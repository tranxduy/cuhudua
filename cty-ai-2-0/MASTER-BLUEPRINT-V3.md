# CTY AI 3.0 — MASTER BLUEPRINT
## Đặc tả phát triển từ bản CTY AI 2.0 Public

**Trạng thái:** Kế hoạch kiến trúc và chức năng đề xuất, không phải mô tả chức năng đã triển khai.  
**Phạm vi công khai:** Không có dữ liệu mật, thông tin tài khoản, chứng từ thực hoặc nhân sự thật.  
**Nguyên tắc:** Đúng dữ liệu, đúng quyền, có bằng chứng, có người chịu trách nhiệm; tự động hóa các bước lặp, không tự động phê duyệt giao dịch trọng yếu.

### 1. Cấu trúc công nghệ
- GitHub Pages (Public) chỉ dành cho demo bằng dữ liệu giả; không chạy backend hay lưu secret.
- Sản phẩm thật: giao diện web riêng với đăng nhập, backend điều phối (FastAPI/Node.js), PostgreSQL, object storage được phân quyền, hàng đợi và worker, bộ tích hợp; tất cả có kiểm thử phục hồi.
- Model gateway phía backend kết nối mô hình AI (có thể qua OpenRouter nếu chính sách và hợp đồng cho phép); lọc dữ liệu và cấp quota theo Agent.
- Truy vấn dữ liệu số dùng SQL/truy vấn có xác nhận quyền; tìm tài liệu dùng RAG (Retrieval-Augmented Generation: truy xuất tài liệu bổ trợ câu trả lời). AI không tự đặt số liệu.
- Kết nối Base, eOffice, kế toán, nguồn số liệu nhà máy theo quyền API/exports được xác nhận; với dữ liệu hệ thống vận hành điện chỉ đọc, cách ly và không có lệnh điều khiển.

### 2. 16 phân hệ
1. Điều hành: bảng 5 phút, các vấn đề trọng yếu, quyết định chờ duyệt, lịch nhiệm vụ.
2. Sản xuất: kế hoạch/thực hiện điện năng, tổ máy, thời gian dừng, chỉ số nguồn nước và doanh thu.
3. Tài chính: ngân sách, luồng tiền, tiền gửi, nợ, dòng tiền dự báo, cảnh báo biến động.
4. Kế toán: kiểm tra chứng từ, sổ sách, đối chiếu hóa đơn/đơn hàng/biên bản, tài sản, khóa sổ.
5. Mua sắm: nhu cầu, dự toán, kế hoạch, cạnh tranh, lựa chọn, hợp đồng, nghiệm thu, thanh toán.
6. Đầu tư: tiến độ, thiết kế, hợp đồng, giải ngân, vốn, phân tích hiệu quả.
7. Bảo trì: thiết bị, kế hoạch bảo dưỡng, lịch sử sửa chữa, vật tư, khắc phục lỗi.
8. Kho & tài sản: thẻ kho, tồn kho, tuổi tồn, kiểm kê, nguyên giá/khấu hao.
9. Nhân sự: ca kíp, công, lương, nghỉ phép, tuyển dụng, đào tạo, năng lực.
10. Văn thư: công văn đến/đi, số văn bản, phân luồng, dự thảo, trình ký, lưu trữ.
11. Pháp chế: thư viện pháp luật/quy chế hiệu lực, ma trận thẩm quyền, kiểm tra mâu thuẫn.
12. Kiểm soát: đối chiếu bằng chứng, ngoại lệ, kiểm tra định kỳ, theo dõi kiến nghị.
13. An toàn: hồ đập, sự cố, lịch kiểm định, PCCC/PCTT, báo cáo sự kiện.
14. Tri thức: tìm kiếm theo trang/điều/phiên bản, liên kết hồ sơ, bảo toàn xuất xứ.
15. Quản trị Agent: đăng ký công cụ, prompt version, quyền, giới hạn, chạy thử, đánh giá.
16. Báo cáo: báo cáo lập tự động theo sự kiện/lịch, drill-down và trích nguồn.

### 3. Vai trò Agent, sơ đồ phụ thuộc
Các Agent gồm: Vận hành, Tài chính, Kế toán, Mua sắm, Pháp chế, Đầu tư, Bảo trì, Nhân sự, Văn thư, An toàn, Kiểm soát chéo và Thư ký. **Orchestrator** không là người duyệt, mà là bộ định tuyến và giám sát quy trình.

Luồng tiêu chuẩn: nhận sự kiện → phân loại → tạo `case_id` → kiểm tra dữ liệu và quyền → fan-out các tác vụ độc lập → đồng bộ kết quả fan-in → kiểm tra chéo → tổng hợp rủi ro → tạo nhiệm vụ/khuyến nghị → human approval khi cần → cập nhật trạng thái → lưu chứng cứ và báo cáo.

Các Agent **không được** tự do trao toàn bộ dữ liệu giữa nhau; mỗi lần giao chỉ truyền phần dữ liệu cần thiết. Workflow là đồ thị phụ thuộc có hướng, không vòng lặp vô hạn; những bước có sai dữ liệu phải stop hoặc chuyển human review.

Mô hình xử lý:
- `NEW → TRIAGED → WAITING_INPUT → RUNNING → REVIEW_REQUIRED → HUMAN_APPROVAL → CLOSED`, với nhánh `FAILED/RETRY/BLOCKED/CANCELLED`.
- Mỗi bước ghi `workflow_id`, `run_id`, `case_id`, `agent_id`, `input_hash`, `outputs`, `evidence_refs`, `model_version`, `rule_version`, `status`, `started_at`, `ended_at`, `errors`.
- Tác vụ độc lập được xử lý song song; Agent cần dữ liệu đầu vào phải đợi điều kiện và chữ ký điện tử xác thực nếu có.
- Retry có giới hạn, idempotency key để không tạo hai lệnh cùng nội dung; queue lỗi giữ lại để xử lý thủ công.
- Agent không tự ký, duyệt hợp đồng, phê duyệt thanh toán, ghi sổ chính thức, xóa chứng từ hoặc điều khiển nhà máy.

### 4. 10 quy trình xuyên phòng ban ưu tiên
1. Mua sắm → kiểm tra ngân sách → đối chiếu quy chế → kiểm tra hợp đồng → nghiệm thu → kiểm tra chứng từ → trình duyệt.
2. Thanh toán → tài chính + kế toán + pháp chế → kiểm soát chéo → người có thẩm quyền duyệt → kế toán thực hiện và đối chiếu.
3. Sản lượng thấp → vận hành + kinh doanh điện + bảo trì → tài chính phân tích → điều hành giao xử lý.
4. Công nợ quá hạn → kế toán xác minh → tài chính kế hoạch thu → pháp chế rà soát điều khoản → thư ký theo dõi.
5. Sự cố thiết bị → vận hành lập sự kiện → bảo trì phân tích → an toàn kiểm tra → mua sắm vật tư → chủ trì kỹ thuật duyệt.
6. Dự án trễ tiến độ → đầu tư → tài chính → pháp chế hợp đồng → kiểm soát chéo → điều hành quyết định.
7. Chấm công lệch → nhân sự đối chiếu lịch trực → kế toán tính lương → kiểm soát rủi ro → người có thẩm quyền duyệt.
8. Văn bản đến → văn thư phân loại → pháp chế/đơn vị chuyên môn → dự thảo → người ký → văn thư phát hành.
9. Khóa sổ → kế toán đối chiếu nguồn → tài chính phân tích → kiểm soát ngoại lệ → kế toán trưởng ký xác nhận.
10. Nghĩa vụ an toàn định kỳ → an toàn → đơn vị vận hành → xác nhận người phụ trách → báo cáo quá hạn cho điều hành.

### 5. Các sự kiện khởi động tự động
- Văn bản đến hoặc hồ sơ mới.
- File vừa được ký số / trạng thái hồ sơ thay đổi.
- Số liệu mới được nhập/đồng bộ.
- Chỉ tiêu vượt ngưỡng được phê duyệt.
- Đến hạn hoặc quá hạn thực hiện.
- Biên bản nghiệm thu được xác nhận.
- Phát hiện chênh lệch giữa hai hệ thống.
- Báo cáo định kỳ đến lịch.
- Quá trình Agent thất bại / dữ liệu không đầy đủ.
- Quy chế cập nhật hiệu lực.

### 6. 14 loại nhật ký (log)
1. `event_log`: nhận sự kiện nguồn, thời điểm, mã gốc và hash.
2. `ingestion_log`: file/nguồn được tiếp nhận, trạng thái đồng bộ.
3. `ocr_log`: trang đã đọc, trang lỗi, độ tin cậy và yêu cầu xác minh.
4. `case_log`: vòng đời hồ sơ và người phụ trách.
5. `agent_run_log`: nhiệm vụ, model, rule version, thời gian, trạng thái, input/output hash.
6. `handoff_log`: agent gửi, agent nhận, payload refs, điều kiện và ACK.
7. `evidence_log`: tài liệu gốc, phiên bản, nơi lưu, trích dẫn trang/dòng.
8. `validation_log`: kiểm tra toán học, tính nhất quán và số liệu nguồn.
9. `finding_log`: lỗi/rủi ro, mức độ, bằng chứng, owner, hạn khắc phục.
10. `approval_log`: người xem, kết luận, phiên bản hồ sơ, timestamp, trạng thái chữ ký.
11. `change_log`: trường dữ liệu trước/sau, lý do, tài khoản và chức năng thay đổi.
12. `integration_log`: API in/out, retry, kết quả, idempotency ID, lỗi.
13. `security_log`: đăng nhập, cấp quyền, từ chối truy cập, bất thường.
14. `ai_cost_log`: mô hình, token, latency, chi phí, lần lỗi và fallback.

Không dùng log AI làm bằng chứng rằng nghiệp vụ đã được người có thẩm quyền ký. Log phải có retention, chống sửa và chức năng truy xuất theo quyền; nội dung nhạy cảm được redacted.

### 7. 25 nhóm báo cáo đầu ra
**Điều hành:** (1) 5 phút đầu ngày; (2) cảnh báo trọng yếu; (3) công việc quá hạn; (4) báo cáo tuần; (5) báo cáo tháng; (6) đối chiếu kế hoạch năm.

**Tài chính:** (7) doanh thu – sản lượng – giá; (8) chi phí theo khoản mục/đơn vị; (9) lợi nhuận/độ lệch ngân sách; (10) dòng tiền 13 tuần; (11) tuổi nợ phải thu/phải trả; (12) đối chiếu ngân hàng.

**Nghiệp vụ:** (13) mua sắm và tiến trình phê duyệt; (14) tính đầy đủ hồ sơ thanh toán; (15) lịch hợp đồng và hạn bảo lãnh; (16) tiến độ dự án; (17) giải ngân đầu tư; (18) sửa chữa bảo dưỡng; (19) tồn kho và tài sản; (20) nhân sự – ca trực – tiền lương; (21) an toàn – kiểm định – sự cố.

**Quản trị và AI:** (22) nghị quyết, văn bản và nhiệm vụ thực hiện; (23) điểm tuân thủ/chưa có chứng cứ; (24) tình trạng thực hiện kiến nghị; (25) chất lượng Agent, lỗi, chi phí và tỷ lệ phải sửa.

Mỗi báo cáo có template, kỳ, nguồn dữ liệu, mức đầy đủ, tác giả máy/người xác nhận, trạng thái nháp/đã duyệt, lịch sử phiên bản, xuất Excel/Word/PDF/CSV (tùy đầu ra phù hợp).

### 8. Truy vấn tiếng Việt mục tiêu
- Sản lượng hôm nay so với tuần trước và KH tháng?
- Doanh thu điện giảm do lượng hay giá?
- Đơn vị nào có chi phí sửa chữa vượt dự toán?
- Lập bảng đối chiếu công nợ theo khách hàng và ngày quá hạn.
- Liệt kê hồ sơ thanh toán thiếu nghiệm thu.
- Những hợp đồng nào sắp hết hạn hoặc đang chưa có bảo lãnh?
- Tổng số tiền mua sắm theo nhà cung cấp trong 12 tháng.
- Có yêu cầu mua cùng hạng mục tách thành nhiều đề nghị không?
- Dự án nào tăng chi phí hoặc chậm mốc?
- Thiết bị nào hỏng lặp lại nhiều lần?
- Ca nào có bảng công không khớp lịch trực?
- Quy chế nào còn hiệu lực, điều khoản nào quy định thẩm quyền?
- Văn bản nào giao việc nhưng chưa có bằng chứng hoàn thành?
- Những kết luận AI nào bị người kiểm tra bác bỏ?
- Hôm nay có quyết định nào cần Tổng Giám đốc xử lý?
Mỗi câu trả lời cần có dữ liệu nguồn, thời điểm cập nhật, công thức tính, phạm vi truy vấn, trạng thái chưa đủ chứng cứ.

### 9. CSDL dữ liệu lõi dự kiến
`organizations`, `units`, `users`, `roles`, `role_assignments`, `data_sources`, `data_syncs`, `documents`, `document_versions`, `policies`, `policy_versions`, `cases`, `case_artifacts`, `workflow_templates`, `workflow_runs`, `agent_definitions`, `agent_runs`, `agent_handoffs`, `evidence`, `findings`, `tasks`, `approvals`, `notifications`, `measurements`, `budgets`, `reports`, `audit_events`, `model_usage`.  
Kho lưu trữ file riêng; bảng database lưu metadata và quyền truy cập, không đẩy toàn bộ file scan vào bản ghi.

### 10. Phân quyền
- Ban điều hành: dashboard/duyệt đúng thẩm quyền, không tự bypass các bước kiểm tra.
- TCKT: nguồn sổ kế toán, hồ sơ thanh toán và đối chiếu; ký duyệt theo chức danh/ủy quyền thực.
- Đơn vị nghiệp vụ: xem và sửa dữ liệu thuộc phạm vi phân công.
- HĐQT: xem/tác nghiệp theo vai trò quản trị, không nhận quyền tự động của TGĐ.
- BKS: kênh giám sát độc lập, đọc tài liệu thuộc quyền giám sát, yêu cầu giải trình, không tự duyệt thanh toán hay tác nghiệp ban điều hành.
- Admin kỹ thuật: cấu hình, sao lưu, vận hành hệ thống nhưng không mặc nhiên có quyền đọc mọi nội dung nhạy cảm.
- AI service account: tối thiểu quyền, quyền có thời hạn theo từng nhiệm vụ.

### 11. UI và tính năng bổ trợ
- Trang Tổng quan 5 phút và Inbox quyết định.
- Hồ sơ công việc, đồ thị Agent và timeline.
- Inbox yêu cầu bổ sung; nhắc hạn tự động.
- Smart Search theo từ khóa, câu hỏi tiếng Việt, tài liệu và danh sách kết quả.
- Viewer PDF có gạch dấu nguồn, đối chiếu hai phiên bản.
- Ma trận thẩm quyền/luồng trình ký, phân quyền và điều kiện dừng.
- Dashboard biểu đồ, drill-down, filter và lưu bộ lọc.
- Kanban, lịch, Gantt, phụ thuộc công việc.
- Bộ cấu hình Agent, chạy thử, prompt/version, công cụ và hạn mức chi phí.
- Thông báo theo quyền, email nội bộ có kiểm soát, mobile responsive.
- Trình tạo báo cáo có mẫu, schedule, quyền gửi và xác nhận.
- Kiểm tra dữ liệu đầu vào, chuẩn hóa đơn vị đo và nguồn chứng từ.
- Sao lưu, khôi phục, quản lý phiên bản và kiểm thử hồi quy.

### 12. Lộ trình, ưu tiên và nghiệm thu
- **P0 — Khả dụng và an toàn:** đăng nhập, backend, PostgreSQL, quyền, mã hồ sơ, nhật ký bất biến, backup/restore, bản Public chỉ demo.
- **P1 — 3 workflow thật:** hồ sơ mua sắm/thanh toán, báo cáo quản trị, văn bản đến/giao việc; có xác thực dữ liệu và phê duyệt.
- **P2 — Thư viện tri thức và RAG:** quy chế hiệu lực, OCR đối chiếu, trích nguồn, trả lời có dẫn chứng.
- **P3 — Đồng bộ hệ thống:** API Base/eOffice/kế toán/nhà máy và dashboard cập nhật theo lịch.
- **P4 — Dự báo, tối ưu:** phân tích nguyên nhân, dự báo dòng tiền, hiệu quả đầu tư, bảo trì có điều kiện dữ liệu.

**Tiêu chí chấp nhận:** Test phân quyền deny/allow; nguồn truy xuất được; không log dữ liệu mật; tính toán độc lập khớp; phục hồi dữ liệu; retry không sinh giao dịch trùng; dừng khi thiếu bằng chứng; tất cả hành động trọng yếu cần duyệt của người có thẩm quyền. Tỷ lệ thông qua thông thường không được che khuất lỗi trọng yếu.

### 13. Định hướng công nghệ và pháp lý
- PostgreSQL với cơ chế phân quyền cấp hàng, kiểm thử các trường hợp bị từ chối.
- n8n hoặc worker riêng để điều phối sự kiện; khi mở rộng có hàng đợi Redis và worker.
- API AI đặt ở máy chủ và áp dụng chính sách nhà cung cấp, ẩn/chặn dữ liệu nhạy cảm; không lưu API key tại frontend.
- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 hiệu lực 01/01/2026 cần được rà soát cụ thể trước khi xử lý dữ liệu nhân sự, cổ đông và bên thứ ba.
- Tham khảo tiêu chuẩn an toàn GenAI/Agent, chống prompt injection, lộ dữ liệu và quyền hành động quá rộng.

**KẾT LUẬN:** Mục tiêu 5 phút là thời gian lãnh đạo nhận biết và giao quyết định hằng ngày, không thay thế vận hành an toàn nhà máy, nghĩa vụ kiểm toán hoặc quy trình phê duyệt hợp pháp.
