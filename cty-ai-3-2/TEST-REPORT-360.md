# CTY AI 3.2 — TEST REPORT 360 DOSSIERS (01/11/2026)

## Kết quả đã xác minh
| Nội dung | Kết quả |
|---|---|
| Bộ dữ liệu `manifest.json` | 8 lĩnh vực × 45 = **360** hồ sơ, ID duy nhất |
| Các TXT trên GitHub | 360 tệp đã được ghi bằng Git tree; kiểm tra mẫu trực tiếp ít nhất 8 tệp thuộc 8 lĩnh vực |
| JavaScript app.js | Kiểm tra cú pháp bằng `new Function()` **ĐẠT** |
| Luồng 360 hồ sơ | **360/360** xử lý trong thử nghiệm DOM + phản hồi fetch mô phỏng |
| Kết quả Agent | **2.115** |
| Handoff Agent | **2.430** |
| Công việc tự tạo | **307** |
| Chi phí TCKT đã xử lý 10 tháng | **3.125 triệu đồng**; khớp tổng từng tháng và tổng hồ sơ |
| Giá trị giải ngân dự án giả định | **7.882,3 triệu đồng**; khớp tổng 5 dự án |
| HTTP 404 của 1 TXT | **359 hoàn tất, 1 báo lỗi**; không tính hồ sơ lỗi |
| Sau phục hồi nguồn | **360 hoàn tất**, 0 lỗi |
| Chạy lặp | Không tạo trùng công việc; số nhiệm vụ giữ nguyên 307 |

## 4 thử nghiệm nhập TXT bên ngoài
1. `MAU-01`: Nhập hồ sơ chi phí CLOSED, giá trị đã xử lý **120 triệu** => báo cáo tài chính tăng 120 triệu.
2. `MAU-02`: Mua sắm REVIEW, thiếu chứng từ => Agent tạo cảnh báo và công việc; giá trị đã xử lý vẫn 0.
3. `MAU-03`: Dự án mới APPROVED chưa xử lý => xuất hiện dự án thứ 6, tổng mức đầu tư 6.500 triệu; giá trị xử lý 0.
4. `MAU-04`: Hồ sơ sản xuất CLOSED => cộng 1.250.000 kWh và doanh thu 1.150 triệu đồng trong báo cáo mô phỏng.

Thử bổ sung: thay giá trị đã xử lý 120 triệu thành 180 triệu khi chỉ duyệt 120 triệu => **bị từ chối**; không nạp vào danh sách.

## Phạm vi kiểm thử và giới hạn
- Kiểm thử đủ 360 hồ sơ đã thực hiện trên **JavaScript mô phỏng các thành phần DOM và phản hồi fetch**; không phải trình duyệt Chrome/Safari thực tế. Phản hồi fetch trong test toàn diện được dựng từ trường manifest; không phải mỗi tệp TXT được tải qua HTTP trong bài thử này.
- 8 tệp TXT được đọc lại trực tiếp qua GitHub và xác minh: đúng ID, tháng, trạng thái, giá trị đã xử lý và có luồng B1–B7.
- Chưa xác nhận GitHub Pages phục vụ bản phát hành mới ở thời điểm lập test report; cần kiểm tra trực tiếp sau khi phát hành `main`.
- Chưa có mô hình AI ngôn ngữ thực, xác thực văn bản ký, số liệu GSC thật hoặc kết nối phần mềm kế toán.

## Kiểm thử giao diện cần thực hiện sau triển khai
Mở URL web, kiểm tra 360 hồ sơ; chọn chạy toàn bộ; xem báo cáo TCKT đúng 3.125 triệu, đối chiếu 10 tháng; xem 5 dự án với tổng giá trị đã xử lý 7.882,3 triệu; mở TXT HS-01-01 có số dòng, báo cáo log; nhập 4 mẫu và đánh giá kết quả; xuất CSV, TXT, JSON; thử trên điện thoại.

**Tất cả số tiền và dữ liệu là giả định; kết quả thử này không thay thế kiểm toán hay kiểm thử bảo mật.**
