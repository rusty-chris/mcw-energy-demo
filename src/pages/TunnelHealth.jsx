import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  monthlyData,
  keyFacts,
  methodologySteps,
  DESIGN_HEAD,
  WARNING_THRESHOLD,
} from '../data/glendoeData';

const statusColour = {
  normal: 'bg-green-100 text-green-800',
  caution: 'bg-yellow-100 text-yellow-800',
  warning: 'bg-orange-100 text-orange-800',
  collapse: 'bg-red-100 text-red-800',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg p-3 text-xs font-verdana">
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value != null ? p.value : 'COLLAPSE'}
          {p.name === 'Net Head (m)' ? ' m' : p.name === 'Output (MW)' ? ' MW' : '%'}
        </p>
      ))}
    </div>
  );
};

export default function TunnelHealth() {
  const chartData = monthlyData.map((d) => ({
    ...d,
    designHead: DESIGN_HEAD,
    warningThreshold: WARNING_THRESHOLD,
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="font-verdana text-mcw-red uppercase tracking-widest text-xs mb-1">
          Module 01 · Head Loss Monitoring
        </p>
        <p className="font-verdana text-xs text-mcw-gray mb-2">
          Case Study: Glendoe Hydro Scheme, Scotland (2009)
        </p>
        <h1 className="font-calibri text-4xl font-bold text-mcw-black mb-3">
          Tunnel Health Methodology
        </h1>
        <p className="font-verdana text-mcw-gray text-sm max-w-3xl leading-relaxed">
          In 2009, the Glendoe headrace tunnel — at 6.2 km the longest TBM-bored tunnel in UK
          hydropower — collapsed just eight months after commissioning. The £137M legal dispute
          that followed (SSE v Hochtief, eventually reaching the Supreme Court) revealed that
          operational data available to the plant operator contained months of advance warning
          that was never acted upon.
        </p>
        <p className="font-verdana text-mcw-gray text-sm max-w-3xl leading-relaxed mt-2">
          The scheme was officially opened by Queen Elizabeth II on <strong>29 June 2009</strong>.
          The very next day — <strong>30 June</strong> — operators reported "unusual thumping
          noises" lasting approximately two hours. Five weeks later, on <strong>4 August 2009</strong>,
          a sediment plume was observed and the scheme was shut down. The collapse had blocked
          71 m of tunnel in the Conagleann Fault Zone.
        </p>
        <p className="font-verdana text-mcw-gray text-sm max-w-3xl leading-relaxed mt-2">
          This dashboard demonstrates Module 01 of HydroPulse: the Head Loss Monitoring
          methodology developed by Mike McWilliams during his expert witness work on the Glendoe
          proceedings — a systematic approach to monitoring net head loss that identifies structural
          deterioration long before catastrophic failure occurs.
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

      {/* Net Head chart */}
      <section className="mb-10">
        <h2 className="section-heading">
          Net Head <span className="red-accent">Decline</span>, January–August 2009
        </h2>
        <p className="font-verdana text-xs text-mcw-gray mb-4">
          The design net head was 600–606 m. A head reading of 584 m was observed in late May/June —
          the first manual check. No automated alarm existed. The chart shows what automated
          monitoring would have revealed.
        </p>
        <div className="card p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Verdana', fontSize: 11 }} />
              <YAxis
                domain={[550, 620]}
                tick={{ fontFamily: 'Verdana', fontSize: 11 }}
                label={{ value: 'Head (m)', angle: -90, position: 'insideLeft', offset: 10, style: { fontFamily: 'Verdana', fontSize: 11 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Verdana', fontSize: 11 }} />
              {/* Warning zone shading */}
              <ReferenceArea y1={550} y2={WARNING_THRESHOLD} fill="#fef2f2" fillOpacity={0.5} />
              <ReferenceLine
                y={DESIGN_HEAD}
                stroke="#22c55e"
                strokeDasharray="6 3"
                label={{ value: 'Design Head 603m', position: 'right', style: { fontFamily: 'Verdana', fontSize: 10, fill: '#22c55e' } }}
              />
              <ReferenceLine
                y={WARNING_THRESHOLD}
                stroke="#FF0000"
                strokeDasharray="6 3"
                label={{ value: 'Warning Threshold 595m', position: 'right', style: { fontFamily: 'Verdana', fontSize: 10, fill: '#FF0000' } }}
              />
              <Line
                type="monotone"
                dataKey="netHead"
                name="Net Head (m)"
                stroke="#000000"
                strokeWidth={2}
                dot={{ r: 4, fill: '#000000' }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="designHead"
                name="Design Head (m)"
                stroke="#22c55e"
                strokeWidth={1}
                dot={false}
                strokeDasharray="6 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Output chart */}
      <section className="mb-10">
        <h2 className="section-heading">
          Turbine <span className="red-accent">Output</span> vs. Capacity
        </h2>
        <p className="font-verdana text-xs text-mcw-gray mb-4">
          Declining head directly reduces turbine output. Output fell from ~98 MW in January to
          ~90 MW by June — a measurable and corroborating signal of tunnel deterioration.
          August output was zero following collapse.
        </p>
        <div className="card p-4">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Verdana', fontSize: 11 }} />
              <YAxis
                domain={[0, 105]}
                tick={{ fontFamily: 'Verdana', fontSize: 11 }}
                label={{ value: 'MW', angle: -90, position: 'insideLeft', offset: 10, style: { fontFamily: 'Verdana', fontSize: 11 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="6 3" label={{ value: '100 MW capacity', position: 'right', style: { fontFamily: 'Verdana', fontSize: 10, fill: '#22c55e' } }} />
              <Bar dataKey="output" name="Output (MW)" fill="#000000" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Head loss % chart */}
      <section className="mb-10">
        <h2 className="section-heading">
          Cumulative Head Loss <span className="red-accent">(%)</span>
        </h2>
        <p className="font-verdana text-xs text-mcw-gray mb-4">
          Expressed as a percentage of design head, the loss accelerated from ~0.2% in January
          to 3.2% by June and reached 14% at the point of collapse. A 2% threshold would have
          triggered an alert in approximately May 2009.
        </p>
        <div className="card p-4">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Verdana', fontSize: 11 }} />
              <YAxis tick={{ fontFamily: 'Verdana', fontSize: 11 }} label={{ value: 'Head Loss (%)', angle: -90, position: 'insideLeft', offset: 10, style: { fontFamily: 'Verdana', fontSize: 11 } }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Verdana', fontSize: 11 }} />
              <ReferenceLine y={2} stroke="#FF0000" strokeDasharray="5 3" label={{ value: '2% alert threshold', position: 'right', style: { fontFamily: 'Verdana', fontSize: 10, fill: '#FF0000' } }} />
              <Line
                type="monotone"
                dataKey="headLossPct"
                name="Head Loss (%)"
                stroke="#FF0000"
                strokeWidth={2}
                dot={{ r: 4, fill: '#FF0000' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Status timeline */}
      <section className="mb-10">
        <h2 className="section-heading">Operational Status Timeline</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-verdana border-collapse">
            <thead>
              <tr className="bg-mcw-black text-white">
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-right">Net Head (m)</th>
                <th className="px-4 py-2 text-right">Output (MW)</th>
                <th className="px-4 py-2 text-right">Head Loss</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, i) => (
                <tr key={row.month} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-bold">{row.month}</td>
                  <td className="px-4 py-2 text-right">{row.netHead} m</td>
                  <td className="px-4 py-2 text-right">
                    {row.output != null ? `${row.output} MW` : '—'}
                  </td>
                  <td className="px-4 py-2 text-right">{row.headLossPct}%</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${statusColour[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-verdana text-xs text-gray-400 mt-2 italic">
          Data is illustrative, constructed from publicly available court records and technical
          literature. It is consistent with documented observations but not primary operational data.
        </p>
      </section>

      {/* Methodology steps */}
      <section className="mb-10">
        <h2 className="section-heading">
          The <span className="red-accent">Methodology</span>
        </h2>
        <p className="font-verdana text-sm text-mcw-gray mb-6 max-w-3xl">
          The core insight is simple: progressive head loss is a reliable leading indicator of
          tunnel structural deterioration. Setting automated thresholds and correlating them
          with output data provides operators with weeks or months of advance warning.
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
          Despite 1,700 sensors being installed at Glendoe, no alarms were configured for net head,
          needle valve opening, or head loss. The first manual observation of anomalous head
          (584 m vs design 603 m) came in late May / early June 2009 — but went unacted upon.
          Applying a 2% head-loss alert threshold to the available data would have triggered
          an alarm in approximately{' '}
          <strong>April 2009 — four months before the collapse was detected on 4 August 2009</strong>.
        </p>
        <p className="font-verdana text-sm mt-3 text-red-100">
          This methodology is now applicable to any hydropower or pumped storage scheme with
          operational head and flow monitoring.
        </p>
      </section>

      {/* Sources */}
      <section>
        <h2 className="section-heading text-sm font-verdana font-normal text-mcw-gray">Sources</h2>
        <ul className="font-verdana text-xs text-mcw-gray space-y-1 list-disc list-inside">
          <li>Glendoe Hydro Scheme, Wikipedia</li>
          <li>TunnelTalk: "Rock falls shut down Glendoe power plant" (2009)</li>
          <li>
            Springer Rock Mechanics and Rock Engineering: "The Glendoe Tunnel Collapse in Scotland"
            (2019)
          </li>
          <li>SSE Renewables: glendoe scheme technical overview</li>
          <li>
            M.J. McWilliams, "Geological Risk — Optimal Design for Risk Management", Mott MacDonald
            (2014)
          </li>
        </ul>
      </section>
    </main>
  );
}
