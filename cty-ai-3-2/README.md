# CTY AI 3.2 – 360 hồ sơ TXT và báo cáo lũy kế 10 tháng

**Trang web:** https://tranxduy.github.io/cuhudua/cty-ai-3-2/

## Quy mô
- **8 lĩnh vực × 45 hồ sơ = 360 hồ sơ TXT riêng**, từ HS-01-01 đến HS-08-45.
- **6 đơn vị giả định**, mỗi đơn vị có trưởng nhóm và 5 nhân viên; Tổng Giám đốc và Phó Tổng Giám đốc có tên giả. Kế toán trưởng là người đứng đầu nhóm TCKT giả định.
- **12 Agent** phối hợp theo 8 sơ đồ phụ thuộc; Agent Kiểm soát chéo và Agent Thư ký chạy sau các Agent chuyên môn.
- 5 dự án đầu tư giả định, mỗi dự án 9 hồ sơ.

## Cách thực hành
1. Vào web, bấm **Đọc & xử lý 360 hồ sơ**. Hệ thống tải 360 TXT công khai (mỗi hồ sơ một file); tệp tải lỗi bị loại khỏi kết quả và ghi nhật ký lỗi.
2. Vào **Báo cáo chi phí**: số liệu đến 31/10/2026, xem chi phí đề nghị, được duyệt, đã hoàn tất và đã thanh toán; xem theo 10 tháng và khoản mục. Đơn vị: **triệu đồng giả định**. Chỉ giá trị trong TXT có trạng thái CLOSED và khớp manifest mới tính là đã xử lý.
3. Vào **Dự án đầu tư**: tổng mức dự án chỉ tính một lần, giải ngân từ hồ sơ hoàn tất, xem tiến độ từ hồ sơ gần nhất.
4. Vào **8 lĩnh vực**: báo cáo theo lĩnh vực; tránh cộng chồng các nghiệp vụ.
5. Vào **Hồ sơ TXT**: xem từng dòng có số dòng nguồn; chạy riêng từng Agent; xem nhật ký 7 bước ở tệp và handoff có cấu trúc.
6. Vào **Nhập tình huống** tải mẫu TXT, sửa mã hồ sơ mới và tải lên để cho Agent xử lý thử; hồ sơ nhập được lưu **trên trình duyệt**, không tự tải lên GitHub.
7. Vào **Nhật ký** xuất CSV hoặc sao lưu JSON.

## Quy tắc về số liệu
- `GIÁ_TRỊ_ĐỀ_NGHỊ`: toàn bộ nhu cầu trong hồ sơ; không phải đã duyệt hoặc đã chi.
- `GIÁ_TRỊ_ĐÃ_DUYỆT`: số được duyệt *theo hồ sơ giả*.
- `GIÁ_TRỊ_ĐÃ_XỬ_LÝ`: chỉ khác 0 khi `TRẠNG_THÁI: CLOSED`; không vượt số đã duyệt; được đưa vào báo cáo chi phí/giải ngân.
- `GIÁ_TRỊ_ĐÃ_THANH_TOÁN`: phần đã thanh toán giả, không vượt số đã xử lý.
- `DỰ_TOÁN_HỒ_SƠ`: dự toán riêng, không dùng thay tổng mức dự án.
- `TỔNG_MỨC_DỰ_ÁN` và `MÃ_DỰ_ÁN`: dành cho TXT dự án nhập ngoài; tổng mức chỉ tính một lần mỗi mã.
- Sản lượng và doanh thu nhập ngoài qua `ĐIỆN_NĂNG_THỰC_HIỆN` và `DOANH_THU_DIEN`.

## Kết cấu dữ liệu
- `manifest.json`: chỉ mục 360 hồ sơ, đơn vị và dự án.
- `hosos/HS-XX-YY.txt`: **360 tệp TXT** từ đề nghị, dự toán, trạng thái chứng từ, nhật ký 7 bước và kết quả đến tháng.
- `app.js`, `style.css`, `index.html`: mã nguồn chạy trực tiếp trong trình duyệt.
- `mau-ho-so/`: 4 tình huống TXT có thể tải về và nhập lại.
- `archive-40/`: bản CTY AI 3.2 cũ 40 hồ sơ, bao gồm tệp ứng dụng và manifest riêng để so sánh.

## Nguồn tham chiếu và giới hạn
Chỉ sử dụng các nhóm nghiệp vụ và nguyên tắc phù hợp định hướng QĐ29/QĐ-HĐQT.GSC ngày 31/12/2025 và QĐ21/QĐ-HĐQT.GSC ngày 06/12/2024. QĐ21/2024 **chưa xác minh tình trạng hiệu lực hiện nay**. Không tuyên bố toàn bộ điều khoản QĐ29 đã được soát 100%.

**Đây là demo.** Tất cả người, dự án, thời điểm, số liệu và tài liệu đều giả. Agent chỉ là mã quy tắc; không có AI LLM thực, OCR, xác thực chữ ký, cơ sở dữ liệu tập trung, đăng nhập hay kết nối kế toán. Không sử dụng để phê duyệt, hạch toán, thanh toán hay kiểm soát an toàn nhà máy thực tế.

Để dùng dữ liệu GSC thật: phải tách bản nội bộ, có máy chủ riêng, phân quyền và xác minh căn cứ bằng tài liệu ký.
