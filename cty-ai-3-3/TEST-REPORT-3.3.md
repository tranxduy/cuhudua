# CTY AI 3.3 – Biên bản kiểm thử chức năng

**Ngày phát hành dự kiến:** 01/11/2026  
**Môi trường thử:** JavaScript chạy bằng mô hình DOM giả, localStorage giả và phản hồi fetch giả định; một hồ sơ mẫu `HS-01-01.txt` đã được lấy trực tiếp từ GitHub để đối chiếu tải nguồn. Đây **không phải** nghiệm thu trình duyệt thực, bảo mật hay phần mềm kế toán.

## 1. Kiểm tra mã nguồn
- Core và UI đều được biên dịch cú pháp JavaScript thành công.
- Giao diện có các đường dẫn `core.js`, `ui.js`; dùng `../cty-ai-3-2/manifest.json` và tệp `../cty-ai-3-2/hosos/…`, không tự nhân đôi 360 hồ sơ.
- Kiểm thử mô phỏng **8/8 màn hình đạt**: tổng quan, công việc, hồ sơ, tám lĩnh vực, tài chính, dự án, nhật ký, nhập TXT.
- Báo cáo đầy đủ TXT đã tạo được nội dung hơn 23.000 ký tự trên dữ liệu test, có từng lĩnh vực, chi phí theo tháng và người giữ việc.

## 2. Thử chu trình xử lý từ đầu đến cuối
| Tình huống thử | Kết quả |
|---|---|
| Hồ sơ PENDING tại TGĐ | Được mở, bước hiện hành = bước 4 |
| Chuyển người xử lý kèm lý do | Ghi sự kiện ASSIGN |
| TGĐ duyệt giả 115 triệu trên đề nghị 120 | Chuyển sang APPROVED |
| Nghiệm thu giả 110 triệu (≤115) | Chuyển sang kế toán |
| Ghi thanh toán giả 80 triệu (≤110) | Chuyển sang báo cáo |
| Bước 7 hoàn tất | Trạng thái CLOSED, số đã xử lý hiện tại tăng **110 triệu**, số gốc giữ nguyên |
| Trả hồ sơ từ bước 3 về người lập | Chuyển về bước 1, giữ điểm trả ở bước 3 |
| Bổ sung và trình lại | Quay về bước 3, ghi sự kiện RESUBMIT |
| Xuất báo cáo 8 lĩnh vực | 8 dòng lĩnh vực + tiêu đề |
| Hồ sơ TXT đầu vào | Kiểm tra trường và 7 biểu mẫu trước khi ghi xử lý |

## 3. Điều kiện cần thử tiếp trên giao diện thật
1. Mở web từ GitHub Pages trên Chrome và Safari.
2. Chọn một hồ sơ REVIEW, thử Trả bổ sung, chọn người nhận và Trình lại; xem nhật ký ASSIGN/RETURN/RESUBMIT.
3. Chọn hồ sơ PENDING, thử duyệt giá trị **lớn hơn đề nghị** (phải bị chặn).
4. Thử nghiệm thu lớn hơn duyệt và thanh toán lớn hơn nghiệm thu (phải bị chặn).
5. Xác nhận khi kết thúc bước 7, báo cáo **hiện tại** tăng; báo cáo **gốc 31/10** không đổi.
6. Xuất CSV, báo cáo tổng hợp TXT, sao lưu JSON, thử khôi phục trên phiên kiểm thử khác.
7. Thử tải sai TXT, mất kết nối hoặc lỗi HTTP 404: thao tác phải dừng, có thông báo lỗi.

## 4. Giới hạn
Kết quả trên không chứng minh rằng toàn bộ 360 hồ sơ đã được tải qua mạng trong trình duyệt thật. Đây là **kiểm thử logic mô phỏng**, không phải kiểm thử quyền tài khoản, ký số, hạch toán hoặc hệ thống workflow có backend.


## Kiểm thử bổ sung: vận hành toàn diện, nhân viên và quản lý công việc

Đã thực hiện kiểm thử chạy mã JavaScript trong **DOM/localStorage/fetch giả lập**, sử dụng bộ kịch bản 360 hồ sơ tái tạo theo cơ cấu tám lĩnh vực; riêng nguồn TXT `HS-01-01` được đối chiếu từ GitHub. Không tuyên bố đã chạy trên trình duyệt thực hoặc kết nối máy chủ GSC.

| Nội dung | Kết quả |
|---|---|
| Tất cả 8 màn hình có sẵn + 3 màn hình bổ sung | **11/11 đạt** |
| Báo cáo luồng công việc | 7 bước; 10 tháng; có người, trạng thái, ngày và liên kết mở hồ sơ |
| Báo cáo nhân sự | 38 người giả định trong kịch bản test; phân biệt việc trực tiếp và việc nhóm quản lý |
| Danh sách việc từng người | Có việc đang giữ, đã hoàn tất, bước bị trả, biên bản và nhật ký giao lại |
| KPI hiệu quả | Tỷ lệ hoàn tất công việc đã nhận, việc tồn, hạn do người dùng nhập; không suy ra năng lực thật |
| Nhiệm vụ độc lập | Tạo từ hồ sơ, đổi người, đổi hạn, hoàn tất và mở lại; ghi 3 sự kiện TASK_CREATE, TASK_ASSIGN, TASK_DONE trong kiểm thử cuối |
| Báo cáo tổng hợp TXT | **58.197 ký tự** trong bộ kiểm thử tích hợp; chứa luồng, nhân sự và nhiệm vụ |
| Xuất CSV | Luồng 16 cột (gồm 7 bước), nhân sự 11 cột, và danh sách nhiệm vụ |
| JavaScript | Ba mô-đun core/ui/operations được kiểm tra cú pháp thành công |

**Chưa kiểm thử được:** tình trạng GitHub Pages qua trình duyệt thực, trình duyệt iPhone, dữ liệu đồng bộ đa người dùng, phân quyền/định danh và nhật ký chống sửa đổi. Bất kỳ đánh giá nhân viên nào trên web hiện đều là **chỉ số khối lượng xử lý giả định**, không phải kết luận hiệu quả lao động thực tế.
