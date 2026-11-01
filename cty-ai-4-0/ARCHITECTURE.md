# CTY AI 4.0 – ĐẶC TẢ KIẾN TRÚC NÂNG CẤP NỘI BỘ
**Trạng thái: ĐẶC TẢ/THIẾT KẾ – CHƯA TRIỂN KHAI CLOUD.** Ngày 01/11/2026.
**Nguồn đầu vào:** CTY AI 3.3 mô phỏng, 360 hồ sơ TXT/8 lĩnh vực. Dữ liệu công ty thật không được đưa vào repository công khai.

## 1. Mục tiêu
Chuyển từ web JavaScript lưu localStorage sang hệ thống cộng tác có backend, định danh, phân quyền thực thi tại server/db, hồ sơ nguồn, nhật ký/audit và báo cáo đúng người đúng kỳ. Không cho phép tự động phê duyệt, ký số, thanh toán, hạch toán hoặc điều khiển nhà máy từ AI.

## 2. Kiến trúc logic
```
SPA TypeScript (React/Vite; đăng nhập; Inbox; My Tasks; Workflow; Reports; File Viewer)
   │  JWT định danh; request-id/idempotency key; HTTPS
   ▼
Backend APIs / Supabase Edge Functions
   ├─ Xử lý chuyển trạng thái, kiểm tra ma trận ủy quyền và giao dịch nguyên tử
   ├─ Tạo sự kiện công việc, thông báo và audit
   ├─ OCR/trích xuất nội dung từ tệp (tùy định dạng; chưa mở tự động giai đoạn đầu)
   └─ AI Gateway: gọi nhà cung cấp AI bằng khóa ở server, kiểm soát dữ liệu ra ngoài
   │
   ├── PostgreSQL + RLS ── Auth / hồ sơ / step / work item / log / snapshot
   ├── Private Object Storage ── PDF DOCX XLSX JPG PNG + version hash
   └── Realtime / Outbox + cron ── chuông thông báo, email, SLA
```
Đề xuất Supabase (Auth + Postgres + Storage + Realtime + Edge Functions) cho bản thử nghiệm có đăng nhập. Nếu chính sách dữ liệu yêu cầu hạ tầng nội bộ/VN, phải đánh giá phương án khác trước khi gửi dữ liệu thật lên đám mây nước ngoài.

## 3. Dữ liệu (schema thiết kế, chưa phải migrations chạy được)
- orgs, departments, profiles, memberships, roles, role_permissions, delegations (hiệu lực từ–đến, hạn mức, loại hồ sơ);
- cases(id, org_id, type, owner, department_id, requested, approved, executed, paid, accounting_period, version, status);
- case_steps(id, case_id, ordinal, kind, assignee, state, started_at, due_at, finished_at, decision_ref);
- workflow_definitions, workflow_rules, approvals, return_requests, handoffs, tasks, comments;
- case_files, file_versions(file_key, mime, size, sha256, uploaded_by, uploaded_at, document_kind, signature_status, predecessor_id);
- audit_events(actor_user_id, action, aggregate_id, before, after, event_id, server_at, source_ip_hash);
- outbox_events, notifications, notification_delivery, sla_policies, escalation_rules;
- ai_jobs, ai_extracts, ai_findings(case_id, evidence_file_id, source_page_or_row, confidence, reviewed_by), ai_prompts_version;
- report_snapshots(accounting_period, closing_at, created_by, hash), report_lines, report_lineage.

Tất cả bảng kinh doanh phải có RLS và quyền SQL tối thiểu; admin tài khoản không được mặc nhiên đồng nghĩa với quyền phê duyệt nghiệp vụ. Tuyệt đối không đặt service/secret key ở frontend.

## 4. Ma trận quyền đề xuất – phải đối chiếu Điều lệ, quy chế, ủy quyền thực
| Chủ thể | Xem | Soạn/trình | Kiểm soát | Phê duyệt | Kiểm toán/giám sát |
|---|---|---|---|---|---|
| Người lập | Hồ sơ chính mình, hồ sơ được chia sẻ | Trong phạm vi đơn vị | Không mặc định | Không | Lịch sử của mình |
| Trưởng bộ phận | Hồ sơ thuộc bộ phận | Trả/bổ sung/trình | Thẩm tra chuyên môn | Chỉ khi được ủy quyền hợp lệ | Nhật ký bộ phận |
| Kế toán/TCKT | Hồ sơ thuộc phạm vi trách nhiệm kế toán, kể cả các bộ phận khác | Bổ sung nhận xét, chứng từ kế toán | Kiểm tra ngân sách/chứng từ/điều kiện thanh toán | Không thay TGĐ | Liên kết sổ, giải trình |
| Kế toán trưởng | Hồ sơ thuộc phân quyền kế toán-tài chính và trình duyệt liên quan | Ý kiến chuyên môn | Kiểm soát kế toán, có thể từ chối hồ sơ chưa đủ | Chỉ trong hạn mức ủy quyền đã xác thực | Báo cáo tổng hợp |
| TGĐ/PTGĐ | Theo quyền điều hành và phạm vi ủy quyền | Giao việc/chỉ đạo | Xem ý kiến trước duyệt | Theo thẩm quyền/hạn mức thực | Dashboard điều hành |
| HĐQT | Theo thẩm quyền quản trị | Nghị quyết/chủ trương | Theo quy chế | Chỉ loại việc thuộc thẩm quyền | Báo cáo |
| BKS | Theo quyền giám sát hợp pháp | Yêu cầu tài liệu/kiến nghị | Giám sát độc lập | Không thay ban điều hành duyệt | Truy vết, báo cáo |
| Quản trị kỹ thuật | Cấu hình máy chủ/hệ thống | Quản trị tài khoản | Bảo trì kỹ thuật | Không mặc định | Chỉ log được phân quyền |
Phân quyền là tổng hợp RBAC (vai trò) + ABAC (đơn vị, loại hồ sơ, người được giao, giá trị, hạn mức, trạng thái, quyền ủy quyền). Cấm người tạo tự phê duyệt cùng bước nếu vi phạm phân nhiệm.

## 5. State machine – không cứng hóa “mọi hồ sơ đều trình TGĐ”
DRAFT -> UNIT_REVIEW -> FINANCE_CHECK (khi có điều kiện) -> AUTHORIZED_APPROVAL -> EXECUTION/ACCEPTANCE -> ACCOUNTING_RECORD -> REPORTED.
- Workflow tùy loại nghiệp vụ và hạn mức, có thể phát sinh cấp có thẩm quyền khác hoặc bước phê duyệt chuyên môn bổ sung.
- Mỗi chuyển bước chạy transaction: kiểm tra JWT + role + quyền + thời hiệu ủy quyền + điều kiện chứng từ + version + idempotency; ghi đồng thời event/audit/outbox; trả 409 nếu có cập nhật đồng thời.
- Nhánh RETURN -> REWORK -> RESUBMIT lưu chuỗi gốc, không xóa dấu vết.
- BKS chỉ theo dõi/phát hiện rủi ro/kiến nghị; không tự ý phê duyệt thay người quản trị.

## 6. Quản lý file nguồn
- Private bucket; giới hạn MIME thực, kích cỡ, kiểm tra malware và SHA-256 khi nhập; không tin đuôi tệp.
- Có version, ngày/người tải, nguồn, trạng thái ký số, bản sau/bản trước; không cho ghi đè bản ký.
- File xem bằng viewer PDF/ảnh, Office preview được ủy quyền hoặc tải tệp có hạn. Dùng signed URL thời hạn ngắn; chặn danh sách public.
- “Có tệp đính kèm” != “hồ sơ có giá trị pháp lý”: xác minh chữ ký số, thông tin chủ thể, tính toàn vẹn và hồ sơ trình duyệt theo quy định liên quan; xem xét lưu trữ pháp lý.

## 7. Cảnh báo
- Mỗi sự kiện giao việc/chuyển lại/tạo hồ sơ/duyệt: lưu outbox trong transaction rồi phát thông báo.
- In-app chuông real-time với RLS, email fallback có log giao hàng. Thiết lập SLA theo loại việc/bước, giờ làm việc/lịch lễ, ngoại lệ, tạm dừng có lý do, nhắc trước hạn và thang escalations. Không tự gắn “quá hạn” khi chưa có SLA được phê duyệt.
- Không dùng một kết nối client để tạo “thông báo đã gửi thành công” khi chưa xác nhận giao hàng.

## 8. AI thật và kiểm soát rủi ro
- AI nằm sau backend (Edge Functions/server), khóa API chỉ ở secrets; cho phép cấu hình nhà cung cấp theo chính sách CNTT.
- Pipeline: kiểm quyền hồ sơ → chuẩn hóa metadata → đọc text/tệp → chỉ mục tài liệu có quyền → tạo tóm tắt/soát xét → bằng chứng file/trang/hàng → lưu ai_findings → người chuyên môn xác nhận → mới trình.
- AI trả về: luận điểm, căn cứ, đoạn nguồn, mức tin cậy, điểm chưa đủ, phiên bản prompt/model; tuyệt đối không tự bịa căn cứ, ký duyệt, hạch toán, thanh toán.
- Tránh prompt injection từ nội dung tệp, hạn chế dữ liệu gửi bên thứ ba, cân nhắc ẩn danh/loại dữ liệu mật, log nhà cung cấp và kiểm toán truy cập.

## 9. Không gian làm việc (SPA)
- Sidebar theo vai trò: Inbox của tôi / Tôi đang giữ / Hồ sơ của đơn vị / Đang chờ tôi duyệt / Cần bổ sung / Báo cáo / Nhân sự / Kho tài liệu / AI Assistant / Quản trị.
- Trang xử lý 3 cột trên desktop: danh sách công việc – tài liệu/biểu mẫu – lịch sử/điều kiện/phê duyệt. Mobile tối ưu luồng một tác vụ.
- Dashboard TGĐ chỉ đưa chỉ số quyết định, rủi ro, hồ sơ xin duyệt, tắc nghẽn; BKS có trang giám sát riêng, kế toán có hàng đợi chứng từ.

## 10. Kế hoạch chuyển đổi, điều kiện ra mắt
P0: Đóng băng 3.3; sao lưu JSON demo; chuẩn hóa 360 trường hợp giả, bộ test phân quyền.
P1: Auth + RBAC/ABAC + RLS + database + các lệnh chuyển trạng thái có transaction và audit.
P2: Kho tệp riêng tư, upload/preview/version + workspace + mẫu workflow theo nghiệp vụ.
P3: Realtime, email, SLA, dashboard có căn cứ, snapshot báo cáo.
P4: AI server-side, RAG grounded citations, đánh giá chất lượng và kiểm soát dữ liệu.
P5: Kiểm thử multi-user, quyền âm tính, concurrent update, file malware, backups/restore, log, ứng phó sự cố rồi mới nhập hồ sơ thật.

## 11. Các điểm cần xác nhận trước khi triển khai thực
1. Chính sách vị trí dữ liệu, phạm vi hồ sơ công ty được phép đưa lên cloud và điều kiện dùng AI bên ngoài.
2. Nhà cung cấp cloud và tài khoản/quyền quản trị đã được người đại diện doanh nghiệp chấp thuận.
3. Ma trận quyền/HĐQT–TGĐ–KTT–trưởng phòng, hạn mức, văn bản ủy quyền, mẫu quy trình.
4. Các tiêu chí SLA và quy định lưu trữ, ký số, phân nhiệm, bằng chứng.
5. Tên miền nội bộ, email/identity provider, yêu cầu sao lưu và khôi phục.
6. Nhà cung cấp AI, dự toán sử dụng, kiểm soát quyền truy xuất tệp.

**Tuyệt đối không coi đặc tả này là đã triển khai hoặc đã bảo mật. CTY AI 3.3 vẫn chỉ là mô phỏng Public.**
