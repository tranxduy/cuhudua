# CTY AI 3.2 — Hồ sơ TXT & mạng lưới Agent

> **Public demo bằng dữ liệu hư cấu.** Các tệp TXT là tệp thật nằm trong kho GitHub nhưng **không phải hồ sơ thật của Công ty Thủy điện Geruco Sông Côn**. Không có API AI, đăng nhập, phân quyền máy chủ, lưu trữ tập trung, ký số hoặc quyền thanh toán.

## 1. Đường dẫn

- Web dự kiến GitHub Pages: https://tranxduy.github.io/cuhudua/cty-ai-3-2/
- Mã nguồn: `index.html`
- Danh mục: `manifest.json`
- 40 tệp TXT thực: `hosos/HS-01-01.txt` đến `hosos/HS-08-05.txt`

## 2. Quy mô

- 40 hồ sơ TXT, 8 nhóm nghiệp vụ × 5 hồ sơ.
- 6 nhóm đơn vị mô phỏng, mỗi nhóm có **1 trưởng đơn vị và 5 nhân viên giả**. Có Kế toán trưởng là trưởng nhóm TCKT.
- 2 chức danh điều hành: Tổng Giám đốc và Phó Tổng Giám đốc (tên giả).
- Tổng cộng **38 cá nhân giả**, **12 Agent chuyên trách** và bộ điều phối.
- Các nhóm: TCKT, QLĐT&KD, Tổng hợp, phân xưởng Vận hành, phân xưởng Sửa chữa, tổ An toàn – Môi trường (tổ sau là đơn vị chức năng giả lập, không xác nhận là phòng thật).

## 3. Các chức năng sử dụng

**Điều hành:** xem số hồ sơ, kết quả, số cần xử lý, lỗi tải và công việc, chạy 40 tệp bằng một nút.

**Hồ sơ TXT:** danh sách/tìm/lọc; xem tệp gốc được tải bằng `fetch`, số dòng, mã hồ sơ, nút đọc và tải TXT; chạy từng Agent hoặc toàn bộ, xuất biên bản TXT theo mã hồ sơ. Tệp không tải được được ghi lỗi thay vì tạo kết quả ảo.

**Agent:** sơ đồ phụ thuộc cho 8 luồng, thực hiện nhận/bàn giao và phân tích từ trường dữ liệu nằm trong nội dung TXT, lưu kết quả vào hồ sơ dùng chung. Agent Kiểm soát chéo hợp nhất các phát hiện; Agent Thư ký tạo đầu việc. Người dùng ghi ý kiến nhưng không thay thế phê duyệt thật.

**Công việc:** tự sinh từ cờ tình huống, một mã `caseId:flag`/việc, tránh trùng khi chạy lại. Đánh dấu hoàn thành và xuất CSV.

**Nhân sự:** cơ cấu giả định theo từng đơn vị, trưởng phòng/quản đốc/tổ trưởng và năm nhân viên, lãnh đạo công ty.

**Truy vấn:** tìm theo từ khóa, chỉ mục, nội dung TXT đã đọc, người phụ trách, trạng thái; một số câu hỏi tiếng Việt xử lý bằng quy tắc. Không phải mô hình AI trò chuyện tự do.

**Báo cáo:** toàn bộ hồ sơ, nhóm nghiệp vụ, số lần chạy Agent, số bàn giao, cảnh báo và trạng thái; xuất CSV/JSON và in/Lưu PDF từ trình duyệt.

**Nhật ký:** INGEST, AGENT, HANDOFF, FINDING, TASK, REVIEW, ERROR; lọc và xuất CSV, sao lưu/khôi phục JSON.

**Quy tắc:** danh mục kiểm soát tham chiếu QĐ29/2025 và QĐ21/2024 có cảnh báo tình trạng xác minh, không tự công nhận một hồ sơ là hợp lệ.

## 4. Quy trình dùng trong 5 phút

1. Mở trang web, kiểm tra `manifest.json` đã nạp danh mục 40 tệp.
2. Bấm **Đọc và chạy 40 hồ sơ**.
3. Vào **Hồ sơ TXT**, chọn một hồ sơ; xem nội dung nguồn và các đoạn trích có số dòng được Agent sử dụng.
4. Vào **Công việc** xem việc Agent Thư ký tự sinh; vào **Mạng Agent** để nhìn thấy các quan hệ phụ thuộc.
5. Vào **Báo cáo** hoặc **Nhật ký** để xuất kết quả.

## 5. Dữ liệu và hạn chế

- Dữ liệu trạng thái, log, công việc và TXT nhập thêm lưu trong `localStorage` trên từng thiết bị, **không đồng bộ**.
- Tệp TXT công khai chỉ phục vụ kiểm thử, không có chứng từ gốc, chữ ký, bằng chứng phê duyệt hoặc số liệu vận hành thật.
- “Agent đọc TXT” hiện là bộ phân tích mã JavaScript có cấu trúc và quy tắc cảnh báo, chưa sử dụng mô hình ngôn ngữ lớn.
- Nút “Đã chạy” chỉ nói quy trình đã chạy, **không có nghĩa hồ sơ hợp pháp/hợp lệ**.
- Những điều khoản trọng yếu của QĐ29 cần đối chiếu bản ký đầy đủ trước khi cho phép chặn hồ sơ thật; QĐ21/2024 phải xác minh hiệu lực hiện hành.
- Khi làm bản nội bộ phải có backend, xác thực, quyền theo vị trí, nhật ký bất biến và thiết kế kết nối riêng; không triển khai dữ liệu thật trên trang GitHub Pages Public.

## 6. Kiểm thử và chứng cứ
Xem `TEST-REPORT-3.2.md`. Lưu ý: kiểm thử JavaScript trong môi trường DOM mô phỏng, **chưa có xác nhận kiểm thử thao tác trình duyệt thực tế hay HTTP GitHub Pages công khai**.
