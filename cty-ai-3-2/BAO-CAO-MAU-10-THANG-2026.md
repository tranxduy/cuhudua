# CTY AI 3.2 – Báo cáo quản trị giả định 10 tháng năm 2026

> Toàn bộ con người, dự án, số tiền, chứng từ và kết quả ký duyệt trong báo cáo là **hư cấu để thử nghiệm**; không phải thông tin tài chính/kế toán hoặc nghị quyết của Công ty Thủy điện Geruco Sông Côn.

## 1. Mô hình và luồng kiểm soát
- Dữ liệu **360 hồ sơ TXT, 8 lĩnh vực × 45 hồ sơ, mỗi tháng 36 hồ sơ** (01–10/2026).
- Một hồ sơ có 07 biểu mẫu: 01 nhân viên dự thảo → 02 trưởng bộ phận kiểm tra/trình → 03 Phòng TCKT kiểm soát, đồng ý trình → 04 Tổng Giám đốc phê duyệt → 05 thực hiện, nghiệm thu → 06 kế toán ghi nhận → 07 báo cáo kỳ.
- Người xử lý, ngày làm việc, trạng thái, số phiếu BM1–BM7 theo từng mã hồ sơ. **TCKT không thay TGĐ quyết định phê duyệt chi**.
- 214 hồ sơ CLOSED, 37 APPROVED (chưa thực hiện), 37 PENDING (chờ TGĐ), 72 REVIEW (trả về trưởng đơn vị hoặc TCKT). Các trạng thái chưa CLOSED có số đã xử lý bằng 0.
- Bản demo từ chối TXT có bước sau DONE khi bước trước còn WAITING/RETURNED, hoặc giá trị đã xử lý vượt giá trị duyệt.

## 2. Báo cáo chi phí TCKT lũy kế đến 31/10/2026

| Chỉ tiêu | Giá trị giả định (triệu đồng) |
|---|---:|
| Tổng đề nghị | 5.350 |
| Tổng đã duyệt | 3.606,5 |
| **Tổng đã xử lý** | **3.125** |
| Đã thanh toán | 2.911 |
| Đề nghị còn chưa hoàn tất | 2.225 |

### Theo từng tháng

| Tháng | Hồ sơ tất cả lĩnh vực | Hồ sơ TCKT | Đề nghị | Duyệt | Xử lý | Thanh toán |
|---|---:|---:|---:|---:|---:|---:|
| 01 | 36 | 4 | 315 | 160 | **160** | 151 |
| 02 | 36 | 4 | 500 | 494,5 | **445** | 379 |
| 03 | 36 | 5 | 450 | 279 | **180** | 175 |
| 04 | 36 | 5 | 690 | 360 | **360** | 346 |
| 05 | 36 | 5 | 450 | 409,5 | **270** | 252 |
| 06 | 36 | 5 | 730 | 556 | **385** | 374 |
| 07 | 36 | 5 | 450 | 205 | **205** | 183 |
| 08 | 36 | 4 | 685 | 630 | **630** | 630 |
| 09 | 36 | 4 | 460 | 267,5 | **245** | 214 |
| 10 | 36 | 4 | 620 | 245 | **245** | 207 |
| **Lũy kế** | **360** | **45** | **5.350** | **3.606,5** | **3.125** | **2.911** |

### Theo khoản mục

| Nhóm chi phí | Hồ sơ | Đã xử lý (triệu đồng) |
|---|---:|---:|
| Chi phí nhân công | 5 | 135 |
| Sửa chữa | 5 | 280 |
| Nguyên vật liệu | 5 | 330 |
| Dịch vụ mua ngoài | 5 | 570 |
| Quản lý doanh nghiệp | 5 | 75 |
| Công tác phí | 5 | 165 |
| Tư vấn | 5 | 310 |
| Bảo hiểm – phí | 5 | 990 |
| Khấu hao | 5 | 270 |

**Điểm kiểm soát:** Không chuyển giá trị ở phiếu đề nghị hoặc phiếu TGĐ phê duyệt thành chi phí hoàn tất nếu chưa có bước thực hiện, nghiệm thu, ghi nhận và lên báo cáo trong hồ sơ giả.

## 3. Báo cáo dự án đầu tư giả định

Tổng mức đầu tư của **5 dự án** chỉ tính một lần theo mã dự án: **86.200 triệu đồng**. Tổng giá trị xử lý từ **45 hồ sơ đầu tư**: **7.882,3 triệu đồng**.

| Dự án giả định | Tổng mức | Đề nghị | Đã xử lý | Đã thanh toán |
|---|---:|---:|---:|---:|
| Dự án thủy điện Tân Sơn (giả định) | 23.000 | 2.619,3 | 1.542,1 | 1.233,6 |
| Dự án điện mặt trời Suối Xanh (giả định) | 13.800 | 2.619,3 | 1.101,6 | 1.101,6 |
| Dự án nâng cấp hệ thống điều khiển (giả định) | 8.500 | 2.619,3 | 2.619,3 | 2.619,3 |
| Dự án cấp nước Bắc Hà (giả định) | 31.200 | 2.619,3 | 0 | 0 |
| Dự án cải tạo đường quản lý (giả định) | 9.700 | 2.619,3 | 2.619,3 | 2.619,3 |

Không cộng trực tiếp các số liệu nghiệp vụ từ mua sắm, kế toán, dự án và bảo trì thành một tổng chi phí công ty nếu chưa thiết kế nguyên tắc loại trừ trùng lặp.

## 4. Hướng dẫn truy xuất
Trong CTY AI 3.2, mở **Quy trình 7 bước → chọn mã HS-XX-YY → Xem biểu mẫu 01–07 → xem nguồn TXT có số dòng**. Bấm **Đọc & xử lý 360 hồ sơ** trước khi xem báo cáo đã xác minh.

Dữ liệu của file báo cáo mẫu này được tính từ cùng bộ chỉ mục giả định. **Trong web**, số liệu mới được đánh dấu đã đối chiếu sau khi tệp TXT tương ứng đọc được và vượt qua kiểm tra cấu trúc, số tiền và mốc quy trình.

## 5. Giới hạn
Chưa có AI ngôn ngữ thực, OCR, chữ ký số, quản trị quyền hay liên thông phần mềm kế toán. Một số điều khoản Quyết định 29/2025 và Quy chế quản lý tài chính QĐ21/2024 chỉ ở mức căn cứ tham chiếu có ghi nhận tình trạng xác minh; không kết luận về tính hợp pháp của các hồ sơ thực.
