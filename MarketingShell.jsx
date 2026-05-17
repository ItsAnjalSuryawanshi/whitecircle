"import { Link, useNavigate } from \"react-router-dom\";
import { useAuth } from \"../context/AuthContext\";
import { Menu, ShieldCheck } from \"lucide-react\";
import { useState } from \"react\";

export function MarketingHeader() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className=\"sticky top-0 z-40 backdrop-blur-xl bg-[#FDFDFC]/85 border-b border-[#0B2046]/10\">
      <div className=\"max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between\">
        <Link to=\"/\" data-testid=\"brand-logo\" className=\"flex items-center gap-3\">
          <div className=\"w-10 h-10 rounded-sm bg-[#0B2046] flex items-center justify-center\">
            <ShieldCheck className=\"text-[#D4AF37]\" size={20} />
          </div>
          <div className=\"leading-tight\">
            <div className=\"font-serif-display text-xl text-[#0B2046] font-semibold\">WhiteCircle</div>
            <div className=\"label-overline text-[#4A5568]\">Tax · Compliance</div>
          </div>
        </Link>
        <nav className=\"hidden lg:flex items-center gap-8 text-sm\">
          <a href=\"/#services\" className=\"text-[#050E20] hover:text-[#0B2046]\" data-testid=\"nav-services\">Services</a>
          <a href=\"/#pricing\" className=\"text-[#050E20] hover:text-[#0B2046]\" data-testid=\"nav-pricing\">Pricing</a>
          <a href=\"/#features\" className=\"text-[#050E20] hover:text-[#0B2046]\" data-testid=\"nav-features\">Why Us</a>
          <a href=\"/#faq\" className=\"text-[#050E20] hover:text-[#0B2046]\" data-testid=\"nav-faq\">FAQ</a>
          <Link to=\"/career\" className=\"text-[#050E20] hover:text-[#0B2046]\" data-testid=\"nav-career\">Careers</Link>
          <Link to=\"/book\" className=\"text-[#050E20] hover:text-[#0B2046]\" data-testid=\"nav-book\">Book Consultation</Link>
        </nav>
        <div className=\"flex items-center gap-3\">
          {user ? (
            <>
              <button
                onClick={() => nav(\"/dashboard\")}
                data-testid=\"header-dashboard-btn\"
                className=\"hidden sm:inline-flex bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm transition-colors px-5 py-2.5 text-sm font-medium\"
              >
                Dashboard
              </button>
              <button
                onClick={async () => { await logout(); nav(\"/\"); }}
                data-testid=\"header-logout-btn\"
                className=\"text-sm text-[#4A5568] hover:text-[#0B2046]\"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to=\"/login\" data-testid=\"header-login-link\" className=\"hidden sm:inline-block text-sm text-[#0B2046] hover:underline\">Login</Link>
              <Link
                to=\"/register\"
                data-testid=\"header-getstarted-btn\"
                className=\"bg-[#D4AF37] text-[#050E20] hover:bg-[#C5A028] rounded-sm transition-colors px-5 py-2.5 text-sm font-bold\"
              >
                Get Started
              </Link>
            </>
          )}
          <button className=\"lg:hidden\" onClick={() => setOpen(!open)} data-testid=\"mobile-menu-toggle\">
            <Menu size={22} />
          </button>
        </div>
      </div>
      {open && (
        <div className=\"lg:hidden border-t border-[#0B2046]/10 bg-white px-6 py-4 space-y-3 text-sm\">
          <a href=\"/#services\" onClick={() => setOpen(false)} className=\"block\">Services</a>
          <a href=\"/#pricing\" onClick={() => setOpen(false)} className=\"block\">Pricing</a>
          <a href=\"/#features\" onClick={() => setOpen(false)} className=\"block\">Why Us</a>
          <a href=\"/#faq\" onClick={() => setOpen(false)} className=\"block\">FAQ</a>
          <Link to=\"/career\" onClick={() => setOpen(false)} className=\"block\">Careers</Link>
          <Link to=\"/book\" onClick={() => setOpen(false)} className=\"block\">Book Consultation</Link>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className=\"bg-[#050E20] text-white mt-24\">
      <div className=\"max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-12 gap-10\">
        <div className=\"md:col-span-4\">
          <div className=\"flex items-center gap-3\">
            <div className=\"w-10 h-10 rounded-sm bg-[#D4AF37] flex items-center justify-center\">
              <ShieldCheck className=\"text-[#050E20]\" size={20} />
            </div>
            <div>
              <div className=\"font-serif-display text-2xl\">WhiteCircle Group</div>
              <div className=\"label-overline text-white/60\">Tax · Compliance · Advisory</div>
            </div>
          </div>
          <p className=\"mt-6 text-white/70 text-sm max-w-sm\">
            India's most trusted automated tax & compliance platform. Chartered Accountant supervised. Built for business owners who value time.
          </p>
        </div>
        <div className=\"md:col-span-2\">
          <div className=\"label-overline text-white/60 mb-4\">Services</div>
          <ul className=\"space-y-2 text-sm text-white/80\">
            <li>GST Filing</li><li>ITR Filing</li><li>TDS / TCS</li><li>Company Registration</li><li>Trademark</li>
          </ul>
        </div>
        <div className=\"md:col-span-2\">
          <div className=\"label-overline text-white/60 mb-4\">Company</div>
          <ul className=\"space-y-2 text-sm text-white/80\">
            <li><Link to=\"/career\">Careers</Link></li>
            <li><Link to=\"/book\">Book Consultation</Link></li>
            <li><a href=\"#faq\">FAQ</a></li>
          </ul>
        </div>
        <div className=\"md:col-span-4\">
          <div className=\"label-overline text-white/60 mb-4\">Contact</div>
          <div className=\"text-sm text-white/80 space-y-2\">
            <div>support@whitecircle.in</div>
            <div>+91 98765 43210</div>
            <div>Mumbai · Delhi · Bengaluru</div>
            <div className=\"mt-4 flex gap-2 flex-wrap\">
              <span className=\"border border-white/20 px-3 py-1 text-xs\">ISO 27001</span>
              <span className=\"border border-[#D4AF37] text-[#D4AF37] px-3 py-1 text-xs\">CA Supervised</span>
            </div>
          </div>
        </div>
      </div>
      <div className=\"border-t border-white/10\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-white/50 gap-3\">
          <div>© {new Date().getFullYear()} WhiteCircle Group. All rights reserved.</div>
          <div className=\"flex gap-6\"><span>Privacy Policy</span><span>Terms of Use</span></div>
        </div>
      </div>
    </footer>
  );