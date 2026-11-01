# CTY AI 3.2 – BIÊN BẢN KIỂM THỬ BẢN 7 BIỂU MẪU (01/11/2026)

## 1. Dữ liệu
- 360 tệp TXT được ghi qua GitHub Git Trees, gồm 7 biểu mẫu/tệp; 8 lĩnh vực, 45 hồ sơ/lĩnh vực.
- 36 hồ sơ mỗi tháng 01–10/2026, tên hồ sơ và kỳ khớp; các giai đoạn có người, số phiếu BM1–BM7 và ngày làm việc.
- Đã kiểm tra riêng **8 tệp thật lấy qua GitHub** thuộc 8 lĩnh vực và cả ba đợt cập nhật; mỗi tệp có đủ 7 biểu mẫu, ngày và mã hồ sơ.

## 2. Kiểm thử JavaScript DOM và fetch mô phỏng
| Nội dung | Kết quả |
|---|---|
| Hồ sơ hoàn tất qua luồng Agent | **360/360** |
| Agent output | **2.115** |
| Handoff | **2.430** |
| Log STAGE | **2.009** |
| CLOSED đủ 7 bước | **214** |
| REVIEW bị trả, không được hạch toán giả | **72** |
| PENDING chưa được TGĐ phê duyệt | **37** |
| APPROVED chưa nghiệm thu | **37** |
| Ma trận có đủ 360 bản ghi | **360** |
| Biểu mẫu | **2.520** |
| Số chi phí TCKT đã xử lý | **3.125 triệu đồng** |
| Chi phí đã xử lý ở mọi tháng 1–10 | **Đều lớn hơn 0** |
| Nhập TXT CUSTOM-001 | **Đạt** – 7 bước, chi phí tăng đúng 120 triệu |
| Nhập TXT có bước 3 WAITING nhưng bước 4 DONE | **Bị từ chối** |
| JSON lưu cục bộ trong browser | Khoảng **2,6 triệu ký tự** trong test |

## 3. Giới hạn phạm vi
Phần lớn kết quả 360 hồ sơ được thử bằng phản hồi TXT **dựng lại từ cùng mã generator và manifest** trong môi trường DOM/fetch mô phỏng, không phải tải 360 tệp qua mạng GitHub Pages. Đã kiểm tra trực tiếp 8 TXT tiêu biểu trên GitHub. Chưa có xác nhận trình duyệt thực (Chrome/Safari), bảo mật, chữ ký số hay việc xử lý hồ sơ GSC thật.

## 4. Hướng dẫn kiểm thử thực tế
Mở trang web → đọc 360 hồ sơ → chọn HS-01-01 → xem BM01, BM03, BM04, BM06, BM07 → ma trận Quy trình 7 bước → báo cáo chi phí theo 10 tháng → tải TXT mẫu → thay mã và trạng thái để thử chặn bước sai. Bản 40 hồ sơ cũ lưu riêng tại `archive-40/`.
