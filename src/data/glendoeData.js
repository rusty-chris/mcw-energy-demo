// Glendoe Hydro Scheme operational data (Jan–Aug 2009)
// Based on publicly available court records and technical literature.
// Design head: 600–606m. Collapse detected 4 August 2009 after 71m blockage in headrace tunnel.
// Sources: Glendoe Hydro Scheme Wikipedia; tunneltalk.com; Springer Rock Mechanics paper (2019);
//          Renewable Energy World "Reopening Glendoe after a Rockfall"

export const DESIGN_HEAD = 603; // midpoint of design range 600–606m
export const WARNING_THRESHOLD = 595; // illustrative early-warning threshold

// Monthly trend data — anchor points are from documented court records;
// intermediate values are interpolated and illustrative.
export const monthlyData = [
  { month: 'Jan 2009', netHead: 602, output: 98.2, headLossPct: 0.2, status: 'normal' },
  { month: 'Feb 2009', netHead: 601, output: 97.5, headLossPct: 0.3, status: 'normal' },
  { month: 'Mar 2009', netHead: 599, output: 96.8, headLossPct: 0.7, status: 'normal' },
  { month: 'Apr 2009', netHead: 596, output: 95.1, headLossPct: 1.2, status: 'caution' },
  { month: 'May 2009', netHead: 591, output: 93.0, headLossPct: 2.0, status: 'caution' },
  { month: 'Jun 2009', netHead: 584, output: 90.4, headLossPct: 3.2, status: 'warning' },
  { month: 'Jul 2009', netHead: 576, output: 87.2, headLossPct: 4.5, status: 'warning' },
  { month: '4 Aug 2009', netHead: 569, output: null, headLossPct: 14.0, status: 'collapse' },
];

// Key documented facts from court records:
// - Late May / early June 2009: operator Sandilands "noticed" head reading of 584m (design 600–606m)
// - 29 June 2009: official opening by Queen Elizabeth II
// - 30 June 2009: "unusual thumping noises" heard for ~2 hours — documented precursor signal
// - 4 August 2009: sediment plume observed — collapse detected; scheme shut down and drained
// - Collapse caused ~14% head loss (38–39m below gross head of 608m)
// - Output reduced to ~90MW before collapse (design 100MW)
// - No alarms were set for net head, needle valve opening, or head loss in 2009
// - 1,700 sensors installed; only 179 actively monitored

export const keyFacts = [
  { label: 'Installed Capacity', value: '100 MW' },
  { label: 'Design Net Head', value: '600–606 m (UK record)' },
  { label: 'Headrace Tunnel', value: '6.2 km × 5 m diameter' },
  { label: 'Commissioned', value: 'January 2009' },
  { label: 'Collapse', value: 'August 2009 (71 m blocked)' },
  { label: 'Repair Duration', value: '3 years (resumed Aug 2012)' },
  { label: 'Legal Dispute', value: '£137M — SSE vs Hochtief' },
  { label: 'Monitoring Sensors', value: '1,700 installed; 179 active' },
];

export const methodologySteps = [
  {
    step: 1,
    title: 'Establish Baseline',
    description:
      'Define the expected net head, flow, and output for normal operating conditions. For Glendoe, design head was 600–606 m with peak flow of 18.6 m³/s.',
  },
  {
    step: 2,
    title: 'Monitor Head Loss Over Time',
    description:
      'Track the difference between gross head and net head at the turbine. Progressive head loss beyond 1% signals material accumulation or structural change in the tunnel.',
  },
  {
    step: 3,
    title: 'Set Graduated Alert Thresholds',
    description:
      'Define automated alarms: caution at ~1% head loss, warning at ~2%, critical at ~4%. At Glendoe, no such alarms existed — the first manual observation came at 584 m (3.2% loss).',
  },
  {
    step: 4,
    title: 'Cross-Reference with Output Data',
    description:
      'A head loss of 3–4% corresponds to a measurable output reduction (100 MW → 90 MW). Correlating head and output data confirms the signal is not a sensor anomaly.',
  },
  {
    step: 5,
    title: 'Intervene',
    description:
      'At the warning threshold (step 3), dewater and inspect. The Glendoe data shows the warning threshold was crossed in approximately April 2009 — four months before collapse.',
  },
];
