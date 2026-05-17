"import { useEffect, useState } from \"react\";
import { DashboardShell } from \"../components/DashboardShell\";
import { http, formatApiError } from \"../lib/api\";
import { toast } from \"sonner\";
import { LayoutDashboard, FileUp, ClipboardList, Receipt, MessagesSquare, User, CalendarClock, Download } from \"lucide-react\";

const NAV = [
  { key: \"overview\", label: \"Dashboard\", icon: LayoutDashboard },
  { key: \"documents\", label: \"Documents\", icon: FileUp },
  { key: \"filings\", label: \"Filings\", icon: ClipboardList },
  { key: \"invoices\", label: \"Invoices\", icon: Receipt },
  { key: \"chat\", label: \"Chat\", icon: MessagesSquare },
  { key: \"profile\", label: \"Profile\", icon: User },
];

export default function ClientDashboard() {
  const [active, setActive] = useState(\"overview\");
  return (
    <DashboardShell title={NAV.find(n => n.key === active).label} navItems={NAV} active={active} onSelect={setActive}>
      {active === \"overview\" && <Overview />}
      {active === \"documents\" && <Documents />}
      {active === \"filings\" && <Filings />}
      {active === \"invoices\" && <Invoices />}
      {active === \"chat\" && <Chat />}
      {active === \"profile\" && <Profile />}
    </DashboardShell>
  );
}

function StatCard({ label, value, suffix, accent }) {
  return (
    <div className=\"bg-white border border-[#E2E8F0] p-6\">
      <div className=\"label-overline text-[#4A5568]\">{label}</div>
      <div className={`font-mono-fin text-4xl mt-2 ${accent || \"text-[#0B2046]\"}`}>{value}{suffix && <span className=\"text-xl text-[#4A5568] ml-1\">{suffix}</span>}</div>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  useEffect(() => {
    http.get(\"/analytics/client\").then(r => setStats(r.data));
    http.get(\"/reminders\").then(r => setReminders(r.data.slice(0, 6)));
  }, []);
  return (
    <div className=\"space-y-8\" data-testid=\"client-overview\">
      <div className=\"grid grid-cols-2 lg:grid-cols-4 gap-4\">
        <StatCard label=\"Compliance Score\" value={stats?.compliance_score ?? \"—\"} suffix=\"%\" />
        <StatCard label=\"Total Filings\" value={stats?.total_filings ?? \"—\"} />
        <StatCard label=\"Pending\" value={stats?.pending ?? \"—\"} accent=\"text-[#B7791F]\" />
        <StatCard label=\"Unpaid Invoices\" value={stats?.unpaid_invoices ?? \"—\"} accent=\"text-[#9B2C2C]\" />
      </div>
      <div className=\"bg-white border border-[#E2E8F0] p-6\">
        <div className=\"flex items-center gap-2 mb-4\">
          <CalendarClock size={16} className=\"text-[#0B2046]\" />
          <div className=\"font-serif-display text-xl text-[#050E20]\">Upcoming due dates</div>
        </div>
        <div className=\"divide-y divide-[#E2E8F0]\">
          {reminders.map((r, i) => (
            <div key={i} className=\"py-3 flex items-center justify-between\">
              <div><div className=\"font-medium text-[#050E20]\">{r.title}</div><div className=\"text-xs text-[#4A5568]\">{r.category}</div></div>
              <div className=\"text-right\">
                <div className=\"font-mono-fin text-sm text-[#0B2046]\">{r.due_date}</div>
                <div className={`text-xs ${r.days_left < 0 ? \"text-[#9B2C2C]\" : r.days_left <= 5 ? \"text-[#B7791F]\" : \"text-[#1B4D3E]\"}`}>
                  {r.days_left < 0 ? `${Math.abs(r.days_left)} d overdue` : `${r.days_left} days left`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MONTHS = [\"January\",\"February\",\"March\",\"April\",\"May\",\"June\",\"July\",\"August\",\"September\",\"October\",\"November\",\"December\"];
const CATS = [\"GST\",\"ITR\",\"TDS\",\"Bank\",\"Sales\",\"Purchase\",\"Other\"];

function Documents() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState({ category: \"GST\", month: MONTHS[new Date().getMonth()], year: new Date().getFullYear(), notes: \"\" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => http.get(\"/documents\").then(r => setDocs(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error(\"Please select a file\");
    setLoading(true);
    try {
      const b64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result.split(\",\")[1]);
        reader.onerror = rej; reader.readAsDataURL(file);
      });
      await http.post(\"/documents\", { ...form, filename: file.name, file_data: b64, file_type: file.type });
      toast.success(\"Document uploaded. Confirmation sent to your email.\");
      setFile(null); setForm({ ...form, notes: \"\" });
      load();
    } catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  return (
    <div className=\"space-y-8\" data-testid=\"client-documents\">
      <form onSubmit={submit} className=\"bg-white border border-[#E2E8F0] p-6\">
        <div className=\"font-serif-display text-xl text-[#050E20] mb-5\">Upload document</div>
        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">
          <div>
            <label className=\"label-overline text-[#4A5568]\">Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} data-testid=\"doc-category\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className=\"label-overline text-[#4A5568]\">Month</label>
            <select value={form.month} onChange={e => setForm({...form, month: e.target.value})} data-testid=\"doc-month\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\">
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className=\"label-overline text-[#4A5568]\">Year</label>
            <input type=\"number\" value={form.year} onChange={e => setForm({...form, year: +e.target.value})} data-testid=\"doc-year\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
          </div>
          <div>
            <label className=\"label-overline text-[#4A5568]\">File</label>
            <input type=\"file\" onChange={e => setFile(e.target.files[0])} data-testid=\"doc-file\" className=\"mt-2 w-full text-sm\" />
          </div>
        </div>
        <div className=\"mt-4\">
          <label className=\"label-overline text-[#4A5568]\">Notes</label>
          <textarea rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} data-testid=\"doc-notes\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
        </div>
        <button type=\"submit\" disabled={loading} data-testid=\"doc-submit\" className=\"mt-5 bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm px-6 py-3 font-medium disabled:opacity-60\">
          {loading ? \"Uploading…\" : \"Upload document\"}
        </button>
      </form>

      <div className=\"bg-white border border-[#E2E8F0]\">
        <div className=\"p-6 border-b border-[#E2E8F0] font-serif-display text-xl text-[#050E20]\">Uploaded documents</div>
        <table className=\"w-full text-sm\">
          <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
            <tr><th className=\"text-left p-4\">Filename</th><th className=\"text-left p-4\">Category</th><th className=\"text-left p-4\">Period</th><th className=\"text-left p-4\">Uploaded</th></tr>
          </thead>
          <tbody>
            {docs.length === 0 && <tr><td colSpan=\"4\" className=\"p-8 text-center text-[#4A5568]\">No documents yet.</td></tr>}
            {docs.map(d => (
              <tr key={d.id} className=\"border-t border-[#E2E8F0]\" data-testid={`doc-row-${d.id}`}>
                <td className=\"p-4 text-[#050E20]\">{d.filename}</td>
                <td className=\"p-4\">{d.category}</td>
                <td className=\"p-4\">{d.month} {d.year}</td>
                <td className=\"p-4 font-mono-fin text-[#4A5568]\">{new Date(d.uploaded_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const FILING_TYPES = [\"GSTR-1\",\"GSTR-3B\",\"CMP-08\",\"ITR\",\"TDS\",\"Annual\"];

function Filings() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ type: \"GSTR-1\", period: \"\", notes: \"\" });

  const load = () => http.get(\"/filings\").then(r => setRows(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try { await http.post(\"/filings\", form); toast.success(\"Filing requested\"); load(); setForm({ ...form, period: \"\", notes: \"\" }); }
    catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
  };

  const downloadProof = async (id) => {
    try {
      const { data } = await http.get(`/filings/${id}/proof`);
      if (!data.file_data) return toast.error(\"Proof not yet uploaded\");
      const link = document.createElement(\"a\");
      link.href = `data:application/octet-stream;base64,${data.file_data}`;
      link.download = data.filename || \"proof\";
      link.click();
    } catch { toast.error(\"Download failed\"); }
  };

  return (
    <div className=\"space-y-8\" data-testid=\"client-filings\">
      <form onSubmit={submit} className=\"bg-white border border-[#E2E8F0] p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end\">
        <div>
          <label className=\"label-overline text-[#4A5568]\">Type</label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} data-testid=\"filing-type\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\">
            {FILING_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className=\"label-overline text-[#4A5568]\">Period</label>
          <input value={form.period} onChange={e => setForm({...form, period: e.target.value})} placeholder=\"e.g. Feb 2026\" required data-testid=\"filing-period\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
        </div>
        <div className=\"md:col-span-1\">
          <label className=\"label-overline text-[#4A5568]\">Notes</label>
          <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} data-testid=\"filing-notes\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
        </div>
        <button type=\"submit\" data-testid=\"filing-submit\" className=\"bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm px-6 py-2.5 font-medium\">Request filing</button>
      </form>

      <div className=\"bg-white border border-[#E2E8F0]\">
        <table className=\"w-full text-sm\">
          <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
            <tr><th className=\"text-left p-4\">Type</th><th className=\"text-left p-4\">Period</th><th className=\"text-left p-4\">Status</th><th className=\"text-left p-4\">Ack No.</th><th className=\"text-left p-4\">Proof</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan=\"5\" className=\"p-8 text-center text-[#4A5568]\">No filings yet.</td></tr>}
            {rows.map(r => (
              <tr key={r.id} className=\"border-t border-[#E2E8F0]\" data-testid={`filing-row-${r.id}`}>
                <td className=\"p-4 text-[#050E20] font-medium\">{r.type}</td>
                <td className=\"p-4\">{r.period}</td>
                <td className=\"p-4\"><StatusBadge status={r.status} /></td>
                <td className=\"p-4 font-mono-fin text-[#4A5568]\">{r.acknowledgement_no || \"—\"}</td>
                <td className=\"p-4\">
                  {r.proof_filename
                    ? <button onClick={() => downloadProof(r.id)} className=\"text-[#0B2046] inline-flex items-center gap-1 hover:underline\" data-testid={`filing-download-${r.id}`}><Download size={14} /> Download</button>
                    : <span className=\"text-[#4A5568]\">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { \"Pending\": \"bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/30\", \"In Process\": \"bg-[#0B2046]/10 text-[#0B2046] border-[#0B2046]/30\", \"Filed\": \"bg-[#1B4D3E]/10 text-[#1B4D3E] border-[#1B4D3E]/30\" };
  return <span className={`text-xs px-2.5 py-1 border ${map[status] || \"\"}`}>{status}</span>;
}

function Invoices() {
  const [rows, setRows] = useState([]);
  const load = () => http.get(\"/invoices\").then(r => setRows(r.data));
  useEffect(() => { load(); }, []);

  const pay = async (id) => {
    if (!window.confirm(\"Confirm payment? (Demo — marks as paid)\")) return;
    try { await http.patch(`/invoices/${id}`, { status: \"Paid\" }); toast.success(\"Payment recorded\"); load(); }
    catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
  };

  return (
    <div data-testid=\"client-invoices\" className=\"bg-white border border-[#E2E8F0]\">
      <div className=\"p-6 border-b border-[#E2E8F0] font-serif-display text-xl text-[#050E20]\">Invoices & payments</div>
      <table className=\"w-full text-sm\">
        <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
          <tr><th className=\"text-left p-4\">Invoice</th><th className=\"text-left p-4\">Description</th><th className=\"text-left p-4\">Amount</th><th className=\"text-left p-4\">Due</th><th className=\"text-left p-4\">Status</th><th className=\"p-4\"></th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan=\"6\" className=\"p-8 text-center text-[#4A5568]\">No invoices yet.</td></tr>}
          {rows.map(i => (
            <tr key={i.id} className=\"border-t border-[#E2E8F0]\">
              <td className=\"p-4 font-mono-fin text-[#0B2046]\">{i.invoice_no}</td>
              <td className=\"p-4\">{i.description}</td>
              <td className=\"p-4 font-mono-fin text-[#050E20]\">₹ {Number(i.amount).toLocaleString(\"en-IN\")}</td>
              <td className=\"p-4 font-mono-fin text-[#4A5568]\">{i.due_date}</td>
              <td className=\"p-4\"><span className={`text-xs px-2.5 py-1 border ${i.status === \"Paid\" ? \"bg-[#1B4D3E]/10 text-[#1B4D3E] border-[#1B4D3E]/30\" : \"bg-[#9B2C2C]/10 text-[#9B2C2C] border-[#9B2C2C]/30\"}`}>{i.status}</span></td>
              <td className=\"p-4 text-right\">
                {i.status === \"Unpaid\" && <button onClick={() => pay(i.id)} data-testid={`pay-${i.id}`} className=\"bg-[#D4AF37] text-[#050E20] hover:bg-[#C5A028] rounded-sm px-4 py-2 text-xs font-bold\">Pay Now</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Chat() {
  const [msgs, setMsgs] = useState([]);
  const [body, setBody] = useState(\"\");
  const load = () => http.get(\"/messages\").then(r => setMsgs(r.data.messages || []));
  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    try { await http.post(\"/messages\", { body }); setBody(\"\"); load(); }
    catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
  };

  return (
    <div className=\"bg-white border border-[#E2E8F0] flex flex-col h-[70vh]\" data-testid=\"client-chat\">
      <div className=\"p-6 border-b border-[#E2E8F0] font-serif-display text-xl text-[#050E20]\">Chat with your accountant</div>
      <div className=\"flex-1 overflow-auto p-6 space-y-3\">
        {msgs.length === 0 && <div className=\"text-center text-[#4A5568] text-sm\">Start a conversation. Our team typically responds within 4 hours.</div>}
        {msgs.map(m => (
          <div key={m.id} className={`max-w-md ${m.from_role === \"client\" ? \"ml-auto bg-[#0B2046] text-white\" : \"bg-[#F5F2EA] text-[#050E20]\"} p-3 rounded-sm`}>
            <div className=\"text-xs label-overline opacity-70 mb-1\">{m.from_name} · {m.from_role}</div>
            <div className=\"text-sm\">{m.body}</div>
            <div className=\"text-[10px] opacity-60 mt-1 font-mono-fin\">{new Date(m.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className=\"border-t border-[#E2E8F0] p-4 flex gap-2\">
        <input value={body} onChange={e => setBody(e.target.value)} placeholder=\"Type a message…\" data-testid=\"chat-input\" className=\"flex-1 px-4 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
        <button type=\"submit\" data-testid=\"chat-send\" className=\"bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm px-5 py-2.5 font-medium\">Send</button>
      </form>
    </div>
  );
}

function Profile() {
  const [form, setForm] = useState({ name: \"\", phone: \"\", business_name: \"\", gstin: \"\", pan: \"\" });
  useEffect(() => { http.get(\"/auth/me\").then(r => setForm({ name: r.data.name || \"\", phone: r.data.phone || \"\", business_name: r.data.business_name || \"\", gstin: r.data.gstin || \"\", pan: r.data.pan || \"\" })); }, []);
  const save = async (e) => {
    e.preventDefault();
    try { await http.put(\"/profile\", form); toast.success(\"Profile updated\"); }
    catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
  };
  return (
    <form onSubmit={save} className=\"bg-white border border-[#E2E8F0] p-6 max-w-2xl\" data-testid=\"client-profile\">
      <div className=\"font-serif-display text-xl text-[#050E20] mb-5\">Business & KYC</div>
      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
        {[
          { k: \"name\", l: \"Full name\" }, { k: \"phone\", l: \"Phone\" }, { k: \"business_name\", l: \"Business name\" },
          { k: \"gstin\", l: \"GSTIN\" }, { k: \"pan\", l: \"PAN\" },
        ].map(f => (
          <div key={f.k}>
            <label className=\"label-overline text-[#4A5568]\">{f.l}</label>
            <input value={form[f.k]} onChange={e => setForm({...form, [f.k]: e.target.value})} data-testid={`profile-${f.k}`} className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
          </div>
        ))}
      </div>
      <button type=\"submit\" data-testid=\"profile-save\" className=\"mt-6 bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm px-6 py-3 font-medium\">Save changes</button>
    </form>
  );
}
"