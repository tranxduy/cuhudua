
(function(){"use strict";
const $=id=>document.getElementById(id),E=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=n=>Number(n||0).toLocaleString("vi-VN",{maximumFractionDigits:2});
const AG=[["accounting","Kế toán"],["finance","Tài chính"],["legal","Pháp chế"],["procurement","Mua sắm"],["production","Vận hành"],["project","Đầu tư"],["maintenance","Bảo trì"],["hr","Nhân sự"],["records","Văn thư"],["safety","An toàn"],["audit","Kiểm soát chéo"],["secretary","Thư ký"]];
const AN=Object.fromEntries(AG);
const FLOW={
finance:[["accounting",[]],["finance",[]],["legal",["accounting"]],["audit",["accounting","finance","legal"]],["secretary",["audit"]]],
production:[["production",[]],["maintenance",[]],["finance",["production"]],["safety",["production"]],["audit",["production","maintenance","finance","safety"]],["secretary",["audit"]]],
procurement:[["procurement",[]],["finance",[]],["legal",["procurement"]],["accounting",["procurement","legal"]],["audit",["procurement","finance","legal","accounting"]],["secretary",["audit"]]],
project:[["project",[]],["finance",[]],["legal",["project"]],["safety",["project"]],["audit",["project","finance","legal","safety"]],["secretary",["audit"]]],
maintenance:[["maintenance",[]],["production",[]],["procurement",[]],["safety",["maintenance"]],["finance",["procurement"]],["audit",["maintenance","production","procurement","safety","finance"]],["secretary",["audit"]]],
hr:[["hr",[]],["finance",[]],["accounting",["hr"]],["legal",["hr"]],["audit",["hr","finance","accounting","legal"]],["secretary",["audit"]]],
governance:[["records",[]],["legal",[]],["finance",["records"]],["audit",["records","legal","finance"]],["secretary",["audit"]]],
safety:[["safety",[]],["production",[]],["maintenance",["safety"]],["records",["safety"]],["audit",["safety","production","maintenance","records"]],["secretary",["audit"]]]
};
const FLAGS={THIEU_CHUNG_TU:"Hồ sơ thiếu chứng từ, cần bổ sung",CHO_PHE_DUYET:"Đang chờ phê duyệt theo thẩm quyền",CHO_THUC_HIEN:"Được duyệt nhưng chưa hoàn tất",CHENH_LECH_NHO:"Có sai lệch cần đối chiếu",VUOT_DU_TOAN:"Giá trị đề nghị vượt dự toán",CHENH_TIEN_DO:"Tiến độ chậm so với kế hoạch"};
const F=["MÃ_HỒ_SƠ","TÊN_HỒ_SƠ","LĨNH_VỰC","THÁNG","NĂM","ĐƠN_VỊ","NHÂN_VIÊN_GIẢ","LOẠI_KHOẢN_MỤC","GIÁ_TRỊ_ĐỀ_NGHỊ","DỰ_TOÁN_HỒ_SƠ","GIÁ_TRỊ_ĐÃ_DUYỆT","GIÁ_TRỊ_ĐÃ_XỬ_LÝ","GIÁ_TRỊ_ĐÃ_THANH_TOÁN","TRẠNG_THÁI","CỜ_KIỂM_TRA"];
const KEY="cty-ai-32-360-v2",blank=()=>({version:322,runs:{},tasks:[],events:[],custom:[]});
let db=blank(),M=null,selected="",view="overview",agent="audit",qrows=[],busy=false,cache=new Map(),filter={text:"",domain:"",month:"",status:""};
try{const x=JSON.parse(localStorage.getItem(KEY)||"null");if(x&&x.version===322&&x.runs&&Array.isArray(x.events))db=x}catch(e){}
function toast(msg){$("toast").textContent=msg;$("toast").hidden=false;clearTimeout(window.ctyTimer);window.ctyTimer=setTimeout(()=>$("toast").hidden=true,4000)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){toast("Bộ nhớ đầy. Hãy xuất bản sao lưu.")}}
function cases(){return (M?M.cases:[]).concat(db.custom||[])}
function byId(id){return cases().find(c=>c.id===id)}
function state(c){return db.runs[c.id]||(db.runs[c.id]={status:"new",results:{},parsed:null,finished:false,review:""})}
function event(c,type,from,to,description,source){db.events.push({caseId:c.id,type,from,to,description,source:source||null,time:new Date().toISOString()})}
function field(raw,k){const t=raw.split(/\r?\n/).find(x=>x.startsWith(k+":"));return t?t.slice(k.length+1).trim():""}
function parse(raw){const values={};for(const name of F)values[name]=field(raw,name);
const N=n=>{let x=values[n];return x!==""&&/^-?\d+(\.\d+)?$/.test(x)?Number(x):NaN};
return{id:values["MÃ_HỒ_SƠ"],title:values["TÊN_HỒ_SƠ"],domain:values["LĨNH_VỰC"],month:N("THÁNG"),year:N("NĂM"),dept:values["ĐƠN_VỊ"],owner:values["NHÂN_VIÊN_GIẢ"],type:values["LOẠI_KHOẢN_MỤC"],proposed:N("GIÁ_TRỊ_ĐỀ_NGHỊ"),budget:N("DỰ_TOÁN_HỒ_SƠ"),approved:N("GIÁ_TRỊ_ĐÃ_DUYỆT"),processed:N("GIÁ_TRỊ_ĐÃ_XỬ_LÝ"),paid:N("GIÁ_TRỊ_ĐÃ_THANH_TOÁN"),status:values["TRẠNG_THÁI"],flag:values["CỜ_KIỂM_TRA"],projectId:field(raw,"MÃ_DỰ_ÁN")||null,projectName:field(raw,"TÊN_DỰ_ÁN")||null,projectBudget:Number(field(raw,"TỔNG_MỨC_DỰ_ÁN")||0),progressPlan:Number(field(raw,"TIẾN_ĐỘ_KẾ_HOẠCH")||0),progressActual:Number(field(raw,"TIẾN_ĐỘ_THỰC_HIỆN")||0),kwhActual:Number(field(raw,"ĐIỆN_NĂNG_THỰC_HIỆN")||0),revenue:Number(field(raw,"DOANH_THU_DIEN")||0),lines:raw.split(/\r?\n/).length}}
function validate(c,p){let error=[];if(p.id!==c.id||!p.title)error.push("Mã hoặc tên hồ sơ không khớp");if(!FLOW[p.domain])error.push("Lĩnh vực chưa hỗ trợ");if(p.year!==2026||!Number.isInteger(p.month)||p.month<1||p.month>12)error.push("Kỳ không hợp lệ");if(!["CLOSED","APPROVED","PENDING","REVIEW"].includes(p.status))error.push("Trạng thái không hợp lệ");
for(const k of ["proposed","budget","approved","processed","paid"])if(!Number.isFinite(p[k])||p[k]<0)error.push("Trường số "+k+" không hợp lệ");
if(p.approved>p.proposed+.00001||p.processed>p.approved+.00001||p.paid>p.processed+.00001)error.push("Thứ tự số đề nghị/duyệt/xử lý/thanh toán sai");
if(p.status!=="CLOSED"&&p.processed!==0)error.push("Hồ sơ chưa CLOSED nhưng có giá trị xử lý");
if(c.local&&p.domain==="project"&&(!p.projectId||!p.projectName||!(p.projectBudget>0)))error.push("Hồ sơ dự án nhập ngoài cần MÃ_DỰ_ÁN, TÊN_DỰ_ÁN, TỔNG_MỨC_DỰ_ÁN");if(!c.local){for(const k of ["domain","month","year","proposed","approved","processed","status"]){if(typeof p[k]==="number"?Math.abs(p[k]-c[k])>.00001:p[k]!==c[k])error.push("Sai lệch manifest: "+k)}}
return error}
function getEvidence(c,name){const x=cache.get(c.id);if(!x)return null;const rows=x.raw.split(/\r?\n/),i=rows.findIndex(v=>v.startsWith(name+":"));return i<0?null:{file:c.path||"TXT nhập",line:i+1,text:rows[i]}}
async function read(c){if(cache.has(c.id))return cache.get(c.id);let raw;
if(c.local)raw=c.sourceText;else{let response=await fetch(c.path,{cache:"no-cache"});if(!response.ok)throw Error("Không tải được "+c.path+" (HTTP "+response.status+")");raw=await response.text()}
if(raw.length<250)throw Error("Tệp TXT quá ngắn");const p=parse(raw),err=validate(c,p);if(err.length)throw Error(err.join("; "));
const d={raw,p};cache.set(c.id,d);event(c,"INGEST","TXT","Điều phối","Đọc và đối chiếu "+p.lines+" dòng trong tệp "+(c.path||"TXT cục bộ"),{file:c.path||"local",line:2});return d}
function next(c){let s=state(c);return FLOW[c.domain].find(([id,deps])=>!s.results[id]&&deps.every(d=>s.results[d]))}
function issue(c,code,fieldName,detail){return {code,text:detail||FLAGS[code]||code,evidence:getEvidence(c,fieldName||"CỜ_KIỂM_TRA")}}
function doAgent(c,d){const node=next(c);if(!node)return false;
const [id,deps]=node,s=state(c),p=d.p;for(const from of deps)event(c,"HANDOFF",from,id,"Bàn giao kết quả "+AN[from]+" → "+AN[id]);
let findings=[],comment="";
if(id==="audit"){let list=Object.values(s.results).flatMap(r=>r.findings||[]);findings=list.filter((v,i)=>list.findIndex(x=>x.code===v.code)===i);comment="Kiểm soát chéo "+Object.keys(s.results).length+" báo cáo, "+findings.length+" vấn đề."}
else if(id==="secretary"){findings=s.results.audit?.findings||[];comment="Tổng hợp hồ sơ, tạo đầu việc từ các cảnh báo và chuyển người phụ trách.";for(const f of findings){const tid=c.id+":"+f.code;if(!db.tasks.some(t=>t.id===tid)){db.tasks.push({id:tid,caseId:c.id,title:f.text,owner:c.owner,done:false});event(c,"TASK","secretary",c.owner,f.text,f.evidence)}}
if(["PENDING","APPROVED"].includes(p.status)){let tid=c.id+":WAIT";if(!db.tasks.some(t=>t.id===tid)){db.tasks.push({id:tid,caseId:c.id,title:"Theo dõi hồ sơ chưa hoàn tất: "+p.status,owner:c.owner,done:false});event(c,"TASK","secretary",c.owner,"Theo dõi trạng thái chưa xử lý")}}}
else{
const allowed={finance:["finance","accounting","legal"],production:["production","finance","safety"],procurement:["procurement","legal","accounting"],project:["project","finance","legal"],maintenance:["maintenance","finance","safety"],hr:["hr","accounting","legal"],governance:["records","legal"],safety:["safety","records"]}[c.domain]||[];
if(p.flag!=="KHONG"&&p.flag!=="CHENH_LECH_NHO"&&allowed.includes(id)&&((p.flag==="THIEU_CHUNG_TU"&&["accounting","procurement","project","maintenance","hr","records","safety"].includes(id))||(p.flag==="CHO_PHE_DUYET"&&["legal","records"].includes(id))||(p.flag==="CHO_THUC_HIEN"&&id==="finance")))findings.push(issue(c,p.flag));
if(p.flag==="CHENH_LECH_NHO"&&["production","finance","maintenance","records"].includes(id))findings.push(issue(c,p.flag));
if(p.proposed>p.budget+.00001&&["finance","procurement","project"].includes(id))findings.push(issue(c,"VUOT_DU_TOAN","DỰ_TOÁN_HỒ_SƠ","Số đề nghị "+num(p.proposed)+" triệu vượt dự toán "+num(p.budget)+" triệu."));
if(id==="project"&&c.progressActual!=null&&c.progressPlan!=null&&c.progressActual<c.progressPlan-6)findings.push(issue(c,"CHENH_TIEN_DO","TRẠNG_THÁI","Tiến độ mẫu "+c.progressActual+"% dưới kế hoạch "+c.progressPlan+"%."));
comment=findings.length?"Ghi nhận "+findings.length+" cảnh báo kèm nguồn TXT.":"Đã đối chiếu bộ quy tắc mô phỏng, không tự kết luận tính hợp pháp.";
}
s.results[id]={id,deps,findings,comment,at:new Date().toISOString()};event(c,"AGENT",id,"Hồ sơ",comment);
for(let f of findings)event(c,"FINDING",id,"audit",f.text,f.evidence);
if(!next(c)){s.parsed=p;s.finished=true;s.status={CLOSED:"closed",APPROVED:"pending",PENDING:"pending",REVIEW:"review"}[p.status];event(c,"DECISION","TXT giả định","Con người",p.status+" – dữ liệu quyết định có sẵn trong TXT; chưa có ký duyệt thực.");}
else s.status="running";return true}
async function runCase(c,single){try{const d=await read(c);if(state(c).finished&&!single)return true;let n=0;if(single)doAgent(c,d);else while(next(c)){doAgent(c,d);if(++n>20)throw Error("Agent chạy quá giới hạn");}save();return true}
catch(e){let s=state(c);s.status="failed";s.finished=false;s.parsed=null;event(c,"ERROR","Loader","Người kiểm tra",e.message);save();return false}}
async function runAll(){if(busy||!M)return;busy=true;let queue=cases().filter(c=>!state(c).finished),pos=0,done=0,failed=0;
$("progressNote").textContent="Đang đọc tệp TXT và xử lý hồ sơ…";
async function worker(){while(pos<queue.length){let c=queue[pos++],ok=await runCase(c,false);done++;if(!ok)failed++;if(done%20===0||done===queue.length){$("progressNote").textContent="Hoàn tất "+done+"/"+queue.length+" hồ sơ mới; lỗi "+failed+".";let ready=cases().filter(c=>state(c).finished).length;$("progressCount").textContent=ready+"/"+cases().length;$("progressBar").style.width=(ready/cases().length*100)+"%";await Promise.resolve()}}}
await Promise.all(Array.from({length:Math.min(12,queue.length||1)},()=>worker()));busy=false;save();render();toast("Đã chạy "+done+" hồ sơ, lỗi "+failed+". Mở Báo cáo chi phí hoặc Dự án.");}
function valid(domain){return cases().filter(c=>(!domain||c.domain===domain)&&state(c).finished&&state(c).parsed&&state(c).parsed.year===2026&&state(c).parsed.month<=10)}
function total(arr,key){return arr.reduce((sum,c)=>sum+(state(c).parsed?.[key]||0),0)}
function count(domain){return cases().filter(c=>!domain||c.domain===domain).length}
function coverage(domain){return valid(domain).length+"/"+count(domain)}
function statusName(c){return{new:"Chưa chạy",running:"Đang xử lý",closed:"Đã xử lý",pending:"Chờ hoàn tất",review:"Cần bổ sung",failed:"Lỗi TXT"}[state(c).status]||"Chưa chạy"}
function pill(c){return '<span class="pill '+(state(c).status==="closed"?"ok":["review","failed"].includes(state(c).status)?"warn":"")+'">'+E(statusName(c))+'</span>'}
function metric(target,list){$(target).innerHTML=list.map(([key,v])=>'<div class="metric"><span>'+E(key)+'</span><strong>'+E(v)+'</strong></div>').join("")}
function table(rows){return '<table>'+rows.map((r,i)=>'<tr>'+r.map(v=>(i?'<td>':'<th>')+E(v)+(i?'</td>':'</th>')).join("")+'</tr>').join("")+'</table>'}
function domainRows(){return M.domains.map(d=>{let a=valid(d.key);return[d.name,a.length,count(d.key),total(a,"proposed"),total(a,"processed"),a.filter(c=>state(c).parsed.status==="CLOSED").length]})}
function financeMonths(){return Array.from({length:10},(_,i)=>{let v=valid("finance").filter(c=>state(c).parsed.month===i+1);return[i+1,v.length,total(v,"proposed"),total(v,"approved"),total(v,"processed"),total(v,"paid")]})}
function financeTypes(){let map={};for(let c of valid("finance")){let k=state(c).parsed.type||"Khác";if(!map[k])map[k]=[k,0,0,0];map[k][1]++;map[k][2]+=state(c).parsed.proposed;map[k][3]+=state(c).parsed.processed}return Object.values(map).sort((a,b)=>b[3]-a[3])}
function projectRows(){let all=M.projects.slice();for(let c of db.custom.filter(x=>x.domain==="project"))if(c.projectId&&!all.some(p=>p.id===c.projectId))all.push({id:c.projectId,name:c.projectName,budget:c.projectBudget});return all.map(p=>{let a=valid("project").filter(c=>c.projectId===p.id);let latest=a.slice().sort((x,y)=>y.month-x.month||Number(y.serial||0)-Number(x.serial||0))[0];return[p.id,p.name,p.budget,a.length,total(a,"proposed"),total(a,"processed"),total(a,"paid"),latest?.progressPlan??null,latest?.progressActual??null]})}
function coverageMessage(domain){return"Đã đọc, xác minh TXT "+coverage(domain)+" hồ sơ. Đây là số liệu giả định. Hồ sơ chưa đọc không được cộng vào báo cáo; hoàn tất mẫu khi đạt "+count(domain)+"/"+count(domain)+"."}
function renderDashboard(){let v=valid(),ready=cases().filter(c=>state(c).finished).length;
metric("mainMetrics",[["Hồ sơ",cases().length],["Đã đối chiếu",ready+"/"+cases().length],["CLOSED",v.filter(c=>state(c).parsed.status==="CLOSED").length],["Cần bổ sung",cases().filter(c=>state(c).status==="review").length],["Việc chưa hoàn thành",db.tasks.filter(t=>!t.done).length]]);
$("progressCount").textContent=ready+"/"+cases().length;$("progressBar").style.width=(ready/cases().length*100)+"%";
$("domainSummary").innerHTML=M.domains.map(d=>'<div class="barrow"><span>'+E(d.name)+'</span><div class="bar"><i style="width:'+(valid(d.key).length/count(d.key)*100)+'%"></i></div><b>'+valid(d.key).length+'/45</b></div>').join("");
let risk=cases().filter(c=>["review","failed"].includes(state(c).status)).slice(0,8);
$("priority").innerHTML=risk.map(c=>'<button class="case" data-open="'+E(c.id)+'"><span><b>'+E(c.title)+'</b><small>'+E(c.id)+'</small></span>'+pill(c)+'</button>').join("")||'<p>Chưa có dữ liệu cảnh báo. Hãy chạy bộ hồ sơ.</p>'}
function renderCaseList(){let list=cases().filter(c=>(!filter.text||(c.id+" "+c.title+" "+c.owner+" "+c.type).toLowerCase().includes(filter.text))&&(!filter.domain||c.domain===filter.domain)&&(!filter.month||c.month===Number(filter.month))&&(!filter.status||state(c).status===filter.status));
$("casesCount").textContent=list.length+" hồ sơ";$("caseList").innerHTML=list.map(c=>'<button class="case '+(selected===c.id?"active":"")+'" data-open="'+E(c.id)+'"><span><b>'+E(c.title)+'</b><small>'+E(c.id)+" · "+E(c.owner)+'</small></span>'+pill(c)+'</button>').join("")||'<p class="muted">Không có hồ sơ phù hợp.</p>'}
function renderCase(){const c=byId(selected);if(!c)return;let s=state(c),d=cache.get(c.id),p=s.parsed||c;
$("caseDetail").innerHTML='<div class="pair top"><div><small>'+E(c.id)+' · '+E(c.domainName)+'</small><h2>'+E(c.title)+'</h2></div>'+pill(c)+'</div><div class="info-grid">'+[["Người phụ trách",c.owner],["Tháng",c.month+"/2026"],["Đề nghị",num(c.proposed)+" triệu"],["Đã xử lý",s.parsed?num(s.parsed.processed)+" triệu":"Chưa xác minh"],["Trạng thái TXT",c.status],["Agent hoàn thành",Object.keys(s.results).length+"/"+FLOW[c.domain].length]].map(x=>'<div class="infobox"><small>'+E(x[0])+'</small><b>'+E(x[1])+'</b></div>').join("")+'</div><div class="actions"><button data-case="read">Đọc TXT</button><button data-case="step" class="ghost">Chạy 1 Agent</button><button data-case="run">Chạy toàn bộ</button><button data-case="download" class="ghost">Tải TXT</button><button data-case="export" class="ghost">Xuất biên bản</button><button data-case="redo" class="danger">Làm lại</button></div><label>Nhận xét của người phụ trách (demo)</label><textarea id="reviewInput">'+E(s.review)+'</textarea><button data-case="review" class="ghost">Ghi nhận</button>';
$("fileStatus").textContent=d?"Đã đọc "+d.p.lines+" dòng từ "+(c.path||"TXT cục bộ"):"Chưa tải tệp trong phiên hiện tại.";
$("fileViewer").innerHTML=d?d.raw.split(/\r?\n/).map((x,i)=>'<span class="ln"><i>'+(i+1)+'</i><span>'+E(x)+'</span></span>').join(""):"Chọn “Đọc TXT” để xem nội dung.";
$("caseAgentResults").innerHTML=FLOW[c.domain].map(([id,deps])=>{let r=s.results[id];return '<div class="event '+(r?.findings?.length?"error":"")+'"><b>'+E(AN[id])+(r?" ✓":" ○")+'</b><span>'+E(r?.comment||"Chờ kết quả: "+(deps.map(x=>AN[x]).join(", ")||"đầu vào TXT"))+'</span>'+(r?.findings||[]).map(f=>'<div class="issue"><b>'+E(f.text)+'</b><small>TXT dòng '+(f.evidence?.line||"?")+": "+E(f.evidence?.text||"")+'</small></div>').join("")+'</div>'}).join("");
$("caseLog").innerHTML=db.events.filter(e=>e.caseId===c.id).slice(-35).reverse().map(e=>'<div class="event"><b>'+E(e.type)+' · '+E(e.from)+' → '+E(e.to)+'</b><span>'+E(e.description)+'</span><small>'+new Date(e.time).toLocaleString("vi-VN")+'</small></div>').join("")}
function renderFinance(){let f=valid("finance"),months=financeMonths(),types=financeTypes();
$("finCoverage").textContent=coverageMessage("finance");
metric("financeMetrics",[["Đã đối chiếu",coverage("finance")],["Tổng đề nghị",num(total(f,"proposed"))+" triệu"],["Đã duyệt",num(total(f,"approved"))+" triệu"],["Đã xử lý",num(total(f,"processed"))+" triệu"],["Đã thanh toán",num(total(f,"paid"))+" triệu"]]);
$("financeMonths").innerHTML=table([["Tháng","Số hồ sơ","Đề nghị","Duyệt","Xử lý","Thanh toán"],...months.map(x=>x.map((v,i)=>i<2?v:num(v))),["TỔNG",f.length,num(total(f,"proposed")),num(total(f,"approved")),num(total(f,"processed")),num(total(f,"paid"))]]);
let max=Math.max(1,...types.map(x=>x[3]));
$("financeCategories").innerHTML=types.map(x=>'<div class="barrow"><span>'+E(x[0])+'</span><div class="bar"><i style="width:'+(x[3]/max*100)+'%"></i></div><b>'+num(x[3])+'</b></div>').join("")||'<p>Chưa đối chiếu hồ sơ.</p>';
$("financeCases").innerHTML=table([["Mã","Tháng","Khoản mục","Đề nghị","Đã xử lý","Trạng thái"],...f.slice().sort((a,b)=>a.month-b.month).map(c=>[c.id,c.month,c.type,num(state(c).parsed.proposed),num(state(c).parsed.processed),statusName(c)])])}
function renderProjects(){let rows=projectRows(),f=valid("project"),bud=rows.reduce((s,p)=>s+p[2],0);
$("projectCoverage").textContent=coverageMessage("project");
metric("projectMetrics",[["Dự án",rows.length],["Đã đọc",coverage("project")],["Tổng vốn dự kiến",num(bud)+" triệu"],["Đã xử lý",num(total(f,"processed"))+" triệu"],["Chờ xử lý",num(total(f,"proposed")-total(f,"processed"))+" triệu"]]);
$("projectCards").innerHTML=rows.map(r=>'<div class="panel"><div class="pair"><b>'+E(r[1])+'</b><span class="pill">'+r[3]+'/'+cases().filter(c=>c.projectId===r[0]).length+' hồ sơ</span></div><div class="info-grid">'+[["Tổng mức",num(r[2])+" triệu"],["Đề nghị",num(r[4])+" triệu"],["Giải ngân",num(r[5])+" triệu"],["Đã thanh toán",num(r[6])+" triệu"]].map(x=>'<div class="infobox"><small>'+E(x[0])+'</small><b>'+E(x[1])+'</b></div>').join("")+'</div><p class="small muted">Tiến độ từ hồ sơ đã đọc mới nhất: kế hoạch '+(r[7]??"—")+"% – thực hiện "+(r[8]??"—")+'%. Chỉ số giả.</p></div>').join("");
$("projectCases").innerHTML=table([["Mã","Dự án","Tháng","Hạng mục","Đề nghị","Đã xử lý","Trạng thái"],...f.map(c=>[c.id,c.projectId,c.month,c.type,num(state(c).parsed.proposed),num(state(c).parsed.processed),statusName(c)])])}
function renderReports(){let v=valid(),prod=valid("production").filter(c=>state(c).parsed.status==="CLOSED");
$("allCoverage").textContent="Đã xác minh "+v.length+"/"+cases().length+" TXT, kỳ đến 31/10/2026. Giá trị chỉ là mô phỏng.";
$("domainReport").innerHTML=table([["Lĩnh vực","Đã đọc","Tổng","Đề nghị triệu","Đã xử lý triệu","CLOSED"],...domainRows().map(r=>[r[0],r[1],r[2],num(r[3]),num(r[4]),r[5]])]);
$("allCasesTable").innerHTML=table([["Mã","Lĩnh vực","Tháng","Đề nghị","Đã xử lý","Kết quả"],...v.map(c=>[c.id,c.domainName,c.month,num(state(c).parsed.proposed),num(state(c).parsed.processed),statusName(c)])]);
$("customDomainReport").innerHTML='<div class="info-grid">'+[["Sản lượng mẫu",num(prod.reduce((s,c)=>s+Number(c.kwhActual||0),0))+" kWh"],["Doanh thu điện mẫu",num(prod.reduce((s,c)=>s+Number(c.revenue||0),0))+" triệu"],["Chi phí bảo trì đã xử lý",num(total(valid("maintenance"),"processed"))+" triệu"],["Mua sắm đã xử lý",num(total(valid("procurement"),"processed"))+" triệu"],["Nhân sự đã xử lý",num(total(valid("hr"),"processed"))+" triệu"],["Hồ sơ quản trị đã đọc",valid("governance").length],["Hồ sơ an toàn đã đọc",valid("safety").length],["Chi phí dự án",num(total(valid("project"),"processed"))+" triệu"]].map(x=>'<div class="infobox"><small>'+E(x[0])+'</small><b>'+E(x[1])+'</b></div>').join("")+'</div><p class="muted tiny">Không cộng ngang các lĩnh vực khi chưa loại trừ ghi nhận trùng. Chỉ báo cáo từng lĩnh vực.</p>'}
function renderAgents(){$("agents").innerHTML=AG.map(([id,name])=>'<button class="agent '+(agent===id?"selected":"")+'" data-agent="'+id+'"><b>'+E(name)+'</b><small>'+cases().filter(c=>state(c).results[id]).length+' lần xử lý</small></button>').join("");
$("agentTitle").textContent="Agent "+AN[agent];let incoming=[],outgoing=[];
for(let [domain,nodes] of Object.entries(FLOW))for(let [id,deps] of nodes){if(id===agent)for(let d of deps)incoming.push(AN[d]+" → "+AN[id]+" ("+domain+")");if(deps.includes(agent))outgoing.push(AN[agent]+" → "+AN[id]+" ("+domain+")")}
$("agentDetail").innerHTML='<h3>Nhận dữ liệu</h3>'+[...new Set(incoming)].map(x=>'<div class="event">'+E(x)+'</div>').join("")+'<h3>Bàn giao</h3>'+[...new Set(outgoing)].map(x=>'<div class="event">'+E(x)+'</div>').join("");
$("genericSteps").innerHTML=["Tiếp nhận và kiểm tra TXT","Trưởng bộ phận rà đề nghị","Agent chuyên môn chạy song song","Đối chiếu chéo kết quả","Trạng thái phê duyệt giả định","Hoàn tất nghiệp vụ và tổng hợp số tiền","Thư ký lập báo cáo và đầu việc"].map((x,i)=>'<div class="step"><strong>B'+(i+1)+" "+E(x)+'</strong></div>').join("")}
function renderTasks(){$("taskCount").textContent=db.tasks.filter(t=>!t.done).length+" việc chưa xong / "+db.tasks.length+" việc";
$("tasks").innerHTML=db.tasks.slice().sort((a,b)=>Number(a.done)-Number(b.done)).map(t=>'<label class="task"><input type="checkbox" data-task="'+E(t.id)+'" '+(t.done?"checked":"")+'><span><b>'+E(t.title)+'</b><small>'+E(t.caseId)+" · "+E(t.owner)+'</small></span></label>').join("")||'<p>Chưa có công việc.</p>'}
function renderPeople(){$("executives").innerHTML=M.executives.map(p=>'<div class="person"><b>'+E(p.name)+'</b><small>'+E(p.role)+" giả định"+'</small></div>').join("");
$("org").innerHTML=M.departments.map(d=>'<div class="orgbox"><b>'+E(d.name)+'</b><small>'+E(d.manager)+" · "+E(d.position)+'</small>'+d.staff.map(n=>'<div class="person">'+E(n)+'<small>Nhân viên giả</small></div>').join("")+'</div>').join("")}
function renderLogs(){let type=$("logType").value,term=$("logSearch").value.toLowerCase(),items=db.events.filter(e=>(!type||e.type===type)&&(!term||e.caseId.toLowerCase().includes(term)));
$("logCount").textContent=items.length+" sự kiện";$("logsList").innerHTML=items.slice(-200).reverse().map(e=>'<div class="event '+(e.type==="ERROR"?"error":"")+'"><b>'+E(e.caseId)+" · "+E(e.type)+" "+E(e.from)+" → "+E(e.to)+'</b><span>'+E(e.description)+'</span><small>'+new Date(e.time).toLocaleString("vi-VN")+'</small></div>').join("")}
function render(){if(!M)return;renderDashboard();renderCaseList();renderCase();renderFinance();renderProjects();renderReports();renderAgents();renderTasks();renderPeople();renderLogs()}
function show(tab){view=tab;document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("selected",b.dataset.tab===tab));document.querySelectorAll(".page").forEach(p=>p.hidden=p.id!=="p-"+tab);render();window.scrollTo({top:0,behavior:"smooth"})}
function csv(rows){return "\ufeff"+rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\r\n")}
function download(name,content,mime){let b=new Blob([content],{type:mime||"text/plain;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function reportRows(type){if(type==="finance")return[["Tháng","Số hồ sơ","Đề nghị","Đã duyệt","Đã xử lý","Thanh toán"],...financeMonths()];if(type==="projects")return[["Mã","Dự án","Ngân sách","Hồ sơ","Đề nghị","Đã xử lý","Thanh toán","KH %","TH %"],...projectRows()];if(type==="domains")return[["Lĩnh vực","Đã đọc","Tổng hồ sơ","Đề nghị","Đã xử lý","CLOSED"],...domainRows()];if(type==="tasks")return[["Mã","Người","Nhiệm vụ","Hoàn thành"],...db.tasks.map(t=>[t.caseId,t.owner,t.title,t.done])];if(type==="logs")return[["Mã","Loại","Từ","Đến","Nội dung","Lúc"],...db.events.map(e=>[e.caseId,e.type,e.from,e.to,e.description,e.time])];return qrows}
function query(q){let s=String(q||"").toLowerCase(),rows=[["Chỉ tiêu","Giá trị","Nguồn"]],note="";
if(s.includes("chi phí")&&s.includes("cao nhất"))rows=[["Khoản mục","Đã xử lý triệu","Hồ sơ"],...financeTypes().map(x=>[x[0],num(x[3]),x[1]])];
else if(s.includes("chi phí")&&s.includes("tháng"))rows=reportRows("finance");
else if(s.includes("chi phí")||s.includes("tổng chi"))rows=[["Chi phí đã xử lý",num(total(valid("finance"),"processed"))+" triệu","TCKT, "+coverage("finance")+" TXT"],["Đã phê duyệt",num(total(valid("finance"),"approved"))+" triệu","TXT đã xác minh"],["Đã thanh toán",num(total(valid("finance"),"paid"))+" triệu","TXT đã xác minh"]];
else if(s.includes("dự án")||s.includes("giải ngân"))rows=reportRows("projects");
else if(s.includes("sản lượng")||s.includes("doanh thu")){let x=valid("production").filter(c=>state(c).parsed.status==="CLOSED");rows=[["Sản lượng mẫu",num(x.reduce((a,c)=>a+Number(c.kwhActual||0),0))+" kWh","Các hồ sơ CLOSED"],["Doanh thu mẫu",num(x.reduce((a,c)=>a+Number(c.revenue||0),0))+" triệu","Nguồn manifest TXT đã đối chiếu"]]}
else if(s.includes("bàn giao")||s.includes("agent"))rows=[["Handoff",db.events.filter(e=>e.type==="HANDOFF").length,"Nhật ký"],["Lượt Agent",cases().reduce((a,c)=>a+Object.keys(state(c).results).length,0),"Hồ sơ"]];
else if(s.includes("công việc"))rows=reportRows("tasks");
else if(s.includes("thiếu")||s.includes("chờ")||s.includes("phê duyệt"))rows=[["Hồ sơ","Nội dung","Trạng thái"],...cases().filter(c=>["review","pending"].includes(state(c).status)).slice(0,60).map(c=>[c.id,c.title,statusName(c)])];
else if(s.includes("lĩnh vực")||s.includes("tổng hợp"))rows=reportRows("domains");
else note="Chưa hỗ trợ loại câu hỏi này. Không suy đoán dữ liệu. Hãy thử câu hỏi mẫu.";
qrows=rows;$("answer").innerHTML='<div class="notice">'+E(note||"Kết quả theo số liệu mô phỏng từ các hồ sơ TXT đã đối chiếu, kỳ 01–10/2026.")+'</div><div class="table-scroll">'+table(rows)+'</div>'}
const questions=["Tổng chi phí đã xử lý đến tháng 10?","Chi phí nào cao nhất?","Chi phí theo từng tháng","Báo cáo 5 dự án đầu tư","Dự án nào giải ngân nhiều?","Hồ sơ đang chờ phê duyệt","Hồ sơ nào thiếu chứng từ?","Có bao nhiêu lượt bàn giao Agent?","Báo cáo sản lượng và doanh thu","Các công việc chưa hoàn thành","Báo cáo tổng hợp 8 lĩnh vực"];
function template(){return ["CTY AI 3.2 – MẪU TÌNH HUỐNG TXT GIẢ ĐỊNH","MÃ_HỒ_SƠ: CUSTOM-001","TÊN_HỒ_SƠ: Mua vật tư kiểm tra hồ sơ tháng 10","LĨNH_VỰC: finance","THÁNG: 10","NĂM: 2026","ĐƠN_VỊ: TCKT","NHÂN_VIÊN_GIẢ: Nhân viên thử nghiệm","LOẠI_KHOẢN_MỤC: Vật tư","GIÁ_TRỊ_ĐỀ_NGHỊ: 120","DỰ_TOÁN_HỒ_SƠ: 130","GIÁ_TRỊ_ĐÃ_DUYỆT: 120","GIÁ_TRỊ_ĐÃ_XỬ_LÝ: 120","GIÁ_TRỊ_ĐÃ_THANH_TOÁN: 100","TRẠNG_THÁI: CLOSED","CỜ_KIỂM_TRA: KHONG","","01. PHIẾU ĐỀ NGHỊ","Mô tả tình huống, nơi lập và người chủ trì. Đây chỉ là tài liệu giả.","02. KIỂM TRA DỰ TOÁN","Mô tả dự toán và tài liệu đối chiếu.","03. CHỨNG TỪ GIẢ ĐỊNH","Liệt kê hồ sơ và trạng thái từng chứng từ; không đính kèm tài liệu mật.","04. LUỒNG XỬ LÝ","B1 tiếp nhận, B2 kiểm tra, B3 chuyên môn, B4 kiểm soát chéo, B5 trình duyệt, B6 ghi nhận kết quả, B7 báo cáo.","05. KẾT LUẬN","Ghi kết quả, giá trị đã xử lý và vấn đề cần bổ sung.","Chỉ dùng dữ liệu giả hoặc được phép công khai. Đơn vị tiền: triệu đồng."].join("\n")}
async function importFile(){let f=$("uploadFile").files?.[0];if(!f){toast("Chọn một tệp TXT.");return}if(f.size>150000){toast("TXT vượt 150KB.");return}let raw=await f.text(),p=parse(raw);let c={...p,local:true,sourceText:raw,path:"local:"+f.name,domainName:M.domains.find(x=>x.key===p.domain)?.name||p.domain};
if(!c.id||cases().some(x=>x.id===c.id)){toast("Mã hồ sơ trống hoặc trùng.");return}let errors=validate(c,p);if(errors.length){$("importResult").textContent="Tệp chưa đúng: "+errors.join("; ");return}
db.custom.push(c);selected=c.id;save();await runCase(c,false);$("importResult").textContent="Đã nhập và xử lý "+c.id;show("cases");toast("Đã xử lý TXT vừa nhập ở thiết bị này.")}
async function caseCommand(cmd){const c=byId(selected);if(!c)return;let s=state(c);
if(cmd==="read"){try{await read(c)}catch(e){s.status="failed";event(c,"ERROR","Loader","Người sử dụng",e.message);toast(e.message)}}
if(cmd==="step")await runCase(c,true);
if(cmd==="run")await runCase(c,false);
if(cmd==="redo"){delete db.runs[c.id];db.tasks=db.tasks.filter(t=>t.caseId!==c.id);db.events=db.events.filter(e=>e.caseId!==c.id);await runCase(c,false)}
if(cmd==="review"){s.review=$("reviewInput").value;event(c,"DECISION","Người kiểm tra giả","Thư ký",s.review||"Đã nhận xét")}
if(cmd==="download"){try{download(c.id+".txt",(await read(c)).raw)}catch(e){toast(e.message)}}
if(cmd==="export")download(c.id+"-bien-ban.txt",["CTY AI 3.2 – BIÊN BẢN HỒ SƠ MÔ PHỎNG",c.id,c.title,"Trạng thái: "+statusName(c),"Đã xử lý: "+num(s.parsed?.processed||0)+" triệu",...Object.values(s.results).flatMap(x=>["Agent "+AN[x.id]+": "+x.comment,...x.findings.map(f=>"Cảnh báo: "+f.text+(f.evidence?" (dòng "+f.evidence.line+")":""))]),"Ý kiến: "+(s.review||"Chưa có")].join("\n"));
save();render()}
function act(a){if(a==="runall")runAll();if(a==="sample"){selected=cases()[0].id;show("cases");runCase(cases()[0],false).then(render)}
if(a==="financecsv"||a==="projectcsv"||a==="allcsv"||a==="taskcsv"||a==="logcsv"||a==="querycsv"){const ty={financecsv:"finance",projectcsv:"projects",allcsv:"domains",taskcsv:"tasks",logcsv:"logs",querycsv:"query"}[a];download("CTY-AI-3.2-"+ty+".csv",csv(reportRows(ty)),"text/csv;charset=utf-8")}
if(a==="financetxt")download("CTY-AI-3.2-CHI-PHI-10-THANG.txt",["BÁO CÁO CHI PHÍ GIẢ ĐỊNH ĐẾN 31/10/2026",coverageMessage("finance"),"Chi phí đã xử lý: "+num(total(valid("finance"),"processed"))+" triệu","Theo tháng:",...financeMonths().map(r=>"Tháng "+r[0]+": "+num(r[4])+" triệu"),"Theo khoản mục:",...financeTypes().map(r=>r[0]+": "+num(r[3])+" triệu"),"Không phải BCTC thật."].join("\n"));
if(a==="alljson")download("CTY-AI-3.2-report.json",JSON.stringify({coverage:valid().length,domains:domainRows(),financeMonths:financeMonths(),projects:projectRows()},null,2),"application/json");
if(a==="print")window.print();if(a==="ask")query($("question").value);if(a==="template")download("CTY-AI-3.2-MAU-TXT.txt",template());if(a==="import")importFile();
if(a==="backup")download("CTY-AI-3.2-backup.json",JSON.stringify(db,null,2),"application/json");
if(a==="reset"&&confirm("Xóa toàn bộ trạng thái demo, hồ sơ TXT nhập và log trên thiết bị này?")){db=blank();cache.clear();selected=M.cases[0].id;save();render()}}
function click(e){let b=e.target.closest("button");if(!b)return;if(b.dataset.tab){show(b.dataset.tab);return}if(b.dataset.open){selected=b.dataset.open;show("cases");return}if(b.dataset.agent){agent=b.dataset.agent;renderAgents();return}if(b.dataset.case){caseCommand(b.dataset.case);return}if(b.dataset.ask){$("question").value=b.dataset.ask;query(b.dataset.ask);return}if(b.dataset.action)act(b.dataset.action)}
async function boot(){try{let response=await fetch("manifest.json",{cache:"no-cache"});if(!response.ok)throw Error("HTTP "+response.status);M=await response.json();
if(M.cases?.length!==360||M.domains?.length!==8||M.domains.some(d=>M.cases.filter(c=>c.domain===d.key).length!==45))throw Error("Không đủ dữ liệu 8 × 45");
selected=M.cases[0].id;
$("caseDomain").innerHTML='<option value="">Tất cả lĩnh vực</option>'+M.domains.map(d=>'<option value="'+E(d.key)+'">'+E(d.name)+'</option>').join("");
$("caseMonth").innerHTML='<option value="">Tất cả tháng</option>'+Array.from({length:10},(_,i)=>'<option value="'+(i+1)+'">Tháng '+(i+1)+'</option>').join("");
$("questions").innerHTML=questions.map(q=>'<button class="case" data-ask="'+E(q)+'">'+E(q)+'</button>').join("");
$("caseSearch").oninput=e=>{filter.text=e.target.value.toLowerCase();renderCaseList()};$("caseDomain").onchange=e=>{filter.domain=e.target.value;renderCaseList()};$("caseMonth").onchange=e=>{filter.month=e.target.value;renderCaseList()};$("caseStatus").onchange=e=>{filter.status=e.target.value;renderCaseList()};
$("tasks").onchange=e=>{let t=db.tasks.find(t=>t.id===e.target.dataset.task);if(t){t.done=e.target.checked;save();renderTasks()}};
$("logType").onchange=renderLogs;$("logSearch").oninput=renderLogs;
$("restoreFile").onchange=async e=>{let f=e.target.files?.[0];if(!f)return;try{if(f.size>6000000)throw Error("Tệp quá lớn");let d=JSON.parse(await f.text());if(d.version!==322||!d.runs||!Array.isArray(d.tasks)||!Array.isArray(d.events)||!Array.isArray(d.custom))throw Error("Sai cấu trúc");if(confirm("Khôi phục thay dữ liệu hiện tại?")){db=d;cache.clear();save();render()}}catch(err){toast(err.message)}};
document.addEventListener("click",click);$("bootAlert").hidden=true;render();
}catch(e){$("bootAlert").textContent="Không tải được danh mục hồ sơ: "+e.message+". Báo cáo không được tạo khi thiếu dữ liệu.";}}
window.CTY32={boot,runAll,runCase,read,parse,validate,cases,state,valid,financeMonths,financeTypes,projectRows,domainRows,getStore:()=>db,render,template};
boot();
})();
