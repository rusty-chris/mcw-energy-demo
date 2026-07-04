#!/usr/bin/env python3.11
"""
HydroPulse Bearing Health — LSTM trained on 50-min aggregated IMS features
===========================================================================
NOTE: Forces CPU to avoid CuDNN 9.1/9.3 mismatch on this machine.

Domain-bridging strategy
------------------------
The previous version extracted 28 waveform features (kurtosis, crest factor,
etc.) from 20 kHz IMS snapshots — features that are impossible to compute from
Pakistan SCADA data, which delivers one amplitude value per channel per 50 min.

Fix: operate at the same temporal and feature resolution as Pakistan.

  IMS     : 5 consecutive 10-min snapshots  → mean RMS per bearing per 50-min window
  Pakistan: one SCADA reading per channel per 50-min interval  (already that format)

Both datasets now produce:  log(amplitude / healthy_baseline)  per channel.
This feature is dimensionless (g-force ÷ g-force, μm ÷ μm) — units cancel.
An LSTM trained on IMS log-ratios can be applied directly to Pakistan log-ratios.

Normalisation: each dataset is divided by its own healthy-period mean baseline.
Taking the log compresses the wide dynamic range while keeping the feature linear
near 1.0 (log(1+x) ≈ x for small x). Feature is clipped to [log(0.1), log(5)] =
[-2.30, 1.61] to stay within the range the IMS training data actually covers.

Pakistan channels selected (4 to match IMS 4-bearing layout):
  tgb_z — primary signal: 7 μm Oct → 14-258 μm per reading in Dec/Jan (real variance)
  tgb_x — secondary: 8 μm Oct → 16 μm Dec (step change)
  ugb_z — upper guide bearing: 35 μm Oct → 40-68 μm Dec (modest increase)
  lgb_x — lower guide bearing: 34 μm Oct → 28-60 μm Dec (partial signal)

Usage:
  python3.11 ml/train_bearing_lstm.py [--retrain] [--epochs 60]

Dependencies (Python 3.11):
  pip install numpy pandas tensorflow rarfile matplotlib
"""

import argparse
import io
import json
import os
import sys
from pathlib import Path

# Force CPU — CuDNN 9.1 loaded but TF compiled with 9.3
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

import numpy as np
import pandas as pd

SCRATCHPAD = Path(
    "/tmp/claude-1000/-home-expert-Documents-contracting-mcw-energy-test-react"
    "/77d98e90-7b7a-467d-9ed2-1ee60824b894/scratchpad"
)
UNRAR_TOOL = str(SCRATCHPAD / "unrar_extracted/usr/bin/unrar-nonfree")

SNAPS_PER_WIN = 5      # 5 × 10-min IMS snapshots = 50-min interval
SEQ_LEN       = 16     # 16 × 50-min = ~13 h of LSTM temporal context
N_CH          = 4      # 4 bearings (IMS) / 4 vibration channels (Pakistan)
LOG_CLIP_HI   = 1.61   # log(5)  — max ratio allowed before clipping  (5× baseline)
LOG_CLIP_LO   = -2.30  # log(0.1) — min ratio (10× drop, clipped to this)

# Pakistan: ordered to match IMS bearing numbering (channel with most signal first)
PK_CHANNELS = ["tgb_z", "tgb_x", "ugb_z", "lgb_x"]


# ─── IMS loading ─────────────────────────────────────────────────────────────

def _snapshot_rms(raw_bytes: bytes, n_ch: int = N_CH) -> np.ndarray:
    """Per-bearing RMS from one IMS 20-kHz snapshot (bytes)."""
    data = np.loadtxt(io.BytesIO(raw_bytes))
    if data.ndim == 1:
        data = data.reshape(-1, 1)
    data = data[:, :n_ch]
    return np.sqrt(np.mean(data ** 2, axis=0)).astype(np.float32)


def load_ims_50min(rar_path: Path, desc: str = "") -> np.ndarray:
    """
    Load all IMS snapshots from a .rar and aggregate to 50-min mean RMS.
    Returns ndarray of shape (N_windows, N_CH).
    """
    import rarfile
    rarfile.UNRAR_TOOL = UNRAR_TOOL

    with rarfile.RarFile(str(rar_path)) as rf:
        members = sorted(
            m for m in rf.namelist()
            if not m.endswith("/") and "__MACOSX" not in m and ".pdf" not in m
        )

    print(f"  {desc}: {len(members)} snapshots → ", end="", flush=True)
    rms_list = []
    with rarfile.RarFile(str(rar_path)) as rf:
        for i, name in enumerate(members):
            if (i + 1) % 1000 == 0:
                print(f"{i+1}…", end="", flush=True)
            try:
                rms_list.append(_snapshot_rms(rf.read(name)))
            except Exception:
                pass

    all_rms = np.array(rms_list, dtype=np.float32)           # (N_snaps, N_CH)
    n_win   = len(all_rms) // SNAPS_PER_WIN
    grouped = all_rms[: n_win * SNAPS_PER_WIN].reshape(n_win, SNAPS_PER_WIN, N_CH)
    mean_rms = grouped.mean(axis=1)                           # (N_win, N_CH)
    print(f"{n_win} 50-min intervals")
    return mean_rms


# ─── Feature engineering ─────────────────────────────────────────────────────

def log_ratio_features(amplitudes: np.ndarray, baseline: np.ndarray) -> np.ndarray:
    """
    log(amplitude / baseline) per channel, clipped to [LOG_CLIP_LO, LOG_CLIP_HI].
    = 0.0 when at healthy baseline, > 0 when degraded, < 0 when below baseline.
    """
    safe_baseline = np.maximum(baseline, 1e-8)
    ratio = amplitudes / safe_baseline
    ratio = np.maximum(ratio, np.exp(LOG_CLIP_LO))   # floor before log
    lr = np.log(ratio).astype(np.float32)
    return np.clip(lr, LOG_CLIP_LO, LOG_CLIP_HI)


def make_health_index(n: int, deg_start_frac: float = 0.82) -> np.ndarray:
    """Linear ramp: 0 (healthy) → 1 (failure), starting at deg_start_frac."""
    hi = np.zeros(n, dtype=np.float32)
    start = int(n * deg_start_frac)
    hi[start:] = np.linspace(0.0, 1.0, n - start)
    return hi


def build_sequences(features: np.ndarray, labels: np.ndarray) -> tuple:
    X = np.array([features[i: i + SEQ_LEN] for i in range(len(features) - SEQ_LEN)],
                 dtype=np.float32)
    y = labels[SEQ_LEN:].astype(np.float32)
    return X, y


# ─── Model ───────────────────────────────────────────────────────────────────

def build_lstm() -> "tf.keras.Model":
    import tensorflow as tf
    m = tf.keras.Sequential([
        tf.keras.layers.LSTM(32, input_shape=(SEQ_LEN, N_CH), return_sequences=True),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.LSTM(16),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(8, activation="relu"),
        tf.keras.layers.Dense(1, activation="sigmoid"),
    ])
    m.compile(optimizer="adam", loss="mse", metrics=["mae"])
    return m


# ─── Pakistan G4 ─────────────────────────────────────────────────────────────

def load_pakistan_g4(scratchpad: Path) -> pd.DataFrame:
    df = pd.read_csv(scratchpad / "vibration_data.csv", header=0).iloc[:, :8]
    df.columns = ["timestamp", "power_mw", "ugb_z", "lgb_x", "lgb_y",
                  "tgb_x", "tgb_y", "tgb_z"]
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    for c in df.columns[1:]:
        df[c] = pd.to_numeric(df[c], errors="coerce")
    return (df
            .dropna(subset=["timestamp", "tgb_x"])
            .query("tgb_x > 0")
            .sort_values("timestamp")
            .reset_index(drop=True))


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rar-dir",  default=str(SCRATCHPAD / "IMS_data/IMS"))
    ap.add_argument("--epochs",   type=int, default=60)
    ap.add_argument("--out-json", default="src/data/lstmPredictions.json")
    ap.add_argument("--retrain",  action="store_true",
                    help="Ignore cached model and retrain from scratch")
    args = ap.parse_args()

    import tensorflow as tf
    print(f"TF {tf.__version__} | Python {sys.version.split()[0]}\n")

    rar_dir    = Path(args.rar_dir)
    model_path = Path("ml/lstm_model_50min.keras")

    # ── Load IMS data ──────────────────────────────────────────────────────────
    print("=== Loading IMS data (50-min aggregation) ===")
    ds1 = load_ims_50min(rar_dir / "1st_test.rar", "Dataset 1")   # ~431 windows
    ds2 = load_ims_50min(rar_dir / "2nd_test.rar", "Dataset 2")   # ~197 windows
    ds3 = load_ims_50min(rar_dir / "3rd_test.rar", "Dataset 3")   # ~1264 windows

    # Healthy-period baselines (mean amplitude of the healthy fraction)
    b1 = ds1[: int(len(ds1) * 0.85)].mean(axis=0)
    b2 = ds2[: int(len(ds2) * 0.82)].mean(axis=0)
    b3 = ds3[: int(len(ds3) * 0.90)].mean(axis=0)

    # Log-ratio features and health indices
    f1 = log_ratio_features(ds1, b1);  hi1 = make_health_index(len(ds1), 0.85)
    f2 = log_ratio_features(ds2, b2);  hi2 = make_health_index(len(ds2), 0.82)
    f3 = log_ratio_features(ds3, b3);  hi3 = make_health_index(len(ds3), 0.90)

    # Training on Datasets 1+2; validation on last 200 intervals of Dataset 3
    train_f  = np.concatenate([f1, f2], axis=0)
    train_hi = np.concatenate([hi1, hi2])
    val_f    = f3[-200:]
    val_hi   = hi3[-200:]

    X_tr, y_tr   = build_sequences(train_f, train_hi)
    X_val, y_val = build_sequences(val_f, val_hi)
    print(f"\nFeature range (train): min={train_f.min():.2f}  max={train_f.max():.2f}")
    print(f"Train sequences: {X_tr.shape} | Val: {X_val.shape}")
    print(f"Train health: {y_tr.mean():.3f}±{y_tr.std():.3f}  Val: {y_val.mean():.3f}±{y_val.std():.3f}")

    # ── Train or load ──────────────────────────────────────────────────────────
    model = build_lstm()
    model.summary()

    if model_path.exists() and not args.retrain:
        print(f"\nLoading cached model from {model_path}  (pass --retrain to rebuild)")
        model.load_weights(str(model_path))
        _, val_mae = model.evaluate(X_val, y_val, verbose=0)
        final_val_mae = float(val_mae)
        hist_dict = {"loss": [], "val_loss": [], "val_mae": []}
        print(f"Val MAE: {final_val_mae:.4f}")
    else:
        print(f"\n=== Training ({args.epochs} epochs) ===")
        hist = model.fit(
            X_tr, y_tr,
            validation_data=(X_val, y_val),
            epochs=args.epochs,
            batch_size=32,
            callbacks=[
                tf.keras.callbacks.EarlyStopping(
                    patience=10, restore_best_weights=True, verbose=1),
                tf.keras.callbacks.ReduceLROnPlateau(
                    patience=5, factor=0.5, verbose=1),
            ],
            verbose=1,
        )
        final_val_mae = min(hist.history["val_mae"])
        print(f"\nBest val MAE: {final_val_mae:.4f}")
        model_path.parent.mkdir(exist_ok=True)
        model.save(str(model_path))
        print(f"Model saved → {model_path}")
        hist_dict = hist.history

    # ── IMS held-out predictions ───────────────────────────────────────────────
    val_preds = model.predict(X_val, verbose=0).flatten()
    thresh25  = next((i for i, r in enumerate(val_preds) if r >= 0.25), None)
    thresh50  = next((i for i, r in enumerate(val_preds) if r >= 0.50), None)
    print(f"\nIMS Dataset 3 (last 200 intervals):")
    print(f"  25% threshold at interval {thresh25}, 50% at {thresh50}")
    if thresh25 is not None:
        hrs = (len(val_preds) - thresh25) * 50 / 60
        print(f"  Warning {hrs:.0f} h ({hrs/24:.1f} days) before failure")

    # ── Pakistan G4 inference ──────────────────────────────────────────────────
    print("\n=== Pakistan G4 inference ===")
    g4 = load_pakistan_g4(SCRATCHPAD)
    print(f"  {len(g4)} operational readings  "
          f"{g4['timestamp'].dt.date.min()} → {g4['timestamp'].dt.date.max()}")

    # Healthy baseline: October operational readings
    oct_mask  = g4["timestamp"].dt.month == 10
    pk_base   = g4.loc[oct_mask, PK_CHANNELS].mean(axis=0).values.astype(np.float32)
    print("  October baselines: " +
          ", ".join(f"{c}={pk_base[i]:.1f}μm" for i, c in enumerate(PK_CHANNELS)))

    # Log-ratio features for entire operational period
    g4_amp  = g4[PK_CHANNELS].values.astype(np.float32)
    g4_feat = log_ratio_features(g4_amp, pk_base)

    # Show feature distribution per month to verify the normalisation makes sense
    print("\n  Log-ratio per channel (mean ± std):")
    for month_n, label in [(10, "Oct"), (12, "Dec"), (1, "Jan"), (2, "Feb")]:
        mask = g4["timestamp"].dt.month == month_n
        if not mask.any():
            continue
        vals = g4_feat[mask.values]
        row = "  ".join(f"{c}={vals[:,i].mean():+.2f}±{vals[:,i].std():.2f}"
                        for i, c in enumerate(PK_CHANNELS))
        print(f"    {label}: {row}")

    # Build sequences within December-February only (not spanning Nov offline gap)
    n_oct     = int(oct_mask.sum())
    dec_feat  = g4_feat[n_oct:]                              # December onward
    dec_ts    = g4["timestamp"].iloc[n_oct:].reset_index(drop=True)
    dec_tgbz  = g4["tgb_z"].iloc[n_oct:].reset_index(drop=True)
    dec_tgbx  = g4["tgb_x"].iloc[n_oct:].reset_index(drop=True)

    X_dec     = np.array([dec_feat[i: i + SEQ_LEN] for i in range(len(dec_feat) - SEQ_LEN)],
                         dtype=np.float32)
    dec_preds = model.predict(X_dec, batch_size=256, verbose=0).flatten()
    dec_risk  = (dec_preds * 100).clip(0, 100)

    # Also score October so we can show the baseline risk level
    n_oct_seq  = max(0, n_oct - SEQ_LEN)
    oct_feat_s = g4_feat[:n_oct]
    if n_oct_seq > 0:
        X_oct     = np.array([oct_feat_s[i: i + SEQ_LEN] for i in range(n_oct_seq)],
                              dtype=np.float32)
        oct_preds = model.predict(X_oct, batch_size=256, verbose=0).flatten()
        print(f"\n  October risk (baseline): mean={oct_preds.mean()*100:.1f}%  "
              f"max={oct_preds.max()*100:.1f}%")

    # Weekly aggregates (December onward)
    result_df = pd.DataFrame({
        "timestamp": dec_ts.iloc[SEQ_LEN:].values,
        "tgb_z":     dec_tgbz.iloc[SEQ_LEN:].values,
        "tgb_x":     dec_tgbx.iloc[SEQ_LEN:].values,
        "risk_pct":  dec_risk,
    })
    result_df["week"] = pd.to_datetime(result_df["timestamp"]).dt.to_period("W")
    weekly = (result_df
              .groupby("week")
              .agg(
                  week_start = ("timestamp", "min"),
                  tgb_z_mean = ("tgb_z", "mean"),
                  tgb_z_max  = ("tgb_z", "max"),
                  tgb_x_max  = ("tgb_x", "max"),
                  risk_mean  = ("risk_pct", "mean"),
                  risk_max   = ("risk_pct", "max"),
              )
              .reset_index())
    weekly["week_start"] = pd.to_datetime(weekly["week_start"])
    weekly["week_label"] = weekly["week_start"].apply(
        lambda d: d.strftime("%b") + " W" + str((d.day - 1) // 7 + 1)
    )

    print("\n  Weekly summary:")
    hdr = f"  {'Week':10s}  {'tgb_z_max':>10s}  {'tgb_x_max':>10s}  {'risk_mean':>10s}  {'risk_max':>10s}"
    print(hdr)
    for _, row in weekly.iterrows():
        bar = "█" * int(row["risk_max"] / 5)
        print(f"  {row['week_label']:10s}  {row['tgb_z_max']:>10.1f}  {row['tgb_x_max']:>10.1f}"
              f"  {row['risk_mean']:>9.1f}%  {row['risk_max']:>9.1f}%  {bar}")

    # ── Export JSON ────────────────────────────────────────────────────────────
    out = {
        "model_info": {
            "architecture":   "2-layer LSTM (32→16) + Dense(8) + Dense(1, sigmoid)",
            "training_data":  "NASA IMS Datasets 1+2 (50-min aggregated mean-RMS per bearing)",
            "features":       f"log(amplitude / healthy_baseline) × {N_CH} channels",
            "temporal_res":   "50-min intervals (matches Pakistan SCADA sampling rate)",
            "seq_len_min":    SEQ_LEN * 50,
            "val_mae":        round(float(final_val_mae), 4),
        },
        "ims_test": {
            "dataset":                  "IMS Dataset 3 (last 200 50-min intervals)",
            "risk_scores_pct":          [round(float(r * 100), 1) for r in val_preds],
            "health_index_true":        [round(float(v), 4) for v in y_val],
            "warning_25pct_interval":   int(thresh25) if thresh25 is not None else None,
            "warning_50pct_interval":   int(thresh50) if thresh50 is not None else None,
        },
        "pakistan_g4": {
            "channels":      PK_CHANNELS,
            "baselines_um":  [round(float(b), 1) for b in pk_base],
            "weekly": [
                {
                    "week":       str(row["week"]),
                    "week_label": row["week_label"],
                    "tgb_z_mean": round(float(row["tgb_z_mean"]), 1),
                    "tgb_z_max":  round(float(row["tgb_z_max"]),  1),
                    "tgb_x_max":  round(float(row["tgb_x_max"]),  1),
                    "risk_mean":  round(float(row["risk_mean"]),   1),
                    "risk_max":   round(float(row["risk_max"]),    1),
                }
                for _, row in weekly.iterrows()
            ],
        },
        "training_history": {
            "loss":     [round(float(v), 5) for v in hist_dict.get("loss", [])],
            "val_loss": [round(float(v), 5) for v in hist_dict.get("val_loss", [])],
            "val_mae":  [round(float(v), 5) for v in hist_dict.get("val_mae", [])],
        },
    }

    Path(args.out_json).parent.mkdir(parents=True, exist_ok=True)
    with open(args.out_json, "w") as f:
        json.dump(out, f, indent=2)
    print(f"\nResults written to {args.out_json}")

    # ── Plot ──────────────────────────────────────────────────────────────────
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        fig, axes = plt.subplots(3, 1, figsize=(14, 12))

        # Panel 1: IMS validation
        ax = axes[0]
        ax.plot(y_val,     color="black",   lw=1.5, label="True health index")
        ax.plot(val_preds, color="#cc0000", lw=2,   label="LSTM risk score")
        ax.axhline(0.25, ls="--", color="orange", lw=1)
        ax.axhline(0.50, ls="--", color="red",    lw=1)
        if thresh25: ax.axvline(thresh25, ls=":", color="orange", lw=1)
        if thresh50: ax.axvline(thresh50, ls=":", color="red",    lw=1)
        ax.set_title("IMS Dataset 3 — held-out validation (50-min aggregated features)")
        ax.set_ylabel("Risk score");  ax.legend();  ax.grid(True, alpha=0.3)

        # Panel 2: Pakistan weekly risk + tgb_z
        ax = axes[1]
        wl   = weekly["week_label"].tolist()
        rmax = weekly["risk_max"].tolist()
        rmn  = weekly["risk_mean"].tolist()
        tzm  = weekly["tgb_z_max"].tolist()
        x    = range(len(wl))
        ax2  = ax.twinx()
        ax2.bar(x, tzm, color="lightblue", alpha=0.4, label="tgb_z peak (μm)")
        ax2.set_ylabel("tgb_z peak (μm)", color="steelblue")
        ax.plot(x, rmax, color="#cc0000", lw=2, marker="o", ms=5, label="Risk max %")
        ax.plot(x, rmn,  color="#cc0000", lw=1, ls="--", alpha=0.5, label="Risk mean %")
        ax.axhline(25, ls="--", color="orange", lw=1)
        ax.axhline(50, ls="--", color="red",    lw=1)
        ax.set_xticks(x);  ax.set_xticklabels(wl, rotation=45, ha="right", fontsize=8)
        ax.set_ylim(0, 105);  ax.set_ylabel("Risk %")
        ax.set_title("Pakistan G4 (Neelum-Jhelum) — LSTM inference on SCADA data")
        ax.legend(loc="upper left");  ax.grid(True, alpha=0.3)

        # Panel 3: Training history
        ax = axes[2]
        if hist_dict.get("loss"):
            ax.plot(hist_dict["loss"],     color="black",   label="Train loss")
            ax.plot(hist_dict["val_loss"], color="#cc0000", label="Val loss")
            ax.set_title("Training history");  ax.legend();  ax.grid(True, alpha=0.3)
        else:
            ax.text(0.5, 0.5, "Cached model — no training history",
                    ha="center", va="center", transform=ax.transAxes)

        plt.tight_layout()
        plot_path = Path("ml/lstm_results.png")
        plt.savefig(str(plot_path), dpi=130, bbox_inches="tight")
        plt.close()
        print(f"Plot saved → {plot_path}")
    except Exception as e:
        print(f"Plot skipped: {e}")


if __name__ == "__main__":
    main()
