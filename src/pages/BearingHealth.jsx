import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import {
  weeklyData,
  resultStats,
  caseContext,
  methodologySteps,
  NORMAL_PEAK_LIMIT,
  WARNING_THRESHOLD,
} from '../data/bearingHealthData';

const statusColour = {
  normal:  'bg-green-100 text-green-800',
  caution: 'bg-yellow-100 text-yellow-800',
  warning: 'bg-orange-100 text-orange-800',
  failure: 'bg-red-100 text-red-800',
  offline: 'bg-gray-100 text-gray-500',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg p-3 text-xs font-verdana">
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value != null ? p.value : '—'}
          {p.name.includes('%') ? '' : '%'}
        </p>
      ))}
    </div>
  );
};

export default function BearingHealth() {
  const chartData = weeklyData.filter((d) => d.status !== 'failure');

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">

      {/* Page header */}
      <div className="mb-8">
        <p className="font-verdana text-mcw-red uppercase tracking-widest text-xs mb-1">
          Module 02 · Bearing Health Monitoring
        </p>
        <p className="font-verdana text-xs text-mcw-gray mb-2">
          Case Study: Neelum-Jhelum Hydropower Project, Pakistan — Unit No. 01 (2021–2022)
        </p>
        <h1 className="font-calibri text-4xl font-bold text-mcw-black mb-3">
          Detecting Bearing Failure Before It Happens
        </h1>
        <p className="font-verdana text-mcw-gray text-sm max-w-3xl leading-relaxed">
          When Unit No. 01 returned to service in December 2021 after its seasonal shutdown, the
          turbine guide bearing was already beginning to fail. No alarm fired. The unit was taken
          offline in early February 2022 when the bearing failed — with no automated prior warning.
          HydroPulse's AI risk model, trained on real bearing run-to-failure data, would have flagged
          89% risk on the very first operational reading — <strong>approximately eight weeks earlier</strong>.
        </p>
      </div>

      {/* Headline result stats */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {resultStats.map(({ value, label, detail, highlight }) => (
            <div
              key={label}
              className={`card p-4 border-t-4 ${highlight ? 'border-mcw-red' : 'border-gray-300'}`}
            >
              <p className={`font-calibri text-2xl font-bold ${highlight ? 'text-mcw-red' : 'text-mcw-black'}`}>
                {value}
              </p>
              <p className="font-verdana text-xs font-bold text-mcw-black mt-1">{label}</p>
              <p className="font-verdana text-xs text-mcw-gray mt-0.5 leading-snug">{detail}</p>
            </div>
          ))}
        </div>
        {/* Small context strip */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">
          {caseContext.map(({ label, value }) => (
            <span key={label} className="font-verdana text-xs text-mcw-gray">
              <span className="font-bold">{label}:</span> {value}
            </span>
          ))}
        </div>
      </section>

      {/* Single chart: LSTM risk score vs raw peak vibration exceedance */}
      <section className="mb-10">
        <h2 className="section-heading">
          AI <span className="red-accent">Risk Score</span> vs Raw Signal
        </h2>
        <p className="font-verdana text-xs text-mcw-gray mb-4 max-w-3xl">
          The red line is the AI risk model output. The grey dashed line is the raw peak vibration
          expressed as a percentage of the warning threshold (0% = at normal limit, 100% = at alarm).
          The raw signal rises gradually through December, reaching the alarm level only in
          December W4. The AI risk model was already at 89% on the first day back — because it detected the
          step-change in the axial bearing channel (TGB-Z), which jumped 10× at restart while the
          horizontal channels that operators were watching moved only modestly.
        </p>
        <div className="card p-4">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontFamily: 'Verdana', fontSize: 10 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontFamily: 'Verdana', fontSize: 11 }}
                label={{ value: '(%)', angle: -90, position: 'insideLeft', offset: 10,
                  style: { fontFamily: 'Verdana', fontSize: 11 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Verdana', fontSize: 11 }} />
              <ReferenceLine
                y={25}
                stroke="#f59e0b"
                strokeDasharray="5 3"
                label={{ value: '25% caution', position: 'right',
                  style: { fontFamily: 'Verdana', fontSize: 9, fill: '#f59e0b' } }}
              />
              <ReferenceLine
                y={50}
                stroke="#FF0000"
                strokeDasharray="5 3"
                label={{ value: '50% warning', position: 'right',
                  style: { fontFamily: 'Verdana', fontSize: 9, fill: '#FF0000' } }}
              />
              <Area
                type="monotone"
                dataKey="riskScore"
                name="AI Risk Score (%)"
                stroke="#FF0000"
                fill="#FF0000"
                fillOpacity={0.15}
                strokeWidth={2}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="peakScore"
                name="Peak Vib % of Alert Threshold"
                stroke="#6b7280"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={{ r: 2, fill: '#6b7280' }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="font-verdana text-xs text-gray-400 mt-2 italic">
          LSTM trained on NASA IMS Bearing Run-to-Failure dataset (50-min aggregated features,
          val MAE 0.10). Peak Vib % = (peak − {NORMAL_PEAK_LIMIT} μm) ÷
          ({WARNING_THRESHOLD} − {NORMAL_PEAK_LIMIT} μm) × 100, capped at 100%.
          Weekly aggregates from Figshare dataset DOI: 10.6084/m9.figshare.21290895.
        </p>
      </section>

      {/* Status table — compact */}
      <section className="mb-10">
        <h2 className="section-heading">Weekly Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-verdana border-collapse">
            <thead>
              <tr className="bg-mcw-black text-white">
                <th className="px-3 py-2 text-left">Week</th>
                <th className="px-3 py-2 text-right">Mean Vib</th>
                <th className="px-3 py-2 text-right">Peak Vib</th>
                <th className="px-3 py-2 text-right">Temp</th>
                <th className="px-3 py-2 text-right">AI Risk</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((row, i) => (
                <tr key={row.week} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 font-bold">{row.week}</td>
                  <td className="px-3 py-1.5 text-right">
                    {row.meanVib != null ? `${row.meanVib} μm` : '—'}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {row.peakVib != null ? `${row.peakVib} μm` : '—'}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {row.tempC != null ? `${row.tempC}°C` : '—'}
                  </td>
                  <td className="px-3 py-1.5 text-right font-bold">
                    {row.riskScore != null ? `${row.riskScore}%` : '—'}
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${statusColour[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key finding callout */}
      <section className="bg-mcw-red text-white p-8 mb-10">
        <h2 className="font-calibri text-2xl font-bold mb-3">Key Finding</h2>
        <p className="font-verdana text-sm leading-relaxed max-w-3xl">
          The mean vibration alarm for Unit 01 never fired — the mean stayed at ~6 μm, well
          within the 8 μm design limit, from October through to the failure in early February.
          Even a peak vibration alarm configured at 15 μm would have fired only in December W4,
          giving approximately 5.5 weeks of notice. The HydroPulse AI risk model detected{' '}
          <strong>89% failure risk on the first operational day of December</strong> —
          approximately eight weeks before the bearing failed, and 2.5 weeks earlier than any
          peak vibration threshold would have alerted.
        </p>
        <p className="font-verdana text-sm mt-3 text-red-100">
          This methodology generalises to any rotating machinery in a hydroelectric scheme:
          generator bearings, shaft seals, gearboxes, and turbine runner wear patterns.
        </p>
      </section>

      {/* Methodology — trimmed to 3 steps */}
      <section className="mb-10">
        <h2 className="section-heading">
          The <span className="red-accent">Methodology</span>
        </h2>
        <div className="space-y-4">
          {methodologySteps.slice(0, 3).map(({ step, title, description }) => (
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

      {/* Clinical AI bridge */}
      <section className="mb-10 card border-l-4 border-mcw-red">
        <h2 className="font-calibri font-bold text-mcw-black text-lg mb-3">
          Grounded in Proven Clinical AI Methodology
        </h2>
        <p className="font-verdana text-xs text-mcw-gray leading-relaxed mb-3">
          The HydroPulse bearing health module is built on the same methodological foundations
          as clinical early warning systems. Dr Chris McWilliams, HydroPulse's data science
          lead, developed machine learning decision support tools for intensive care using
          MIMIC-III — one of the world's largest open clinical time-series databases — predicting
          patient discharge readiness and adverse events from dense multivariate sensor streams.
        </p>
        <p className="font-verdana text-xs text-mcw-gray leading-relaxed">
          The transfer is methodologically exact: ICU vital signs become SCADA bearing channels;
          patient deterioration becomes bearing failure; the discharge prediction model becomes
          the maintenance window scheduler. The mathematics, the temporal pattern recognition,
          and the challenge of extracting signal from noisy, high-frequency data are identical.
        </p>
      </section>

      {/* Sources */}
      <section>
        <h2 className="section-heading text-sm font-verdana font-normal text-mcw-gray">
          Sources
        </h2>
        <ul className="font-verdana text-xs text-mcw-gray space-y-1 list-disc list-inside">
          <li>
            Manzoor et al. (2024) — "A Fault Prognostic System for the Turbine Guide Bearings of
            a Hydropower Plant Using LSTM", arXiv:2407.19040
          </li>
          <li>
            Bearing Vibration Dataset of a Hydropower Project — Figshare, open access,
            DOI: 10.6084/m9.figshare.21290895
          </li>
          <li>
            C. McWilliams et al. (2019) — "Towards a decision support tool for intensive care
            discharge: machine learning algorithm development using MIMIC-III and Bristol, UK",
            BMJ Open
          </li>
          <li>
            Neelum-Jhelum Hydroelectric Project — WAPDA, Pakistan (969 MW, commissioned 2018)
          </li>
        </ul>
      </section>

    </main>
  );
}
