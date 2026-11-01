(function(){"use strict";
const key="cty_ai_33_demo_v1",empty=()=>({version:33,overrides:{},verified:{},events:[],custom:[]});
let db=empty(),manifest=null,cache=new Map(),busy=false;
try{let v=JSON.parse(localStorage.getItem(key)||"null");if(v?.version===33&&v.overrides&&v.verified&&Array.isArray(v.events)&&Array.isArray(v.custom))db=v}catch(e){}
const date=()=>new Date(Date.now()+7*3600000).toISOString().slice(0,10),timestamp=()=>new Date().toISOString();
const copy=o=>JSON.parse(JSON.stringify(o)),fmt=n=>Number(n||0).toLocaleString("vi-VN",{maximumFractionDigits:2});
function save(){try{localStorage.setItem(key,JSON.stringify(db))}catch(e){throw Error("Bộ nhớ cục bộ đầy; hãy xuất bản sao JSON")}}
function init(data){if(data?.cases?.length!==360||data?.domains?.length!==8||data.cases.some(c=>c.workflow?.length!==7))throw Error("Thiếu dữ liệu 360 hồ sơ hoặc quy trình 7 bước");manifest=data}
function all(){return manifest?manifest.cases.concat(db.custom):[]}
function find(id){return all().find(x=>x.id===id)}
function people(){if(!manifest)return[];return[...new Set([...manifest.executives.map(x=>x.name),...manifest.departments.flatMap(d=>[d.manager,...d.staff]),...db.custom.map(c=>c.owner)])].filter(Boolean)}
function defaultSteps(c){if(c.workflow?.length===7)return c.workflow;let s=manifest.departments.find(d=>d.code==="TCKT")?.staff||[],ceo=manifest.executives.find(d=>d.role==="Tổng Giám đốc")?.name||"TGĐ giả",names=["Nhân viên lập dự thảo","Trưởng đơn vị trình","TCKT kiểm soát","TGĐ duyệt","Thực hiện/nghiệm thu","Kế toán ghi nhận","Tổng hợp báo cáo"],actors=[c.owner,c.manager||"Trưởng phòng giả",s.find(x=>x!==c.owner)||"TCKT giả",ceo,c.owner,s[1]||"Kế toán giả",s[2]||"Báo cáo giả"],finish={CLOSED:7,APPROVED:4,PENDING:3,REVIEW:2}[c.status]??2;return names.map((name,i)=>({order:i+1,title:name,actor:actors[i],code:["DRAFT","MANAGER","FINANCE","CEO","EXECUTION","ACCOUNTING","REPORT"][i],status:i<finish?"DONE":i===finish?(c.status==="REVIEW"?"RETURNED":"WAITING"):"NOT_STARTED",datetime:null,formId:"BM"+(i+1)+"-"+c.id}))}
function steps(c){return db.overrides[c.id]?.stages||defaultSteps(c)}
function index(c){let o=db.overrides[c.id];return o&&Number.isInteger(o.currentIndex)?o.currentIndex:steps(c).findIndex(x=>x.status!=="DONE")}
function status(c){let st=steps(c),o=db.overrides[c.id];if(st.every(x=>x.status==="DONE"))return"CLOSED";if(o?.returnTo!=null||st.some(x=>x.status==="RETURNED"))return"REVIEW";if(st[3].status==="DONE")return st[4].status==="DONE"?"IN_PROGRESS":"APPROVED";return"PENDING"}
function holder(c){const i=index(c);return i<0?"—":steps(c)[i].actor}
function phase(c){const i=index(c);return i<0?"Hoàn tất":steps(c)[i].title}
function vals(c){const o=db.overrides[c.id],closed=status(c)==="CLOSED";return {request:c.proposed||0,approved:o?.approved!==undefined?o.approved:c.approved||0,processed:closed?(o?.processed!==undefined?o.processed:c.processed||0):0,paid:closed?(o?.paid!==undefined?o.paid:c.paid||0):0,baseProcessed:c.processed||0,basePaid:c.paid||0}}
function sum(arr,which){return arr.reduce((n,c)=>n+(vals(c)[which]||0),0)}
function baseSum(arr,field){return arr.reduce((n,c)=>n+Number(c[field]||0),0)}
function cases(domain){return all().filter(c=>!domain||c.domain===domain)}
function issues(c){let o=db.overrides[c.id],i=index(c),arr=[];if(status(c)==="REVIEW")arr.push(o?.issue||"Hồ sơ bị trả lại hoặc cần bổ sung chứng từ, giải trình");if(status(c)==="PENDING"&&i===3)arr.push("Chờ Tổng Giám đốc xem xét phê duyệt");if(status(c)==="APPROVED")arr.push("Đã phê duyệt giả định nhưng chưa nghiệm thu");if(status(c)==="IN_PROGRESS")arr.push("Đã triển khai nhưng chưa đủ các bước ghi nhận và báo cáo");if(i>=0&&c.proposed>c.budget)arr.push("Giá trị đề nghị vượt dự toán "+fmt(c.proposed-c.budget)+" triệu");if(o?.note)arr.push(o.note);if(!arr.length&&i>=0)arr.push("Chờ "+holder(c)+" xử lý B"+(i+1));return arr}
function aging(c){let t=steps(c).filter(s=>s.datetime&&s.status==="DONE").at(-1)?.datetime||c.createdAt;let d=t&&Date.parse(t.slice(0,10)+"T00:00:00Z");return d===undefined||!Number.isFinite(d)?null:Math.max(0,Math.round((Date.parse(date()+"T00:00:00Z")-d)/86400000))}
function log(c,type,from,to,note,step=null,amount=null){db.events.push({caseId:c.id,type,from:from||"",to:to||"",note:note||"",step,amount,at:timestamp(),date:date()})}
function field(raw,k){let line=raw.split(/\r?\n/).find(x=>x.startsWith(k+":"));return line?line.slice(k.length+1).trim():""}
function checkSource(c,raw){let errors=[];if(!raw||raw.length<250)errors.push("Tệp quá ngắn");if(field(raw,"MÃ_HỒ_SƠ")!==c.id)errors.push("Mã hồ sơ không trùng");if(field(raw,"TÊN_HỒ_SƠ")!==c.title)errors.push("Tên hồ sơ không trùng");if(field(raw,"LĨNH_VỰC")!==c.domain)errors.push("Lĩnh vực sai");if(Number(field(raw,"THÁNG"))!==c.month)errors.push("Tháng sai");
for(let [k,v] of [["GIÁ_TRỊ_ĐỀ_NGHỊ",c.proposed],["GIÁ_TRỊ_ĐÃ_DUYỆT",c.approved],["GIÁ_TRỊ_ĐÃ_XỬ_LÝ",c.processed],["GIÁ_TRỊ_ĐÃ_THANH_TOÁN",c.paid]]){let x=Number(field(raw,k));if(!Number.isFinite(x)||Math.abs(x-Number(v||0))>.00001)errors.push("Không khớp "+k)}
if((raw.match(/===== BIỂU MẪU \d{2} \|/g)||[]).length!==7)errors.push("Thiếu 7 biểu mẫu");return errors}
async function verify(c){if(db.verified[c.id]&&cache.has(c.id))return cache.get(c.id);let raw;if(c.local)raw=c.sourceText;else{let r=await fetch("../cty-ai-3-2/"+c.path,{cache:"no-cache"});if(!r.ok)throw Error("HTTP "+r.status+": "+c.path);raw=await r.text()}
let errors=checkSource(c,raw);if(errors.length)throw Error(errors.join("; "));cache.set(c.id,raw);if(!db.verified[c.id])log(c,"VERIFY","TXT","Điều phối","Đối chiếu mã, kỳ, giá trị và 7 biểu mẫu");db.verified[c.id]=true;save();return raw}
async function verifyAll(onProgress){if(busy)return;busy=true;let q=all().filter(c=>!db.verified[c.id]),pos=0,ok=0,fail=0;async function work(){while(pos<q.length){let c=q[pos++];try{await verify(c);ok++}catch(e){fail++;log(c,"ERROR","TXT","Điều phối",e.message)}if((ok+fail)%20===0){save();onProgress?.(ok+fail,q.length,fail)}}}
await Promise.all(Array.from({length:Math.min(10,q.length||1)},()=>work()));busy=false;save();onProgress?.(ok+fail,q.length,fail);return{ok,fail}}
function touch(c){if(!db.overrides[c.id])db.overrides[c.id]={stages:copy(defaultSteps(c)),currentIndex:index(c),returnTo:null,approved:c.approved||0,processed:c.processed||0,paid:c.paid||0,issue:"",note:"",updatedAt:timestamp()};return db.overrides[c.id]}
async function act(id,kind,arg={}){
const c=find(id);if(!c)throw Error("Không thấy hồ sơ");
if(kind==="reset"){delete db.overrides[id];log(c,"RESET",arg.actor||"Điều phối demo","Kịch bản gốc",arg.note||"Khôi phục trạng thái mô phỏng");save();return true}
await verify(c);const idx=index(c),s=steps(c),current=s[idx];if(idx<0&&kind!=="comment")throw Error("Hồ sơ đã hoàn tất");
const actor=arg.actor||current?.actor||"Điều phối demo";if(kind!=="comment"&&actor!==current.actor)throw Error("Hãy chọn đúng người đang được giao tại bước "+(idx+1));
if(["assign","return"].includes(kind)&&!String(arg.note||"").trim())throw Error("Cần ghi rõ lý do chuyển/trả hồ sơ");
if(kind==="assign"&&!arg.to)throw Error("Chọn người nhận việc");
const o=touch(c),st=o.stages,i=o.currentIndex;
if(kind==="comment"){o.note=arg.note||"";log(c,"COMMENT",actor,st[i]?.actor||"Hồ sơ",o.note,i)}
if(kind==="assign"){const from=st[i].actor;st[i].actor=arg.to;o.note=arg.note;log(c,"ASSIGN",from,arg.to,arg.note,i)}
if(kind==="return"){o.issue=arg.note;o.note=arg.note;if(i===0){st[0].status="RETURNED";o.currentIndex=0;log(c,"RETURN",actor,st[0].actor,arg.note,0)}else{st[i].status="RETURNED";st[0].status="WAITING";if(arg.to)st[0].actor=arg.to;o.returnTo=i;o.currentIndex=0;log(c,"RETURN",actor,st[0].actor,arg.note,i)}}
if(kind==="complete"){
 if(i===0&&o.returnTo!==null){const back=o.returnTo;st[0].status="DONE";st[0].datetime=date()+"T08:30:00+07:00";st[back].status="WAITING";o.currentIndex=back;o.returnTo=null;o.issue="";log(c,"RESUBMIT",actor,st[back].actor,arg.note||"Bổ sung và trình lại",0)}
 else{let amount=Number(arg.amount);
 if(i===3){if(!Number.isFinite(amount)||amount<0||amount>c.proposed||(c.proposed>0&&amount===0))throw Error("Số duyệt phải nằm trong (0, đề nghị]");o.approved=amount}
 if(i===4){if(!Number.isFinite(amount)||amount<0||amount>o.approved)throw Error("Nghiệm thu không được vượt số duyệt");o.processed=amount}
 if(i===5){if(!Number.isFinite(amount)||amount<0||amount>o.processed)throw Error("Thanh toán không được vượt nghiệm thu");o.paid=amount}
 const types=["DRAFT","MANAGER","FINANCE","APPROVE","EXECUTE","RECORD","REPORT"],type=types[i];st[i].status="DONE";st[i].datetime=date()+"T"+["08:30","09:45","10:20","11:15","14:05","15:10","16:05"][i]+":00+07:00";
 const next=st.findIndex((x,n)=>n>i&&x.status!=="DONE");if(next>=0){st[next].status="WAITING";o.currentIndex=next}else{o.currentIndex=-1;o.completedAt=timestamp()}
 log(c,type,actor,next>=0?st[next].actor:"Đã lên báo cáo",arg.note||"Hoàn tất bước mô phỏng",i,i===3?o.approved:i===4?o.processed:i===5?o.paid:null)}
}
o.note=arg.note||o.note;o.updatedAt=timestamp();save();return true}
function getForm(c,index){let raw=cache.get(c.id),id=String(index+1).padStart(2,"0");if(raw){let a=raw.indexOf("===== BIỂU MẪU "+id+" |"),e="===== KẾT THÚC BIỂU MẪU "+id+" =====",b=raw.indexOf(e,a);if(a>=0&&b>a)return raw.slice(a,b+e.length)}
let s=steps(c)[index];return "BIỂU MẪU MÔ PHỎNG, CHƯA TẢI NGUỒN TXT\n"+s.formId+"\n"+s.title+"\nNgười xử lý: "+s.actor+"\nTrạng thái: "+s.status+"\nNgày: "+(s.datetime||"Chưa có")}
function projects(){let list=manifest.projects.slice();for(const c of db.custom.filter(x=>x.domain==="project"))if(c.projectId&&!list.some(p=>p.id===c.projectId))list.push({id:c.projectId,name:c.projectName,budget:c.projectBudget});return list.map(p=>{let xs=cases("project").filter(c=>c.projectId===p.id);let latest=xs.slice().sort((a,b)=>b.month-a.month||b.serial-a.serial)[0];return{...p,cases:xs,request:baseSum(xs,"proposed"),baseline:baseSum(xs,"processed"),current:sum(xs,"processed"),paid:sum(xs,"paid"),closed:xs.filter(c=>status(c)==="CLOSED").length,review:xs.filter(c=>status(c)==="REVIEW").length,plan:latest?.progressPlan,actual:latest?.progressActual}})}
function domains(){return manifest.domains.map(d=>{let a=cases(d.key),closed=a.filter(c=>status(c)==="CLOSED").length,review=a.filter(c=>status(c)==="REVIEW").length;return{key:d.key,name:d.name,count:a.length,closed,review,pending:a.length-closed-review,request:baseSum(a,"proposed"),baseline:baseSum(a,"processed"),current:sum(a,"processed"),verified:a.filter(c=>db.verified[c.id]).length}})}
function importTxt(raw){
 let id=field(raw,"MÃ_HỒ_SƠ"),d=field(raw,"LĨNH_VỰC"),domain=manifest.domains.find(x=>x.key===d),n=k=>Number(field(raw,k)),statusSource=field(raw,"TRẠNG_THÁI");
 if(!id||find(id))throw Error("Mã hồ sơ trống hoặc trùng");if(!domain)throw Error("Lĩnh vực chưa hỗ trợ");
 const c={id,domain:d,domainName:domain.name,title:field(raw,"TÊN_HỒ_SƠ"),month:n("THÁNG"),year:n("NĂM"),dept:field(raw,"ĐƠN_VỊ"),owner:field(raw,"NHÂN_VIÊN_GIẢ"),type:field(raw,"LOẠI_KHOẢN_MỤC"),proposed:n("GIÁ_TRỊ_ĐỀ_NGHỊ"),budget:n("DỰ_TOÁN_HỒ_SƠ"),approved:n("GIÁ_TRỊ_ĐÃ_DUYỆT"),processed:n("GIÁ_TRỊ_ĐÃ_XỬ_LÝ"),paid:n("GIÁ_TRỊ_ĐÃ_THANH_TOÁN"),status:statusSource,local:true,sourceText:raw,path:"local:"+id+".txt",manager:manifest.departments.find(x=>x.code===field(raw,"ĐƠN_VỊ"))?.manager||"Trưởng phòng giả"};
 if(!c.title||c.year!==2026||c.month<1||c.month>10||!["PENDING","APPROVED","REVIEW","CLOSED"].includes(c.status))throw Error("Kỳ, tiêu đề hoặc trạng thái không hợp lệ");
 if([c.proposed,c.budget,c.approved,c.processed,c.paid].some(x=>!Number.isFinite(x)||x<0)||c.approved>c.proposed||c.processed>c.approved||c.paid>c.processed||(c.status!=="CLOSED"&&c.processed!==0))throw Error("Giá trị không hợp lệ");
 const errors=checkSource(c,raw);if(errors.length)throw Error(errors.join("; "));
 const hasStages=Boolean(field(raw,"BƯỚC_1_TRẠNG_THÁI"));
 if(hasStages){
 const base=defaultSteps(c);let blocked=false;
 c.workflow=base.map((step,i)=>{
  let n=i+1,st=field(raw,"BƯỚC_"+n+"_TRẠNG_THÁI")||"NOT_STARTED",who=field(raw,"BƯỚC_"+n+"_NGƯỜI")||step.actor,day=field(raw,"BƯỚC_"+n+"_NGÀY");
  if(!["DONE","WAITING","RETURNED","NOT_STARTED"].includes(st))throw Error("Trạng thái B"+n+" không hợp lệ");
  if(blocked&&st==="DONE")throw Error("B"+n+" đã hoàn thành trong khi bước trước chưa hoàn tất");
  if(st!=="DONE")blocked=true;
  if(day&&!/^2026-(0[1-9]|1[0-2])-[0-3][0-9]$/.test(day))throw Error("Ngày B"+n+" sai");
  if(st==="DONE"&&!day)throw Error("B"+n+" đã hoàn tất nhưng chưa có ngày");
  if(st!=="DONE"&&day&&st!=="RETURNED")throw Error("B"+n+" chưa làm nhưng có ngày xử lý");
  return{...step,status:st,actor:who,datetime:day?day+"T09:00:00+07:00":null};
 });
 if(statusSource==="CLOSED"&&c.workflow.some(x=>x.status!=="DONE"))throw Error("CLOSED cần hoàn thành đủ 7 bước");
 if(statusSource!=="CLOSED"&&c.workflow.every(x=>x.status==="DONE"))throw Error("Hồ sơ chưa CLOSED nhưng cả 7 bước đều hoàn tất");
 if(statusSource==="PENDING"&&c.workflow[3].status==="DONE")throw Error("PENDING chưa thể có bước phê duyệt TGĐ DONE");
 if(statusSource==="APPROVED"&&c.workflow[3].status!=="DONE")throw Error("APPROVED phải có bước TGĐ đã duyệt giả");
 }
 db.custom.push(c);db.verified[c.id]=true;cache.set(c.id,raw);log(c,"VERIFY","TXT nhập","Điều phối","Đã nhập hồ sơ giả định");save();return c}
const api={init,get manifest(){return manifest},all,find,people,steps,index,status,holder,phase,vals,cases,sum,baseSum,issues,aging,log,verify,verifyAll,act,getForm,projects,domains,importTxt,get data(){return db},setData(x){if(x.version!==33||!x.overrides||!x.verified||!Array.isArray(x.events)||!Array.isArray(x.custom))throw Error("Sai cấu trúc sao lưu");db=x;cache.clear();save()},reset(){db=empty();cache.clear();save()},save,fmt,date};
window.CTX=api;
})();