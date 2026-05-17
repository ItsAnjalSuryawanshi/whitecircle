"import { useState } from \"react\";
import { Link, useNavigate } from \"react-router-dom\";
import { useAuth } from \"../context/AuthContext\";
import { formatApiError } from \"../lib/api\";
import { ShieldCheck } from \"lucide-react\";
import { toast } from \"sonner\";

const HERO_IMG = \"https://static.prod-images.emergentagent.com/jobs/471469cd-b32c-4713-bbb0-f6f19c2b2a56/images/5862e7db273a2f5be62de5699cfe772d2f9332a046fd33ca7d77a29827722ec8.png\";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(\"\");
  const [password, setPassword] = useState(\"\");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(\"\");

  const submit = async (e) => {
    e.preventDefault();
    setErr(\"\"); setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}`);
      nav(\"/dashboard\");
    } catch (ex) {
      setErr(formatApiError(ex.response?.data?.detail) || \"Login failed\");
    } finally { setLoading(false); }
  };

  return (
    <div className=\"min-h-screen grid grid-cols-1 lg:grid-cols-2\">
      <div className=\"relative hidden lg:block\">
        <img src={HERO_IMG} alt=\"\" className=\"absolute inset-0 w-full h-full object-cover\" />
        <div className=\"absolute inset-0 bg-[#050E20]/80\" />
        <div className=\"relative h-full flex flex-col justify-between p-12 text-white\">
          <Link to=\"/\" data-testid=\"login-brand\" className=\"inline-flex items-center gap-3\">
            <div className=\"w-10 h-10 bg-[#D4AF37] flex items-center justify-center\"><ShieldCheck className=\"text-[#050E20]\" size={20} /></div>
            <div><div className=\"font-serif-display text-xl\">WhiteCircle</div><div className=\"label-overline text-white/60\">Tax · Compliance</div></div>
          </Link>
          <div>
            <div className=\"label-overline text-[#D4AF37] mb-3\">Trusted Partner</div>
            <p className=\"font-serif-display text-4xl leading-tight\">\"We replaced two accountants with WhiteCircle. The compliance score dashboard keeps the board calm.\"</p>
            <p className=\"mt-4 text-white/60 text-sm\">— Rohit Bansal, CFO Stride Logistics</p>
          </div>
        </div>
      </div>
      <div className=\"flex items-center justify-center p-8 bg-[#FDFDFC]\">
        <form onSubmit={submit} className=\"w-full max-w-md\" data-testid=\"login-form\">
          <div className=\"label-overline text-[#0B2046] mb-3\">Welcome back</div>
          <h1 className=\"font-serif-display text-4xl text-[#050E20] leading-tight mb-2\">Sign in to your dashboard.</h1>
          <p className=\"text-sm text-[#4A5568] mb-8\">Continue managing your filings, uploads & invoices.</p>

          {err && <div className=\"mb-4 p-3 bg-[#9B2C2C]/10 text-[#9B2C2C] text-sm border border-[#9B2C2C]/20\" data-testid=\"login-error\">{err}</div>}

          <label className=\"label-overline text-[#4A5568]\">Email</label>
          <input type=\"email\" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid=\"login-email\"
            className=\"mt-2 mb-5 w-full px-4 py-3 border border-[#E2E8F0] bg-white text-[#050E20] focus:border-[#0B2046] outline-none rounded-sm\" />

          <label className=\"label-overline text-[#4A5568]\">Password</label>
          <input type=\"password\" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid=\"login-password\"
            className=\"mt-2 mb-6 w-full px-4 py-3 border border-[#E2E8F0] bg-white text-[#050E20] focus:border-[#0B2046] outline-none rounded-sm\" />

          <button type=\"submit\" disabled={loading} data-testid=\"login-submit\"
            className=\"w-full bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm transition-colors px-6 py-3.5 font-medium disabled:opacity-60\">
            {loading ? \"Signing in…\" : \"Sign in\"}
          </button>

          <p className=\"mt-6 text-sm text-[#4A5568]\">New to WhiteCircle? <Link to=\"/register\" data-testid=\"login-register-link\" className=\"text-[#0B2046] underline\">Create an account</Link></p>

          <div className=\"mt-8 p-4 border border-[#E2E8F0] bg-[#F5F2EA]/50 text-xs text-[#4A5568] rounded-sm\">
            <div className=\"font-semibold text-[#050E20] mb-1\">Demo accounts</div>
            <div>Admin: admin@whitecircle.in / Admin@123</div>
            <div>Accountant: accountant@whitecircle.in / Account@123</div>
          </div>
        </form>s
      </div>
    </div>
  );
}
"