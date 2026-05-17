"import { useEffect, useState } from \"react\";
import { DashboardShell } from \"../components/DashboardShell\";
import { http, formatApiError } from \"../lib/api\";
import { toast } from \"sonner\";
import { LayoutDashboard, ClipboardList } from \"lucide-react\";

const NAV = [
  { key: \"overview\", label: \"My Tasks\", icon: LayoutDashboard },
  { key: \"filings\", label: \"Process Filings\", icon: ClipboardList },
];

export default function AccountantDashboard() {
  const [active, setActive] = useState(\"overview\");
  return (
    <DashboardShell title={NAV.find(n => n.key === active).label} navItems={NAV} active={active} onSelect={setActive}>
      {active === \"overview\" && <Overview />}
      {active === \"filings\" && <Process />}
    </DashboardShell>
  );
}

function Overview() {
  const [rows, setRows] = useState([]);
  useEffect(() => { http.get(\"/filings\").then(r => setRows(r.data)); }, []);
  const pending = rows.filter(r => r.status === \"Pending\").length;
  const inproc = rows.filter(r => r.status === \"In Process\").length;
  const filed = rows.filter(r => r.status === \"Filed\").length;
  return (
    <div data-testid=\"accountant-overview\" className=\"space-y-6\">
      <div className=\"grid grid-cols-3 gap-4\">
        {[[\"Pending\", pending, \"text-[#B7791F]\"],[\"In Process\", inproc, \"text-[#0B2046]\"],[\"Filed\", filed, \"text-[#1B4D3E]\"]].map(([l,v,c]) => (
          <div key={l} className=\"bg-white border border-[#E2E8F0] p-6\">
            <div className=\"label-overline text-[#4A5568]\">{l}</div>
            <div className={`font-mono-fin text-4xl mt-2 ${c}`}>{v}</div>
          </div>
        ))}
      </div>
      <div className=\"bg-white border border-[#E2E8F0] p-6\">
        <div className=\"font-serif-display text-xl text-[#050E20] mb-4\">Recent assignments</div>
        <div className=\"divide-y divide-[#E2E8F0]\">
          {rows.slice(0, 8).map(r => (
            <div key={r.id} className=\"py-3 flex items-center justify-between\">
              <div><div className=\"font-medium text-[#050E20]\">{r.client_name} — {r.type}</div><div className=\"text-xs text-[#4A5568]\">{r.period}</div></div>
              <div className=\"text-xs label-overline text-[#0B2046]\">{r.status}</div>
            </div>
          ))}
          {rows.length === 0 && <div className=\"text-sm text-[#4A5568] py-8 text-center\">No assignments yet.</div>}
        </div>
      </div>
    </div>
  );
}

function Process() {
  const [rows, setRows] = useState([]);
  const load = () => http.get(\"/filings\").then(r => setRows(r.data));
  useEffect(() => { load(); }, []);

  const update = async (id, patch) => {
    try { await http.patch(`/filings/${id}`, patch); toast.success(\"Updated\"); load(); }
    catch (ex) { toast.error(formatApiError(ex.response?.data?.detail)); }
  };
  const uploadProof = async (id, file) => {
    const b64 = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(\",\")[1]); r.onerror = rej; r.readAsDataURL(file); });
    update(id, { proof_filename: file.name, proof_data: b64, status: \"Filed\" });
  };

  return (
    <div className=\"bg-white border border-[#E2E8F0]\" data-testid=\"accountant-process\">
      <table className=\"w-full text-sm\">
        <thead className=\"bg-[#F5F2EA]/40 text-[#4A5568] label-overline\">
          <tr><th className=\"text-left p-3\">Client</th><th className=\"text-left p-3\">Type</th><th className=\"text-left p-3\">Period</th><th className=\"text-left p-3\">Status</th><th className=\"text-left p-3\">Ack No.</th><th className=\"text-left p-3\">Proof</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className=\"border-t border-[#E2E8F0]\">
              <td className=\"p-3\">{r.client_name}</td><td className=\"p-3 font-medium\">{r.type}</td><td className=\"p-3\">{r.period}</td>
              <td className=\"p-3\">
                <select value={r.status} onChange={e => update(r.id, { status: e.target.value })} className=\"border border-[#E2E8F0] px-2 py-1 rounded-sm text-xs bg-white\" data-testid={`acc-status-${r.id}`}>
                  <option>Pending</option><option>In Process</option><option>Filed</option>
                </select>
              </td>
              <td className=\"p-3\"><input defaultValue={r.acknowledgement_no || \"\"} onBlur={e => e.target.value !== r.acknowledgement_no && update(r.id, { acknowledgement_no: e.target.value })} placeholder=\"ACK no.\" className=\"border border-[#E2E8F0] px-2 py-1 rounded-sm text-xs bg-white w-28\" /></td>
              <td className=\"p-3\"><label className=\"text-xs text-[#0B2046] cursor-pointer hover:underline\">{r.proof_filename ? r.proof_filename.slice(0,14)+\"…\" : \"Upload\"}<input type=\"file\" className=\"hidden\" onChange={e => e.target.files[0] && uploadProof(r.id, e.target.files[0])} data-testid={`acc-proof-${r.id}`} /></label></td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan=\"6\" className=\"p-8 text-center text-[#4A5568]\">No assigned filings.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
"