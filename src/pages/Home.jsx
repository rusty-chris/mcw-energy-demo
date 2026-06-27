import { Link } from 'react-router-dom';

const credentials = [
  { org: 'World Bank', role: 'Senior Advisor on Hydropower & Dams' },
  { org: 'CEBR', role: 'Senior Advisor, Energy' },
  { org: 'Agua Imara', role: 'Non-executive Board Member' },
  { org: 'Klinchenberg', role: 'Senior Advisor (Norfund/BII/TotalEnergies)' },
  { org: 'Zero Terrain', role: 'Global Advisory Board' },
  { org: 'IHA Pumped Storage Forum', role: 'Partnership Member' },
];

const innovations = [
  {
    code: 'FELT',
    title: 'Finance, Engineer, Lease & Transfer',
    description:
      'A financing model Mike invented to unlock capital-intensive hydropower projects in difficult markets — replacing decades of failed BOT/PFI approaches. The private sector finances, builds, and leases; ownership transfers to the public entity at the end of the term.',
    comingSoon: true,
  },
  {
    code: 'LAPS',
    title: 'Location Agnostic Pumped Storage',
    description:
      'Underground pumped hydro storage deployable anywhere — no mountains required. Using shaft-boring roadheader technology, LAPS enables grid-scale energy storage at depths up to 1,600 m. Featured in the 2021 International Forum on Pumped Storage publication.',
    comingSoon: true,
  },
  {
    code: 'THM',
    title: 'Tunnel Health Methodology',
    description:
      'A data-driven methodology for predicting tunnel structural failure from operational metrics. Developed during expert witness work on the £137M Glendoe Hydro Scheme collapse (Scotland, 2009) — showing the collapse could have been predicted months in advance.',
    link: '/tunnel-health',
    linkLabel: 'Explore the Dashboard →',
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-mcw-black text-white py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <p className="font-verdana text-mcw-red uppercase tracking-widest text-xs mb-3">
              Independent Energy Advisory
            </p>
            <h1 className="font-calibri text-4xl md:text-5xl font-bold leading-tight mb-4">
              Mike McWilliams
            </h1>
            <p className="font-verdana text-gray-300 text-lg mb-2">
              Over 45 years pioneering hydropower, energy storage, and project finance
              in more than 60 countries.
            </p>
            <p className="font-verdana text-gray-400 text-sm mb-8">
              World Bank Senior Advisor · Former Global Head of Hydropower, Mott MacDonald ·
              University of Edinburgh, Civil Engineering (1978)
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/tunnel-health" className="btn-primary inline-block">
                Tunnel Health Dashboard
              </Link>
              <Link
                to="/contact"
                className="border border-white text-white font-verdana font-bold px-6 py-3 hover:bg-white hover:text-mcw-black transition-colors duration-200 inline-block"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src="/mike-photo.jpg"
              alt="Mike McWilliams"
              className="w-48 h-60 object-cover border-4 border-mcw-red shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-12 bg-mcw-lightgray">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-heading text-center mb-8">Current Roles &amp; Affiliations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {credentials.map(({ org, role }) => (
              <div key={org} className="card text-center">
                <p className="font-calibri font-bold text-mcw-black text-lg">{org}</p>
                <p className="font-verdana text-sm text-mcw-gray mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h2 className="section-heading">
              A Career Built on{' '}
              <span className="red-accent">Hydropower</span>
            </h2>
            <p className="font-verdana text-mcw-gray text-sm leading-relaxed mb-4">
              Mike McWilliams has spent his career at the intersection of engineering, finance, and
              policy in the global hydropower sector. As Global Head of Hydropower at Mott MacDonald —
              a USD 2 billion engineering consultancy — he led project development, risk assessment, and
              commercial structuring across Africa, South East Asia, and beyond.
            </p>
            <p className="font-verdana text-mcw-gray text-sm leading-relaxed mb-4">
              His expert witness work has taken him into some of the most technically complex disputes
              in the sector, requiring the kind of forensic analysis that bridges engineering evidence
              with legal process. That work directly informed his Tunnel Health Methodology.
            </p>
            <p className="font-verdana text-mcw-gray text-sm leading-relaxed">
              Today, through McWilliams Energy, he advises governments, multilateral lenders, and
              private developers on how to structure, finance, and de-risk large-scale hydropower
              and pumped storage projects.
            </p>
          </div>
          <div className="flex-1">
            <h2 className="section-heading">
              Key <span className="red-accent">Innovations</span>
            </h2>
            <div className="space-y-4">
              {innovations.map(({ code, title, description, link, linkLabel, comingSoon }) => (
                <div key={code} className="card border-l-4 border-mcw-red">
                  <div className="flex items-start gap-3">
                    <span className="font-calibri font-bold text-mcw-red text-xl w-14 flex-shrink-0">
                      {code}
                    </span>
                    <div>
                      <p className="font-calibri font-bold text-mcw-black">{title}</p>
                      <p className="font-verdana text-xs text-mcw-gray mt-1 leading-relaxed">
                        {description}
                      </p>
                      {link && (
                        <Link
                          to={link}
                          className="inline-block mt-2 text-mcw-red font-verdana text-xs font-bold hover:underline"
                        >
                          {linkLabel}
                        </Link>
                      )}
                      {comingSoon && (
                        <span className="inline-block mt-2 text-xs font-verdana text-gray-400 italic">
                          Detail page coming soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mcw-red py-14 px-4 text-center">
        <h2 className="font-calibri text-3xl font-bold text-white mb-3">
          Working on a hydropower project?
        </h2>
        <p className="font-verdana text-red-100 text-sm mb-6 max-w-xl mx-auto">
          Mike provides advisory, risk assessment, financial structuring, and expert witness services
          to developers, lenders, and governments worldwide.
        </p>
        <Link
          to="/contact"
          className="bg-white text-mcw-red font-verdana font-bold px-8 py-3 hover:bg-red-50 transition-colors inline-block"
        >
          Make an Enquiry
        </Link>
      </section>
    </main>
  );
}
