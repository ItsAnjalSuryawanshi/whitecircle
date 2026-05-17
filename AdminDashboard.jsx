"import { useEffect, useState } from \"react\";
import { DashboardShell } from \"../components/DashboardShell\";
import { http, formatApiError } from \"../lib/api\";
import { toast } from \"sonner\";
import { LayoutDashboard, Users, ClipboardList, Receipt, MessagesSquare, UserPlus, Phone, Briefcase } from \"lucide-react\";

const NAV = [
  { key: \"overview\", label: \"Overview\", icon: LayoutDashboard },
  { key: \"clients\", label: \"Clients\", icon: Users },
  { key: \"filings\", label: \"Filings Workflow\", icon: ClipboardList },
  { key: \"invoices\", label: \"Invoices\", icon: Receipt },
  { key: \"staff\", label: \"Staff\", icon: UserPlus },
  { key: \"leads\", label: \"Leads\", icon: Phone },
  { key: \"careers\", label: \"Careers\", icon: Briefcase },
  { key: \"chat\", label: \"Chat Threads\", icon: MessagesSquare },
];

export default function AdminDashboard() {
  const [active, setActive] = useState(\"overview\");
  return (
    <DashboardShell title={NAV.find(n => n.key === active).label} navItems={NAV} active={active} onSelect={setActive}>
      {active === \"overview\" && <Overview />}
      {active === \"clients\" && <Clients />}
      {active === \"filings\" && <Filings />}
      {active === \"invoices\" && <Invoices />}
      {active === \"staff\" && <Staff />}
      {active === \"leads\" && <Leads />}
      {active === \"careers\" && <Careers />}
      {active === \"chat\" && <ChatThreads />}
    </DashboardShell>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className=\"bg-white border border-[#E2E8F0] p-6\">
      <div className=\"label-overline text-[#4A5568]\">{label}</div>
      <div className={`font-mono-fin text-3xl mt-2 ${accent || \"text-[#0B2046]\"}`}>{value}</div>
    </div>
  );
}

function Overview() {
  const [s, setS] = useState(null);
  useEffect(() => { http.get(\"/analytics/admin\").then(r => setS(r.data)); }, []);
  if (!s) return <div>Loading…</div>;
  return (
    <div className=\"space-y-6\" data-testid=\"admin-overview\">
      <div className=\"grid grid-cols-2 lg:grid-cols-4 gap-4\">
        <Stat label=\"Total Clients\" value={s.total_clients} />
        <Stat label=\"Total Filings\" value={s.total_filings} />
        <Stat label=\"Pending\" value={s.pending} accent=\"text-[#B7791F]\" />
        <Stat label=\"Filed\" value={s.filed} accent=\"text-[#1B4D3E]\" />
        <Stat label=\"In Process\" value={s.in_process} />
        <Stat label=\"Unpaid Invoices\" value={s.unpaid_invoices} accent=\"text-[#9B2C2C]\" />
        <Stat label=\"Inactive (30d)\" value={s.inactive_clients} accent=\"text-[#9B2C2C]\" />
        <Stat label=\"Revenue (Paid)\" value={`₹ ${Number(s.total_revenue_paid || 0).toLocaleString(\"en-IN\")}`} />
      </div>
    </div>
  );
}

function Clients() {
  const [rows, setRows] = useState([]);
  useEffect(() => { http.get(\"/admin/clients\").then(r => setRows(r.data)); }, []);
  return (
    <div className=\"bg-white border border-[#E2E8F0]\" data-testid=\"admin-clients\">
      <table className=\"w-full text-sm\">
        <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
          <tr><th className=\"text-left p-4\">Name</th><th className=\"text-left p-4\">Email</th><th className=\"text-left p-4\">Business</th><th className=\"text-left p-4\">GSTIN</th><th className=\"text-left p-4\">Joined</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan=\"5\" className=\"p-8 text-center text-[#4A5568]\">No clients yet.</td></tr>}
          {rows.map(r => (
            <tr key={r.id} className=\"border-t border-[#E2E8F0]\" data-testid={`client-row-${r.id}`}>
              <td className=\"p-4 font-medium text-[#050E20]\">{r.name}</td>
              <td className=\"p-4\">{r.email}</td>
              <td className=\"p-4\">{r.business_name || \"—\"}</td>
              <td className=\"p-4 font-mono-fin\">{r.gstin || \"—\"}</td>
              <td className=\"p-4 font-mono-fin text-[#4A5568]\">{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Filings() {
  const [rows, setRows] = useState([]);
  const [staff, setStaff] = useState([]);
  const load = () => http.get(\"/filings\").then(r => setRows(r.data));
  useEffect(() => { load(); http.get(\"/admin/staff\").then(r => setStaff(r.data.filter(u => u.role === \"accountant\"))); }, []);

  const update = async (id, patch) => {
    try { await http.patch(`/filings/${id}`, patch); toast.success(\"Updated\"); load(); }
    catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
  };
  const uploadProof = async (id, file) => {
    const b64 = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(\",\")[1]); r.onerror = rej; r.readAsDataURL(file); });
    update(id, { proof_filename: file.name, proof_data: b64, status: \"Filed\" });
  };

  return (
    <div className=\"bg-white border border-[#E2E8F0]\" data-testid=\"admin-filings\">
      <table className=\"w-full text-sm\">
        <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
          <tr><th className=\"text-left p-3\">Client</th><th className=\"text-left p-3\">Type</th><th className=\"text-left p-3\">Period</th><th className=\"text-left p-3\">Status</th><th className=\"text-left p-3\">Assigned</th><th className=\"text-left p-3\">Ack No.</th><th className=\"text-left p-3\">Proof</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className=\"border-t border-[#E2E8F0]\" data-testid={`admin-filing-${r.id}`}>
              <td className=\"p-3 text-[#050E20]\">{r.client_name}</td>
              <td className=\"p-3 font-medium\">{r.type}</td>
              <td className=\"p-3\">{r.period}</td>
              <td className=\"p-3\">
                <select value={r.status} onChange={e => update(r.id, { status: e.target.value })} className=\"border border-[#E2E8F0] px-2 py-1 rounded-sm text-xs bg-white\" data-testid={`status-${r.id}`}>
                  <option>Pending</option><option>In Process</option><option>Filed</option>
                </select>
              </td>
              <td className=\"p-3\">
                <select value={r.assigned_to || \"\"} onChange={e => update(r.id, { assigned_to: e.target.value })} className=\"border border-[#E2E8F0] px-2 py-1 rounded-sm text-xs bg-white\" data-testid={`assign-${r.id}`}>
                  <option value=\"\">— Assign —</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </td>
              <td className=\"p-3\">
                <input defaultValue={r.acknowledgement_no || \"\"} onBlur={e => e.target.value !== r.acknowledgement_no && update(r.id, { acknowledgement_no: e.target.value })} placeholder=\"ACK no.\" className=\"border border-[#E2E8F0] px-2 py-1 rounded-sm text-xs bg-white w-28\" data-testid={`ack-${r.id}`} />
              </td>
              <td className=\"p-3\">
                <label className=\"text-xs text-[#0B2046] cursor-pointer hover:underline\">
                  {r.proof_filename ? r.proof_filename.slice(0, 14) + \"…\" : \"Upload\"}
                  <input type=\"file\" className=\"hidden\" onChange={e => e.target.files[0] && uploadProof(r.id, e.target.files[0])} data-testid={`proof-${r.id}`} />
                </label>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan=\"7\" className=\"p-8 text-center text-[#4A5568]\">No filings yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Invoices() {
  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ client_id: \"\", description: \"\", amount: \"\", due_date: \"\" });
  const load = () => http.get(\"/invoices\").then(r => setRows(r.data));
  useEffect(() => { load(); http.get(\"/admin/clients\").then(r => { setClients(r.data); if (r.data[0]) setForm(f => ({ ...f, client_id: r.data[0].id })); }); }, []);

  const create = async (e) => {
    e.preventDefault();
    try { await http.post(\"/invoices\", { ...form, amount: parseFloat(form.amount) }); toast.success(\"Invoice created\"); load(); setForm({ ...form, description: \"\", amount: \"\", due_date: \"\" }); }
    catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
  };

  return (
    <div className=\"space-y-6\" data-testid=\"admin-invoices\">
      <form onSubmit={create} className=\"bg-white border border-[#E2E8F0] p-6 grid grid-cols-1 md:grid-cols-5 gap-3 items-end\">
        <div>
          <label className=\"label-overline text-[#4A5568]\">Client</label>
          <select value={form.client_id} onChange={e => setForm({...form, client_id: e.target.value})} required data-testid=\"inv-client\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\">
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className=\"md:col-span-2\"><label className=\"label-overline text-[#4A5568]\">Description</label>
          <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} required data-testid=\"inv-desc\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
        </div>
        <div><label className=\"label-overline text-[#4A5568]\">Amount (₹)</label>
          <input type=\"number\" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required data-testid=\"inv-amount\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
        </div>
        <div><label className=\"label-overline text-[#4A5568]\">Due date</label>
          <input type=\"date\" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} required data-testid=\"inv-due\" className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
        </div>
        <button type=\"submit\" data-testid=\"inv-submit\" className=\"md:col-span-5 justify-self-start bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm px-6 py-2.5 font-medium\">Create invoice</button>
      </form>

      <div className=\"bg-white border border-[#E2E8F0]\">
        <table className=\"w-full text-sm\">
          <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
            <tr><th className=\"text-left p-4\">Invoice</th><th className=\"text-left p-4\">Client</th><th className=\"text-left p-4\">Description</th><th className=\"text-left p-4\">Amount</th><th className=\"text-left p-4\">Status</th></tr>
          </thead>
          <tbody>
            {rows.map(i => (
              <tr key={i.id} className=\"border-t border-[#E2E8F0]\">
                <td className=\"p-4 font-mono-fin\">{i.invoice_no}</td><td className=\"p-4\">{i.client_name}</td><td className=\"p-4\">{i.description}</td>
                <td className=\"p-4 font-mono-fin\">₹ {Number(i.amount).toLocaleString(\"en-IN\")}</td>
                <td className=\"p-4\">{i.status}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan=\"5\" className=\"p-8 text-center text-[#4A5568]\">No invoices yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Staff() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: \"\", email: \"\", phone: \"\", password: \"\" });
  const load = () => http.get(\"/admin/staff\").then(r => setRows(r.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try { await http.post(\"/admin/staff\", form); toast.success(\"Staff added\"); setForm({ name: \"\", email: \"\", phone: \"\", password: \"\" }); load(); }
    catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
  };

  return (
    <div className=\"space-y-6\" data-testid=\"admin-staff\">
      <form onSubmit={create} className=\"bg-white border border-[#E2E8F0] p-6 grid grid-cols-1 md:grid-cols-5 gap-3 items-end\">
        {[\"name\",\"email\",\"phone\",\"password\"].map(k => (
          <div key={k}><label className=\"label-overline text-[#4A5568]\">{k}</label>
            <input type={k === \"password\" ? \"password\" : k === \"email\" ? \"email\" : \"text\"} value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} required={k!==\"phone\"} data-testid={`staff-${k}`} className=\"mt-2 w-full px-3 py-2.5 border border-[#E2E8F0] rounded-sm bg-white\" />
          </div>
        ))}
        <button type=\"submit\" data-testid=\"staff-submit\" className=\"bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm px-6 py-2.5 font-medium\">Add Accountant</button>
      </form>

      <div className=\"bg-white border border-[#E2E8F0]\">
        <table className=\"w-full text-sm\">
          <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
            <tr><th className=\"text-left p-4\">Name</th><th className=\"text-left p-4\">Email</th><th className=\"text-left p-4\">Role</th></tr>
          </thead>
          <tbody>
            {rows.map(r => <tr key={r.id} className=\"border-t border-[#E2E8F0]\"><td className=\"p-4\">{r.name}</td><td className=\"p-4\">{r.email}</td><td className=\"p-4 capitalize\">{r.role}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Leads() {
  const [rows, setRows] = useState([]);
  useEffect(() => { http.get(\"/consultations\").then(r => setRows(r.data)); }, []);
  return (
    <div className=\"bg-white border border-[#E2E8F0]\" data-testid=\"admin-leads\">
      <table className=\"w-full text-sm\">
        <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
          <tr><th className=\"text-left p-4\">Name</th><th className=\"text-left p-4\">Service</th><th className=\"text-left p-4\">Email</th><th className=\"text-left p-4\">Phone</th><th className=\"text-left p-4\">Preferred</th><th className=\"text-left p-4\">Message</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className=\"border-t border-[#E2E8F0]\">
              <td className=\"p-4 font-medium\">{r.name}</td><td className=\"p-4\">{r.service}</td><td className=\"p-4\">{r.email}</td>
              <td className=\"p-4 font-mono-fin\">{r.phone}</td><td className=\"p-4 font-mono-fin\">{r.preferred_date || \"—\"}</td>
              <td className=\"p-4 text-[#4A5568]\">{r.message || \"—\"}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan=\"6\" className=\"p-8 text-center text-[#4A5568]\">No leads yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Careers() {
  const [rows, setRows] = useState([]);
  useEffect(() => { http.get(\"/careers\").then(r => setRows(r.data)); }, []);
  return (
    <div className=\"bg-white border border-[#E2E8F0]\" data-testid=\"admin-careers\">
      <table className=\"w-full text-sm\">
        <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
          <tr><th className=\"text-left p-4\">Name</th><th className=\"text-left p-4\">Role</th><th className=\"text-left p-4\">Experience</th><th className=\"text-left p-4\">Email</th><th className=\"text-left p-4\">Phone</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className=\"border-t border-[#E2E8F0]\">
              <td className=\"p-4\">{r.name}</td><td className=\"p-4\">{r.role}</td><td className=\"p-4\">{r.experience}</td>
              <td className=\"p-4\">{r.email}</td><td className=\"p-4 font-mono-fin\">{r.phone}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan=\"5\" className=\"p-8 text-center text-[#4A5568]\">No applications yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function ChatThreads() {
  const [threads, setThreads] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [body, setBody] = useState(\"\");
  useEffect(() => { http.get(\"/messages\").then(r => setThreads(r.data.threads || [])); }, []);
  const open = async (tid) => { setActive(tid); const { data } = await http.get(`/messages?thread_id=${tid}`); setMsgs(data.messages || []); };
  const send = async (e) => {
    e.preventDefault();
    if (!body.trim() || !active) return;
    await http.post(\"/messages\", { to_user_id: active, body }); setBody(\"\");
    const { data } = await http.get(`/messages?thread_id=${active}`); setMsgs(data.messages || []);
  };

  return (
    <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]\" data-testid=\"admin-chat\">
      <div className=\"bg-white border border-[#E2E8F0] overflow-auto\">
        <div className=\"p-4 label-overline text-[#4A5568] border-b border-[#E2E8F0]\">Threads</div>
        {threads.length === 0 && <div className=\"p-6 text-sm text-[#4A5568]\">No conversations yet.</div>}
        {threads.map(t => (
          <button key={t.thread_id} onClick={() => open(t.thread_id)} className={`w-full text-left p-4 border-b border-[#E2E8F0] hover:bg-[#F5F2EA]/40 ${active === t.thread_id ? \"bg-[#F5F2EA]/60\" : \"\"}`}>
            <div className=\"font-medium text-[#050E20] text-sm\">{t.last_message?.from_name}</div>
            <div className=\"text-xs text-[#4A5568] truncate\">{t.last_message?.body}</div>
          </button>
        ))}
      </div>
      <div className=\"md:col-span-2 bg-white border border-[#E2E8F0] flex flex-col\">
        <div className=\"flex-1 overflow-auto p-4 space-y-2\">
          {!active && <div className=\"text-center text-[#4A5568] text-sm mt-10\">Select a thread to start replying.</div>}
          {msgs.map(m => (
            <div key={m.id} className={`max-w-md ${m.from_role !== \"client\" ? \"ml-auto bg-[#0B2046] text-white\" : \"bg-[#F5F2EA] text-[#050E20]\"} p-3 rounded-sm`}>
              <div className=\"text-xs label-overline opacity-70 mb-1\">{m.from_name}</div>
              <div className=\"text-sm\">{m.body}</div>
            </div>
          ))}
        </div>
        {active && (
          <form onSubmit={send} className=\"border-t border-[#E2E8F0] p-3 flex gap-2\">
            <input value={body} onChange={e => setBody(e.target.value)} placeholder=\"Reply…\" data-testid=\"admin-chat-input\" className=\"flex-1 px-3 py-2 border border-[#E2E8F0] rounded-sm bg-white\" />
            <button type=\"submit\" className=\"bg-[#0B2046] text-white hover:bg-[#14346B] rounded-sm px-4 py-2 text-sm font-medium\">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}
"