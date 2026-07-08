import { Link } from 'react-router-dom';

const modules = [
  {
    id: '01',
    name: 'Tunnel Health Monitoring',
    description:
      'Detect a tunnel blockage from the relationship between needle-valve (or wicket-gate) opening and gross head — a signal far more sensitive than pressure monitoring. Based on the methodology from the £137M Glendoe case (SSE v Hochtief).',
    link: '/tunnel-health',
    active: true,
  },
  {
    id: '02',
    name: 'Bearing Health Monitoring',
    description:
      'Detect escalating transient vibration patterns and correlated temperature drift in turbine and generator bearings — before a simple mean-value alarm would ever fire.',
    link: '/bearing-health',
    active: true,
  },
  {
    id: '03',
    name: 'Flow & Sediment Load',
    description:
      'Monitor suspended sediment concentration and flow variability — key drivers of erosion and cavitation risk in headrace tunnels and turbines.',
    active: false,
  },
  {
    id: '04',
    name: 'Civil Structure Health',
    description:
      'Integrate inspection records with live operational signals to track dam, penstock, and intake condition continuously.',
    active: false,
  },
  {
    id: '05',
    name: 'Revenue & Availability Impact',
    description:
      'Translate health signals into financial terms — lost generation estimates, repair cost forecasting, and insurance risk quantification.',
    active: false,
  },
];

const credentials = [
  { org: 'World Bank', role: 'Senior Advisor on Hydropower & Dams' },
  { org: 'Mott MacDonald', role: 'Former Global Head of Hydropower' },
  { org: 'CEBR', role: 'Senior Advisor, Energy' },
  { org: 'Agua Imara', role: 'Non-executive Board Member' },
  { org: 'Klinchenberg', role: 'Senior Advisor (Norfund/BII/TotalEnergies)' },
  { org: 'IHA Pumped Storage Forum', role: 'Partnership Member' },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-mcw-black text-white py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="font-verdana text-mcw-red uppercase tracking-widest text-xs mb-4">
            Predictive Hydropower Asset Management
          </p>
          <h1 className="font-calibri text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Stop reacting to failures.
            <br />
            <span className="text-mcw-red">Start predicting them.</span>
          </h1>
          <p className="font-verdana text-gray-300 text-base max-w-2xl mb-8 leading-relaxed">
            HydroPulse turns your existing operational sensor data into continuous early-warning
            intelligence — so structural deterioration, efficiency losses, and civil risks are
            caught months before they become failures.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/tunnel-health" className="btn-primary inline-block">
              See the Case Study →
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white font-verdana font-bold px-6 py-3 hover:bg-white hover:text-mcw-black transition-colors duration-200 inline-block"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-4 bg-mcw-lightgray">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center mb-3">
            You have the data.{' '}
            <span className="red-accent">Are you using it?</span>
          </h2>
          <p className="font-verdana text-mcw-gray text-sm text-center max-w-2xl mx-auto mb-10">
            Modern hydroelectric schemes generate thousands of sensor readings per second. Yet most
            operators are still running on reactive repairs or fixed schedules that are disconnected
            from what the data is actually telling them.
          </p>

          <div className="grid md:grid-cols-3 border border-gray-200">
            <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block flex-shrink-0" />
                <h3 className="font-calibri font-bold text-mcw-black text-lg">
                  Reactive Maintenance
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Act after equipment fails',
                  'Maximum damage before detection',
                  'High emergency repair costs',
                  'Unplanned downtime events',
                  'Legal exposure for preventable failures',
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2 font-verdana text-xs text-mcw-gray">
                    <span className="text-red-400 font-bold flex-shrink-0">✕</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block flex-shrink-0" />
                <h3 className="font-calibri font-bold text-mcw-black text-lg">
                  Scheduled Maintenance
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Calendar-driven intervals',
                  'Disconnected from live data',
                  'May miss accelerating deterioration',
                  'Resources spent on unnecessary checks',
                  'No personalisation to your asset',
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2 font-verdana text-xs text-mcw-gray">
                    <span className="text-yellow-500 font-bold flex-shrink-0">~</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-mcw-black text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-mcw-red inline-block flex-shrink-0" />
                <h3 className="font-calibri font-bold text-white text-lg">HydroPulse</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Continuous data-driven alerting',
                  'Months of advance warning',
                  'Prioritised, targeted maintenance',
                  'Multiple data streams correlated',
                  'Configured per asset and operating conditions',
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2 font-verdana text-xs text-gray-300">
                    <span className="text-mcw-red font-bold flex-shrink-0">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Glendoe stat callout */}
          <div className="mt-6 bg-mcw-black text-white p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex gap-8 flex-wrap justify-center md:justify-start">
              {[
                { value: '~20,000', label: 'alarms raised —\nnone caught it' },
                { value: '1,700', label: 'sensors installed\nat Glendoe' },
                { value: '<0.2%', label: 'head change from a\n⅔ tunnel blockage' },
                { value: '£137M', label: 'legal dispute\nthat followed' },
              ].map(({ value, label }) => (
                <div key={value} className="text-center">
                  <p className="font-calibri font-bold text-4xl text-mcw-red">{value}</p>
                  <p className="font-verdana text-xs text-gray-400 whitespace-pre-line mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-verdana text-sm text-gray-300 md:ml-auto max-w-xs md:text-right">
              The Glendoe collapse (2009) was nearly invisible to the head gauge — but plain in the
              valve-versus-head data operators already had. HydroPulse exists to read that signal.
            </p>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading mb-2">
            Five monitoring modules.{' '}
            <span className="red-accent">One integrated platform.</span>
          </h2>
          <p className="font-verdana text-mcw-gray text-sm mb-10 max-w-2xl">
            Each module targets a distinct failure mode. Together they provide comprehensive
            coverage of hydroelectric asset health — from tunnel integrity to revenue impact.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(({ id, name, description, link, active }) => (
              <div
                key={id}
                className={`card relative flex flex-col ${
                  active ? 'border-l-4 border-mcw-red' : 'opacity-70'
                }`}
              >
                {!active && (
                  <span className="absolute top-3 right-3 bg-gray-100 text-gray-400 font-verdana text-xs px-2 py-0.5">
                    Coming Soon
                  </span>
                )}
                <p className="font-calibri font-bold text-mcw-red text-3xl mb-1">{id}</p>
                <p className="font-calibri font-bold text-mcw-black text-base mb-2">{name}</p>
                <p className="font-verdana text-xs text-mcw-gray leading-relaxed flex-1">
                  {description}
                </p>
                {active && link && (
                  <Link
                    to={link}
                    className="mt-4 font-verdana text-xs font-bold text-mcw-red hover:underline"
                  >
                    Explore the dashboard →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case study dark teaser */}
      <section className="bg-mcw-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="font-verdana text-mcw-red uppercase tracking-widest text-xs mb-3">
              Case Study · Glendoe Hydro Scheme, Scotland
            </p>
            <h2 className="font-calibri text-3xl font-bold mb-4">
              Invisible to the gauge. Plain in the data.
            </h2>
            <p className="font-verdana text-gray-300 text-sm leading-relaxed mb-6 max-w-lg">
              In 2009, the Glendoe headrace tunnel collapsed within months of commissioning — and 71 m
              of blocked tunnel changed the head by barely 1 m, too little for any alarm to catch. Yet
              in the relationship between needle-valve opening and head, the same data show a clear
              departure from early April, months before the £137M collapse was discovered on 4 August.
              The operators could not have seen it with the tools of the day. The right analysis makes
              it visible.
            </p>
            <Link to="/tunnel-health" className="btn-primary inline-block">
              View the Full Dashboard →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 flex-shrink-0 text-center">
            {[
              { value: '~4 mo', label: 'detectable before discovery', highlight: true },
              { value: '7,400', label: 'readings analysed', highlight: false },
              { value: '1 m', label: 'head lost from 71 m of collapse', highlight: false },
              { value: '<0.2%', label: 'head change from a ⅔ blockage', highlight: true },
            ].map(({ value, label, highlight }) => (
              <div key={label}>
                <p
                  className={`font-calibri font-bold text-5xl ${
                    highlight ? 'text-mcw-red' : 'text-white'
                  }`}
                >
                  {value}
                </p>
                <p className="font-verdana text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-mcw-lightgray">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading mb-2">
            The <span className="red-accent">team</span>
          </h2>
          <p className="font-verdana text-mcw-gray text-sm mb-10 max-w-2xl">
            HydroPulse pairs 45 years of field hydropower expertise with proven clinical AI
            methodology — a combination that, as far as we know, is unique in the sector.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mike */}
            <div className="bg-white border border-gray-200 shadow-sm p-6 border-t-4 border-t-mcw-red">
              <div className="flex gap-5 items-start mb-4">
                <img
                  src="/mike-photo.jpg"
                  alt="Mike McWilliams"
                  className="w-20 h-26 object-cover border-2 border-mcw-red shadow flex-shrink-0"
                  style={{ height: '6.5rem' }}
                />
                <div>
                  <p className="font-calibri font-bold text-mcw-black text-xl leading-tight">
                    Mike McWilliams
                  </p>
                  <p className="font-verdana text-mcw-red text-xs uppercase tracking-widest mt-1">
                    Founder · Hydropower Domain Expertise
                  </p>
                  <p className="font-verdana text-xs text-mcw-gray mt-2">
                    McWilliams Energy · Tenterden, UK
                  </p>
                </div>
              </div>
              <p className="font-verdana text-mcw-gray text-xs leading-relaxed mb-4">
                With 45 years in hydropower engineering across 60+ countries, Mike built HydroPulse
                on methodologies developed during expert witness work on the £137M SSE v Hochtief
                (Glendoe) case — showing that the 2009 tunnel collapse was detectable months in
                advance in operational data the operators already held, using a method that did not
                exist at the time.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {credentials.map(({ org, role }) => (
                  <div key={org} className="bg-mcw-lightgray p-2">
                    <p className="font-calibri font-bold text-mcw-black text-xs">{org}</p>
                    <p className="font-verdana text-xs text-mcw-gray mt-0.5 leading-tight">{role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chris */}
            <div className="bg-white border border-gray-200 shadow-sm p-6 border-t-4 border-t-mcw-black">
              <div className="mb-4">
                <p className="font-calibri font-bold text-mcw-black text-xl leading-tight">
                  Dr Chris McWilliams
                </p>
                <p className="font-verdana text-mcw-red text-xs uppercase tracking-widest mt-1">
                  Co-founder · Data Science &amp; Predictive Modelling
                </p>
                <p className="font-verdana text-xs text-mcw-gray mt-2">
                  Research Fellow · University of Bristol, School of Engineering Mathematics &amp; Technology
                </p>
              </div>
              <p className="font-verdana text-mcw-gray text-xs leading-relaxed mb-4">
                Chris brings the methodological rigour of clinical AI to industrial asset monitoring.
                As first author of a machine learning decision support tool for intensive care discharge
                prediction — using multivariate time-series data from MIMIC-III, one of the world's
                largest open clinical databases, validated on NHS Bristol data — his expertise in
                extracting predictive signals from dense sensor streams translates directly to
                HydroPulse's bearing and tunnel health modules.
              </p>
              <p className="font-verdana text-mcw-gray text-xs leading-relaxed mb-4">
                The connection is methodologically exact: ICU vitals and lab values become SCADA
                bearing channels; patient deterioration becomes equipment failure; the clinical
                early warning score becomes the HydroPulse risk score.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { org: 'BMJ Open (2019)', role: 'First author — ML for ICU discharge prediction' },
                  { org: 'BMC Medicine (2021)', role: 'NEWS2 evaluation — 192 citations' },
                  { org: 'MIMIC-III / NHS Bristol', role: 'Multivariate clinical time-series at scale' },
                  { org: 'University of Bristol', role: 'LEAP project — synthetic data for clinical AI' },
                ].map(({ org, role }) => (
                  <div key={org} className="bg-mcw-lightgray p-2">
                    <p className="font-calibri font-bold text-mcw-black text-xs">{org}</p>
                    <p className="font-verdana text-xs text-mcw-gray mt-0.5 leading-tight">{role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mcw-red py-16 px-4 text-center">
        <h2 className="font-calibri text-3xl font-bold text-white mb-3">
          Ready to see what your data is telling you?
        </h2>
        <p className="font-verdana text-red-100 text-sm mb-6 max-w-xl mx-auto">
          HydroPulse is available for pilot deployment on operating hydroelectric and pumped storage
          schemes. Request a demonstration or discuss your asset's data landscape.
        </p>
        <Link
          to="/contact"
          className="bg-white text-mcw-red font-verdana font-bold px-8 py-3 hover:bg-red-50 transition-colors inline-block"
        >
          Request a Demo
        </Link>
      </section>
    </main>
  );
}
