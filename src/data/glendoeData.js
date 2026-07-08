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
// IMPORTANT: The scatter points below are ILLUSTRATIVE / RECONSTRUCTED to match the ACTUAL axis
// geometry of Mike's published Appendix T charts (T1–T7). Those charts are decisive on scale:
//   • T3–T7 (Dec–Feb band, and the half-monthly March & April plots) all use an x-axis of
//     80.5–84.5% valve. So EVERY reading from December through April sits in that narrow window.
//   • The dramatic march out to 90–100% valve happens only in May, June and July (chart T1,
//     x-axis 80–100%).
//   • Gross head axis is 603–609 m throughout; the normal band is steep (~1.8 m of head per 1%
//     of valve), because a small change in valve corresponds to a large change in head.
// The reconstruction therefore tells the two-act story Mike's charts tell: a tight Dec–Feb band,
// a March cluster still inside it (late March grazing the upper edge = possible onset), an April
// cluster that has clearly — but still subtly, at valve 82–84% — stepped OUT of the band (the
// forensic signal SSE could not see), and then a May–July blow-out toward a fully-open valve.
// These 78 points stand in for Mike's real ~7,400 ten-minute readings, pending their release.

// --- The band of normal operation ------------------------------------------------------------
// Head as a linear function of valve opening: head = slope * valve + intercept, tolerance ± metres.
// Fitted to Mike's T3 "band of normal operation" (Dec 2008 – Feb 2009): head ≈ 609 m at valve
// 80.5% down to ≈ 603 m at valve 83.8%. (In control-terms a residual/tolerance band; jargon stays
// out of the UI.)
export const BAND = {
  slope: -1.8,
  intercept: 753.8,
  tolerance: 0.6, // metres either side of the centre line (band ≈ 1.2 m tall, matching T3)
  vMin: 80.5,
  vMax: 83.8,
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
// Geometry is faithful to Appendix T: band centre head(v) = -1.8·v + 753.8, ±0.6 m.
//   Dec/Jan/Feb fill the band (Feb high-head/low-valve end → Dec low-head/high-valve end).
//   1–15 Mar sits inside the band; 16–31 Mar hugs its upper edge (possible onset); 1–15 Apr has
//   clearly stepped above the band at valve 82–83% (clear departure); 16–30 Apr is further out;
//   May–Jul blow out to the right toward a fully-open valve. A few baseline/March points sit off
//   the band — these are the start-up/shutdown/output-change outliers Mike notes and filters out.
export const valveHeadSeries = [
  {
    period: 'Dec 2008',
    phase: 'baseline',
    points: [
      { valve: 82.4, head: 605.6 }, { valve: 82.7, head: 605.1 }, { valve: 83.0, head: 604.6 },
      { valve: 83.2, head: 604.1 }, { valve: 82.9, head: 604.9 }, { valve: 83.4, head: 603.9 },
      { valve: 82.6, head: 605.0 },
    ],
  },
  {
    period: 'Jan 2009',
    phase: 'baseline',
    points: [
      { valve: 81.3, head: 607.4 }, { valve: 81.8, head: 606.5 }, { valve: 82.1, head: 606.0 },
      { valve: 81.5, head: 607.0 }, { valve: 82.4, head: 605.6 }, { valve: 81.0, head: 607.8 },
      { valve: 82.2, head: 605.7 }, { valve: 83.0, head: 604.5 },
      { valve: 84.0, head: 604.4 }, // start-up/shutdown outlier (right of band)
    ],
  },
  {
    period: 'Feb 2009',
    phase: 'baseline',
    points: [
      { valve: 80.6, head: 608.9 }, { valve: 81.0, head: 608.1 }, { valve: 81.3, head: 607.5 },
      { valve: 80.8, head: 608.5 }, { valve: 81.6, head: 606.9 }, { valve: 81.1, head: 607.9 },
      { valve: 80.7, head: 608.7 },
      { valve: 82.5, head: 607.6 }, // outlier above band
    ],
  },
  {
    period: '1–15 Mar 2009',
    phase: 'within',
    points: [
      { valve: 81.2, head: 607.4 }, { valve: 81.6, head: 606.8 }, { valve: 81.9, head: 606.4 },
      { valve: 82.1, head: 606.1 }, { valve: 82.3, head: 605.7 }, { valve: 81.7, head: 606.7 },
      { valve: 82.5, head: 605.4 },
      { valve: 83.3, head: 605.9 }, { valve: 83.6, head: 606.2 }, // right-of-band outliers
    ],
  },
  {
    period: '16–31 Mar 2009',
    phase: 'onset',
    points: [
      { valve: 81.2, head: 608.0 }, { valve: 81.5, head: 607.6 }, { valve: 81.8, head: 607.1 },
      { valve: 82.0, head: 606.8 }, { valve: 82.3, head: 606.2 }, { valve: 81.6, head: 607.3 },
      { valve: 82.5, head: 605.85 },
      { valve: 83.0, head: 606.3 }, { valve: 83.4, head: 606.0 }, // right-of-band outliers
    ],
  },
  {
    period: '1–15 Apr 2009',
    phase: 'departure',
    points: [
      { valve: 81.7, head: 608.0 }, { valve: 82.0, head: 607.6 }, { valve: 82.3, head: 607.2 },
      { valve: 82.6, head: 606.9 }, { valve: 82.9, head: 606.6 }, { valve: 83.2, head: 606.3 },
      { valve: 81.9, head: 607.8 },
      { valve: 81.0, head: 605.4 }, // low shutdown outlier
    ],
  },
  {
    period: '16–30 Apr 2009',
    phase: 'departure',
    points: [
      { valve: 82.9, head: 605.2 }, { valve: 83.2, head: 605.0 }, { valve: 83.5, head: 604.8 },
      { valve: 83.8, head: 604.6 }, { valve: 84.1, head: 604.5 }, { valve: 84.4, head: 604.3 },
      { valve: 83.0, head: 605.1 },
    ],
  },
  {
    period: 'May 2009',
    phase: 'severe',
    points: [
      { valve: 84.5, head: 606.0 }, { valve: 86.0, head: 605.6 }, { valve: 88.0, head: 605.2 },
      { valve: 90.0, head: 604.9 }, { valve: 91.5, head: 604.7 }, { valve: 93.0, head: 604.6 },
      { valve: 94.5, head: 604.9 }, { valve: 92.0, head: 605.5 },
    ],
  },
  {
    period: 'Jun 2009',
    phase: 'severe',
    points: [
      { valve: 88.0, head: 605.4 }, { valve: 89.0, head: 604.3 }, { valve: 90.0, head: 606.0 },
      { valve: 91.0, head: 604.6 }, { valve: 91.5, head: 606.5 }, { valve: 92.0, head: 605.2 },
    ],
  },
  {
    period: 'Jul 2009',
    phase: 'severe',
    points: [
      { valve: 92.5, head: 605.6 }, { valve: 94.5, head: 605.9 }, { valve: 96.0, head: 605.5 },
      { valve: 97.5, head: 606.0 }, { valve: 98.5, head: 605.6 }, { valve: 99.5, head: 605.9 },
      { valve: 100.0, head: 606.0 },
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
