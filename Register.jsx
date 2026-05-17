"import { useState } from \"react\";
import { Link, useNavigate } from \"react-router-dom\";
import { useAuth } from \"../context/AuthContext\";
import { formatApiError } from \"../lib/api\";
import { ShieldCheck } from \"lucide-react\";
import { toast } from \"sonner\";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: \"\", email: \"\", phone: \"\", business_name: \"\", password: \"\" });
  const [err, setErr] = useState(\"\");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(\"\"); setLoading(true);
    try {
      const u = await register(form);
      toast.success(`Welcome, ${u.name}`);
      nav(\"/dashboard\");
    } catch (ex) {
      setErr(formatApiError(ex.response?.data?.detail) || \"Registration failed\");
    } finally { setLoading(false); }
  };

  return (
    <div className=\"min-h-screen grid grid-cols-1 lg:grid-cols-2\">
      <div className=\"hidden lg:flex bg-[#050E20] text-white p-12 flex-col justify-between\">
        <Link to=\"/\" className=\"inline-flex items-center gap-3\">
          <div className=\"w-10 h-10 bg-[#D4AF37] flex items-center justify-center\"><ShieldCheck className=\"text-[#050E20]\" size={20} /></div>
          <div><div className=\"font-serif-display text-xl\">WhiteCircle</div><div className=\"label-overline text-white/60\">Tax · Compliance</div></div>
        </Link>
        <div>
          <div className=\"label-overline text-[#D4AF37] mb-3\">5 minutes. No paperwork.</div>
          <h2 className=\"font-serif-display text-4xl leading-tight\">Open your compliance command centre.</h2>
          <ul className=\"mt-8 space-y-3 text-sm text-white/80\">
            <li>• Free dashboard — pay only when you file</li>
            <li>• Same-day onboarding</li>
            <li>• CA review on every filing</li>
            <li>• Secure document vault, encrypted at rest</li>
          </ul>
        </div>
        <div className=\"text-xs text-white/40\">ISO 27001 Aligned · CA Supervised · Pan-India</div>
      </div>
      <div className=\"flex items-center justify-center p-8 bg-[#FDFDFC]\">
        <form onSubmit={submit} className=\"w-full max-w-md\" data-testid=\"register-form\">
          <div className=\"label-overline text-[#0B2046] mb-3\">Create account</div>
          <h1 className=\"font-serif-display text-4xl text-[#050E20] leading-tight mb-2\">Start your compliance journey.</h1>
          <p className=\"text-sm text-[#4A5568] mb-8\">It takes less than two minutes.</p>

          {err && <div className=\"mb-4 p-3 bg-[#9B2C2C]/10 text-[#9B2C2C] text-sm border border-[#9B2C2C]/20\" data-testid=\"register-error\">{err}</div>}

          {[
            { k: \"name\", l: \"Full name\", t: \"text\", req: true },
            { k: \"email\", l: \"Work email\", t: \"email\", req: true },
            { k: \"phone\", l: \"Mobile (optional)\", t: \"tel\" },
            { k: \"business_name\", l: \"Business name (optional)\", t: \"text\" },
            { k: \"password\", l: \"Password\", t: \"password\", req: true },
          ].map(f => (
            <div key={f.k} className=\"mb-4\">
              <label className=\"label-overline text-[#4A5568]\">{f.l}</label>
              <input type={f.t} required={f.req} value={form[f.k]} onChange={set(f.k)} data-testid={`register-${f.k}`}
                className=\"mt-2 w-full px-4 py-3 border border-[#E2E8F0] bg-white text-[#050E20] focus:border-[#0B2046] outline-none rounded-sm\" />
            </div>
          ))}

          <button type=\"submit\" disabled={loading} data-testid=\"register-submit\"
            className=\"mt-2 w-full bg-[#D4AF37] text-[#050E20] hover:bg-[#C5A028] rounded-sm transition-colors px-6 py-3.5 font-bold disabled:opacity-60\">
            {loading ? \"Creating account…\" : \"Create account\"}
          </button>

          <p className=\"mt-6 text-sm text-[#4A5568]\">Already a client? <Link to=\"/login\" data-testid=\"register-login-link\" className=\"text-[#0B2046] underline\">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
"