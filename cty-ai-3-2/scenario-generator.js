return (function generate(c,j,manifest){
 const i=j%45,k=Math.floor(j/45),m=1+((i%10+Math.floor(i/10)*3+(k%2)*5)%10);
 const staff=manifest.departments.find(x=>x.code==="TCKT").staff,ceo=manifest.executives.find(x=>x.role==="Tổng Giám đốc").name;
 const actors=[c.owner,c.manager,staff[(i+2)%5],ceo,c.owner,staff[(i+3)%5],staff[(i+4)%5]];
 const labels=["PHIẾU ĐỀ NGHỊ VÀ DỰ TOÁN","PHIẾU TRƯỞNG BỘ PHẬN KIỂM TRA – TRÌNH","PHIẾU TCKT KIỂM SOÁT VÀ ĐỒNG Ý TRÌNH","PHIẾU TỔNG GIÁM ĐỐC PHÊ DUYỆT","BIÊN BẢN THỰC HIỆN – NGHIỆM THU","PHIẾU KẾ TOÁN GHI NHẬN","PHIẾU TỔNG HỢP BÁO CÁO THÁNG"];
 const fmt=n=>Number(n||0).toLocaleString("vi-VN",{maximumFractionDigits:2});
 const weekday=t=>{let d=new Date(t);while([0,6].includes(d.getUTCDay()))d.setUTCDate(d.getUTCDate()+1);return d};
 const next=t=>{let d=new Date(t);d.setUTCDate(d.getUTCDate()+1);return weekday(d)};
 let d=weekday(`2026-${String(m).padStart(2,"0")}-${String(2+Math.floor(i/10)*3+(i%2)).padStart(2,"0")}T09:00:00Z`);
 const stop=c.status==="CLOSED"?7:c.status==="APPROVED"?4:c.status==="PENDING"?3:(i%2===0?1:2);
 const stages=labels.map((title,n)=>{if(n)d=next(d);const st=n<stop?"DONE":c.status==="REVIEW"&&n===stop?"RETURNED":c.status==="PENDING"&&n===3?"WAITING":c.status==="APPROVED"&&n===4?"WAITING":"NOT_STARTED";return{title,status:st,actor:actors[n],day:["DONE","RETURNED"].includes(st)?d.toISOString().slice(0,10):null,id:`BM${n+1}-${c.id}`}});
 const title=c.title.replace(/\(tháng\s+\d{1,2}\)/i,`(tháng ${String(m).padStart(2,"0")})`);
 const asText=[
 [`Kính trình Trưởng đơn vị ${actors[1]}.`,`Người lập ${actors[0]} đề nghị xử lý ${title}.`,`Loại nghiệp vụ: ${c.type}; giá trị đề nghị ${fmt(c.proposed)} triệu, dự toán riêng ${fmt(c.budget)} triệu.`,`Hồ sơ kèm (giả): Tờ trình ĐN-${c.id}, bảng dự toán DT-${c.id}, bảng giải trình nội dung và khối lượng.`,`Đầu ra: chuyển trưởng đơn vị kiểm tra trước khi gửi TCKT.`],
 [`Trưởng đơn vị: ${actors[1]}.`,`Đã rà sự cần thiết, tính hợp lệ biểu mẫu, kinh phí và điều kiện thực hiện theo nghiệp vụ giả định.`,`Giá trị dự toán ${fmt(c.budget)} triệu; đề nghị ${fmt(c.proposed)} triệu; chênh lệch ${fmt(c.proposed-c.budget)} triệu.`,`Ý kiến: ${stages[1].status==="RETURNED"?"Không đồng ý trình, yêu cầu người lập bổ sung hồ sơ và giải trình.":stages[1].status==="DONE"?"Đồng ý trình Phòng Tài chính – Kế toán kiểm soát, chưa cho phép chi.":"Chưa thực hiện do bước trước chưa hoàn tất."}`],
 [`Người kiểm soát TCKT: ${actors[2]} (khác người lập theo dữ liệu giả).`,`Checklist: hồ sơ đề nghị, thẩm quyền cấp trình, dự toán, bộ chứng từ, hợp đồng/nghiệm thu (nếu có), điều kiện thanh toán và tính thống nhất số tiền.`,`Kết quả: ${stages[2].status==="RETURNED"?"Chưa đồng ý trình, trả hồ sơ để bổ sung chứng từ/giải trình.":stages[2].status==="DONE"?"Đã kiểm soát và đồng ý trình người có thẩm quyền; cần xác minh giá trị chữ ký khi áp dụng thật.":"Chưa được kiểm soát."}`,`LƯU Ý: Phòng TCKT kiểm tra nghiệp vụ và đồng ý trình, không thay thế phê duyệt của TGĐ. QĐ21/2024 về tài chính chỉ là tham chiếu chưa xác minh hiệu lực.`],
 [`Kính trình Tổng Giám đốc ${actors[3]}.`,`Tài liệu trình: đề nghị, ý kiến trưởng bộ phận, phiếu kiểm soát TCKT, dự toán, hồ sơ giải trình; đều là dữ liệu mô phỏng.`,`Giá trị đề nghị ${fmt(c.proposed)} triệu; giá trị được duyệt giả định ${fmt(c.approved)} triệu.`,`Quyết định: ${stages[3].status==="DONE"?"PHÊ DUYỆT MÔ PHỎNG trong phạm vi giá trị được duyệt, giao bộ phận chủ trì thực hiện.":stages[3].status==="WAITING"?"ĐANG CHỜ TGĐ XEM XÉT; KHÔNG ĐƯỢC THỰC HIỆN.":"CHƯA CÓ QUYẾT ĐỊNH TGĐ; hồ sơ dừng ở bước trước."}`,`Chữ ký: ${stages[3].status==="DONE"?"MẪU TÊN GIẢ – KHÔNG CÓ CHỮ KÝ THẬT":"CHƯA KÝ"}.`],
 [`Đơn vị thực hiện: ${c.dept}, đầu mối ${actors[4]}.`,`Bộ chứng từ thực hiện giả: Phiếu công việc CV-${c.id}, bảng khối lượng KL-${c.id}, biên bản nghiệm thu NT-${c.id}, bảng kê chất lượng (nếu áp dụng).`,`Kết quả: ${stages[4].status==="DONE"?"Đã thực hiện, nghiệm thu giả định và xác nhận giá trị hoàn tất "+fmt(c.processed)+" triệu đồng.":"CHƯA NGHIỆM THU; không có căn cứ ghi nhận giá trị đã xử lý."}`,`Người xác nhận: ${stages[4].status==="DONE"?actors[4]+" (mô phỏng)":"Chưa có xác nhận"}.`],
 [`Người ghi nhận: ${actors[5]}.`,`Căn cứ kiểm tra: tờ trình, phiếu trưởng bộ phận, kiểm soát TCKT, quyết định TGĐ (giả), nghiệm thu và chứng từ giá trị.`,`Số đã xử lý giả định ${fmt(c.processed)} triệu; đã thanh toán giả định ${fmt(c.paid)} triệu; không vượt giá trị được duyệt ${fmt(c.approved)} triệu.`,`Kết luận: ${stages[5].status==="DONE"?"Đã lập phiếu ghi nhận nghiệp vụ GIẢ, không ghi sổ kế toán thực.":"Chưa ghi nhận; không được lấy đề nghị làm chi phí đã xử lý."}`],
 [`Người lập báo cáo: ${actors[6]}; kỳ báo cáo tháng ${String(m).padStart(2,"0")}/2026.`,`Mã hồ sơ nguồn ${c.id}; đơn vị ${c.dept}; khoản mục ${c.type}.`,`Giá trị đề nghị ${fmt(c.proposed)} triệu; duyệt giả ${fmt(c.approved)} triệu; đã xử lý giả ${fmt(c.processed)} triệu; thanh toán giả ${fmt(c.paid)} triệu.`,`Kết quả: ${stages[6].status==="DONE"?"Đã tổng hợp vào báo cáo lĩnh vực theo kỳ giả định.":"Chỉ ghi trong danh mục theo dõi; chưa cộng vào giá trị đã xử lý."}`,`Không cộng trùng chi phí kế toán với mua sắm, sửa chữa, giải ngân đầu tư hoặc sản lượng điện.`]
 ];
 if(c.domain==="project")asText[6].push(`Dự án ${c.projectId}: ${c.projectName}; tổng mức ${fmt(c.projectBudget)} triệu ghi 1 lần, KH tiến độ ${c.progressPlan}%, TH ${c.progressActual}% (mô phỏng).`);
 if(c.domain==="production")asText[6].push(`Sản lượng KH ${c.kwhPlan} kWh, TH ${c.kwhActual} kWh; doanh thu mẫu ${c.revenue} triệu.`);
 const L=[
 "CTY AI 3.2 — HỒ SƠ VĂN BẢN GIẢ ĐỊNH CÓ 7 BIỂU MẪU VÀ NHẬT KÝ THÁNG, KHÔNG PHẢI BẢN KÝ",
 `MÃ_HỒ_SƠ: ${c.id}`,`TÊN_HỒ_SƠ: ${title}`,`LĨNH_VỰC: ${c.domain}`,`THÁNG: ${m}`,`NĂM: 2026`,
 `ĐƠN_VỊ: ${c.dept}`,`NHÂN_VIÊN_GIẢ: ${c.owner}`,`TRƯỞNG_BỘ_PHẬN_GIẢ: ${c.manager}`,`NGƯỜI_KIỂM_SOÁT_TCKT: ${actors[2]}`,`TỔNG_GIÁM_ĐỐC_GIẢ: ${actors[3]}`,`KẾ_TOÁN_GHI_NHẬN: ${actors[5]}`,
 `LOẠI_KHOẢN_MỤC: ${c.type}`,`GIÁ_TRỊ_ĐỀ_NGHỊ: ${c.proposed}`,`DỰ_TOÁN_HỒ_SƠ: ${c.budget}`,`GIÁ_TRỊ_ĐÃ_DUYỆT: ${c.approved}`,`GIÁ_TRỊ_ĐÃ_XỬ_LÝ: ${c.processed}`,`GIÁ_TRỊ_ĐÃ_THANH_TOÁN: ${c.paid}`,`TRẠNG_THÁI: ${c.status}`,`CỜ_KIỂM_TRA: ${c.suggestedRisk}`,
 `KỲ_BÁO_CÁO: ${String(m).padStart(2,"0")}/2026`,"Ghi chú: TẤT CẢ tên người, dấu, chữ ký, số tiền, quyết định đều là GIẢ ĐỊNH.","","==== BẢNG THEO DÕI LUÂN CHUYỂN HỒ SƠ ===="
 ];
 for(let n=0;n<7;n++){let x=stages[n];L.push(`BƯỚC ${n+1}: ${x.title} | ${x.status} | ${x.actor} | ${x.day||"CHƯA CÓ NGÀY"} | ${x.id}`)}
 for(let n=0;n<7;n++){let x=stages[n],p=String(n+1).padStart(2,"0");L.push("",
 `===== BIỂU MẪU ${p} | ${x.title} =====`,
 "CÔNG TY CỔ PHẦN THỦY ĐIỆN GERUCO SÔNG CÔN (HỒ SƠ THỬ NGHIỆM)",
 `Số: ${x.id}/DEMO                      MẪU GIẢ – KHÔNG DÙNG KÝ/THANH TOÁN`,
 `Ngày xử lý: ${x.day||"CHƯA PHÁT SINH"}`,
 `TÊN BIỂU MẪU: ${x.title}`,`Mã hồ sơ: ${c.id} | Đơn vị: ${c.dept} | Kỳ: ${String(m).padStart(2,"0")}/2026`,
 "------------------------------------------------------------",...asText[n],
 `TRẠNG THÁI: ${x.status} – ${x.status==="DONE"?"ĐÃ XỬ LÝ MÔ PHỎNG":x.status==="RETURNED"?"TRẢ BỔ SUNG":"CHƯA PHÁT SINH/CHỜ"}`,
 `Người lập/xử lý: ${x.actor}.`,`Ô ký, đóng dấu: [KHÔNG CÓ CHỮ KÝ / CON DẤU THẬT]`,
 `===== KẾT THÚC BIỂU MẪU ${p} =====`);}
 L.push("HẾT HỒ SƠ MÔ PHỎNG. KHÔNG DÙNG LÀM CHỨNG TỪ HẠCH TOÁN/CHI TIỀN.");
 return L.join("\n");
});