"import { useState } from \"react\";
import { MarketingHeader, MarketingFooter } from \"../components/MarketingShell\";
import { http, formatApiError } from \"../lib/api\";
import { toast } from \"sonner\";
import { CalendarClock, MessagesSquare, Phone } from \"lucide-react\";

const services = [
  \"GST Filing\",\"ITR Filing\",\"TDS Filing\",\"Company Registration\",\"LLP Registration\",
  \"Trademark\",\"Tax Audit\",\"Payroll\",\"CFO Services\",\"Other\",
];

export default function BookConsultation() {
  const [form, setForm] = useState({ name: \"\", email: \"\", phone: \"\", service: services[0], message: \"\", preferred_date: \"\" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await http.post(\"/consultations\", form);
      setDone(true);
      toast.success(\"Consultation requested. Our team will be in touch within 4 hours.\");
    } catch (ex) {
      toast.error(formatApiError(ex.response?.data?.detail) || \"Failed to submit\");
    } finally { setLoading(false); }
  };

  return (
    <div className=\"bg-[#FDFDFC] min-h-screen\">
      <MarketingHeader />
      <section className=\"max-w-7xl mx-auto px-6 lg:px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-12\">
        <div className=\"md:col-span-5\">
          <div className=\"label-overline text-[#0B2046] mb-4\">Book Consultation</div>
          <h1 className=\"font-serif-display text-5xl text-[#050E20] leading-tight mb-6\">Talk to a Chartered Accountant — <em>free.</em></h1>
          <p className=\"text-[#4A5568] leading-relaxed\">A 30-minute call. Bring your books, your questions, your headaches. We'll map the right plan and timeline before you commit.</p>
          <div className=\"mt-10 space-y-5\">
            <div className=\"flex gap-4\"><div className=\"w-10 h-10 bg-[#0B2046] flex items-center justify-center\"><CalendarClock className=\"text-[#D4AF37]\" size={18} /></div><div><div className=\"font-serif-display text-lg text-[#050E20]\">Same-day scheduling</div><div className=\"text-sm text-[#4A5568]\">Slots within 4 working hours</div></div></div>
            <div className=\"flex gap-4\"><div className=\"w-10 h-10 bg-[#0B2046] flex items-center justify-center\"><MessagesSquare className=\"text-[#D4AF37]\" size={18} /></div><div><div className=\"font-serif-display text-lg text-[#050E20]\">No pressure quote</div><div className=\"text-sm text-[#4A5568]\">Written proposal within 24 hours</div></div></div>
            <div className=\"flex gap-4\"><div className=\"w-10 h-10 bg-[#0B2046] flex items-center justify-center\"><Phone className=\"text-[#D4AF37]\" size={18} /></div><div><div className=\"font-serif-display text-lg text-[#050E20]\">+91 98765 43210</div><div className=\"text-sm text-[#4A5568]\">Or write to support@whitecircle.in</div></div></div>
          </div>
        </div>
        <div className=\"md:col-span-7\">
          {done ? (
            <div className=\"border border-[#1B4D3E]/30 bg-[#1B4D3E]/5 p-10 text-center\" data-testid=\"booking-success\">
              <div className=\"font-serif-display text-3xl text-[#0B2046] mb-2\">Request received.</div>
              <p className=\"text-[#4A5568]\">Our partner team will reach out at <span className=\"font-medium text-[#050E20]\">{form.email}</span> within 4 working hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className=\"border border-[#E2E8F0] bg-white p-8\" data-testid=\"booking-form\">
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                <Field label=\"Full name\" required value={form.name} onChange={set(\"name\")} testid=\"book-name\" />
                <Field label=\"Email\" type=\"email\" required value={form.email} onChange={set(\"email\")} testid=\"book-email\" />
                <Field label=\"Phone\" type=\"tel\" required value={form.phone} onChange={set(\"phone\")} testid=\"book-phone\" />
                <div>
                  <label className=\"label-overline text-[#4A5568]\">Service</label>
                  <select value={form.service} onChange={set(\"service\")} data-testid=\"book-service\"
                    className=\"mt-2 w-full px-4 py-3 border border-[#E2E8F0] bg-white text-[#050E20] focus:border-[#0B2046] outline-none rounded-sm\">
                    {services.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <Field label=\"Preferred date\" type=\"date\" value={form.preferred_date} onChange={set(\"preferred_date\")} testid=\"book-date\" />
              </div>
              <div className=\"mt-5\">
                <label className=\"label-overline text-[#4A5568]\">Tell us more (optional)</label>
                <textarea rows={4} value={form.message} onChange={set(\"message\")} data-testid=\"book-message\"
                  className=\"mt-2 w-full px-4 py-3 border border-[#E2E8F0] bg-white text-[#050E20] focus:border-[#0B2046] outline-none rounded-sm\" />
              </div>
              <button type=\"submit\" disabled={loading} data-testid=\"book-submit\"
                className=\"mt-6 bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm px-7 py-3.5 font-medium disabled:opacity-60\">
                {loading ? \"Submitting…\" : \"Request consultation\"}
              </button>
            </form>
          )}
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

function Field({ label, testid, ...rest }) {
  return (
    <div>
      <label className=\"label-overline text-[#4A5568]\">{label}</label>
      <input data-testid={testid} {...rest}
        className=\"mt-2 w-full px-4 py-3 border border-[#E2E8F0] bg-white text-[#050E20] focus:border-[#0B2046] outline-none rounded-sm\" />
    </div>
  );
}
"