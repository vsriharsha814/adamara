import Link from "next/link";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-white/70">
            &copy; {currentYear} Amaravati Communications Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/privacy-policy" className="text-white/70 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-white/70 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-white/70 hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

