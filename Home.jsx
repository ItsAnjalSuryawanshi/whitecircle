"import { Link } from \"react-router-dom\";
import { MarketingHeader, MarketingFooter } from \"../components/MarketingShell\";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from \"../components/ui/accordion\";
import {
  ArrowUpRight, ShieldCheck, FileCheck2, CalendarClock, MessagesSquare,
  Cloud, BadgeCheck, Zap, FileText, Building2, Award, Briefcase,
  ChevronRight, Star, CheckCircle2, TrendingUp, Lock,
} from \"lucide-react\";

const HERO_IMG = \"https://static.prod-images.emergentagent.com/jobs/471469cd-b32c-4713-bbb0-f6f19c2b2a56/images/8b5f70ceb3858c12cddf8f278c6d5fb3b782c607a781e5e24e01c6de55243c5e.png\";
const DOC_IMG = \"https://static.prod-images.emergentagent.com/jobs/471469cd-b32c-4713-bbb0-f6f19c2b2a56/images/dcbf9a95441dfbaf009bbd83ee5778a9b85ba68d3350237942ee3bc71617c211.png\";
const TEAM_IMG = \"https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHRlYW0lMjBvZmZpY2V8ZW58MHx8fHwxNzc4OTI5MTY5fDA&ixlib=rb-4.1.0&q=85\";
const SIGN_IMG = \"https://images.unsplash.com/photo-1562564055-71e051d33c19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBkb2N1bWVudCUyMHNpZ25pbmd8ZW58MHx8fHwxNzc4OTI5MTY5fDA&ixlib=rb-4.1.0&q=85\";

const taxServices = [
  { name: \"GST Registration\", desc: \"End-to-end GST onboarding within 48 hours.\" },
  { name: \"GST Filing\", desc: \"GSTR-1, 3B, CMP-08 & Annual returns.\" },
  { name: \"Income Tax Filing\", desc: \"ITR-1 through ITR-7 for individuals & entities.\" },
  { name: \"TDS / TCS Filing\", desc: \"Quarterly filings with reconciliation.\" },
  { name: \"Accounting & Bookkeeping\", desc: \"Monthly books, P&L and balance sheets.\" },
  { name: \"Tax Audit\", desc: \"Section 44AB compliance under CA supervision.\" },
  { name: \"ROC / MCA Compliances\", desc: \"DIR-3 KYC, AOC-4, MGT-7 and more.\" },
  { name: \"Payroll Processing\", desc: \"Salary, PF, ESI & professional tax.\" },
];
const bizServices = [
  { name: \"Company Registration\", desc: \"Private Limited · OPC · Public Ltd.\" },
  { name: \"LLP Registration\", desc: \"DPIN, name approval, agreement.\" },
  { name: \"MSME / Udyam\", desc: \"Tax benefits, subsidies, faster credit.\" },
  { name: \"Startup India\", desc: \"DPIIT recognition & tax holiday.\" },
  { name: \"Trademark Registration\", desc: \"Brand protection across 45 classes.\" },
  { name: \"FSSAI License\", desc: \"Food business compliance, all states.\" },
  { name: \"IEC Code\", desc: \"Import-export license, DGFT linked.\" },
  { name: \"Professional Tax\", desc: \"State-wise registration & filing.\" },
];
const advancedServices = [
  { name: \"Business Consulting\", icon: Briefcase },
  { name: \"Tax Advisory\", icon: FileText },
  { name: \"Internal Audit\", icon: ShieldCheck },
  { name: \"GST Litigation\", icon: BadgeCheck },
  { name: \"Data Analytics\", icon: TrendingUp },
  { name: \"CFO Services\", icon: Building2 },
  { name: \"Compliance Automation\", icon: Zap },
];

const features = [
  { icon: Zap, title: \"100% Digital Workflow\" },
  { icon: Cloud, title: \"Secure Cloud Storage\" },
  { icon: CalendarClock, title: \"Auto Due-Date Reminders\" },
  { icon: FileCheck2, title: \"Filing History & Proofs\" },
  { icon: Award, title: \"CA Supervised\" },
  { icon: Lock, title: \"Bank-Grade Encryption\" },
  { icon: ShieldCheck, title: \"GSTN-Style Panel\" },
  { icon: MessagesSquare, title: \"Same-Day Response\" },
];

const pricing = [
  {
    name: \"GST Filing\", price: \"₹ 999\", period: \"/ month\", popular: false,
    features: [\"GSTR-1 & GSTR-3B\", \"Monthly reminders\", \"Acknowledgement archive\", \"Email support\"],
  },
  {
    name: \"ITR Filing\", price: \"₹ 1,499\", period: \"/ year\", popular: true,
    features: [\"ITR-1 to ITR-4\", \"Capital gains computation\", \"Refund tracking\", \"Dedicated CA review\"],
  },
  {
    name: \"TDS Filing\", price: \"₹ 1,299\", period: \"/ quarter\", popular: false,
    features: [\"Form 24Q / 26Q / 27Q\", \"Challan reconciliation\", \"TRACES corrections\", \"Form 16 / 16A\"],
  },
  {
    name: \"Full Compliance\", price: \"₹ 4,999\", period: \"/ month\", popular: false,
    features: [\"GST + TDS + ITR\", \"ROC + Bookkeeping\", \"Dedicated accountant\", \"Priority WhatsApp\"],
  },
];

const testimonials = [
  { name: \"Anjali Mehta\", role: \"Founder, Mehta Textiles\", body: \"Our GST filings went from 3 days of chaos to a 10-minute upload. The WhatsApp confirmations alone are worth it.\", stars: 5 },
  { name: \"Rohit Bansal\", role: \"CFO, Stride Logistics\", body: \"We replaced two accountants with WhiteCircle. Compliance score dashboard keeps the board calm.\", stars: 5 },
  { name: \"Sneha Krishnan\", role: \"Director, Aurora Foods\", body: \"FSSAI, GST and ROC — all under one roof. Their CA team caught a 4-lakh refund we'd missed.\", stars: 5 },
];

const faqs = [
  { q: \"Do you handle GST notices and litigation?\", a: \"Yes. Our CA team handles SCN responses, departmental hearings and appellate filings — included in the Full Compliance plan.\" },
  { q: \"How quickly can I onboard?\", a: \"Same day. Register, complete KYC, upload your last GST return and we begin from your next filing cycle.\" },
  { q: \"Is my data secure?\", a: \"All documents are AES-256 encrypted at rest and TLS-secured in transit. We are ISO 27001 aligned and never share data with third parties.\" },
  { q: \"Can I switch from another CA?\", a: \"Absolutely. We handle the migration including OTPs, login transfers and historical reconciliation at no extra cost.\" },
  { q: \"Do you support startups and DPIIT recognition?\", a: \"Yes — Startup India registration, ESOP pool setup, FEMA filings and tax holiday certificates are all in scope.\" },
];

export default function Home() {
  return (
    <div className=\"bg-[#FDFDFC]\">
      <MarketingHeader />

      {/* HERO */}
      <section className=\"relative overflow-hidden hero-grain\" data-testid=\"hero-section\">
        <div className=\"absolute inset-0\">
          <img src={HERO_IMG} alt=\"\" className=\"w-full h-full object-cover\" />
          <div className=\"absolute inset-0 bg-[#050E20]/85\" />
        </div>
        <div className=\"relative max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-32 grid grid-cols-1 md:grid-cols-12 gap-10 items-end\">
          <div className=\"md:col-span-8 text-white\">
            <div className=\"label-overline text-[#D4AF37] mb-6 flex items-center gap-3\">
              <span className=\"w-12 h-px bg-[#D4AF37]\" /> Est. Mumbai · India
            </div>
            <h1 className=\"font-serif-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight\">
              India's most <em className=\"text-[#D4AF37] not-italic\">trusted</em> tax<br />& compliance partner.
            </h1>
            <p className=\"mt-8 text-white/75 max-w-xl text-lg leading-relaxed\">
              One dashboard for every filing, every reminder, every acknowledgement.
              Supervised by Chartered Accountants. Automated by design.
            </p>
            <div className=\"mt-10 flex flex-wrap gap-4\">
              <Link to=\"/register\" data-testid=\"hero-getstarted-btn\" className=\"bg-[#D4AF37] text-[#050E20] hover:bg-[#C5A028] rounded-sm px-7 py-4 font-bold text-sm tracking-wide inline-flex items-center gap-2\">
                Get Started <ArrowUpRight size={16} />
              </Link>
              <Link to=\"/book\" data-testid=\"hero-book-btn\" className=\"border border-white/30 text-white hover:bg-white/10 rounded-sm px-7 py-4 font-medium text-sm tracking-wide inline-flex items-center gap-2\">
                Book Consultation
              </Link>
              <Link to=\"/login\" data-testid=\"hero-login-btn\" className=\"text-white/80 hover:text-white rounded-sm px-3 py-4 font-medium text-sm tracking-wide inline-flex items-center gap-2\">
                Login <ChevronRight size={14} />
              </Link>
            </div>
            <div className=\"mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs text-white/60\">
              {[\"GST Filing\", \"ITR Filing\", \"TDS Filing\", \"Business Registration\"].map(q => (
                <a key={q} href=\"#services\" className=\"hover:text-[#D4AF37] inline-flex items-center gap-1.5\">
                  <span className=\"w-1.5 h-1.5 bg-[#D4AF37]\" /> {q}
                </a>
              ))}
            </div>
          </div>

          <div className=\"md:col-span-4 hidden md:block\">
            <div className=\"bg-white/95 backdrop-blur rounded-sm p-6 border border-white/20\">
              <div className=\"label-overline text-[#4A5568] mb-3\">Compliance Score</div>
              <div className=\"font-mono-fin text-5xl text-[#0B2046]\">98<span className=\"text-2xl text-[#4A5568]\">/100</span></div>
              <div className=\"text-xs text-[#4A5568] mt-1\">Avg. client this quarter</div>
              <div className=\"h-px bg-[#E2E8F0] my-5\" />
              <div className=\"space-y-3 text-sm\">
                <div className=\"flex justify-between\"><span>GSTR-3B (Jan)</span><span className=\"text-[#1B4D3E] font-medium\">Filed</span></div>
                <div className=\"flex justify-between\"><span>TDS Q3</span><span className=\"text-[#1B4D3E] font-medium\">Filed</span></div>
                <div className=\"flex justify-between\"><span>GSTR-1 (Feb)</span><span className=\"text-[#B7791F] font-medium\">Due 11 Mar</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className=\"border-y border-[#E2E8F0] bg-[#F5F2EA]/40\" data-testid=\"trust-bar\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-wrap items-center justify-between gap-8\">
          {[
            \"10,000+ Filings / Year\", \"ISO 27001 Aligned\", \"100+ CA Network\",
            \"Pan-India Coverage\", \"98% On-Time Filings\",
          ].map((t) => (
            <div key={t} className=\"font-serif-display text-lg text-[#0B2046] italic\">{t}</div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id=\"services\" className=\"max-w-7xl mx-auto px-6 lg:px-10 py-24\" data-testid=\"services-section\">
        <div className=\"grid grid-cols-1 md:grid-cols-12 gap-10 mb-16\">
          <div className=\"md:col-span-5\">
            <div className=\"label-overline text-[#0B2046] mb-4\">01 — Our Services</div>
            <h2 className=\"font-serif-display text-4xl sm:text-5xl text-[#050E20] leading-tight\">
              Every compliance, <em>under one circle.</em>
            </h2>
          </div>
          <div className=\"md:col-span-6 md:col-start-7 self-end\">
            <p className=\"text-[#4A5568] leading-relaxed\">
              From your first GST registration to a full board-level CFO mandate, our chartered accountants and software
              work in tandem so you can run your business — not chase deadlines.
            </p>
          </div>
        </div>

        <div className=\"label-overline text-[#0B2046] mb-6\">Tax & Compliance</div>
        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0] mb-16\">
          {taxServices.map((s) => (
            <div key={s.name} data-testid={`service-${s.name.replace(/\s+/g, \"-\").toLowerCase()}`} className=\"bg-white p-6 hover:bg-[#F5F2EA]/60 transition-colors group\">
              <div className=\"font-serif-display text-xl text-[#0B2046]\">{s.name}</div>
              <p className=\"text-sm text-[#4A5568] mt-2 leading-relaxed\">{s.desc}</p>
              <div className=\"mt-4 text-xs text-[#0B2046] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity\">
                Learn more <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>

        <div className=\"label-overline text-[#0B2046] mb-6\">Business Registrations</div>
        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0] mb-16\">
          {bizServices.map((s) => (
            <div key={s.name} className=\"bg-white p-6 hover:bg-[#F5F2EA]/60 transition-colors\">
              <div className=\"font-serif-display text-xl text-[#0B2046]\">{s.name}</div>
              <p className=\"text-sm text-[#4A5568] mt-2 leading-relaxed\">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className=\"label-overline text-[#0B2046] mb-6\">Advanced Advisory</div>
        <div className=\"grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4\">
          {advancedServices.map((s) => (
            <div key={s.name} className=\"border border-[#E2E8F0] p-5 hover:border-[#0B2046] hover:-translate-y-0.5 transition-all\">
              <s.icon size={20} className=\"text-[#0B2046]\" />
              <div className=\"mt-3 text-sm font-medium text-[#050E20]\">{s.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className=\"bg-[#050E20] text-white py-24\" data-testid=\"dashboard-preview\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center\">
          <div className=\"md:col-span-5\">
            <div className=\"label-overline text-[#D4AF37] mb-4\">02 — Smart Dashboard</div>
            <h2 className=\"font-serif-display text-4xl sm:text-5xl leading-tight\">
              A control room for <em>your compliance.</em>
            </h2>
            <p className=\"mt-6 text-white/70 leading-relaxed\">
              Filing status, due-date countdowns, acknowledgement history, payment trail and direct chat with your accountant — every piece of your tax life in one panel.
            </p>
            <ul className=\"mt-8 space-y-3 text-sm\">
              {[\"Filing Status Cards\", \"Monthly Upload Button\", \"Due Date Reminders\", \"Acknowledgement History\", \"Payment History\", \"Chat with Accountant\"].map(i => (
                <li key={i} className=\"flex items-center gap-3\"><CheckCircle2 size={16} className=\"text-[#D4AF37]\" /> {i}</li>
              ))}
            </ul>
            <Link to=\"/register\" className=\"mt-10 inline-flex bg-[#D4AF37] text-[#050E20] hover:bg-[#C5A028] rounded-sm px-6 py-3 font-bold text-sm\" data-testid=\"dashboard-cta-btn\">
              Open Free Account
            </Link>
          </div>
          <div className=\"md:col-span-7\">
            <div className=\"bg-white text-[#050E20] p-6 border border-white/10 grid grid-cols-2 gap-4\">
              <div className=\"border border-[#E2E8F0] p-5\">
                <div className=\"label-overline text-[#4A5568]\">GST Filings</div>
                <div className=\"font-mono-fin text-4xl text-[#0B2046] mt-1\">142</div>
                <div className=\"text-xs text-[#1B4D3E] mt-1\">▲ 12% this quarter</div>
              </div>
              <div className=\"border border-[#E2E8F0] p-5\">
                <div className=\"label-overline text-[#4A5568]\">Avg. Score</div>
                <div className=\"font-mono-fin text-4xl text-[#0B2046] mt-1\">98<span className=\"text-xl\">%</span></div>
                <div className=\"text-xs text-[#1B4D3E] mt-1\">On-time rate</div>
              </div>
              <div className=\"col-span-2 border border-[#E2E8F0] p-5\">
                <div className=\"label-overline text-[#4A5568] mb-3\">Upcoming</div>
                <div className=\"space-y-2 text-sm\">
                  <div className=\"flex justify-between border-b border-[#E2E8F0] pb-2\"><span>GSTR-1 · February</span><span className=\"font-mono-fin text-[#B7791F]\">Due in 4 days</span></div>
                  <div className=\"flex justify-between border-b border-[#E2E8F0] pb-2\"><span>GSTR-3B · February</span><span className=\"font-mono-fin text-[#0B2046]\">Due in 13 days</span></div>
                  <div className=\"flex justify-between\"><span>TDS Q4</span><span className=\"font-mono-fin text-[#0B2046]\">Due 30 Apr</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id=\"features\" className=\"max-w-7xl mx-auto px-6 lg:px-10 py-24\" data-testid=\"features-section\">
        <div className=\"grid grid-cols-1 md:grid-cols-12 gap-10 mb-12\">
          <div className=\"md:col-span-6\">
            <div className=\"label-overline text-[#0B2046] mb-4\">03 — Why WhiteCircle</div>
            <h2 className=\"font-serif-display text-4xl sm:text-5xl text-[#050E20] leading-tight\">Eight reasons CFOs <em>stay</em>.</h2>
          </div>
        </div>
        <div className=\"grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0]\">
          {features.map((f) => (
            <div key={f.title} className=\"bg-white p-6 flex flex-col gap-4 hover:bg-[#F5F2EA]/50 transition-colors\">
              <div className=\"w-10 h-10 bg-[#0B2046] flex items-center justify-center\"><f.icon size={18} className=\"text-[#D4AF37]\" /></div>
              <div className=\"font-serif-display text-lg text-[#050E20]\">{f.title}</div>
            </div>
          ))}
        </div>

        <div className=\"mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-center\">
          <div className=\"md:col-span-6\">
            <img src={TEAM_IMG} alt=\"Team\" className=\"w-full h-[420px] object-cover\" />
          </div>
          <div className=\"md:col-span-6\">
            <div className=\"label-overline text-[#0B2046] mb-4\">A standard the Big-4 would recognise</div>
            <h3 className=\"font-serif-display text-3xl text-[#050E20] leading-tight\">ISO process. Dedicated accountant. Transparent pricing.</h3>
            <p className=\"mt-5 text-[#4A5568] leading-relaxed\">
              We combine the discipline of an EY-style audit firm with the speed of a fintech. Every filing is double-reviewed,
              every document encrypted, every deadline calendared — and you pay one transparent fee.
            </p>
            <div className=\"mt-6 grid grid-cols-2 gap-4 text-sm\">
              {[\"ISO Certified Process\",\"Secure Encryption\",\"Automated Calendar\",\"Dedicated Accountant\",\"Transparent Pricing\",\"Fast Turnaround\"].map(t => (
                <div key={t} className=\"flex items-center gap-2 text-[#050E20]\"><CheckCircle2 size={14} className=\"text-[#0B2046]\" />{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id=\"pricing\" className=\"bg-[#F5F2EA]/50 py-24 border-y border-[#E2E8F0]\" data-testid=\"pricing-section\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10\">
          <div className=\"grid grid-cols-1 md:grid-cols-12 gap-10 mb-16\">
            <div className=\"md:col-span-5\">
              <div className=\"label-overline text-[#0B2046] mb-4\">04 — Pricing</div>
              <h2 className=\"font-serif-display text-4xl sm:text-5xl text-[#050E20] leading-tight\">Plans that respect your <em>P&L.</em></h2>
            </div>
            <div className=\"md:col-span-6 md:col-start-7 self-end\">
              <p className=\"text-[#4A5568]\">No hidden fees. No annual lock-ins. Start with one filing and grow into full compliance — your dedicated accountant scales with you.</p>
            </div>
          </div>
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
            {pricing.map((p) => (
              <div key={p.name} data-testid={`pricing-${p.name.replace(/\s+/g,\"-\").toLowerCase()}`} className={`bg-white border p-7 flex flex-col ${p.popular ? \"border-[#0B2046] relative shadow-lg\" : \"border-[#E2E8F0]\"}`}>
                {p.popular && <div className=\"absolute -top-3 left-7 bg-[#D4AF37] text-[#050E20] text-xs font-bold px-3 py-1\">MOST POPULAR</div>}
                <div className=\"font-serif-display text-2xl text-[#050E20]\">{p.name}</div>
                <div className=\"mt-4 font-mono-fin text-4xl text-[#0B2046]\">{p.price}<span className=\"text-base text-[#4A5568] ml-1\">{p.period}</span></div>
                <ul className=\"mt-6 space-y-3 text-sm text-[#050E20] flex-1\">
                  {p.features.map(f => (
                    <li key={f} className=\"flex items-start gap-2\"><CheckCircle2 size={14} className=\"text-[#0B2046] mt-0.5\" /> {f}</li>
                  ))}
                </ul>
                <Link to=\"/book\" className={`mt-7 text-center px-5 py-3 text-sm font-medium rounded-sm transition-colors ${p.popular ? \"bg-[#D4AF37] text-[#050E20] hover:bg-[#C5A028] font-bold\" : \"border border-[#0B2046] text-[#0B2046] hover:bg-[#0B2046] hover:text-white\"}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className=\"max-w-7xl mx-auto px-6 lg:px-10 py-24\" data-testid=\"testimonials-section\">
        <div className=\"grid grid-cols-1 md:grid-cols-12 gap-10 mb-14\">
          <div className=\"md:col-span-6\">
            <div className=\"label-overline text-[#0B2046] mb-4\">05 — Clients</div>
            <h2 className=\"font-serif-display text-4xl sm:text-5xl text-[#050E20] leading-tight\">Trusted by founders who count.</h2>
          </div>
        </div>
        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
          {testimonials.map(t => (
            <figure key={t.name} className=\"border border-[#E2E8F0] bg-white p-7 flex flex-col\">
              <div className=\"flex gap-0.5 text-[#D4AF37] mb-4\">
                {Array.from({length: t.stars}).map((_, i) => <Star key={i} size={14} fill=\"#D4AF37\" />)}
              </div>
              <blockquote className=\"font-serif-display text-lg text-[#050E20] leading-snug flex-1 italic\">\"{t.body}\"</blockquote>
              <figcaption className=\"mt-6 border-t border-[#E2E8F0] pt-4\">
                <div className=\"font-medium text-[#050E20]\">{t.name}</div>
                <div className=\"text-xs text-[#4A5568]\">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CAREER */}
      <section className=\"relative overflow-hidden\" data-testid=\"career-section\">
        <div className=\"absolute inset-0\">
          <img src={SIGN_IMG} alt=\"\" className=\"w-full h-full object-cover\" />
          <div className=\"absolute inset-0 bg-[#0B2046]/85\" />
        </div>
        <div className=\"relative max-w-7xl mx-auto px-6 lg:px-10 py-24 grid grid-cols-1 md:grid-cols-12 gap-10 items-center text-white\">
          <div className=\"md:col-span-7\">
            <div className=\"label-overline text-[#D4AF37] mb-4\">06 — Careers</div>
            <h2 className=\"font-serif-display text-4xl sm:text-5xl leading-tight\">Join the circle. Build India's <em>compliance backbone.</em></h2>
            <p className=\"mt-6 text-white/75 max-w-xl\">We're hiring Chartered Accountants, GST specialists, full-stack engineers and customer success leads across Mumbai, Bengaluru and Delhi.</p>
          </div>
          <div className=\"md:col-span-5 md:text-right\">
            <Link to=\"/career\" data-testid=\"career-cta-btn\" className=\"inline-flex bg-[#D4AF37] text-[#050E20] hover:bg-[#C5A028] rounded-sm px-7 py-4 font-bold text-sm\">
              View Open Roles <ArrowUpRight size={16} className=\"ml-2\" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id=\"faq\" className=\"max-w-5xl mx-auto px-6 lg:px-10 py-24\" data-testid=\"faq-section\">
        <div className=\"label-overline text-[#0B2046] mb-4\">07 — Frequently Asked</div>
        <h2 className=\"font-serif-display text-4xl sm:text-5xl text-[#050E20] leading-tight mb-10\">Honest answers to common questions.</h2>
        <Accordion type=\"single\" collapsible className=\"w-full\">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className=\"border-b border-[#E2E8F0]\" data-testid={`faq-item-${i}`}>
              <AccordionTrigger className=\"text-left font-serif-display text-lg text-[#050E20] hover:no-underline py-6\">{f.q}</AccordionTrigger>
              <AccordionContent className=\"text-[#4A5568] leading-relaxed pb-6\">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <MarketingFooter />
    </div>
  );
}
"