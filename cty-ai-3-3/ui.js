(function(){"use strict";
const C=window.CTX,$=id=>document.getElementById(id),E=x=>String(x??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k])),f=C.fmt;
let tab="dashboard",selected="",formIndex=0,filters={task:"",taskDomain:"",taskMode:"open",case:"",caseDomain:"",caseStatus:"",reportDomain:"finance",logType:"",logSearch:""};
const labels={CLOSED:"Đã hoàn tất",REVIEW:"Trả bổ sung",PENDING:"Chờ phê duyệt",APPROVED:"Đã duyệt, chờ thực hiện",IN_PROGRESS:"Đang xử lý"};
function toast(v){$("toast").textContent=v;$("toast").hidden=false;clearTimeout(window.__ctytimer);window.__ctytimer=setTimeout(()=>$("toast").hidden=true,4500)}
function pill(s){return'<span class="chip '+(s==="CLOSED"?"ok":s==="REVIEW"?"bad":"pending")+'">'+E(labels[s]||s)+'</span>'}
function btn(c,text){return'<button class="soft min" data-open="'+E(c.id)+'">'+E(text||c.id)+'</button>'}
function metric(id,rows){$(id).innerHTML=rows.map(([title,val])=>'<div class="metric"><span>'+E(title)+'</span><b>'+E(val)+'</b></div>').join("")}
function table(head,body){return'<table><thead><tr>'+head.map(x=>'<th>'+E(x)+'</th>').join("")+'</tr></thead><tbody>'+body.map(r=>'<tr>'+r.map(cell=>'<td>'+cell+'</td>').join("")+'</tr>').join("")+'</tbody></table>'}
function line(label,v){return'<div class="stat"><small>'+E(label)+'</small><b>'+E(v)+'</b></div>'}
function taskRows(){return C.all().filter(c=>{const s=C.status(c),q=(c.id+" "+c.title+" "+C.holder(c)+" "+c.owner).toLowerCase();return(!filters.task||q.includes(filters.task))&&(!filters.taskDomain||c.domain===filters.taskDomain)&&(filters.taskMode==="all"||filters.taskMode==="open"&&s!=="CLOSED"||filters.taskMode==="blocked"&&s==="REVIEW"||filters.taskMode==="waiting"&&["PENDING","APPROVED","IN_PROGRESS"].includes(s))}).sort((a,b)=>(C.status(a)==="REVIEW"?0:1)-(C.status(b)==="REVIEW"?0:1)||(C.aging(b)||0)-(C.aging(a)||0))}
function renderDashboard(){
 const a=C.all(),done=a.filter(c=>C.status(c)==="CLOSED"),open=a.filter(c=>C.status(c)!=="CLOSED"),blocked=open.filter(c=>C.status(c)==="REVIEW"),verified=a.filter(c=>C.data.verified[c.id]).length;
 metric("summaryMetrics",[["Tổng hồ sơ",a.length],["Đã hoàn tất",done.length],["Còn phải xử lý",open.length],["Bị trả/vướng",blocked.length],["Đã đọc TXT",verified+"/"+a.length]]);
 $("domainCards").innerHTML=C.domains().map(d=>'<button class="domainCard" data-domain="'+d.key+'"><b>'+E(d.name)+'</b><small>'+d.closed+'/'+d.count+' hoàn tất · '+d.review+' bị trả</small><div class="bar"><i style="width:'+100*d.closed/(d.count||1)+'%"></i></div><small>Xem chi tiết lĩnh vực →</small></button>').join("");
 let wait=Array.from({length:7},(_,i)=>({i,n:open.filter(c=>C.index(c)===i).length}));
 $("bottlenecks").innerHTML=wait.map(x=>'<div class="barline"><span>B'+(x.i+1)+' · '+E(["Dự thảo","Trưởng bộ phận","Kiểm soát TCKT","TGĐ","Nghiệm thu","Kế toán","Báo cáo"][x.i])+'</span><div class="bar"><i style="width:'+100*x.n/(open.length||1)+'%"></i></div><b>'+x.n+' việc</b></div>').join("");
 let priority=open.slice().sort((x,y)=>(C.status(x)==="REVIEW"?0:1)-(C.status(y)==="REVIEW"?0:1)||(C.aging(y)||0)-(C.aging(x)||0)).slice(0,8);
 $("highPriority").innerHTML=priority.map(c=>'<div class="listItem"><span><b>'+btn(c)+' '+E(c.title)+'</b><small>'+E(C.holder(c))+' · B'+(C.index(c)+1)+' · '+(C.aging(c)??"—")+' ngày từ mốc trong hồ sơ</small></span>'+pill(C.status(c))+'</div>').join("")||'<p>Không còn việc tồn.</p>';
 $("timeline").innerHTML=Array.from({length:10},(_,i)=>{let xs=a.filter(c=>c.month===i+1),n=xs.filter(c=>C.status(c)==="CLOSED").length;return'<div class="barline"><span>Tháng '+(i+1)+' · '+xs.length+' HS</span><div class="bar"><i style="width:'+100*n/(xs.length||1)+'%"></i></div><b>'+n+' xong</b></div>'}).join("");
 $("coverage").innerHTML='<b>'+verified+'/'+a.length+' tệp TXT đã được đối chiếu.</b> Số liệu tổng quan trước khi kiểm tra TXT là dữ liệu kịch bản giả định. Báo cáo gốc 31/10/2026 được tách với kết quả thao tác mới; không coi hành động sau kỳ là đã xảy ra trước kỳ.';
}
function renderTasks(){
 const xs=taskRows();$("taskSummary").textContent=xs.length+" hồ sơ phù hợp · Chọn Xử lý để mở ngay công việc";
 $("taskTable").innerHTML=table(["Mã","Lĩnh vực","Tình huống / vướng mắc","Đang ở bước","Người giữ việc","Trạng thái","Tồn (ngày giả)","Thao tác"],xs.map(c=>[
 btn(c),E(c.domainName),'<b>'+E(c.title)+'</b><small>'+E(C.issues(c)[0]||"Không có cảnh báo")+'</small>',
 E("B"+(C.index(c)+1)+" · "+C.phase(c)),E(C.holder(c)),pill(C.status(c)),E(C.aging(c)??"—"),btn(c,"Xử lý / Chuyển việc")]));
}
function renderCaseList(){
 const xs=C.all().filter(c=>(!filters.caseDomain||c.domain===filters.caseDomain)&&(!filters.caseStatus||C.status(c)===filters.caseStatus)&&(!filters.case||(c.id+" "+c.title+" "+c.owner).toLowerCase().includes(filters.case)));
 $("caseCount").textContent=xs.length+" hồ sơ";
 $("caseList").innerHTML=xs.map(c=>'<button data-open="'+E(c.id)+'" class="listItem '+(c.id===selected?"active":"")+'"><span><b>'+E(c.title)+'</b><small>'+E(c.id)+' · '+E(C.holder(c))+'</small></span>'+pill(C.status(c))+'</button>').join("")||'<p>Không tìm thấy hồ sơ.</p>';
}
function renderCase(){
 const c=C.find(selected);if(!c)return;
 let st=C.status(c),i=C.index(c),steps=C.steps(c),v=C.vals(c),over=C.data.overrides[c.id],actor=i>=0?steps[i].actor:"";
 let out='<div class="caseTitle"><div><small>'+E(c.id)+' · '+E(c.domainName)+' · T'+c.month+'/2026</small><h2>'+E(c.title)+'</h2></div>'+pill(st)+'</div>';
 out+='<div class="detailStats">'+[["Người lập",c.owner],["Người giữ",C.holder(c)],["Đề nghị",f(v.request)+" tr"],["Được duyệt",f(v.approved)+" tr"],["Đã xử lý gốc",f(v.baseProcessed)+" tr"],["Hiện tại",f(v.processed)+" tr"]].map(x=>line(...x)).join("")+'</div>';
 out+='<div class="info"><b>'+E(i<0?"Đã hoàn tất cả 7 bước":"Đang tắc tại B"+(i+1)+": "+steps[i].title)+'</b><div>'+C.issues(c).map(x=>"• "+E(x)).join("<br>")+'</div><div class="small">Nguồn TXT: '+(C.data.verified[c.id]?"Đã kiểm tra":"Chưa đọc (sẽ tự đọc khi thao tác)")+'</div></div>';
 out+='<div class="actions"><button class="soft" data-action="read">Đọc TXT</button><button class="soft" data-action="downloadCase">Tải hồ sơ TXT</button><button class="soft" data-action="resetCase">Khôi phục tình huống gốc</button></div>';
 out+='<h3 style="margin-top:17px">7 bước xử lý và người chịu trách nhiệm</h3><div class="stages">'+steps.map((s,k)=>'<div class="stage '+(s.status==="DONE"?"done":s.status==="RETURNED"?"returned":k===i?"active":"")+'"><b>B'+(k+1)+': '+E(s.title)+'</b><small>'+E(s.actor)+'</small><small>'+E(s.datetime?.slice(0,10)||"Chưa có ngày")+' · '+E(s.status)+'</small><button data-stage="'+k+'" class="soft min">Xem biểu mẫu '+(k+1)+'</button></div>').join("")+'</div>';
 if(i>=0){
 const people=C.people();
 out+='<div class="actionBox"><h3>Xử lý ngay B'+(i+1)+'</h3><p class="hint">Thao tác mô phỏng, có ghi người, thời điểm và lý do; không phải phê duyệt điện tử thật.</p><div class="formGrid">';
 out+='<label>Người đang thao tác<select id="operator">'+people.map(x=>'<option '+(actor===x?"selected":"")+' value="'+E(x)+'">'+E(x)+'</option>').join("")+'</select></label>';
 out+='<label>Chuyển việc / trả về cho<select id="recipient">'+people.map(x=>'<option '+(c.owner===x?"selected":"")+' value="'+E(x)+'">'+E(x)+'</option>').join("")+'</select></label></div>';
 out+='<label class="field">Giải trình, tài liệu cần bổ sung hoặc kết luận</label><textarea id="actionNote" placeholder="Ví dụ: Trả bổ sung biên bản nghiệm thu; chuyển anh ... lập lại để trình TCKT…"></textarea>';
 if([3,4,5].includes(i)){let title=i===3?"Số tiền TGĐ duyệt giả (triệu)":i===4?"Giá trị nghiệm thu giả (triệu)":"Số tiền đã thanh toán giả (triệu)",amount=i===3?(over?.approved||c.proposed):i===4?(over?.processed||v.approved):(over?.paid||0);
 out+='<label class="field">'+title+'</label><input id="amount" type="number" min="0" step="0.01" value="'+(Number(amount)||0)+'">'}
 out+='<div class="actions"><button data-action="complete">✓ '+(over?.returnTo!=null&&i===0?"Bổ sung & trình lại":i===3?"TGĐ phê duyệt giả":i===4?"Nghiệm thu giả":i===5?"Kế toán ghi nhận":i===6?"Ghi vào báo cáo":"Hoàn tất bước, chuyển tiếp")+'</button><button data-action="assign" class="soft">Chuyển người xử lý</button><button data-action="return" class="danger">Trả bổ sung</button><button data-action="comment" class="soft">Lưu ý kiến</button></div></div>';
 }
 out+='<h3 style="margin-top:16px">Biểu mẫu BM'+(formIndex+1)+'</h3><div class="txt">'+E(C.getForm(c,formIndex))+'</div><div class="actions"><button data-action="formtxt" class="soft">Tải biểu mẫu này</button></div>';
 out+='<h3 style="margin-top:16px">Dấu vết xử lý từ đầu đến cuối</h3><div class="feed">';
 out+=steps.map(s=>'<div class="feedEvent"><b>'+E(s.formId)+' · '+E(s.title)+'</b><small>'+E(s.actor)+' · '+E(s.datetime||"Chưa có thời gian")+' · '+E(s.status)+'</small></div>').join("");
 out+=C.data.events.filter(e=>e.caseId===c.id).slice(-35).reverse().map(e=>'<div class="feedEvent '+(["RETURN","ERROR"].includes(e.type)?"alert":"")+'"><b>'+E(e.type)+' · '+E(e.from)+' → '+E(e.to)+'</b><div>'+E(e.note)+'</div><small>'+E(e.date)+' · '+(e.step===null?"—":"B"+(e.step+1))+'</small></div>').join("");
 $("caseDetail").innerHTML=out+'</div>';
}

function fullReport(){
 let all=C.all(),ds=C.domains(),open=all.filter(c=>C.status(c)!=="CLOSED"),lines=[
 "CTY AI 3.3 – BÁO CÁO TOÀN DIỆN 8 LĨNH VỰC – DỮ LIỆU GIẢ ĐỊNH",
 "Ngày tạo: "+C.date()+" (Việt Nam). Kỳ gốc: đến 31/10/2026. Thay đổi trên web là mô phỏng sau kỳ.",
 "Không phải báo cáo kế toán, quản trị hoặc quyết định ký duyệt thật.","",
 "I. TỔNG QUAN",
 "Tổng hồ sơ: "+all.length+"; hoàn tất: "+all.filter(c=>C.status(c)==="CLOSED").length+"; còn việc: "+open.length+"; bị trả: "+open.filter(c=>C.status(c)==="REVIEW").length,
 "TXT đã đối chiếu: "+Object.keys(C.data.verified).filter(k=>C.data.verified[k]).length+"/"+all.length,"",
 "II. TÁM LĨNH VỰC"];
 for(let d of ds){let xs=C.cases(d.key);
 lines.push("",d.name.toUpperCase(),"Số hồ sơ "+d.count+"; đã hoàn tất "+d.closed+"; bị trả "+d.review+"; chờ "+d.pending,
 "Đề nghị "+f(d.request)+" triệu; đã xử lý gốc "+f(d.baseline)+" triệu; hiện tại "+f(d.current)+" triệu.");
 for(let m=1;m<=10;m++){let a=xs.filter(c=>c.month===m);lines.push("Tháng "+m+": "+a.length+" HS, xong "+a.filter(c=>C.status(c)==="CLOSED").length+", bị trả "+a.filter(c=>C.status(c)==="REVIEW").length+", gốc "+f(C.baseSum(a,"processed"))+", hiện tại "+f(C.sum(a,"processed"))+" triệu")}
 lines.push("Các hồ sơ tồn ưu tiên:");
 for(let c of xs.filter(c=>C.status(c)!=="CLOSED").sort((a,b)=>(C.status(a)==="REVIEW"?0:1)-(C.status(b)==="REVIEW"?0:1)).slice(0,20))lines.push(c.id+" | "+c.title+" | "+C.phase(c)+" | "+C.holder(c)+" | "+(C.issues(c)[0]||""));
 }
 lines.push("","III. TÀI CHÍNH – KẾ TOÁN");
 const fcs=C.cases("finance");lines.push("Giá trị xử lý gốc 31/10: "+f(C.baseSum(fcs,"processed"))+" triệu; hiện tại "+f(C.sum(fcs,"processed"))+" triệu.");
 for(let m=1;m<=10;m++){let a=fcs.filter(c=>c.month===m);lines.push("T"+m+": "+a.length+" HS; gốc "+f(C.baseSum(a,"processed"))+" triệu; hiện tại "+f(C.sum(a,"processed"))+" triệu")}
 lines.push("","IV. DỰ ÁN ĐẦU TƯ");
 for(let p of C.projects())lines.push(p.id+" – "+p.name+"; tổng mức "+f(p.budget)+" triệu; hoàn tất "+p.closed+"/"+p.cases.length+" hồ sơ; giải ngân gốc "+f(p.baseline)+", hiện tại "+f(p.current)+" triệu; bị trả "+p.review);
 lines.push("","V. ĐIỂM NGHẼN – PHÂN CÔNG");
 for(let i=0;i<7;i++){let a=open.filter(c=>C.index(c)===i);lines.push("B"+(i+1)+": "+a.length+" việc, trong đó trả bổ sung "+a.filter(c=>C.status(c)==="REVIEW").length)}
 let owners=new Map();for(let c of open)owners.set(C.holder(c),(owners.get(C.holder(c))||0)+1);
 for(let [name,count] of [...owners].sort((a,b)=>b[1]-a[1]).slice(0,30))lines.push(name+": "+count+" hồ sơ");
 lines.push("","VI. NHẬT KÝ THAO TÁC",
 "Tổng: "+C.data.events.length+"; chuyển việc: "+C.data.events.filter(e=>e.type==="ASSIGN").length+"; trả: "+C.data.events.filter(e=>e.type==="RETURN").length+"; trình lại: "+C.data.events.filter(e=>e.type==="RESUBMIT").length+"; báo cáo: "+C.data.events.filter(e=>e.type==="REPORT").length,
 "Mọi quyết định chỉ nằm trên trình duyệt và không có giá trị phê duyệt thật. Không cộng ngang giá trị giữa tám lĩnh vực vì có khả năng trùng nghiệp vụ.");
 return lines.join("\n");
}

function renderDomains(){
 const rows=C.domains();
 metric("domainSummary",[["Lĩnh vực",rows.length],["Số hồ sơ",C.all().length],["Hoàn tất",rows.reduce((n,x)=>n+x.closed,0)],["Bị trả",rows.reduce((n,x)=>n+x.review,0)],["Số thao tác",C.data.events.filter(x=>x.type!=="VERIFY").length]]);
 $("domainReport").innerHTML=table(["Lĩnh vực","Hồ sơ","Hoàn tất","Bị trả","Đang chờ","Giá trị gốc*","Hiện tại*","Chênh lệch*","Đã đọc TXT","Xem"],rows.map(r=>[E(r.name),r.count,r.closed,r.review,r.pending,f(r.baseline),f(r.current),f(r.current-r.baseline),r.verified+"/"+r.count,'<button data-report="'+E(r.key)+'" class="min">Chi tiết</button>']));
 const xs=C.cases(filters.reportDomain),name=C.manifest.domains.find(x=>x.key===filters.reportDomain)?.name||"",base=C.baseSum(xs,"processed"),cur=C.sum(xs,"processed");
 const group=[...new Set(xs.map(x=>x.type))].map(n=>{let a=xs.filter(c=>c.type===n);return[n,a.length,f(C.baseSum(a,"processed")),f(C.sum(a,"processed"))]});
 $("domainDetail").innerHTML='<div class="info"><b>'+E(name)+'</b> · '+xs.length+' hồ sơ. Giá trị đã xử lý gốc '+f(base)+' triệu, hiện tại '+f(cur)+' triệu, điều chỉnh '+f(cur-base)+' triệu. *Không cộng ngang các lĩnh vực để thành chi phí kế toán.</div><h3>Khoản mục nghiệp vụ</h3><div class="tableScroll">'+table(["Khoản mục","Hồ sơ","Đã xử lý gốc","Hiện tại"],group.map(r=>r.map(E)))+'</div><h3 style="margin-top:16px">Hồ sơ, người giữ và lý do vướng</h3><div class="tableScroll">'+table(["Mã","Tháng","Tình huống","Tắc ở bước","Người giữ","Trạng thái","Giá trị hiện tại"],xs.map(c=>[btn(c),c.month,E(c.title),E(C.phase(c)),E(C.holder(c)),pill(C.status(c)),f(C.vals(c).processed)]))+'</div>';
const monthly=Array.from({length:10},(_,i)=>{let a=xs.filter(c=>c.month===i+1);return[i+1,a.length,a.filter(c=>C.status(c)==="CLOSED").length,a.filter(c=>C.status(c)==="REVIEW").length,f(C.baseSum(a,"processed")),f(C.sum(a,"processed"))]});
 const owners=new Map();for(let c of xs.filter(c=>C.status(c)!=="CLOSED"))owners.set(C.holder(c),(owners.get(C.holder(c))||0)+1);
 $("domainDetail").innerHTML+='<h3 style="margin-top:16px">Tiến độ theo từng tháng</h3><div class="tableScroll">'+table(["Tháng","Hồ sơ","Xong","Trả","Gốc","Hiện tại"],monthly.map(r=>r.map(E)))+'</div><h3 style="margin-top:16px">Người đang giữ việc</h3><div class="tableScroll">'+table(["Người","Số hồ sơ đang giữ"],[...owners].sort((a,b)=>b[1]-a[1]).slice(0,20).map(r=>r.map(E)))+'</div>';
}
function renderFinance(){
 const xs=C.cases("finance"),base=C.baseSum(xs,"processed"),cur=C.sum(xs,"processed");
 metric("financeMetrics",[["Hồ sơ",xs.length],["Gốc 31/10",f(base)+" tr"],["Hiện tại",f(cur)+" tr"],["Sau kỳ (giả)",f(cur-base)+" tr"],["Đã thanh toán",f(C.sum(xs,"paid"))+" tr"]]);
 $("financeMonthly").innerHTML=table(["Tháng","Hồ sơ","Đề nghị","Duyệt gốc","Xử lý gốc","Hiện tại mô phỏng"],Array.from({length:10},(_,i)=>{let a=xs.filter(c=>c.month===i+1);return[i+1,a.length,f(C.baseSum(a,"proposed")),f(C.baseSum(a,"approved")),f(C.baseSum(a,"processed")),f(C.sum(a,"processed"))]}));
 let types=[...new Set(xs.map(c=>c.type))].map(type=>{let a=xs.filter(c=>c.type===type);return[type,C.sum(a,"processed")]});let max=Math.max(1,...types.map(x=>x[1]));
 $("financeCategory").innerHTML=types.map(x=>'<div class="barline"><span>'+E(x[0])+'</span><div class="bar"><i style="width:'+100*x[1]/max+'%"></i></div><b>'+f(x[1])+'</b></div>').join("");
 $("financeDetail").innerHTML=table(["Mã","Tháng","Khoản mục","Đã xử lý gốc","Hiện tại","Tắc ở đâu","Người giữ"],xs.map(c=>[btn(c),c.month,E(c.type),f(c.processed),f(C.vals(c).processed),E(C.phase(c)),E(C.holder(c))]));
}
function renderProjects(){
 const p=C.projects();
 metric("projectMetrics",[["Số dự án",p.length],["Tổng mức vốn",f(p.reduce((n,x)=>n+x.budget,0))+" tr"],["Đã xử lý gốc",f(p.reduce((n,x)=>n+x.baseline,0))+" tr"],["Hiện tại",f(p.reduce((n,x)=>n+x.current,0))+" tr"],["Hồ sơ bị trả",p.reduce((n,x)=>n+x.review,0)]]);
 $("projectCards").innerHTML=p.map(x=>'<div class="projectCard"><b>'+E(x.name)+'</b><small>'+E(x.id)+' · '+x.closed+'/'+x.cases.length+' hồ sơ hoàn tất · '+x.review+' bị trả</small><div class="detailStats">'+[["Tổng mức",f(x.budget)+" tr"],["Đề nghị",f(x.request)+" tr"],["Gốc 31/10",f(x.baseline)+" tr"],["Hiện tại",f(x.current)+" tr"],["Đã thanh toán",f(x.paid)+" tr"],["Tiến độ mẫu",x.actual??"—"]].map(row=>line(...row)).join("")+'</div></div>').join("");
 $("projectTable").innerHTML=table(["Mã","Dự án","Hạng mục","Đề nghị","Xử lý gốc","Hiện tại","Bước chờ","Người giữ"],C.cases("project").map(c=>[btn(c),E(c.projectId),E(c.type),f(c.proposed),f(c.processed),f(C.vals(c).processed),E(C.phase(c)),E(C.holder(c))]));
}
function renderAudit(){
 const ev=C.data.events;metric("auditMetrics",[["Tổng sự kiện",ev.length],["Chuyển việc",ev.filter(e=>e.type==="ASSIGN").length],["Trả lại",ev.filter(e=>e.type==="RETURN").length],["Đã lên báo cáo",ev.filter(e=>e.type==="REPORT").length],["TXT đã kiểm tra",Object.keys(C.data.verified).filter(k=>C.data.verified[k]).length]]);
 let rows=ev.filter(e=>(!filters.logType||e.type===filters.logType)&&(!filters.logSearch||(e.caseId+" "+e.from+" "+e.to+" "+e.note).toLowerCase().includes(filters.logSearch))).slice(-250).reverse();
 $("auditTable").innerHTML=table(["Ngày","Hồ sơ","Sự kiện","Người xử lý","Chuyển đến","Lý do / kết luận","Bước"],rows.map(e=>[E(e.date),'<button data-open="'+E(e.caseId)+'" class="soft min">'+E(e.caseId)+'</button>',E(e.type),E(e.from),E(e.to),E(e.note),e.step===null?"—":e.step+1]));
}
function reportRows(type){
 if(type==="domains")return[["Lĩnh vực","Tổng hồ sơ","Hoàn tất","Trả","Chờ","Giá trị gốc","Giá trị hiện tại","Đã đọc TXT"],...C.domains().map(x=>[x.name,x.count,x.closed,x.review,x.pending,x.baseline,x.current,x.verified])];
 if(type==="tasks")return[["Mã","Lĩnh vực","Bước","Người giữ","Trạng thái","Lý do"],...taskRows().map(c=>[c.id,c.domainName,C.phase(c),C.holder(c),C.status(c),C.issues(c)[0]])];
 if(type==="finance")return[["Tháng","Hồ sơ","Đề nghị","Duyệt","Đã xử lý gốc","Hiện tại"],...Array.from({length:10},(_,i)=>{let a=C.cases("finance").filter(c=>c.month===i+1);return[i+1,a.length,C.baseSum(a,"proposed"),C.baseSum(a,"approved"),C.baseSum(a,"processed"),C.sum(a,"processed")]})];
 if(type==="projects")return[["Mã dự án","Dự án","Ngân sách","Hồ sơ","Đề nghị","Xử lý gốc","Hiện tại"],...C.projects().map(x=>[x.id,x.name,x.budget,x.cases.length,x.request,x.baseline,x.current])];
 if(type==="logs")return[["Mã","Thời gian","Loại","Từ","Đến","Bước","Lý do"],...C.data.events.map(e=>[e.caseId,e.at,e.type,e.from,e.to,e.step===null?"":e.step+1,e.note])];
 return[["Mã","Lĩnh vực","Tháng","Người giữ","Trạng thái","Đã xử lý gốc","Hiện tại"],...C.all().map(c=>[c.id,c.domainName,c.month,C.holder(c),C.status(c),c.processed,C.vals(c).processed])];
}
function csv(rows){return"\ufeff"+rows.map(row=>row.map(x=>'"'+String(x??"").replace(/"/g,'""')+'"').join(",")).join("\r\n")}
function download(file,text,mime="text/plain;charset=utf-8"){let blob=new Blob([text],{type:mime}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=file;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1300)}
function template(){let id="CUSTOM-33-001";let L=["CTY AI 3.3 – TÌNH HUỐNG GIẢ ĐỊNH","MÃ_HỒ_SƠ: "+id,"TÊN_HỒ_SƠ: Đề nghị mua vật tư chờ TGĐ tháng 10","LĨNH_VỰC: finance","THÁNG: 10","NĂM: 2026","ĐƠN_VỊ: TCKT","NHÂN_VIÊN_GIẢ: Nguyễn Văn Mẫu","LOẠI_KHOẢN_MỤC: Vật tư","GIÁ_TRỊ_ĐỀ_NGHỊ: 120","DỰ_TOÁN_HỒ_SƠ: 130","GIÁ_TRỊ_ĐÃ_DUYỆT: 0","GIÁ_TRỊ_ĐÃ_XỬ_LÝ: 0","GIÁ_TRỊ_ĐÃ_THANH_TOÁN: 0","TRẠNG_THÁI: PENDING","CỜ_KIỂM_TRA: CHO_PHE_DUYET","01. Lập đề nghị","02. Trưởng bộ phận kiểm tra","03. TCKT kiểm soát","04. Chờ TGĐ","05. Chờ nghiệm thu","06. Chờ ghi nhận","07. Chờ báo cáo"];
 for(let i=1;i<=7;i++){let nn=String(i).padStart(2,"0");L.push("===== BIỂU MẪU "+nn+" | MẪU ĐỢT "+i+" =====","BM"+i+"-"+id+" /DEMO","Chỉ là hồ sơ hư cấu phục vụ tập huấn, không có chữ ký thật.","===== KẾT THÚC BIỂU MẪU "+nn+" =====")}return L.join("\n")}
function render(){if(!C.manifest)return;const fn={dashboard:renderDashboard,tasks:renderTasks,cases:()=>{renderCaseList();renderCase()},domains:renderDomains,finance:renderFinance,projects:renderProjects,audit:renderAudit};fn[tab]?.()}
function show(t){tab=t;document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("selected",x.dataset.tab===t));document.querySelectorAll(".page").forEach(x=>x.hidden=x.id!=="p-"+t);render();window.scrollTo({top:0,behavior:"smooth"})}
async function action(name){
 try{
 if(name==="fullReport"){download("CTY-AI-3.3-BAO-CAO-TOAN-DIEN.txt",fullReport());return}
 if(name==="syncall"){let btn=$("syncBtn");btn.disabled=true;let r=await C.verifyAll((n,total,failed)=>btn.textContent="Đã đọc "+n+"/"+total+" · lỗi "+failed);btn.disabled=false;btn.textContent="↻ Đối chiếu 360 TXT";render();toast("Đã đối chiếu "+r.ok+" TXT; lỗi "+r.fail);return}
 if(["complete","assign","return","comment","resetCase"].includes(name)){
 if(name==="resetCase"){if(!confirm("Khôi phục về kịch bản gốc? Nhật ký thao tác vẫn được giữ."))return;await C.act(selected,"reset",{actor:"Điều phối mô phỏng"});}
 else await C.act(selected,name,{actor:$("operator")?.value,to:$("recipient")?.value,note:$("actionNote")?.value||"",amount:$("amount")?.value});
 render();toast("Đã ghi nhận thao tác mô phỏng "+name);return}
 if(name==="read"){await C.verify(C.find(selected));render();toast("Đã xác minh nguồn TXT");return}
 if(name==="downloadCase"){let c=C.find(selected);download(c.id+".txt",await C.verify(c));return}
 if(name==="formtxt"){let c=C.find(selected);await C.verify(c);download(c.id+"-BM"+(formIndex+1)+".txt",C.getForm(c,formIndex));return}
 if(["reportcsv","domaincsv","taskcsv","casecsv","financecsv","projectcsv","logcsv"].includes(name)){let type={reportcsv:"domains",domaincsv:"domains",taskcsv:"tasks",casecsv:"cases",financecsv:"finance",projectcsv:"projects",logcsv:"logs"}[name];download("CTY-AI-3.3-"+type+".csv",csv(reportRows(type)),"text/csv;charset=utf-8");return}
 if(name==="backup"){download("CTY-AI-3.3-backup.json",JSON.stringify(C.data,null,2),"application/json");return}
 if(name==="resetAll"){if(confirm("Xóa toàn bộ thao tác thử và hồ sơ nhập trên máy? Hãy sao lưu trước.")){C.reset();selected=C.all()[0].id;render()}return}
 if(name==="print"){window.print();return}
 if(name==="template"){download("CTY-AI-3.3-MAU-7-BUOC.txt",template());return}
 if(name==="import"){let file=$("upload").files?.[0];if(!file)throw Error("Chọn tệp TXT trước");if(file.size>150000)throw Error("TXT vượt 150KB");let c=C.importTxt(await file.text());selected=c.id;formIndex=0;show("cases");toast("Đã nhập "+c.id);return}
 }catch(e){toast("Chưa thực hiện: "+e.message);if(name==="import")$("importNotice").textContent=e.message}}
function handleClick(e){let b=e.target.closest("button");if(!b)return;if(b.dataset.tab){show(b.dataset.tab);return}if(b.dataset.open){selected=b.dataset.open;formIndex=0;show("cases");return}if(b.dataset.domain){filters.reportDomain=b.dataset.domain;$("reportDomain").value=filters.reportDomain;show("domains");return}if(b.dataset.report){filters.reportDomain=b.dataset.report;$("reportDomain").value=filters.reportDomain;renderDomains();return}if(b.dataset.stage!==undefined){formIndex=Number(b.dataset.stage);renderCase();return}if(b.dataset.action)action(b.dataset.action)}
async function boot(){try{
 let r=await fetch("../cty-ai-3-2/manifest.json",{cache:"no-cache"});if(!r.ok)throw Error("HTTP "+r.status);C.init(await r.json());
 const opts='<option value="">Tất cả lĩnh vực</option>'+C.manifest.domains.map(d=>'<option value="'+E(d.key)+'">'+E(d.name)+'</option>').join("");
 $("taskDomain").innerHTML=opts;$("caseDomain").innerHTML=opts;$("reportDomain").innerHTML=C.manifest.domains.map(d=>'<option value="'+E(d.key)+'">'+E(d.name)+'</option>').join("");$("reportDomain").value=filters.reportDomain;
 selected=C.all()[0].id;
 $("taskSearch").oninput=e=>{filters.task=e.target.value.toLowerCase();renderTasks()};
 $("taskDomain").onchange=e=>{filters.taskDomain=e.target.value;renderTasks()};
 $("taskMode").onchange=e=>{filters.taskMode=e.target.value;renderTasks()};
 $("caseSearch").oninput=e=>{filters.case=e.target.value.toLowerCase();renderCaseList()};
 $("caseDomain").onchange=e=>{filters.caseDomain=e.target.value;renderCaseList()};
 $("caseStatus").onchange=e=>{filters.caseStatus=e.target.value;renderCaseList()};
 $("reportDomain").onchange=e=>{filters.reportDomain=e.target.value;renderDomains()};
 $("auditType").onchange=e=>{filters.logType=e.target.value;renderAudit()};
 $("auditSearch").oninput=e=>{filters.logSearch=e.target.value.toLowerCase();renderAudit()};
 $("restore").onchange=async e=>{try{let f=e.target.files?.[0];if(!f)return;if(f.size>8000000)throw Error("Backup quá lớn");C.setData(JSON.parse(await f.text()));render();toast("Đã khôi phục")}catch(err){toast(err.message)}e.target.value=""};
 document.addEventListener("click",handleClick);show("dashboard");
 }catch(e){$("error").hidden=false;$("error").textContent="Không đọc được cơ sở dữ liệu CTY AI 3.2: "+e.message}}
window.CTY33UI={boot,render,show,reportRows,taskRows,template,action,fullReport};
boot();
})();