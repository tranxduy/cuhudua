# TEST REPORT — CTY AI 3.2
**Thời điểm kiểm tra:** 2026-11-01  
**Môi trường:** GitHub connector + JavaScript DOM/fetch mô phỏng, không phải Selenium/Playwright hay trình duyệt Chrome thực tế.

## Kết quả
| STT | Kiểm tra | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Mã nguồn index.html tồn tại trên nhánh main | Đạt | GitHub đọc lại tệp sau commit |
| 2 | Manifest 40 hồ sơ và 6 đơn vị | Đạt | 38 tên người đều là dữ liệu giả |
| 3 | Kiểm tra vật lý 40/40 tệp TXT | Đạt | Mỗi tệp tồn tại, có mã hồ sơ và trên 250 ký tự |
| 4 | Cú pháp JavaScript | Đạt | Compile bằng Function constructor |
| 5 | Chạy điều phối 40/40 hồ sơ | Đạt trong DOM/fetch mô phỏng | 235 kết quả Agent |
| 6 | Handoff | Đạt | 270 lượt bàn giao Agent |
| 7 | Thư ký tự sinh công việc | Đạt | 32 công việc, trường hợp thử dùng 3 tệp nguồn thật và các tệp còn lại được mô phỏng nguồn fetch |
| 8 | Phát hiện giá chỉ định thầu tiết kiệm 3% | Đạt | Trường hợp HS-03-04, chỉ báo cần rà soát |
| 9 | Tệp TXT thiếu / HTTP 404 | Đạt | Một hồ sơ báo failed, 39 hồ sơ còn lại chạy được |
| 10 | Tệp TXT phục hồi và chạy lại | Đạt | Chạy lại bổ sung lên 40, không sinh công việc trùng |
| 11 | Giao diện thao tác thực tế trên Safari/Chrome | Chưa kiểm thử | Cần thử trực tiếp trên thiết bị người dùng |
| 12 | GitHub Pages phục vụ địa chỉ URL công khai | Chưa xác minh tự động | Mã nguồn GitHub đã có, người dùng kiểm tra địa chỉ |

## Kịch bản chi tiết
- Vòng 1: 40 hồ sơ, 40 hoàn tất, 0 lỗi, 32 cần rà soát, 235 kết quả Agent, 270 Handoff, 32 công việc.
- Vòng 2: giả lập HTTP 404 cho `HS-05-03.txt` ⇒ 39 hồ sơ hoàn tất, 1 `failed`; sửa nguồn và chạy lại ⇒ 40 hoàn tất.
- Lặp lại vòng xử lý sau khi hoàn tất ⇒ số công việc vẫn là 32, không trùng `caseId:flag`.

## Lưu ý kiểm toán
- Phép thử 40 luồng đã dùng **3 tệp TXT GitHub đọc trực tiếp và 37 phản hồi fetch giả lập từ manifest**; riêng sự tồn tại và cấu trúc 40 tệp được kiểm tra độc lập qua GitHub.
- Không báo 100% chính xác nội dung kiểm tra pháp lý hoặc các bằng chứng của tài liệu PDF.
- Không kết luận hệ thống đã được triển khai như một nền tảng AI sử dụng mô hình ngôn ngữ thực.
- Chưa xác nhận trọn vẹn UI trên trình duyệt hoặc tốc độ khi tải 40 hồ sơ qua mạng ngoài thực tế.

## Tính năng cần kiểm thử thủ công trên GitHub Pages
1. Mở `cty-ai-3-2/`; kiểm tra hiển thị 40 hồ sơ.
2. Bấm **Đọc và chạy 40 hồ sơ**; xem số liệu 40 đã chạy, số cảnh báo và nhật ký.
3. Mở `HS-03-04`: xác định đã đọc TXT, có nguồn dòng và cảnh báo 3%.
4. Mở **Công việc**, đánh dấu một việc; xuất CSV.
5. Mở **Truy vấn**, nhập “Hồ sơ thiếu nghiệm thu”, xem kết quả.
6. Mở **Báo cáo**, xuất CSV và lưu PDF.
7. Tải bản JSON dự phòng, thử khôi phục trên một phiên trình duyệt kiểm thử (không xóa dữ liệu chưa sao lưu).
8. Thử trên iPhone Safari và desktop.
