const STORAGE_KEY = 'hisaabai_entries_v1';
const SYSTEM_PROMPT = `You are HisaabAI, a practical business assistant for small Pakistani shop owners and home businesses.

Analyse only the transaction data supplied by the user. Never invent figures.
Respond in easy Roman Urdu with clear headings.
Your report must include:
1. Overall business performance summary.
2. Total sales, total cost, total profit, profit margin and pending payments.
3. Most profitable products or services.
4. Payment collection risks and unusual losses or low-margin entries.
5. Three practical actions for the next seven days.
6. A realistic weekly sales target based on the supplied data.

Keep the advice concise, respectful and useful. Mention that the report is based only on the saved entries.`;

const sampleEntries = [
  {id:'s1',date:'2026-07-13',customer:'Ali Raza',phone:'03001234567',item:'Blue Cut Glasses',cost:1800,extra:250,sale:3500,received:3500,notes:''},
  {id:'s2',date:'2026-07-14',customer:'Hina Store',phone:'',item:'Leather Wallet Set',cost:2100,extra:150,sale:3900,received:2500,notes:'Remaining next week'},
  {id:'s3',date:'2026-07-15',customer:'Usman',phone:'',item:'Photochromic Lens',cost:2300,extra:400,sale:4700,received:4700,notes:''},
  {id:'s4',date:'2026-07-16',customer:'Saad',phone:'',item:'Frame + AR Lens',cost:1500,extra:350,sale:3200,received:2000,notes:''},
  {id:'s5',date:'2026-07-17',customer:'Noor Boutique',phone:'',item:'Gift Set',cost:2800,extra:100,sale:4500,received:4500,notes:''},
  {id:'s6',date:'2026-07-18',customer:'Areeba',phone:'',item:'UV Lens',cost:1100,extra:250,sale:2400,received:0,notes:'Payment due'}
];
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || sampleEntries;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => `Rs ${Math.round(Number(n)||0).toLocaleString('en-PK')}`;
const calc = e => ({totalCost:+e.cost + +e.extra, pending:Math.max(0,+e.sale-+e.received), profit:+e.sale-(+e.cost + +e.extra)});
const statusOf = e => +e.received >= +e.sale ? 'paid' : +e.received > 0 ? 'partial' : 'pending';
const statusLabel = s => s === 'paid' ? 'Paid' : s === 'partial' ? 'Partial' : 'Pending';

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(entries));renderAll()}
function totals(){return entries.reduce((a,e)=>{const c=calc(e);a.sales+=+e.sale;a.cost+=c.totalCost;a.received+=Math.min(+e.received,+e.sale);a.pending+=c.pending;a.profit+=c.profit;return a},{sales:0,cost:0,received:0,pending:0,profit:0})}
function renderAll(){renderDashboard();renderEntries()}
function renderDashboard(){
 const t=totals(), margin=t.sales?Math.round(t.profit/t.sales*100):0;
 $('#totalSales').textContent=money(t.sales);$('#totalCost').textContent=money(t.cost);$('#totalPending').textContent=money(t.pending);$('#totalProfit').textContent=money(t.profit);$('#heroProfit').textContent=money(t.profit);$('#marginText').textContent=`${margin}% margin`;$('#salesChange').textContent=`${entries.length} transaction${entries.length===1?'':'s'}`;$('#pendingCount').textContent=`${entries.filter(e=>calc(e).pending>0).length} customer${entries.filter(e=>calc(e).pending>0).length===1?'':'s'}`;
 const pct=t.sales?Math.round(t.received/t.sales*100):0;$('#paidPercent').textContent=`${pct}%`;$('#paidAmount').textContent=money(t.received);$('#pendingAmount').textContent=money(t.pending);$('#donut').style.background=`radial-gradient(circle,#fff 58%,transparent 60%),conic-gradient(var(--green) 0 ${pct}%,#e8ecea ${pct}% 100%)`;
 const recent=[...entries].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);$('#recentBody').innerHTML=recent.length?recent.map(e=>{const c=calc(e),s=statusOf(e);return `<tr><td>${formatDate(e.date)}</td><td><b>${esc(e.customer)}</b></td><td>${esc(e.item)}</td><td>${money(e.sale)}</td><td><span class="status ${s}">${statusLabel(s)}</span></td><td class="profit">${money(c.profit)}</td></tr>`}).join(''):`<tr><td colspan="6">No entries yet.</td></tr>`;
 renderChart();
}
function renderChart(){
 const grouped={};entries.forEach(e=>{grouped[e.date]=(grouped[e.date]||0)+calc(e).profit});const days=Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).slice(-7);const max=Math.max(1,...days.map(d=>Math.max(0,d[1])));$('#chart').innerHTML=days.length?days.map(([d,v])=>`<div class="bar-item"><div class="bar" data-value="${money(v)}" style="height:${Math.max(4,v/max*100)}%"></div><span class="bar-label">${new Date(d+'T00:00:00').toLocaleDateString('en-PK',{day:'2-digit',month:'short'})}</span></div>`).join(''):'<div class="result-placeholder">No data for chart.</div>';
}
function renderEntries(){
 const q=$('#searchInput').value.toLowerCase(),f=$('#statusFilter').value;const filtered=[...entries].sort((a,b)=>b.date.localeCompare(a.date)).filter(e=>(!q||`${e.customer} ${e.item} ${e.phone}`.toLowerCase().includes(q))&&(f==='all'||statusOf(e)===f));
 $('#entriesBody').innerHTML=filtered.map(e=>{const c=calc(e),s=statusOf(e);return `<tr><td>${formatDate(e.date)}</td><td><b>${esc(e.customer)}</b><br><small>${esc(e.phone||'')}</small></td><td>${esc(e.item)}</td><td>${money(c.totalCost)}</td><td>${money(e.sale)}</td><td>${money(e.received)}</td><td>${money(c.pending)}</td><td class="profit">${money(c.profit)}</td><td><button class="delete-btn" data-delete="${e.id}" title="Delete">×</button></td></tr>`}).join('');$('#emptyState').classList.toggle('hidden',filtered.length>0);
 $$('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('Delete this sale entry?')){entries=entries.filter(e=>e.id!==b.dataset.delete);save();toast('Entry deleted')}})
}
function formatDate(d){return new Date(d+'T00:00:00').toLocaleDateString('en-PK',{day:'2-digit',month:'short',year:'numeric'})}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function switchView(name){$$('.view').forEach(v=>v.classList.remove('active'));$$('.nav-link').forEach(n=>n.classList.toggle('active',n.dataset.view===name));$(`#${name}View`).classList.add('active');$('#pageTitle').textContent=name==='assistant'?'AI Assistant':name[0].toUpperCase()+name.slice(1);window.scrollTo({top:0,behavior:'smooth'})}
$$('.nav-link').forEach(n=>n.onclick=()=>switchView(n.dataset.view));$$('[data-go]').forEach(b=>b.onclick=()=>switchView(b.dataset.go));
function openModal(){const f=$('#entryForm');f.reset();f.date.value=new Date().toISOString().slice(0,10);f.extra.value=0;updateFormSummary();$('#entryModal').classList.remove('hidden')}
function closeModal(){$('#entryModal').classList.add('hidden')}
$('#openEntryBtn').onclick=openModal;$('#closeModal').onclick=closeModal;$('#cancelModal').onclick=closeModal;$('#entryModal').onclick=e=>{if(e.target.id==='entryModal')closeModal()};
function updateFormSummary(){const f=new FormData($('#entryForm')),cost=+f.get('cost')||0,extra=+f.get('extra')||0,sale=+f.get('sale')||0,received=+f.get('received')||0;$('#formProfit').textContent=money(sale-cost-extra);$('#formPending').textContent=money(Math.max(0,sale-received))}
$('#entryForm').addEventListener('input',updateFormSummary);$('#entryForm').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));if(+data.received>+data.sale){toast('Received amount cannot exceed sale price');return}entries.push({...data,id:crypto.randomUUID(),cost:+data.cost,extra:+data.extra,sale:+data.sale,received:+data.received});save();closeModal();toast('Sale entry saved')};
$('#searchInput').oninput=renderEntries;$('#statusFilter').onchange=renderEntries;
$('#exportBtn').onclick=()=>{const rows=[['Date','Customer','Phone','Item','Cost','Extra Cost','Sale','Received','Pending','Profit','Notes'],...entries.map(e=>{const c=calc(e);return [e.date,e.customer,e.phone,e.item,e.cost,e.extra,e.sale,e.received,c.pending,c.profit,e.notes]})];const csv=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='hisaabai-sales.csv';a.click();URL.revokeObjectURL(a.href);toast('CSV exported')};
function localAnalysis(){const t=totals();if(!entries.length)return 'Pehle kam az kam aik sale entry add karein.';const margin=t.sales?t.profit/t.sales*100:0;const byItem={};entries.forEach(e=>{byItem[e.item]=(byItem[e.item]||0)+calc(e).profit});const best=Object.entries(byItem).sort((a,b)=>b[1]-a[1])[0];const low=[...entries].sort((a,b)=>calc(a).profit-calc(b).profit)[0];const target=Math.ceil((t.sales/Math.max(1,new Set(entries.map(e=>e.date)).size))*7*1.1/500)*500;return `<h4>Overall Summary</h4><p>Aap ki ${entries.length} saved entries ke mutabiq total sales <b>${money(t.sales)}</b>, total cost <b>${money(t.cost)}</b> aur net profit <b>${money(t.profit)}</b> hai. Approx profit margin <b>${margin.toFixed(1)}%</b> hai.</p><h4>Best Performing Item</h4><p><b>${esc(best?.[0]||'N/A')}</b> ne sab se zyada combined profit diya: <b>${money(best?.[1]||0)}</b>.</p><h4>Payment Risk</h4><p>Customers se <b>${money(t.pending)}</b> pending hai. Pending customers ko clear follow-up date aur WhatsApp reminder dena chahiye.</p><h4>Attention Needed</h4><p>Sab se low-profit entry <b>${esc(low?.item||'N/A')}</b> ki hai, jisme profit <b>${money(low?calc(low).profit:0)}</b> raha. Is item ki pricing ya extra cost dobara check karein.</p><h4>Next 7 Days Actions</h4><ul><li>Pending payments ki daily follow-up list banayein.</li><li>High-profit item <b>${esc(best?.[0]||'')}</b> ko zyada promote karein.</li><li>Har sale se pehle minimum target margin set karein.</li></ul><h4>Suggested Weekly Target</h4><p>Current performance ko dekhte hue aglay 7 din ka realistic sales target <b>${money(target)}</b> rakhein.</p><p><small>Yeh report sirf aap ki saved entries par based hai.</small></p>`}
$('#analyzeBtn').onclick=async()=>{const btn=$('#analyzeBtn');btn.disabled=true;btn.textContent='Analysing...';$('#aiResult').innerHTML='<div class="result-placeholder"><span>✦</span><h3>Numbers analyse ho rahe hain...</h3></div>';try{const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({entries,systemPrompt:SYSTEM_PROMPT})});if(!res.ok)throw new Error('AI unavailable');const data=await res.json();$('#aiResult').innerHTML=markdownToHtml(data.analysis)}catch(err){$('#aiResult').innerHTML=localAnalysis();toast('Demo analysis generated — add GEMINI_API_KEY for live AI')}finally{btn.disabled=false;btn.textContent='Generate AI Analysis'}};
function markdownToHtml(md){return esc(md).replace(/^### (.*)$/gm,'<h4>$1</h4>').replace(/^## (.*)$/gm,'<h4>$1</h4>').replace(/^# (.*)$/gm,'<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/^[-*] (.*)$/gm,'<li>$1</li>').replace(/(<li>.*<\/li>\n?)+/g,m=>`<ul>${m}</ul>`).replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>').replace(/^/,'<p>').replace(/$/,'</p>')}
$('#copyInsightBtn').onclick=async()=>{await navigator.clipboard.writeText($('#aiResult').innerText);toast('Analysis copied')};$('#systemPrompt').textContent=SYSTEM_PROMPT;
function toast(msg){$('#toast').textContent=msg;$('#toast').classList.remove('hidden');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.add('hidden'),2400)}
renderAll();
