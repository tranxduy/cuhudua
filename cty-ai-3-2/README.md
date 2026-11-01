# CTY AI 3.2 – Bản 360 hồ sơ, 7 biểu mẫu và báo cáo 10 tháng

**Web:** https://tranxduy.github.io/cuhudua/cty-ai-3-2/  
**Dữ liệu:** 8 lĩnh vực × 45 hồ sơ, **36 hồ sơ mỗi tháng từ 01–10/2026**, 5 dự án đầu tư giả định, 38 nhân sự giả.  
**Nguồn TXT:** `hosos/HS-01-01.txt` đến `hosos/HS-08-45.txt` (360 tệp, 7 biểu mẫu/tệp = **2.520 biểu mẫu**).  
**Trước nâng cấp:** `archive-40/` bảo lưu 40 hồ sơ và trang web phiên bản đầu.

## Luồng 7 bước có ngày và người xử lý
1. Nhân viên lập dự thảo/phiếu đề nghị.
2. Trưởng bộ phận kiểm tra, ký trình theo tình huống giả định.
3. Phòng Tài chính–Kế toán kiểm soát ngân sách, chứng từ, điều kiện thanh toán và **đồng ý trình**. Không thay thế quyết định của TGĐ.
4. TGĐ phê duyệt **giả định**; nếu chưa đủ cơ sở thì chưa chuyển bước.
5. Bộ phận chủ trì thực hiện, lập nghiệm thu/biên bản giả.
6. Kế toán kiểm tra, ghi nhận giá trị xử lý giả; không có bút toán vào phần mềm thật.
7. Người tổng hợp ghi báo cáo tháng/kỳ đúng lĩnh vực; hồ sơ chưa CLOSED không cộng giá trị xử lý.

**Ngày:** từng bước có mốc ngày làm việc thứ Hai–thứ Sáu, nằm trong tháng ghi nhận.  
**Trạng thái:** CLOSED (214), APPROVED/chưa thực hiện (37), PENDING/chờ TGĐ (37), REVIEW/trả lại (72).  
**Người:** tên giả, có Trưởng đơn vị, TCKT, TGĐ, người thực hiện, kế toán và tổng hợp riêng. Trường hợp hồ sơ do TCKT lập thì người kiểm soát TCKT khác người lập.

## Các màn hình
- **Tổng quan:** thống kê hồ sơ, việc tồn và tiến độ đọc TXT.
- **Quy trình 7 bước:** thống kê cấp duyệt, ma trận người/giờ/việc của 360 hồ sơ, xuất CSV.
- **Hồ sơ TXT:** mở từng biểu mẫu 01–07, xem ngày, người kiểm tra, trạng thái, nội dung nguồn, tải phiếu TXT hoặc bản in HTML A4.
- **Luồng Agent:** 12 Agent chuyên môn/kiểm soát/thư ký, log và chuyển giao theo phụ thuộc.
- **Báo cáo chi phí:** lũy kế tháng 1–10 theo tháng và khoản mục, phân biệt đề nghị, duyệt, xử lý, thanh toán.
- **Dự án đầu tư:** 5 dự án giả, ngân sách tính một lần, hồ sơ và tiến độ, giá trị xử lý.
- **8 lĩnh vực / Công việc / Truy vấn / Nhật ký / Nhân sự:** báo cáo, CSV, TXT, JSON và xuất bản in qua trình duyệt.
- **Nhập tình huống:** tải TXT mẫu có 7 biểu mẫu và trường BƯỚC_1..7, sửa mã rồi nạp. Web kiểm tra trình tự, ngày, trạng thái, số tiền, sinh cảnh báo/công việc và báo cáo mô phỏng. Có 4 ví dụ trong `mau-ho-so/`.

## Kiểm tra dữ liệu
Chỉ dùng giá trị xử lý khi tệp TXT tải thành công, khớp mã/tên/kỳ/giá trị với manifest, đủ bảy biểu mẫu và các mốc ngày/nhân sự/biểu mẫu theo kịch bản. Chi phí `GIÁ_TRỊ_ĐÃ_XỬ_LÝ` chỉ tính cho hồ sơ CLOSED; thanh toán không vượt xử lý; không cộng trùng giữa lĩnh vực.

**Dữ liệu là GIẢ ĐỊNH – PUBLIC DEMO.** Không nhập tiền lương, hồ sơ cá nhân, hợp đồng, chứng từ thật hoặc API key. Agent là mã quy tắc trong browser, chưa phải AI LLM, không xác thực chữ ký, không phê duyệt thật, không có backend hoặc phân quyền.

**Nguồn pháp chế:** QĐ29 ngày 31/12/2025 tham chiếu theo các điều đã đọc chọn lọc; Quy chế tài chính QĐ21 ngày 06/12/2024 chưa xác nhận hiệu lực và văn bản sửa đổi; không được dùng web để kết luận tuân thủ hồ sơ thật.
