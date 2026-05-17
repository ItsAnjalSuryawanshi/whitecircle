"import { useState } from \"react\";
import { MarketingHeader, MarketingFooter } from \"../components/MarketingShell\";
import { http, formatApiError } from \"../lib/api\";
import { toast } from \"sonner\";
import { Briefcase } from \"lucide-react\";

const roles = [
  { role: \"Chartered Accountant\", loc: \"Mumbai · Bengaluru\", exp: \"3-7 yrs\" },
  { role: \"GST Compliance Specialist\", loc: \"Remote · Pan-India\", exp: \"2-5 yrs\" },
  { role: \"Senior Full-Stack Engineer\", loc: \"Bengaluru\", exp: \"4+ yrs\" },
  { role: \"Customer Success Lead\", loc: \"Mumbai\", exp: \"3+ yrs\" },
  { role: \"Tax Litigation Associate\", loc: \"Delhi · Mumbai\", exp: \"2-6 yrs\" },
  { role: \"Product Designer\", loc: \"Bengaluru · Remote\", exp: \"3+ yrs\" },
];

export default function Career() {
  const [form, setForm] = useState({ name: \"\", email: \"\", phone: \"\", role: roles[0].role, experience: \"\", cover_letter: \"\" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await http.post(\"/careers\", form); setDone(true); toast.success(\"Application received.\"); }
    catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  return (
    <div className=\"bg-[#FDFDFC] min-h-screen\">
      <MarketingHeader />
      <section className=\"bg-[#050E20] text-white\">
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 py-20\">
          <div className=\"label-overline text-[#D4AF37] mb-4\">Careers at WhiteCircle</div>
          <h1 className=\"font-serif-display text-5xl sm:text-6xl leading-tight max-w-3xl\">Compliance is craft. <em>Build it with us.</em></h1>
          <p className=\"mt-6 text-white/70 max-w-2xl\">We hire people who care about precision, who like solving real businesses' real problems, and who believe software can make Indian finance simpler.</p>
        </div>
      </section>

      <section className=\"max-w-7xl mx-auto px-6 lg:px-10 py-20\">
        <div className=\"label-overline text-[#0B2046] mb-6\">Open roles</div>
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E2E8F0] border border-[#E2E8F0] mb-16\">
          {roles.map(r => (
            <div key={r.role} data-testid={`role-${r.role.replace(/\s+/g,\"-\").toLowerCase()}`} className=\"bg-white p-7 flex items-start justify-between gap-6 hover:bg-[#F5F2EA]/40\">
              <div className=\"flex gap-4\"><div className=\"w-10 h-10 bg-[#0B2046] flex items-center justify-center\"><Briefcase size={18} className=\"text-[#D4AF37]\" /></div>
                <div>
                  <div className=\"font-serif-display text-xl text-[#050E20]\">{r.role}</div>
                  <div className=\"text-sm text-[#4A5568] mt-1\">{r.loc} · {r.exp}</div>
                </div>
              </div>
              <button onClick={() => setForm({ ...form, role: r.role })} className=\"text-xs label-overline text-[#0B2046] hover:underline\" data-testid={`apply-${r.role.replace(/\s+/g,\"-\").toLowerCase()}`}>Apply →</button>
            </div>
          ))}
        </div>

        <div className=\"grid grid-cols-1 md:grid-cols-12 gap-10\">
          <div className=\"md:col-span-5\">
            <div className=\"label-overline text-[#0B2046] mb-3\">Apply</div>
            <h2 className=\"font-serif-display text-3xl text-[#050E20] leading-tight\">Tell us about you.</h2>
            <p className=\"mt-4 text-[#4A5568]\">We read every application. If you fit, you'll hear within 5 working days.</p>
          </div>
          <div className=\"md:col-span-7\">
            {done ? (
              <div className=\"border border-[#1B4D3E]/30 bg-[#1B4D3E]/5 p-10 text-center\" data-testid=\"career-success\">
                <div className=\"font-serif-display text-3xl text-[#0B2046] mb-2\">Application received.</div>
                <p className=\"text-[#4A5568]\">We'll review your profile and respond at {form.email}.</p>
              </div>
            ) : (
              <form onSubmit={submit} className=\"border border-[#E2E8F0] bg-white p-8\" data-testid=\"career-form\">
                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                  <F label=\"Full name\" required value={form.name} onChange={set(\"name\")} testid=\"career-name\" />
                  <F label=\"Email\" type=\"email\" required value={form.email} onChange={set(\"email\")} testid=\"career-email\" />
                  <F label=\"Phone\" type=\"tel\" required value={form.phone} onChange={set(\"phone\")} testid=\"career-phone\" />
                  <div>
                    <label className=\"label-overline text-[#4A5568]\">Role</label>
                    <select value={form.role} onChange={set(\"role\")} data-testid=\"career-role\"
                      className=\"mt-2 w-full px-4 py-3 border border-[#E2E8F0] bg-white text-[#050E20] focus:border-[#0B2046] outline-none rounded-sm\">
                      {roles.map(r => <option key={r.role}>{r.role}</option>)}
                    </select>
                  </div>
                  <F label=\"Experience (e.g. 3 yrs)\" required value={form.experience} onChange={set(\"experience\")} testid=\"career-experience\" />
                </div>
                <div className=\"mt-5\">
                  <label className=\"label-overline text-[#4A5568]\">Cover note</label>
                  <textarea rows={4} value={form.cover_letter} onChange={set(\"cover_letter\")} data-testid=\"career-cover\"
                    className=\"mt-2 w-full px-4 py-3 border border-[#E2E8F0] bg-white text-[#050E20] focus:border-[#0B2046] outline-none rounded-sm\" />
                </div>
                <button type=\"submit\" disabled={loading} data-testid=\"career-submit\"
                  className=\"mt-6 bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm px-7 py-3.5 font-medium disabled:opacity-60\">
                  {loading ? \"Submitting…\" : \"Submit application\"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

function F({ label, testid, ...rest }) {
  return (
    <div>
      <label className=\"label-overline text-[#4A5568]\">{label}</label>
      <input data-testid={testid} {...rest}
        className=\"mt-2 w-full px-4 py-3 border border-[#E2E8F0] bg-white text-[#050E20] focus:border-[#0B2046] outline-none rounded-sm\" />
    </div>
  );
}
"