// Glendoe Hydro Scheme — needle-valve-opening vs gross-head analysis (Dec 2008 – Aug 2009)
//
// METHOD (Mike McWilliams' expert-witness analysis of the Glendoe tunnel collapse):
// At a fixed 100 MW output, gross head and needle-valve opening are locked together by
// the turbine: a higher head needs less flow, so the needle valve sits LESS open. Plotting
// steady-state full-load readings of valve opening (%) against gross head (m) therefore
// produces a tight, downward-sloping "band of normal operation". A blockage in the headrace
// tunnel adds internal head loss, so to still reach 100 MW the valve must open FURTHER —
// the readings walk to the RIGHT of the normal band. Head itself barely moves (a blockage of
// two-thirds of the tunnel costs only ~1 m of a ~605 m head, under 0.2% — inside gauge error),
// which is precisely why a head-based alarm cannot see this and the valve-vs-head view can.
//
// IMPORTANT: The scatter points below are ILLUSTRATIVE / RECONSTRUCTED to match the ranges and
// drift pattern of Mike's published Appendix T charts (T1–T7): valve opening ~80–100%, gross
// head ~603–609 m. They stand in for the real ~7,400 ten-minute readings pending release of the
// primary operational data. The reconstruction is faithful to the documented timeline: baseline
// months sit tightly inside the band, late March grazes the band edge (possible onset), and
// April onward departs progressively to the right.

// --- The band of normal operation ------------------------------------------------------------
// Head as a linear function of valve opening: head = slope * valve + intercept, tolerance ± metres.
// (In control-terms this is a residual/tolerance band; that jargon stays out of the UI.)
export const BAND = {
  slope: -0.3125,
  intercept: 634.125,
  tolerance: 0.6, // metres either side of the centre line
  vMin: 80,
  vMax: 100,
};

const bandHead = (v, offset = 0) => BAND.slope * v + BAND.intercept + offset;

// Two parallel diagonal boundary lines (endpoint coordinates) for drawing the shaded band.
export const bandBoundaries = {
  upper: [
    { valve: BAND.vMin, head: +bandHead(BAND.vMin, BAND.tolerance).toFixed(2) },
    { valve: BAND.vMax, head: +bandHead(BAND.vMax, BAND.tolerance).toFixed(2) },
  ],
  lower: [
    { valve: BAND.vMin, head: +bandHead(BAND.vMin, -BAND.tolerance).toFixed(2) },
    { valve: BAND.vMax, head: +bandHead(BAND.vMax, -BAND.tolerance).toFixed(2) },
  ],
};

// --- Reconstructed steady-state readings, grouped by period (chronological) ------------------
// phase: baseline | within | onset | departure | severe — drives the narrative, not an alarm.
export const valveHeadSeries = [
  {
    period: 'Dec 2008',
    phase: 'baseline',
    points: [
      { valve: 85.9, head: 607.72 }, { valve: 85.3, head: 607.7 }, { valve: 85.3, head: 607.27 },
      { valve: 83.4, head: 608.5 }, { valve: 85.4, head: 607.86 }, { valve: 83.3, head: 608.36 },
      { valve: 84.4, head: 608.11 },
    ],
  },
  {
    period: 'Jan 2009',
    phase: 'baseline',
    points: [
      { valve: 87.1, head: 606.46 }, { valve: 83.2, head: 607.96 }, { valve: 85.7, head: 607.02 },
      { valve: 86.8, head: 607.17 }, { valve: 81.4, head: 608.48 }, { valve: 88.1, head: 606.39 },
      { valve: 89.8, head: 606.53 }, { valve: 88.5, head: 606.91 },
    ],
  },
  {
    period: 'Feb 2009',
    phase: 'baseline',
    points: [
      { valve: 90.7, head: 606.07 }, { valve: 83.1, head: 607.77 }, { valve: 84.4, head: 607.76 },
      { valve: 84.9, head: 607.98 }, { valve: 86.8, head: 607.12 }, { valve: 88.9, head: 605.82 },
      { valve: 87.3, head: 607.02 }, { valve: 88, head: 606.94 },
    ],
  },
  {
    period: '1–15 Mar 2009',
    phase: 'within',
    points: [
      { valve: 92, head: 605.11 }, { valve: 87.5, head: 606.66 }, { valve: 89.8, head: 606.46 },
      { valve: 85.6, head: 607.3 }, { valve: 92.1, head: 605.32 }, { valve: 87.5, head: 607 },
    ],
  },
  {
    period: '16–31 Mar 2009',
    phase: 'onset',
    points: [
      { valve: 90.3, head: 606.36 }, { valve: 94.6, head: 605.32 }, { valve: 89.1, head: 606.89 },
      { valve: 92.8, head: 605.78 }, { valve: 89.5, head: 606.78 }, { valve: 93.7, head: 605.33 },
    ],
  },
  {
    period: '1–15 Apr 2009',
    phase: 'departure',
    points: [
      { valve: 91.7, head: 606.71 }, { valve: 96.3, head: 605.05 }, { valve: 96.4, head: 605.37 },
      { valve: 94, head: 606.12 }, { valve: 93.5, head: 606.03 }, { valve: 97.4, head: 604.98 },
    ],
  },
  {
    period: '16–30 Apr 2009',
    phase: 'departure',
    points: [
      { valve: 97.6, head: 605.46 }, { valve: 95.5, head: 605.88 }, { valve: 99, head: 604.6 },
      { valve: 99.4, head: 604.61 }, { valve: 94.8, head: 605.81 }, { valve: 99.1, head: 604.54 },
    ],
  },
  {
    period: 'May 2009',
    phase: 'severe',
    points: [
      { valve: 98.7, head: 605.13 }, { valve: 95.2, head: 606.43 }, { valve: 100, head: 604.53 },
      { valve: 95.9, head: 606.23 }, { valve: 100, head: 604.83 }, { valve: 98.7, head: 605.18 },
    ],
  },
  {
    period: 'Jun 2009',
    phase: 'severe',
    points: [
      { valve: 97.9, head: 605.91 }, { valve: 96, head: 606.58 }, { valve: 96.2, head: 606.72 },
      { valve: 100, head: 605.07 }, { valve: 96.3, head: 606.6 }, { valve: 97.4, head: 606.27 },
    ],
  },
  {
    period: 'Jul 2009',
    phase: 'severe',
    points: [
      { valve: 100, head: 606 }, { valve: 98.6, head: 606.02 }, { valve: 100, head: 605.58 },
      { valve: 100, head: 605.49 }, { valve: 100, head: 605.4 },
    ],
  },
];

// --- The honest timeline (from Mike's charts T1–T7 and the documented record) ----------------
// marker encodes Mike's careful epistemics: possible vs clear.
export const timeline = [
  {
    period: 'Dec 2008 – Feb 2009',
    event: 'Normal band established',
    detail:
      'Steady-state full-load readings form a tight, downward-sloping band — the fingerprint of a healthy tunnel holding 100 MW.',
    marker: 'baseline',
  },
  {
    period: '1–15 Mar 2009',
    event: 'Still within the band',
    detail: 'Valve-opening and head readings continue to sit inside normal operation.',
    marker: 'normal',
  },
  {
    period: '16–31 Mar 2009',
    event: 'Possible onset',
    detail:
      'Readings drift to the edge of the band — a slight, ambiguous shift to the right. Suggestive, not yet conclusive.',
    marker: 'possible',
  },
  {
    period: '1–15 Apr 2009',
    event: 'Clear departure',
    detail:
      'Readings leave the band: the valve must open further to still hold 100 MW. On this evidence the collapse had already begun before 1 April.',
    marker: 'clear',
  },
  {
    period: '16 Apr – Jul 2009',
    event: 'Progressive worsening',
    detail:
      'Points move steadily further right of the band, the valve edging toward fully open, as the blockage grows.',
    marker: 'clear',
  },
  {
    period: '29–30 Jun 2009',
    event: 'Thumping noises reported',
    detail:
      'The day after the scheme was officially opened by Queen Elizabeth II (29 Jun), operators heard roughly two hours of unusual thumping.',
    marker: 'event',
  },
  {
    period: '4 Aug 2009',
    event: 'Collapse discovered',
    detail:
      'A sediment plume is seen; the unit is shut down and drained. About 71 m of the headrace tunnel is found blocked in the Conagleann Fault Zone.',
    marker: 'discovery',
  },
];

// --- Genuinely documented facts --------------------------------------------------------------
export const keyFacts = [
  { label: 'Installed Capacity', value: '100 MW' },
  { label: 'Gross Head', value: '~600–609 m (UK record)' },
  { label: 'Headrace Tunnel', value: '6.2 km × 5 m diameter' },
  { label: 'Commissioned', value: 'Early 2009' },
  { label: 'Collapse Discovered', value: '4 Aug 2009 (~71 m blocked)' },
  { label: 'Returned to Service', value: 'August 2012' },
  { label: 'Legal Dispute', value: '£137M — SSE v Hochtief' },
  { label: 'Monitoring', value: '1,700 sensors; 179 relayed to ops' },
];

// The head signal is almost blind to the collapse — the crux of Mike's finding.
export const headInsensitivity = {
  blockageFraction: 'two-thirds of the tunnel',
  headLostFromCollapse: '~1 m',
  pctOfHead: '<0.2%',
  note: '71 m of collapsed tunnel cost only about 1 m of head — well inside pressure-gauge error.',
};

// The alarm-flood contrast: rich sensing, none of it able to catch this failure.
export const alarmContrast = {
  sensors: '1,700',
  relayed: '179',
  alarms: '~20,000',
  window: 'Jan–Aug 2009',
  note: 'None of the ~20,000 alarms raised in the eight months to the collapse identified the tunnel blockage, and most were false.',
};

// --- The real method (replaces the deleted head-threshold methodology) -----------------------
export const methodologySteps = [
  {
    step: 1,
    title: 'Isolate steady-state, full-load readings',
    description:
      'Compare like with like. Keep only the ten-minute readings where the unit is holding full 100 MW output, and set aside start-up, shutdown and output-change events — they naturally sit outside the pattern for reasons unrelated to the tunnel.',
  },
  {
    step: 2,
    title: 'Establish the normal band',
    description:
      'Plot needle-valve opening (%) against gross head (m) for the baseline months. At fixed power these readings fall along a tight, downward-sloping band: a higher head needs less flow, so the valve sits less open.',
  },
  {
    step: 3,
    title: 'Watch for departure from the band',
    description:
      'A tunnel blockage adds internal head loss, so the valve must open further to still reach 100 MW. The readings drift to the right of the normal band — a signal far more sensitive than the head gauge, which barely moves.',
  },
  {
    step: 4,
    title: 'Discriminate the cause',
    description:
      'A change in valve opening has several possible explanations: a falling reservoir level, blocked trash screens at the intake, or a blockage inside the tunnel. Each is checked and ruled out in turn so the signal is attributed correctly.',
  },
  {
    step: 5,
    title: 'Intervene with lead time',
    description:
      'A confirmed, sustained departure that survives those checks is grounds to dewater and inspect — with months of lead time before the blockage becomes catastrophic.',
  },
];
