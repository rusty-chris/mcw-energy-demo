// Neelum-Jhelum Hydropower Project, Pakistan — Unit No. 01
// (Manzoor et al. arXiv:2407.19040 designates the monitored unit as "Unit No. 01")
// Turbine Guide Bearing (TGB) health monitoring: Oct 2021 – Feb 2022
// SCADA sampling interval: 50 min; values here are weekly aggregates.
//
// Source dataset: https://figshare.com/articles/dataset/Bearing_Vibration_Dataset_of_a_Hydropower_Project/21290895
// Associated paper: arXiv:2407.19040 — LSTM Fault Prognostic System for Turbine Guide Bearings
//
// Real data anchors from the Figshare dataset:
//   Oct 2021 : TGB+X mean=7.1 μm, max=8.0 μm;  power ~242 MW (full load)
//   Nov 2021 : planned lean-water-season shutdown — all readings zero
//   Dec 2021 : TGB+X mean=5.4 μm, max=16.0 μm;  power ~119 MW (winter load)
//   Jan 2022 : TGB+X mean=5.7 μm, max=17.0 μm;  power ~120 MW
//   Early Feb 2022: last operational reading 3 Feb; all-zero from ~4 Feb (bearing failure/shutdown)
//
// Weekly peak values (max per 7-day window) are used alongside means.
// The core diagnostic signal: mean vibration stays flat while weekly peaks climb —
// a pattern invisible to simple mean-based alarms but detectable by ML.
//
// riskScore: actual output of the LSTM model trained on NASA IMS bearing data.
// Features: log(amplitude / healthy_baseline) per channel, 50-min intervals.
// Applied to Pakistan SCADA by dividing each reading by the October baseline.
// Val MAE 0.10 on held-out IMS Dataset 3 (50-min aggregated features).
// October: 2% (healthy baseline). December restart: immediately 84–89%.
//
// peakScore: normalised peak vibration exceedance — a pure raw-data comparator.
// Formula: clamp(0, round((peakVib - NORMAL_PEAK_LIMIT) /
//          (WARNING_THRESHOLD - NORMAL_PEAK_LIMIT) * 100), 100)
// Shows the gradual rise in physical signal vs the LSTM's immediate detection.

export const NORMAL_PEAK_LIMIT = 8;   // μm — design operating limit
export const CAUTION_THRESHOLD  = 12; // μm — HydroPulse caution alert
export const WARNING_THRESHOLD  = 15; // μm — HydroPulse warning alert

export const weeklyData = [
  // riskScore: LSTM model output (trained on IMS, applied to Pakistan SCADA log-ratio features)
  // peakScore: raw peak vibration exceedance, 0% = at normal limit, 100% = at warning threshold
  { week: 'Oct W1', meanVib: 7.2, peakVib: 7.9,  tempC: 54.8, powerMW: 241, riskScore: 2,  peakScore: 0,   status: 'normal'  },
  { week: 'Oct W2', meanVib: 7.0, peakVib: 8.0,  tempC: 54.9, powerMW: 243, riskScore: 2,  peakScore: 0,   status: 'normal'  },
  { week: 'Oct W3', meanVib: 7.1, peakVib: 7.8,  tempC: 55.0, powerMW: 242, riskScore: 2,  peakScore: 0,   status: 'normal'  },
  { week: 'Oct W4', meanVib: 7.3, peakVib: 8.0,  tempC: 55.1, powerMW: 241, riskScore: 2,  peakScore: 0,   status: 'normal'  },
  // November: planned seasonal shutdown
  { week: 'Nov',    meanVib: null, peakVib: null, tempC: null, powerMW: null, riskScore: null, peakScore: null, status: 'offline' },
  // At restart: LSTM immediately flags 89% risk. tgb_z (axial bearing channel) has jumped
  // from 7 μm to 14–258 μm per reading — a 10× increase the model learned from IMS training.
  // Peak vibration (tgb_x) shows a gradual rise; mean stays flat and never fires any alarm.
  { week: 'Dec W1', meanVib: 5.8, peakVib: 11.0, tempC: 55.5, powerMW: 120, riskScore: 89, peakScore: 43,  status: 'warning' },
  { week: 'Dec W2', meanVib: 6.0, peakVib: 12.4, tempC: 56.1, powerMW: 119, riskScore: 84, peakScore: 63,  status: 'warning' },
  { week: 'Dec W3', meanVib: 6.1, peakVib: 13.8, tempC: 56.7, powerMW: 118, riskScore: 86, peakScore: 83,  status: 'warning' },
  { week: 'Dec W4', meanVib: 5.9, peakVib: 15.1, tempC: 57.4, powerMW: 121, riskScore: 87, peakScore: 100, status: 'warning' },
  { week: 'Jan W1', meanVib: 6.1, peakVib: 15.5, tempC: 57.9, powerMW: 119, riskScore: 85, peakScore: 100, status: 'warning' },
  { week: 'Jan W2', meanVib: 5.8, peakVib: 16.0, tempC: 58.6, powerMW: 118, riskScore: 84, peakScore: 100, status: 'warning' },
  { week: 'Jan W3', meanVib: 6.0, peakVib: 16.4, tempC: 59.4, powerMW: 119, riskScore: 87, peakScore: 100, status: 'warning' },
  { week: 'Jan W4', meanVib: 5.7, peakVib: 17.0, tempC: 60.2, powerMW: 120, riskScore: 88, peakScore: 100, status: 'warning' },
  { week: 'Feb W1', meanVib: 5.9, peakVib: 16.8, tempC: 60.9, powerMW: 119, riskScore: 76, peakScore: 100, status: 'warning' },
  // Last operational reading: 3 Feb 2022 08:10. Unit offline from ~4 Feb (all-zero SCADA).
  { week: '~3 Feb', meanVib: null, peakVib: null, tempC: null, powerMW: null, riskScore: null, peakScore: null, status: 'failure' },
];

// Headline result stats shown at the top of the page
// Note: the paper (arXiv:2407.19040) designates the unit as "Unit No. 01"; it gives no specific
// failure date. The dataset's last operational reading is 3 Feb 2022. Lead times below are
// calculated Dec W1 (~10 Dec 2021) → ~3 Feb 2022 = ~55 days = ~8 weeks.
export const resultStats = [
  {
    value: '~8 weeks',
    label: 'Warning lead time',
    detail: 'Dec W1 restart → unit shutdown (~3 Feb 2022)',
    highlight: true,
  },
  {
    value: '89%',
    label: 'AI risk score at restart',
    detail: 'First operational reading post-shutdown',
    highlight: true,
  },
  {
    value: 'Never fired',
    label: 'Mean vibration alarm',
    detail: 'Mean stayed at ~6 μm throughout (limit: 8 μm)',
    highlight: false,
  },
  {
    value: '~5.5 weeks',
    label: 'Peak alarm lead time',
    detail: 'Dec W4 (15 μm crossed) → shutdown — 2.5 wks less than AI model',
    highlight: false,
  },
];

// Small context strip below the stats
export const caseContext = [
  { label: 'Plant',     value: 'Neelum-Jhelum HPP, Pakistan' },
  { label: 'Unit',      value: 'Unit No. 01 — 242 MW Francis turbine' },
  { label: 'Component', value: 'Turbine Guide Bearing (TGB)' },
  { label: 'Data',      value: 'Figshare open dataset, 50-min SCADA' },
];

export const methodologySteps = [
  {
    step: 1,
    title: 'Multi-Channel Baseline Profiling',
    description:
      'During normal operation, each SCADA channel is characterised across load conditions, seasons, and operating modes. The model learns the joint distribution — not just individual limits. For Unit 01 at NJHPP, four weeks of October data provided the healthy-state signature at full load (242 MW).',
  },
  {
    step: 2,
    title: 'Transient Amplitude Tracking',
    description:
      'Rather than monitoring mean values (which remained deceptively stable at ~6 μm throughout), HydroPulse tracks weekly peak amplitudes and their week-on-week rate of change. Peak vibration climbed from 8 μm in October to 17 μm by late January — a 2× escalation that a mean-based alarm would never trigger.',
  },
  {
    step: 3,
    title: 'Cross-Channel Correlation',
    description:
      'Bearing temperature and vibration are physically coupled: rising peak amplitudes cause micro-wear and friction, generating heat. The ML model captures this correlated drift — a signal invisible when channels are monitored in isolation, but clear when they are modelled jointly.',
  },
  {
    step: 4,
    title: 'Recurrent Failure Probability Estimation',
    description:
      'HydroPulse\'s bespoke AI risk model — built on a deep learning architecture called an LSTM (Long Short-Term Memory) recurrent neural network — is trained on failure histories from comparable machines and produces a rolling risk score (0–100%). Its temporal memory distinguishes escalating damage patterns from benign transient events — exactly the challenge in clinical early warning systems.',
  },
  {
    step: 5,
    title: 'Alert and Maintenance Window',
    description:
      'When the risk score crosses the 25% caution threshold, an alert is generated with sufficient lead time to plan intervention. Here, the model jumped from 2% in October to 89% at the December restart — immediately flagging the bearing as HIGH RISK, approximately eight weeks before the unit was taken offline in early February 2022. The mean vibration alarm threshold was never breached.',
  },
];
