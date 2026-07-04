# HydroPulse — Commercial Differentiation Strategy

## The Challenge

Training an LSTM on public benchmark bearing datasets (IMS, FEMTO-ST, XJTU-SY) is a
homework exercise. Hundreds of academic papers have done exactly this. The algorithm
is not the commercial moat.

## Where the Real Differentiation Lives

### 1. Data nobody else has

Public benchmarks are lab rigs or generic wind farms. Real hydroelectric SCADA
histories — tied to specific plant designs, head variability, seasonal shutdown
patterns, civil structure interactions — are not public. Mike's network is the
route to that proprietary data.

Once a model is trained on real hydro operational data, it is calibrated in a way
no benchmark paper replicates.

**Clinical analogy:** The MIMIC-III model is not the commercial asset. The model
trained and validated on NHS Bristol data is.

### 2. Domain expertise baked into feature engineering

Which channels matter for a Francis turbine vs a Pelton wheel? What does a head-loss
signal mean in the context of a specific geological fault zone? What vibration
signature indicates cavitation vs bearing wear vs shaft misalignment?

Generic condition monitoring vendors don't know. Mike does. That domain knowledge,
encoded into feature selection and alert calibration, cannot be replicated by a
generic LSTM paper.

### 3. The gap between benchmark performance and real deployment

Papers report clean accuracy on IMS or FEMTO-ST. Real deployment means:
- Integrating with a proprietary SCADA system
- Handling sensor dropout and calibration drift
- Establishing baselines after seasonal shutdowns
- Distinguishing cavitation noise from bearing damage under partial load
- Dealing with missing data, irregular sampling, multi-unit correlation

That engineering work is where the value is — and no one has done it specifically
for hydroelectric assets.

### 4. Expert interpretation when alerts fire

A risk score crossing 50% is only useful if someone credible can say
"this means dewater and inspect" vs "this is a sensor artefact from the refill."
That person is Mike McWilliams. The combination of:

- Automated prediction
- Engineering interpretation
- Legal and regulatory credibility (expert witness history in landmark cases)

...is the product, not the model.

### 5. The market is small and unserved

Generic condition monitoring exists for wind (dozens of vendors), aviation, and
oil & gas. For hydroelectric specifically — especially small and mid-size schemes
in the UK, Europe, and emerging markets — there is essentially nothing.

Being the first ML-based asset health monitoring platform built specifically for
hydro is a real and defensible market position.

## Practical Implication for the Demo

Training on IMS is not about claiming novelty. It is about demonstrating technical
credibility: "we can build a working model that correctly predicts bearing failure
on real data." Combined with Mike's domain authority, that is the pitch.

The website framing should be:
> "Proven methodology, applied specifically to hydropower"

Not:
> "Novel ML algorithm"

## The Two-Person Differentiation

| | Mike McWilliams | Dr Chris McWilliams |
|---|---|---|
| Background | 45 years hydropower, expert witness | Clinical AI, ICU decision support |
| Contribution | Domain expertise, failure mode knowledge, client network, data access | ML methodology, model architecture, feature engineering, validation |
| Analogous role | The clinician who knows what the number means | The data scientist who built the early warning score |

The combination is unusual and hard to replicate. Generic ML vendors lack Mike.
Generic hydropower consultants lack Chris. The pairing is the product.
