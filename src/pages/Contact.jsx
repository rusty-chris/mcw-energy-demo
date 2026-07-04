// Contact form is currently static display only.
// See GitHub issue #1 to implement a working form via Formspree or similar.

const contactDetails = [
  { label: 'Email', value: 'mike@mcw-e.com', href: 'mailto:mike@mcw-e.com' },
  { label: 'Mobile', value: '+44 (0) 7941 302972', href: 'tel:+447941302972' },
  {
    label: 'Address',
    value: 'Dene Cottage, Smallhythe Road, Tenterden, Kent TN30 7NB, UK',
    href: null,
  },
  {
    label: 'Website',
    value: 'www.mcw-e.com',
    href: 'https://www.mcw-e.com',
  },
];

const services = [
  'Project development & due diligence',
  'Risk assessment, mitigation & management',
  'Power system planning',
  'Commercial & construction contracts',
  'Economics & financial analysis',
  'Financial structuring (incl. FELT model)',
  'Project control, management & monitoring',
  'Expert witness services',
];

export default function Contact() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="font-verdana text-mcw-red uppercase tracking-widest text-xs mb-2">
          Request a Demo
        </p>
        <h1 className="font-calibri text-4xl font-bold text-mcw-black">Contact HydroPulse</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact details */}
        <div>
          <h2 className="section-heading mb-6">Contact Details</h2>
          <div className="space-y-4">
            {contactDetails.map(({ label, value, href }) => (
              <div key={label} className="flex gap-4">
                <span className="font-verdana text-xs text-mcw-gray w-16 flex-shrink-0 pt-0.5 uppercase tracking-wide">
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    className="font-verdana text-sm text-mcw-black hover:text-mcw-red transition-colors"
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {value}
                  </a>
                ) : (
                  <span className="font-verdana text-sm text-mcw-black">{value}</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-calibri font-bold text-mcw-black text-lg mb-3">Services Offered</h3>
            <ul className="space-y-1">
              {services.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="text-mcw-red font-bold flex-shrink-0">—</span>
                  <span className="font-verdana text-sm text-mcw-gray">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Static enquiry prompt */}
        <div>
          <h2 className="section-heading mb-6">Make an Enquiry</h2>
          <div className="card border-l-4 border-mcw-red">
            <p className="font-verdana text-sm text-mcw-gray leading-relaxed mb-4">
              Interested in piloting HydroPulse on your hydroelectric or pumped storage scheme?
              Mike McWilliams and the MCWe team welcome enquiries from asset owners, operators,
              developers, and lenders worldwide.
            </p>
            <p className="font-verdana text-sm text-mcw-gray leading-relaxed mb-6">
              To request a demonstration or discuss your asset's data landscape, please email{' '}
              <a href="mailto:mike@mcw-e.com" className="text-mcw-red font-bold hover:underline">
                mike@mcw-e.com
              </a>{' '}
              or call{' '}
              <a href="tel:+447941302972" className="text-mcw-red font-bold hover:underline">
                +44 (0) 7941 302972
              </a>
              .
            </p>
            <a href="mailto:mike@mcw-e.com?subject=HydroPulse%20Demo%20Request" className="btn-primary inline-block">
              Request a Demo
            </a>
          </div>

          <div className="card mt-6 bg-mcw-lightgray border-0">
            <p className="font-calibri font-bold text-mcw-black mb-1">Note on this page</p>
            <p className="font-verdana text-xs text-mcw-gray">
              A contact form with direct submission is planned. See{' '}
              <span className="font-bold">GitHub issue #1</span> for implementation details.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
