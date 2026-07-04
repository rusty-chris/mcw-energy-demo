export default function Footer() {
  return (
    <footer className="bg-mcw-black text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col leading-tight">
          <span className="font-calibri font-bold text-lg text-white">
            Hydro<span className="text-mcw-red">Pulse</span>
          </span>
          <span className="font-verdana text-[10px] text-gray-400">by McWilliams Energy</span>
        </div>
        <p className="font-verdana text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} McWilliams Energy. All rights reserved.
          <br />
          Dene Cottage, Smallhythe Road, Tenterden, Kent TN30 7NB, UK
        </p>
        <a
          href="mailto:mike@mcw-e.com"
          className="font-verdana text-sm text-gray-400 hover:text-mcw-red transition-colors"
        >
          mike@mcw-e.com
        </a>
      </div>
    </footer>
  );
}
