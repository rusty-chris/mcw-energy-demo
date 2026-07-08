import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  useXAxisScale,
  useYAxisScale,
} from 'recharts';
import {
  valveHeadSeries,
  bandBoundaries,
  timeline,
  keyFacts,
  methodologySteps,
  headInsensitivity,
  alarmContrast,
} from '../data/glendoeData';

// Month/period colour ramp: a single-hue red ordinal scale, light (Dec, healthy baseline)
// → dark (Jul, deep into the collapse). Order carries the story; position carries the signal.
// Validated with the dataviz palette validator (--ordinal, light on white): monotone, light
// end ≥ 2:1 on white.
const PERIOD_COLOURS = [
  '#e79b98', // Dec 2008
  '#e08a86', // Jan 2009
  '#d97773', // Feb 2009
  '#d16460', // 1–15 Mar
  '#c8524e', // 16–31 Mar
  '#bd433f', // 1–15 Apr
  '#af3733', // 16–30 Apr
  '#9e2c29', // May
  '#8a221f', // Jun
  '#731a17', // Jul
];

const BAND_FILL = '#9ca3af';

// Shaded "band of normal operation" drawn between the two diagonal boundary lines.
// Rendered as a chart child so it can read the live axis scales (Recharts 3 hooks),
// keeping it aligned with the points at any container width.
const NormalBand = () => {
  const sx = useXAxisScale();
  const sy = useYAxisScale();
  if (!sx || !sy) return null;
  const corners = [
    bandBoundaries.upper[0],
    bandBoundaries.upper[1],
    bandBoundaries.lower[1],
    bandBoundaries.lower[0],
  ];
  const poly = corners.map((c) => `${sx(c.valve)},${sy(c.head)}`).join(' ');
  const upper = bandBoundaries.upper.map((c) => `${sx(c.valve)},${sy(c.head)}`).join(' ');
  const lower = bandBoundaries.lower.map((c) => `${sx(c.valve)},${sy(c.head)}`).join(' ');
  const labelX = sx(bandBoundaries.upper[0].valve) + 8;
  const labelY = sy(bandBoundaries.upper[0].head) - 6;
  return (
    <g pointerEvents="none">
      <polygon points={poly} fill={BAND_FILL} fillOpacity={0.16} stroke="none" />
      <polyline points={upper} fill="none" stroke={BAND_FILL} strokeWidth={1} strokeDasharray="5 3" />
      <polyline points={lower} fill="none" stroke={BAND_FILL} strokeWidth={1} strokeDasharray="5 3" />
      <text
        x={labelX}
        y={labelY}
        style={{ fontFamily: 'Verdana', fontSize: 10, fill: '#6b7280', fontWeight: 700 }}
      >
        Band of normal operation
      </text>
    </g>
  );
};

const ScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  if (!p) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg p-3 text-xs font-verdana">
      <p className="font-bold mb-1">{p.period}</p>
      <p>Needle valve opening: {p.valve}%</p>
      <p>Gross head: {p.head} m</p>
    </div>
  );
};

// One flat point list per period, tagged so the tooltip can name it.
const seriesData = valveHeadSeries.map((s) =>
  s.points.map((pt) => ({ ...pt, period: s.period, phase: s.phase })),
);

const markerColour = {
  baseline: 'bg-gray-400',
  normal: 'bg-gray-400',
  possible: 'bg-yellow-500',
  clear: 'bg-mcw-red',
  event: 'bg-mcw-black',
  discovery: 'bg-mcw-black',
};
const markerLabel = {
  baseline: 'Baseline',
  normal: 'Normal',
  possible: 'Possible',
  clear: 'Clear',
  event: 'Event',
  discovery: 'Discovery',
};

export default function TunnelHealth() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="font-verdana text-mcw-red uppercase tracking-widest text-xs mb-1">
          Module 01 · Valve–Head Signature
        </p>
        <p className="font-verdana text-xs text-mcw-gray mb-2">
          Case Study: Glendoe Hydro Scheme, Scotland (2009)
        </p>
        <h1 className="font-calibri text-4xl font-bold text-mcw-black mb-3">
          Tunnel Health Methodology
        </h1>
        <p className="font-verdana text-mcw-gray text-sm max-w-3xl leading-relaxed">
          In 2009, the Glendoe headrace tunnel — at 6.2 km the longest TBM-bored tunnel in UK
          hydropower — collapsed within months of commissioning, blocking about 71 m of the bore in
          the Conagleann Fault Zone. The failure was discovered on <strong>4 August 2009</strong>{' '}
          when a sediment plume appeared and the unit was shut down, and it led to a £137M dispute
          (SSE v Hochtief) that reached the Supreme Court.
        </p>
        <p className="font-verdana text-mcw-gray text-sm max-w-3xl leading-relaxed mt-2">
          The hard part is that the collapse was almost invisible to the instrument you would expect
          to catch it. A blockage of two-thirds of the tunnel costs only about{' '}
          <strong>1 m of a ~605 m head — under 0.2%</strong>, inside the error of the pressure
          gauges. So watching head alone could never have raised the alarm. What Mike McWilliams
          showed in his expert-witness analysis is that the <strong>needle valve</strong> tells the
          story the head gauge cannot.
        </p>
        <p className="font-verdana text-mcw-gray text-sm max-w-3xl leading-relaxed mt-2">
          This dashboard demonstrates Module 01 of HydroPulse: reading tunnel health from the
          relationship between needle-valve opening and gross head — a method SSE did not have in
          2009, applied to data they already held.
        </p>
      </div>

      {/* Key facts */}
      <section className="mb-10">
        <h2 className="section-heading">Scheme Specifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {keyFacts.map(({ label, value }) => (
            <div key={label} className="card">
              <p className="font-verdana text-xs text-mcw-gray">{label}</p>
              <p className="font-calibri font-bold text-mcw-black mt-1">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analogy callout */}
      <section className="mb-6">
        <div className="card border-l-4 border-mcw-red bg-mcw-lightgray">
          <p className="font-calibri font-bold text-mcw-black mb-1">The accelerator, not the speedometer</p>
          <p className="font-verdana text-sm text-mcw-gray leading-relaxed max-w-3xl">
            To hold 70 mph on a flat road, the accelerator sits in a predictable spot. If you have to
            press it further to keep the same speed, something is dragging — even while the
            speedometer still reads a steady 70. Here the <strong>needle valve is the accelerator</strong>,{' '}
            <strong>100 MW is the speed</strong>, a <strong>tunnel blockage is the drag</strong>, and
            the <strong>head gauge is the speedometer that barely notices</strong>.
          </p>
        </div>
      </section>

      {/* Primary chart: valve opening vs gross head */}
      <section className="mb-10">
        <h2 className="section-heading">
          Needle Valve Opening vs <span className="red-accent">Gross Head</span>
        </h2>
        <p className="font-verdana text-xs text-mcw-gray mb-4 max-w-3xl">
          Each point is a steady-state reading at full 100 MW output. Healthy readings fall inside
          the grey band. As the tunnel blocks, the valve must open further to hold 100 MW, so the
          points walk to the <strong>right</strong> of the band — while the head stays almost
          unchanged. Colour runs from December (pale) through to July (deep red).
        </p>
        <div className="card p-4">
          <ResponsiveContainer width="100%" height={420}>
            <ScatterChart margin={{ top: 10, right: 24, left: 8, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                dataKey="valve"
                domain={[80, 101]}
                ticks={[80, 85, 90, 95, 100]}
                tick={{ fontFamily: 'Verdana', fontSize: 11 }}
                label={{
                  value: 'Needle Valve Opening (%)',
                  position: 'insideBottom',
                  offset: -12,
                  style: { fontFamily: 'Verdana', fontSize: 11, fill: '#666666' },
                }}
              />
              <YAxis
                type="number"
                dataKey="head"
                domain={[602, 610]}
                ticks={[602, 604, 606, 608, 610]}
                tick={{ fontFamily: 'Verdana', fontSize: 11 }}
                label={{
                  value: 'Gross Head (m)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 16,
                  style: { fontFamily: 'Verdana', fontSize: 11, fill: '#666666' },
                }}
              />
              <ZAxis range={[70, 70]} />
              <NormalBand />
              <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              {seriesData.map((data, i) => (
                <Scatter
                  key={valveHeadSeries[i].period}
                  name={valveHeadSeries[i].period}
                  data={data}
                  fill={PERIOD_COLOURS[i]}
                  fillOpacity={0.9}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
          {/* Chronological legend (colour = time) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-gray-100">
            <span className="font-verdana text-xs text-mcw-gray mr-1">Reading period:</span>
            {valveHeadSeries.map((s, i) => (
              <span key={s.period} className="inline-flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: PERIOD_COLOURS[i] }}
                />
                <span className="font-verdana text-xs text-mcw-gray">{s.period}</span>
              </span>
            ))}
          </div>
          <p className="font-verdana text-xs text-gray-400 mt-3 italic">
            Points are illustrative, reconstructed to match the ranges and drift pattern of Mike
            McWilliams' published Appendix T charts (needle valve opening ~80–100%, gross head
            ~603–609 m). They stand in for the roughly 7,400 ten-minute readings in the full record.
            A handful of readings inside the baseline months reflect start-up, shutdown and
            output-change events rather than tunnel condition.
          </p>
        </div>
      </section>

      {/* Honest timeline */}
      <section className="mb-10">
        <h2 className="section-heading">
          What the Data <span className="red-accent">Showed</span>, and When
        </h2>
        <p className="font-verdana text-xs text-mcw-gray mb-4 max-w-3xl">
          Read forward in time, the readings move from firmly inside the band, to a slight and
          ambiguous drift, to a clear and sustained departure — well before any physical sign of
          trouble.
        </p>
        <div className="space-y-3">
          {timeline.map((t) => (
            <div key={t.period} className="flex gap-4 card">
              <div className="flex-shrink-0 w-40">
                <p className="font-calibri font-bold text-mcw-black text-sm">{t.period}</p>
                <span className="inline-flex items-center gap-1.5 mt-1">
                  <span className={`w-2.5 h-2.5 rounded-full inline-block ${markerColour[t.marker]}`} />
                  <span className="font-verdana text-xs uppercase tracking-wide text-mcw-gray">
                    {markerLabel[t.marker]}
                  </span>
                </span>
              </div>
              <div className="flex-1">
                <p className="font-calibri font-bold text-mcw-black">{t.event}</p>
                <p className="font-verdana text-xs text-mcw-gray mt-1 leading-relaxed">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alarm contrast */}
      <section className="mb-10">
        <div className="card border-l-4 border-mcw-black">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex gap-8 flex-wrap justify-center md:justify-start">
              {[
                { value: alarmContrast.sensors, label: 'sensors\ninstalled' },
                { value: alarmContrast.relayed, label: 'relayed to\noperators' },
                { value: alarmContrast.alarms, label: `alarms\n${alarmContrast.window}` },
                { value: '0', label: 'caught the\ncollapse' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-calibri font-bold text-3xl text-mcw-red">{value}</p>
                  <p className="font-verdana text-xs text-mcw-gray whitespace-pre-line mt-1">{label}</p>
                </div>
              ))}
            </div>
            <p className="font-verdana text-sm text-mcw-gray md:ml-auto max-w-sm md:text-right">
              Glendoe was not short of sensors. Of the roughly 20,000 alarms raised in the eight
              months to the collapse, none identified the tunnel blockage — and most were false. The
              missing piece was not more data, but the right way to read it.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology steps */}
      <section className="mb-10">
        <h2 className="section-heading">
          The <span className="red-accent">Methodology</span>
        </h2>
        <p className="font-verdana text-sm text-mcw-gray mb-6 max-w-3xl">
          The core insight is simple: at fixed power, needle-valve opening and gross head are tied
          together, and a tunnel blockage breaks that relationship in a way the head gauge cannot
          see. The method turns that into a repeatable early-warning check.
        </p>
        <div className="space-y-4">
          {methodologySteps.map(({ step, title, description }) => (
            <div key={step} className="flex gap-4 card border-l-4 border-mcw-black">
              <div className="flex-shrink-0 w-10 h-10 bg-mcw-black text-white font-calibri font-bold text-lg flex items-center justify-center">
                {step}
              </div>
              <div>
                <p className="font-calibri font-bold text-mcw-black">{title}</p>
                <p className="font-verdana text-xs text-mcw-gray mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key finding callout */}
      <section className="bg-mcw-red text-white p-8 mb-10">
        <h2 className="font-calibri text-2xl font-bold mb-3">Key Finding</h2>
        <p className="font-verdana text-sm leading-relaxed max-w-3xl">
          Applied in retrospect to data SSE already held, the valve-versus-head view places the
          clear onset of the collapse in <strong>early April 2009 — roughly four months before it
          was discovered on 4 August</strong>. The head gauge could not have shown this: {' '}
          {headInsensitivity.blockageFraction} of the tunnel blocked cost only about{' '}
          {headInsensitivity.headLostFromCollapse} of head, {headInsensitivity.pctOfHead} of the
          total and well inside gauge error.
        </p>
        <p className="font-verdana text-sm mt-3 text-red-100 max-w-3xl">
          The point is not that anyone missed an obvious warning. With the tools available in 2009,
          the operators could not reasonably have seen this coming — the method to detect it did not
          yet exist. What Glendoe shows is that the signal was there to be read, and that the right
          analysis makes an "invisible" failure visible with months of lead time. That is the method
          HydroPulse now applies to any hydropower or pumped-storage scheme — Pelton needle valves or
          Francis wicket gates alike.
        </p>
      </section>

      {/* Sources */}
      <section>
        <h2 className="section-heading text-sm font-verdana font-normal text-mcw-gray">Sources</h2>
        <ul className="font-verdana text-xs text-mcw-gray space-y-1 list-disc list-inside">
          <li>M.J. McWilliams — expert-witness analysis, Appendix T charts (needle valve opening v head)</li>
          <li>Glendoe Hydro Scheme, Wikipedia</li>
          <li>TunnelTalk: "Rock falls shut down Glendoe power plant" (2009)</li>
          <li>
            Springer Rock Mechanics and Rock Engineering: "The Glendoe Tunnel Collapse in Scotland"
            (2019)
          </li>
          <li>SSE Renewables: Glendoe scheme technical overview</li>
        </ul>
      </section>
    </main>
  );
}
