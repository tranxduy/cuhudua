(function(){"use strict";
const C=window.CTX,U=window.CTY33UI,$=id=>document.getElementById(id);
const E=x=>String(x??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]));
const f=C.fmt,KEY="cty_ai_33_tasks_v1";
let T={version:1,items:[],serial:0},view={mode:"current",flowDomain:"",flowStatus:"",peopleMode:"current",dept:"",search:"",person:"",taskSearch:"",taskStatus:"open",owner:"",editor:""};
try{let x=JSON.parse(localStorage.getItem(KEY)||"null");if(x?.version===1&&Array.isArray(x.items))T=x}catch(e){}
function persist(){localStorage.setItem(KEY,JSON.stringify(T))}
function notices(msg){$("toast").textContent=msg;$("toast").hidden=false;clearTimeout(window.__ctyOptimer);window.__ctyOptimer=setTimeout(()=>$("toast").hidden=true,3500)}
function logTask(t,type,from,to,message){const stub={id:t.caseId||t.id};C.log(stub,type,from||"",to||"",message||t.title,null);C.save()}
function today(){return C.date()}
function todayDue(d,compare=today()){return Boolean(d&&d<compare)}
function statuses(mode,c){const stages=mode==="baseline"?(c.workflow||C.steps(c)):C.steps(c);let index=mode==="baseline"?stages.findIndex(x=>x.status!=="DONE"):C.index(c);
 const status=mode==="baseline"?(c.status||"PENDING"):C.status(c);
 return{stages,index,status,holder:index<0?"—":stages[index]?.actor||"—",phase:index<0?"Hoàn tất":stages[index]?.title||"Chưa rõ"}}
function knownPeople(){
 const m=new Map(),depts=C.manifest?.departments||[];
 for(const d of depts){m.set(d.manager,{name:d.manager,dept:d.name||d.code,deptCode:d.code||d.name,role:d.code==="TCKT"?"Kế toán trưởng/Trưởng bộ phận":"Trưởng bộ phận",manager:true});
 for(const name of d.staff)m.set(name,{name,dept:d.name||d.code,deptCode:d.code||d.name,role:"Nhân viên",manager:false})}
 for(const x of C.manifest?.executives||[])m.set(x.name,{name:x.name,dept:"Ban điều hành",deptCode:"EXEC",role:x.role||"Lãnh đạo",manager:true});
 for(const c of C.all())for(const s of C.steps(c)){if(!m.has(s.actor))m.set(s.actor,{name:s.actor,dept:c.dept||"Khác",deptCode:c.dept||"KHAC",role:"Người tham gia hồ sơ",manager:false})}
 for(const t of T.items){if(!m.has(t.owner))m.set(t.owner,{name:t.owner,dept:"Được giao ngoài đơn vị",deptCode:"KHAC",role:"Người được giao nhiệm vụ",manager:false})}
 return[...m.values()].sort((a,b)=>a.dept.localeCompare(b.dept,"vi")||a.name.localeCompare(b.name,"vi"));
}
function assignments(mode){
 let entries=[];
 for(const c of C.all()){let s=statuses(mode,c);
 s.stages.forEach((step,i)=>{
  const done=step.status==="DONE",active=s.index===i,returned=step.status==="RETURNED";
  if(!done&&!active&&!returned) return;
  entries.push({name:step.actor,caseId:c.id,title:c.title,domain:c.domain,domainName:c.domainName,month:c.month,kind:"workflow",step:i+1,stage:step.title,formId:step.formId,stageDate:step.datetime?.slice(0,10)||"",status:done?"DONE":returned?"RETURNED":active?"OPEN":"WAITING",active,done,returned,priority:"normal",due:"",id:c.id+":"+i,case:c});
 });
 }
 if(mode==="current")for(const t of T.items){entries.push({name:t.owner,caseId:t.caseId||"",title:t.title,domain:C.find(t.caseId)?.domain||"other",domainName:C.find(t.caseId)?.domainName||"Nhiệm vụ độc lập",month:Number(t.createdAt?.slice(5,7)||0),kind:"task",step:null,stage:"Nhiệm vụ giao",formId:t.id,stageDate:t.updatedAt?.slice(0,10)||"",status:t.status==="done"?"DONE":"OPEN",active:t.status!=="done",done:t.status==="done",returned:false,priority:t.priority,due:t.due,id:t.id,task:t})}
 return entries;
}
function staffStats(mode){
 const people=knownPeople(),a=assignments(mode),by=new Map();
 for(const p of people)by.set(p.name,{...p,done:0,active:0,returned:0,assigned:0,completedDated:0,dueCount:0,overdue:0,stageWorks:0,taskWorks:0,records:[],teamOpen:0,teamDone:0});
 for(const item of a){if(!by.has(item.name))by.set(item.name,{name:item.name,dept:"Khác",deptCode:"KHAC",role:"Tham gia",manager:false,done:0,active:0,returned:0,assigned:0,completedDated:0,dueCount:0,overdue:0,stageWorks:0,taskWorks:0,records:[],teamOpen:0,teamDone:0});
 let p=by.get(item.name);p.records.push(item);p.assigned++;if(item.done)p.done++;if(item.active)p.active++;if(item.returned)p.returned++;if(item.done&&item.stageDate)p.completedDated++;if(item.kind==="workflow")p.stageWorks++;else p.taskWorks++;if(item.due&&item.active){p.dueCount++;if(todayDue(item.due))p.overdue++}}
 // Compute team counts using own department affiliation of every employee stage, never count manager's signature as the whole team.
 for(const p of by.values())if(p.manager&&p.deptCode!=="EXEC"){
 let team=people.filter(x=>x.deptCode===p.deptCode&&!x.manager).map(x=>x.name);
 p.teamOpen=team.reduce((n,name)=>n+(by.get(name)?.active||0),0);
 p.teamDone=team.reduce((n,name)=>n+(by.get(name)?.done||0),0);
 }
 return[...by.values()].map(p=>({...p,completion:p.done+p.active?100*p.done/(p.done+p.active):null,
 evidence:p.done?100*p.completedDated/p.done:null,
 conclusion:p.assigned===0?"Chưa có dữ liệu giao việc":p.active>=8?"Khối lượng đang giữ lớn – cần phân tải":p.overdue>0?"Có nhiệm vụ quá hạn đã khai báo":p.done>=5&&p.active<=2?"Nhiều bước hoàn tất, tồn thấp":p.active>0?"Đang có việc chờ xử lý":"Đã xử lý hết các bước được giao"})).sort((a,b)=>b.active-a.active||b.done-a.done||a.name.localeCompare(b.name,"vi"));
}
function table(cols,rows){return'<table><thead><tr>'+cols.map(x=>'<th>'+E(x)+'</th>').join("")+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(cell=>'<td>'+cell+'</td>').join("")+'</tr>').join("")+'</tbody></table>'}
function metric(id,rows){$(id).innerHTML=rows.map(([label,value])=>'<div class="metric"><span>'+E(label)+'</span><b>'+E(value)+'</b></div>').join("")}
function caseButton(c){return'<button data-open="'+E(c.id)+'" class="soft min">'+E(c.id)+'</button>'}
function reportWorkflow(){
 let mode=view.mode,xs=C.all().filter(c=>(!view.flowDomain||c.domain===view.flowDomain)&&(!view.flowStatus||statuses(mode,c).status===view.flowStatus));
 let open=xs.filter(c=>statuses(mode,c).index>=0),done=xs.length-open.length,returns=xs.filter(c=>statuses(mode,c).status==="REVIEW"),assigned=assignments(mode);
 metric("opWorkflowKpis",[["Hồ sơ theo bộ lọc",xs.length],["Đã đủ 7 bước",done],["Đang giữ/chờ",open.length],["Trả bổ sung",returns.length],["Bước hoàn tất",xs.reduce((n,c)=>n+statuses(mode,c).stages.filter(s=>s.status==="DONE").length,0)]]);
 const stageNames=["Dự thảo","Trưởng đơn vị","TCKT","TGĐ","Nghiệm thu","Kế toán","Báo cáo"];
 $("opStages").innerHTML=stageNames.map((label,i)=>{let num=open.filter(c=>statuses(mode,c).index===i).length;return'<div class="barline"><span>B'+(i+1)+' · '+E(label)+'</span><div class="bar"><i style="width:'+100*num/(open.length||1)+'%"></i></div><b>'+num+' việc</b></div>'}).join("");
 $("opMonthly").innerHTML=table(["Tháng","Số HS","Đã xong","Chờ","Trả","Bước đã làm"],Array.from({length:10},(_,m)=>{let a=xs.filter(c=>c.month===m+1);return[m+1,a.length,a.filter(c=>statuses(mode,c).index<0).length,a.filter(c=>statuses(mode,c).index>=0).length,a.filter(c=>statuses(mode,c).status==="REVIEW").length,a.reduce((n,c)=>n+statuses(mode,c).stages.filter(s=>s.status==="DONE").length,0)]}));
 $("opWorkflowTable").innerHTML=table(["Hồ sơ","Kỳ","Lĩnh vực","Người lập","Đang ở bước","Người giữ","Trạng thái","Hoàn tất bước","B1–B7 (người / trạng thái)","Xử lý"],xs.map(c=>{let x=statuses(mode,c);return[caseButton(c),E(c.month+"/2026"),E(c.domainName),E(c.owner),E(x.phase),E(x.holder),E(x.status),x.stages.filter(s=>s.status==="DONE").length+"/7",x.stages.map((s,i)=>"B"+(i+1)+":"+s.status+" ("+s.actor+")").map(E).join(" · ") ,caseButton(c)]}));
}
function reportPeople(){
 let all=staffStats(view.peopleMode),list=all.filter(p=>(!view.dept||p.deptCode===view.dept)&&(!view.search||(p.name+" "+p.dept+" "+p.role).toLowerCase().includes(view.search)));
 const current=assignments(view.peopleMode),open=current.filter(x=>x.active);
 metric("opPeopleKpis",[["Nhân sự có trong mô phỏng",all.length],["Người có việc đang giữ",[...new Set(open.map(x=>x.name))].length],["Bước/việc hoàn tất",current.filter(x=>x.done).length],["Việc hiện đang mở",open.length],["Nhiệm vụ có hạn quá ngày",view.peopleMode==="current"?T.items.filter(x=>x.status!=="done"&&todayDue(x.due)).length:0]]);
 $("opPeopleTable").innerHTML=table(["Họ tên (giả)","Đơn vị / vai trò","Bước/việc đã làm","Đang giữ","Bị trả ở bước","Tỷ lệ hoàn tất*","Việc có hạn quá ngày","Nhận xét dựa dữ liệu","Chi tiết"],list.map(p=>[
 '<b>'+E(p.name)+'</b>',E(p.dept)+'<small>'+E(p.role)+'</small>',p.done,p.active,p.returned,p.completion===null?"—":f(p.completion)+"%",p.overdue,E(p.conclusion),'<button class="soft min" data-op-person="'+E(p.name)+'">Xem việc</button>']));
 let select=$("opPersonSelect"),value=select.value||view.person;
 select.innerHTML=all.map(p=>'<option value="'+E(p.name)+'">'+E(p.name)+' – '+E(p.dept)+'</option>').join("");
 if(!all.some(p=>p.name===value))value=list[0]?.name||all[0]?.name||"";
 select.value=value;view.person=value;reportPersonDetail();
}
function reportPersonDetail(){
 let p=staffStats(view.peopleMode).find(x=>x.name===view.person);if(!p){$("opPersonDetail").innerHTML="<p>Chưa chọn người.</p>";return}
 let my=p.records,actions=C.data.events.filter(e=>e.from===p.name||e.to===p.name),active=my.filter(x=>x.active),done=my.filter(x=>x.done),returned=my.filter(x=>x.returned);
 let html='<div class="info"><b>'+E(p.name)+'</b> – '+E(p.role)+' / '+E(p.dept)+'. Đã thực hiện '+p.done+' bước/việc; đang giữ '+p.active+'; trả ở bước '+p.returned+'. Đây là chỉ số vận hành của mô phỏng, chưa phải đánh giá năng lực thật.</div>';
 html+='<div class="detailStats">'+[["Việc đang giữ",p.active],["Bước/việc hoàn tất",p.done],["Tỷ lệ hoàn tất",p.completion===null?"—":f(p.completion)+"%"],["Nhiệm vụ quá hạn",p.overdue],["Việc đã ghi nhận có ngày",p.completedDated],["Tải công việc nhóm (nếu quản lý)",p.manager?p.teamOpen:"—"]].map(([k,v])=>'<div class="stat"><small>'+E(k)+'</small><b>'+E(v)+'</b></div>').join("")+'</div>';
 html+='<h3>Danh sách công việc đang giữ ('+active.length+')</h3><div class="tableScroll">'+table(["Công việc","Lĩnh vực","Bước","Mã phiếu","Hạn được giao","Thao tác"],active.map(x=>[
 x.kind==="task"?' <button class="soft min" data-op-edit="'+E(x.id)+'">'+E(x.id)+'</button>':caseButton(x.case),E(x.domainName),E(x.stage),E(x.formId),E(x.due||"Chưa có"),x.kind==="task"?'<button class="soft min" data-op-edit="'+E(x.id)+'">Xử lý</button>':caseButton(x.case)]))+'</div>';
 html+='<h3 style="margin-top:15px">Bước đã hoàn thành ('+done.length+')</h3><div class="tableScroll">'+table(["Mã","Lĩnh vực","Nghiệp vụ","Ngày hoàn thành","Biểu mẫu"],done.slice(0,180).map(x=>[x.kind==="task"?E(x.id):caseButton(x.case),E(x.domainName),E(x.stage),E(x.stageDate||"Không có"),E(x.formId)]))+'</div>';
 html+='<h3 style="margin-top:15px">Chuyển giao và phản hồi có ghi nhật ký ('+actions.length+')</h3><div class="tableScroll">'+table(["Ngày","Loại","Mã liên quan","Từ","Đến","Lý do"],actions.slice(-80).reverse().map(e=>[E(e.date),E(e.type),E(e.caseId),E(e.from),E(e.to),E(e.note)]))+'</div>';
 if(p.manager)html+='<p class="hint">Phần “tải công việc nhóm” chỉ tổng hợp công việc đang giữ của nhân viên cùng đơn vị; không suy ra mức độ điều hành hoặc kết quả đánh giá trưởng bộ phận.</p>';
 $("opPersonDetail").innerHTML=html;
}
function filteredTasks(){
 return T.items.filter(t=>{
 let match=(t.title+" "+t.owner+" "+t.caseId+" "+t.description+" "+t.id).toLowerCase();
 return(!view.taskSearch||match.includes(view.taskSearch))&&(!view.owner||view.owner===t.owner)&&(view.taskStatus==="all"||view.taskStatus==="open"&&t.status!=="done"||view.taskStatus==="done"&&t.status==="done"||view.taskStatus==="overdue"&&t.status!=="done"&&todayDue(t.due));
 }).slice().sort((a,b)=>(a.status==="done"?1:0)-(b.status==="done"?1:0)||(a.due||"9999").localeCompare(b.due||"9999"))}
function renderTaskManager(){
 let open=T.items.filter(t=>t.status!=="done"),overdue=open.filter(t=>todayDue(t.due)),done=T.items.length-open.length;
 metric("opTaskKpis",[["Nhiệm vụ đã tạo",T.items.length],["Đang mở",open.length],["Đã hoàn tất",done],["Quá hạn có căn cứ",overdue.length]]);
 let p=new Map();for(let t of open)p.set(t.owner,(p.get(t.owner)||0)+1);
 $("opTaskOwners").innerHTML='<h3>Phân bổ nhiệm vụ đang mở theo người</h3>'+[...p].sort((a,b)=>b[1]-a[1]).slice(0,12).map(x=>'<div class="barline"><span>'+E(x[0])+'</span><div class="bar"><i style="width:'+100*x[1]/Math.max(1,...p.values())+'%"></i></div><b>'+x[1]+' việc</b></div>').join("");
 $("opTaskTable").innerHTML=table(["Mã","Công việc","Người nhận","Hạn","Ưu tiên","Hồ sơ liên kết","Trạng thái","Xử lý"],filteredTasks().map(t=>[
 E(t.id),'<b>'+E(t.title)+'</b><small>'+E(t.description||"")+'</small>',E(t.owner),E(t.due||"Không đặt")+(t.status!=="done"&&todayDue(t.due)?'<small>Quá hạn</small>':""),E(t.priority),t.caseId&&C.find(t.caseId)?caseButton(C.find(t.caseId)):E(t.caseId||"—"),E(t.status==="done"?"Đã hoàn tất":"Đang mở"),'<button data-op-edit="'+E(t.id)+'" class="min">Cập nhật / Chuyển</button>']));
 if(view.editor)renderEditor();
}
function renderEditor(){
 let t=T.items.find(t=>t.id===view.editor);
 if(!t){$("opTaskEditor").hidden=true;return}
 $("opTaskEditor").hidden=false;$("opEditorTitle").textContent="Xử lý "+t.id+" – "+t.title;
 $("opEditorInfo").innerHTML='<p class="small">Hiện giao '+E(t.owner)+'; trạng thái '+E(t.status)+'; hạn '+E(t.due||"không có")+'.</p>';
 $("opEditorOwner").innerHTML=knownPeople().map(p=>'<option value="'+E(p.name)+'" '+(t.owner===p.name?"selected":"")+'>'+E(p.name)+'</option>').join("");
 $("opEditorDue").value=t.due||"";$("opEditorNote").value="";$("opTaskEditor").scrollIntoView?.({behavior:"smooth",block:"nearest"});
}
function resetPeopleOptions(){
 const list=knownPeople(),opts=list.map(p=>'<option value="'+E(p.name)+'">'+E(p.name)+" · "+E(p.dept)+'</option>').join("");
 $("opTaskOwner").innerHTML=opts;$("opTaskOwnerFilter").innerHTML='<option value="">Mọi người</option>'+opts;
 const depts=[...new Map(list.map(p=>[p.deptCode,p.dept])).entries()];
 $("opPeopleDept").innerHTML='<option value="">Tất cả đơn vị</option>'+depts.map(x=>'<option value="'+E(x[0])+'">'+E(x[1])+'</option>').join("");
 const domainOpts='<option value="">Tất cả lĩnh vực</option>'+C.manifest.domains.map(d=>'<option value="'+E(d.key)+'">'+E(d.name)+'</option>').join("");$("opWorkflowDomain").innerHTML=domainOpts;
}
function snapshot(mode){return mode==="baseline"?"Nguồn 360 hồ sơ đến 31/10/2026":"Tại thời điểm mở báo cáo, gồm thao tác mô phỏng"}
function taskCreate(){
 let title=$("opTaskTitle").value.trim(),owner=$("opTaskOwner").value,due=$("opTaskDue").value,caseId=$("opTaskCase").value.trim(),priority=$("opTaskPriority").value,description=$("opTaskDescription").value.trim();
 if(!title||title.length<4)throw Error("Tên công việc cần ít nhất 4 ký tự");if(!owner)throw Error("Chọn người thực hiện");if(caseId&&!C.find(caseId))throw Error("Mã hồ sơ không tồn tại");
 let id="TASK-33-"+String(++T.serial).padStart(4,"0");while(T.items.some(t=>t.id===id)){id="TASK-33-"+String(++T.serial).padStart(4,"0")}
 let t={id,title,owner,due,caseId,priority,description,status:"open",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),completedAt:null,history:[]};
 t.history.push({type:"CREATED",from:"Điều phối mô phỏng",to:owner,date:today(),note:description});
 T.items.push(t);persist();logTask(t,"TASK_CREATE","Điều phối",owner,title);
 $("opTaskTitle").value="";$("opTaskDescription").value="";$("opTaskCase").value="";renderTaskManager();notices("Đã tạo nhiệm vụ "+id);
}
function taskUpdate(action){
 let t=T.items.find(x=>x.id===view.editor);if(!t)throw Error("Chưa chọn nhiệm vụ");
 let to=$("opEditorOwner").value,due=$("opEditorDue").value,note=$("opEditorNote").value.trim();
 if(action==="task-save"&&!note&&to===t.owner&&due===t.due)throw Error("Chưa có thay đổi hoặc ý kiến");
 let from=t.owner,type="";
 if(action==="task-save"){
 if(!to)throw Error("Cần người nhận");
 t.owner=to;t.due=due;type=from!==to?"TASK_ASSIGN":"TASK_UPDATE";
 }else if(action==="task-complete"){if(t.status==="done")throw Error("Nhiệm vụ đã hoàn tất");if(!note)throw Error("Nhập kết quả hoàn thành");t.status="done";t.completedAt=new Date().toISOString();type="TASK_DONE"}
 else if(action==="task-reopen"){if(t.status==="open")throw Error("Nhiệm vụ đang mở");if(!note)throw Error("Nhập lý do mở lại");t.status="open";t.completedAt=null;type="TASK_REOPEN"}
 t.updatedAt=new Date().toISOString();
 t.history.push({type,from,to:t.owner,date:today(),note});
 persist();logTask(t,type,from,t.owner,note||"Cập nhật hạn và người giữ nhiệm vụ");
 renderTaskManager();notices("Đã cập nhật "+t.id+" ("+type+")");
}
function escapeCSV(rows){return"\ufeff"+rows.map(r=>r.map(x=>'"'+String(x??"").replace(/"/g,'""')+'"').join(",")).join("\r\n")}
function download(name,content,mime="text/plain;charset=utf-8"){let b=new Blob([content],{type:mime}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1200)}
function workflowCSV(){let m=view.mode;return[["Mã","Lĩnh vực","Tháng","Trạng thái","Bước hiện hành","Người giữ","Hoàn tất bước","Đề nghị","Đã xử lý gốc",...Array.from({length:7},(_,i)=>"B"+(i+1)+" người | trạng thái | ngày")],...C.all().filter(c=>!view.flowDomain||view.flowDomain===c.domain).map(c=>{let v=statuses(m,c);return[c.id,c.domainName,c.month,v.status,v.phase,v.holder,v.stages.filter(x=>x.status==="DONE").length,c.proposed,c.processed,...v.stages.map(s=>s.actor+" | "+s.status+" | "+(s.datetime?.slice(0,10)||""))]})]}
function peopleCSV(){return[["Họ tên giả","Đơn vị","Vai trò","Bước/việc đã làm","Đang giữ","Bước bị trả","Tỷ lệ hoàn thành %","Số việc có hạn quá ngày","Đã hoàn tất có ngày","Tải nhóm"],...staffStats(view.peopleMode).map(p=>[p.name,p.dept,p.role,p.done,p.active,p.returned,p.completion===null?"":p.completion,p.overdue,p.completedDated,p.teamOpen])]}
function tasksCSV(){return[["Mã nhiệm vụ","Tên nhiệm vụ","Người giữ","Trạng thái","Hạn","Ưu tiên","Hồ sơ","Tạo ngày","Hoàn tất ngày","Mô tả"],...T.items.map(t=>[t.id,t.title,t.owner,t.status,t.due,t.priority,t.caseId,t.createdAt,t.completedAt,t.description])]}
function plainReport(kind){
 const m=kind==="flow"?view.mode:view.peopleMode,lines=["CTY AI 3.3 – "+(kind==="flow"?"BÁO CÁO THỰC THI LUỒNG":"BÁO CÁO TẢI VÀ HIỆU QUẢ NHÂN SỰ"),"Phạm vi: "+snapshot(m),"Đây là tình huống, nhân sự và chữ ký giả định. Không phải đánh giá cán bộ của GSC.",""];
 if(kind==="flow"){
 let cases=C.all();lines.push("Tổng hồ sơ: "+cases.length+"; đã hoàn tất "+cases.filter(c=>statuses(m,c).index<0).length+"; bị trả "+cases.filter(c=>statuses(m,c).status==="REVIEW").length);
 for(let i=0;i<7;i++)lines.push("Bước "+(i+1)+": đang giữ "+cases.filter(c=>statuses(m,c).index===i).length+" hồ sơ.");
 for(let d of C.manifest.domains){let a=cases.filter(c=>c.domain===d.key);lines.push("\n"+d.name+": "+a.length+" hồ sơ, hoàn tất "+a.filter(c=>statuses(m,c).index<0).length);for(let c of a.filter(c=>statuses(m,c).index>=0).slice(0,45))lines.push(c.id+" | "+statuses(m,c).phase+" | "+statuses(m,c).holder+" | "+statuses(m,c).status)}
 }else{
 for(let p of staffStats(m)){lines.push("\n"+p.name+" / "+p.dept+" / "+p.role, "Đã làm "+p.done+"; đang giữ "+p.active+"; bước trả "+p.returned+"; tỷ lệ hoàn thành "+(p.completion===null?"không đủ dữ liệu":f(p.completion)+"%")+"; có ngày ghi nhận "+p.completedDated+"/"+p.done,"Nhận xét vận hành: "+p.conclusion);
 for(let work of p.records.filter(x=>x.active))lines.push(" - "+(work.caseId||work.id)+": "+work.title+" | "+work.stage+" | hạn "+(work.due||"không khai báo"))}
 }
 lines.push("\nĐánh giá chỉ dựa trên nghiệp vụ mô phỏng, không quy kết chậm xử lý khi không có SLA hoặc ngày giao việc thực. Không đánh giá năng lực, phẩm chất, lương thưởng nhân sự thật.");
 return lines.join("\n");
}
async function action(name){
 if(name==="workflow-csv")download("CTY-AI-3.3-LUONG-CONG-VIEC.csv",escapeCSV(workflowCSV()),"text/csv;charset=utf-8");
 if(name==="workflow-txt")download("CTY-AI-3.3-BAO-CAO-LUONG.txt",plainReport("flow"));
 if(name==="people-csv")download("CTY-AI-3.3-KPI-NHAN-SU.csv",escapeCSV(peopleCSV()),"text/csv;charset=utf-8");
 if(name==="people-txt")download("CTY-AI-3.3-BAO-CAO-NHAN-SU.txt",plainReport("people"));
 if(name==="task-all-csv")download("CTY-AI-3.3-NHIEM-VU.csv",escapeCSV(tasksCSV()),"text/csv;charset=utf-8");
 if(name==="task-backup")download("CTY-AI-3.3-FULL-BACKUP.json",JSON.stringify({kind:"CTY-AI-33-FULL",workflow:C.data,tasks:T},null,2),"application/json");
 if(name==="task-create")taskCreate();
 if(["task-save","task-complete","task-reopen"].includes(name))taskUpdate(name);
 if(name==="task-close"){view.editor="";$("opTaskEditor").hidden=true}
}
function click(e){
 const b=e.target.closest("button");if(!b)return;
 if(b.dataset.tab){
 if(b.dataset.tab==="workflow-report")reportWorkflow();
 if(b.dataset.tab==="people-report")reportPeople();
 if(b.dataset.tab==="task-manager")renderTaskManager();
 return;
 }
 if(b.dataset.opPerson){view.person=b.dataset.opPerson;$("opPersonSelect").value=view.person;reportPersonDetail();return}
 if(b.dataset.opEdit){view.editor=b.dataset.opEdit;U.show("task-manager");renderTaskManager();return}
 if(b.dataset.op){try{action(b.dataset.op)}catch(err){notices(err.message)}return}
}
function setup(){
 if(!C.manifest){setTimeout(setup,70);return}
 resetPeopleOptions();
 $("opSnapshot").onchange=e=>{view.mode=e.target.value;reportWorkflow()};
 $("opWorkflowDomain").onchange=e=>{view.flowDomain=e.target.value;reportWorkflow()};
 $("opWorkflowStatus").onchange=e=>{view.flowStatus=e.target.value;reportWorkflow()};
 $("opPeopleMode").onchange=e=>{view.peopleMode=e.target.value;reportPeople()};
 $("opPeopleDept").onchange=e=>{view.dept=e.target.value;reportPeople()};
 $("opPeopleSearch").oninput=e=>{view.search=e.target.value.toLowerCase();reportPeople()};
 $("opPersonSelect").onchange=e=>{view.person=e.target.value;reportPersonDetail()};
 $("opTaskSearch").oninput=e=>{view.taskSearch=e.target.value.toLowerCase();renderTaskManager()};
 $("opTaskStatus").onchange=e=>{view.taskStatus=e.target.value;renderTaskManager()};
 $("opTaskOwnerFilter").onchange=e=>{view.owner=e.target.value;renderTaskManager()};
 $("opTaskDue").value=today();
 document.addEventListener("click",click);
 window.CTYOPS={reportWorkflow,reportPeople,reportPersonDetail,renderTaskManager,staffStats,assignments,statuses,plainReport,workflowCSV,peopleCSV,tasksCSV,taskCreate,taskUpdate,action,get tasks(){return T},setTasks(v){if(v?.version!==1||!Array.isArray(v.items))throw Error("Sao lưu nhiệm vụ không hợp lệ");T=v;persist();resetPeopleOptions();renderTaskManager()},resetTasks(){T={version:1,items:[],serial:0};view.editor="";persist();resetPeopleOptions();renderTaskManager()},refresh:()=>{resetPeopleOptions();reportWorkflow();reportPeople();renderTaskManager()},get view(){return view}};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
})();