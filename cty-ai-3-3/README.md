# CTY AI 3.3 – Điều hành, báo cáo toàn diện và xử lý công việc giả lập

**Đường dẫn dự kiến:** https://tranxduy.github.io/cuhudua/cty-ai-3-3/  
**Nguồn dữ liệu:** 360 hồ sơ và 2.520 biểu mẫu TXT độc lập trong `../cty-ai-3-2/` (đã phát hành phiên bản 3.2). CTY AI 3.3 **không ghi đè 3.2**.

## Phạm vi công việc
- 8 lĩnh vực × 45 hồ sơ = **360 tình huống** từ tháng 01–10/2026 (36 hồ sơ/tháng); tình huống, nhân sự, dự toán, TGĐ và kết quả hoàn toàn hư cấu.
- Mỗi hồ sơ có 7 bước: nhân viên lập → trưởng đơn vị trình → TCKT kiểm soát → TGĐ phê duyệt giả → thực hiện/nghiệm thu → kế toán ghi nhận giả → báo cáo kỳ.
- Trang **Tổng quan** có chỉ số số hồ sơ, hoàn tất/tồn/trả, tỷ lệ đối chiếu TXT, báo cáo 8 lĩnh vực, sơ đồ tồn theo bước và hồ sơ cần can thiệp.
- Trang **Công việc & vướng mắc**: tìm theo mã, lĩnh vực, nhân viên, trạng thái. Bấm **Xử lý / Chuyển việc** để mở chi tiết và thực hiện ngay.
- Trang **Hồ sơ & xử lý**: biết đang ở bước nào, người giữ, lí do, biểu mẫu TXT, lịch sử. Nút **Hoàn tất bước**, **Chuyển người xử lý**, **Trả bổ sung**, **Bổ sung & trình lại**, **Lưu ý kiến**; giao diện yêu cầu nội dung lý do khi chuyển/trả.
- Trang **Báo cáo 8 lĩnh vực**: số hồ sơ hoàn tất, bị trả, chờ; giá trị đề nghị, đã xử lý gốc 31/10 và hiện tại giả lập; chi tiết 10 tháng, khoản mục, người giữ, từng hồ sơ.
- Trang **Tài chính 10 tháng**: số đã xử lý gốc, hiện tại giả lập và chênh lệch, theo 10 tháng và khoản mục.
- Trang **Dự án đầu tư**: 5 dự án mẫu, ngân sách chỉ cộng một lần/mã, hồ sơ, giải ngân gốc và mô phỏng.
- **Nhật ký & báo cáo**: lưu sự kiện VERIFY, ASSIGN, RETURN, RESUBMIT, APPROVE, EXECUTE, RECORD, REPORT, COMMENT, RESET, ERROR; xuất CSV, sao lưu/khôi phục JSON.
- **Nhập tình huống TXT**: tải mẫu, dùng mã mới, kiểm tra số tiền, 7 biểu mẫu; có thể có thông tin BƯỚC_n_TRẠNG_THÁI, BƯỚC_n_NGÀY và BƯỚC_n_NGƯỜI.

## Cách thử một quy trình từ đầu đến cuối
1. Mở **Công việc & vướng mắc**, tìm một hồ sơ đang ở bước **TGĐ**; bấm **Xử lý / Chuyển việc**.
2. Ở chi tiết, nút thao tác tự đọc TXT nguồn nếu chưa xác minh. Chọn **Chuyển người xử lý**, ghi lý do và chọn người nhận giả định.
3. Mở hồ sơ đó, chọn đúng người giữ việc, nhập số tiền duyệt (không vượt số đề nghị) → **TGĐ phê duyệt giả**.
4. Bước **Nghiệm thu** nhập giá trị thực hiện không vượt giá trị được duyệt, sau đó chuyển sang kế toán.
5. Kế toán nhập số thanh toán không vượt giá trị nghiệm thu; bước cuối **Ghi vào báo cáo**.
6. Quay về **Báo cáo 8 lĩnh vực / Tài chính / Dự án**: số tiền hiện tại thay đổi, **số gốc đến 31/10/2026 không thay đổi**.
7. Thử **Trả bổ sung** từ một bước chưa hoàn tất. Hệ thống chuyển về người lập dự thảo. Sau khi bấm **Bổ sung & trình lại**, hồ sơ quay về bước từng trả để kiểm tra tiếp.
8. Xuất **Báo cáo toàn diện TXT** và **Nhật ký CSV**; có thể sao lưu JSON trước khi thử tình huống tiếp theo.

## Mô hình dữ liệu, nhật ký và kiểm soát
`core.js` sở hữu logic: kiểm tra hồ sơ, điều phối 7 bước, thông tin người giữ, thay đổi số tiền sau các bước và báo cáo. `ui.js` hiển thị màn hình, biểu mẫu và cho phép thao tác. `style.css` định dạng phản hồi màn hình điện thoại/máy tính.

**Các bất biến quan trọng:**
- Không thể chuyển sang bước sau khi bước trước chưa được hoàn tất; trường hợp trả lại tạo nhánh “bổ sung → trình lại → bước trả”.
- Phê duyệt giả không vượt số đề nghị; nghiệm thu không vượt phê duyệt; thanh toán không vượt nghiệm thu.
- Số tiền đã xử lý hiện tại chỉ ghi vào báo cáo khi đủ **7 bước DONE**. Số gốc 31/10 không bị thay đổi bởi thao tác sau kỳ.
- Tệp TXT phải tải được và đối chiếu mã, tên, tháng, lĩnh vực, bốn giá trị tài chính và đủ bảy biểu mẫu trước khi ghi thao tác.
- Trưởng bộ phận, TCKT, TGĐ và người ghi nhận là các vai giả. TCKT kiểm soát nghiệp vụ, không thay thế phê duyệt của TGĐ hoặc HĐQT.
- Các lĩnh vực có thể trùng phạm vi tiền: **không lấy tổng ngang tám lĩnh vực làm tổng chi phí công ty**.
- Mỗi thao tác giữ nguyên dấu vết trong nhật ký. Lệnh khôi phục kịch bản gốc không xóa lịch sử tác động đã ghi.

## Giới hạn, bảo mật
Đây là **Public Demo**, không phải hệ thống xử lý văn bản thực tế: không có đăng nhập, phân quyền server, chữ ký số, gửi việc tới email/Zalo/Base/eOffice, gọi mô hình AI ngôn ngữ thực, hạch toán hoặc thanh toán. Các thay đổi chỉ được lưu bằng **localStorage trên trình duyệt hiện tại**, không đồng bộ giữa thiết bị/người dùng. Có thể chọn vai xử lý khác trên giao diện, nên nhật ký không có giá trị xác thực danh tính hoặc chứng cứ kiểm toán.

**Không nhập hợp đồng, tiền lương, tài khoản, hóa đơn, giá mua, số liệu vận hành hay tài liệu nội bộ GSC vào web GitHub Pages Public.** Khi triển khai nội bộ phải có backend, đăng nhập, phân quyền, trạng thái lưu server, nhật ký bất biến, phê duyệt và ký số theo quy định.

Các tham chiếu QĐ29/2025 và Quy chế tài chính QĐ21/2024 trong nguồn dữ liệu 3.2 là chỉ dẫn mô phỏng có giới hạn xác minh, **không kết luận pháp lý** cho một giao dịch thật.
