# CTY AI 3.1 — Kiểm soát hồ sơ & Điều phối Agent

**Website demo Public:** `https://tranxduy.github.io/cuhudua/cty-ai-3-1/` (đường dẫn dự kiến theo cấu hình Pages của repository).

## 1. Các chức năng
- Bản mô phỏng cũ: 48 tình huống giả định, 12 Agent chuyên trách và bộ điều phối, 31 nhân sự giả, 8 nhóm nghiệp vụ.
- Kiểm soát hồ sơ 3.1: chọn hồ sơ, loại mua sắm, giá trị, thông tin tổ mua sắm/tổ thẩm định, khai báo chứng từ và mã chứng cứ; đánh giá theo 18 quy tắc.
- Đầu ra: checklist theo căn cứ, ba trạng thái **thiếu/chưa được chứng minh**, **chưa xác minh**, **có khai báo**. Không có trạng thái “hợp pháp” hoặc “đã duyệt”.
- Agent Kiểm soát hồ sơ gửi kết quả đến Agent Kiểm soát chéo → Agent Thư ký; ghi log và tạo đầu việc cần bổ sung.
- Truy vấn theo mẫu: rủi ro, hồ sơ, số tiền giả định, bàn giao Agent, phân hệ và kết quả kiểm tra.
- Trung tâm báo cáo: số hồ sơ, tổng quan Agent, bảng số liệu theo nghiệp vụ; xuất CSV/JSON, in qua trình duyệt.
- Nhật ký chung: lọc theo mã hồ sơ/loại sự kiện; tải CSV.
- Lưu trình duyệt (localStorage), chưa đồng bộ các thiết bị.

## 2. Nguồn kiểm soát và xác minh
**Nguồn chính:**
1. **QĐ số 29/QĐ-HĐQT.GSC ngày 31/12/2025**, Quy định về mua sắm trong hoạt động SXKD và duy trì hoạt động thường xuyên, PDF scan 102 trang. Có bản OCR chưa hiệu đính. Đã đối chiếu trực quan chọn lọc các trang PDF 8, 14, 16, 17; các quy tắc khác gắn tình trạng OCR cần xác minh.
2. **QĐ số 21/QĐ-HĐQT.GSC ngày 06/12/2024**, Quy chế quản lý tài chính gồm 06 chương, 44 điều. Chỉ tìm thấy bản 2024, chưa có căn cứ khẳng định tồn tại hoặc hiệu lực của “Quy chế tài chính 2025”. Các quy tắc từ QĐ21 trong web **đều đặt chế độ tham chiếu / chờ xác minh hiệu lực**.

### Nhóm kiểm tra QĐ29
- Điều 3, 5: kế hoạch mua sắm và phê duyệt kế hoạch năm.
- Điều 6: dự toán gói thầu/giá gói thầu.
- Điều 7: kế hoạch lựa chọn nhà thầu, có ngoại lệ thuộc quy định.
- Điều 8, 13: tách vai trò tổ mua sắm và thẩm định.
- Điều 14, 20, 21: phê duyệt kết quả, hồ sơ hợp đồng và bước thư ký kiểm tra hợp đồng.
- Điều 17: trong trường hợp thuộc quy trình chỉ định thầu, thương thảo phải bảo đảm mức tiết kiệm tối thiểu 5% giá gói thầu (theo trang PDF 14).
- Điều 19 (trang PDF 16): mua sắm nhỏ lẻ dưới 5 triệu, 5 đến dưới 20 triệu, 20 đến dưới 100 triệu đồng; hệ thống tự chọn checklist phù hợp khi người dùng chọn loại 'mua sắm nhỏ lẻ'. Ngưỡng từ 100 triệu không tự động kết luận trái phép mà chuyển xác minh phương thức.
- Các dữ liệu phương thức, hồ sơ, giá trị **phải được khai báo**: AI không tự suy đoán căn cứ pháp lý từ một đoạn mô tả.

### Nhóm kiểm tra tài chính (QĐ21/2024, chỉ tham khảo)
- Điều 16: quản lý và đối chiếu công nợ.
- Điều 17: kiểm kê tài sản.
- Điều 20: chứng từ doanh thu/chi phí.
- Điều 21: phân tích/kiểm soát chi phí.
- Điều 25: kế hoạch tài chính.
- Điều 26: kế toán, chứng từ, sổ sách.
- Điều 27: báo cáo tài chính và công bố thông tin.

**Không áp dụng số tiền/quyền phê duyệt theo quy chế tài chính khi chưa xác minh bản ký và thay đổi sau 2024.** Không tuyên bố kiểm tra 102/102 trang scan. Đối với khoản tiền, thẩm quyền hoặc hình thức lựa chọn nhà thầu trọng yếu, người có thẩm quyền kiểm tra trực tiếp bản gốc và quy định hiện hành.

## 3. Chuỗi phối hợp
`Mở hồ sơ → Các Agent chuyên môn xử lý theo luồng phụ thuộc → Kiểm soát chéo → Thư ký → Người quản lý`

Bổ sung tại 3.1:
`Người khai báo checklist → Agent kiểm soát hồ sơ → Ghi kết quả có nguồn → Kiểm soát chéo → Thư ký tạo việc bổ sung → Người kiểm tra thực tế`.

Mỗi lượt có `caseId`, ngày giờ, loại kiểm tra, kết quả từng quy tắc, nguồn (điều + trang) và lịch sử. Không cho Agent duyệt/chi tiền/ký số/hạch toán chính thức/điều khiển nhà máy.

## 4. Hướng dẫn dùng nhanh
1. Mở website 3.1, bấm **Chạy 48 tình huống** để kiểm tra mạng Agent.
2. Vào **Kiểm soát hồ sơ**, chọn một hồ sơ mua sắm.
3. Chọn phương thức, điền giá trị và giá gói thầu/giá thương thảo (nếu áp dụng).
4. Đánh dấu trạng thái từng chứng từ và mã tham chiếu chứng từ **GIẢ**.
5. Bấm **Đối chiếu và ghi log**; xem kết quả và công việc sinh ra.
6. Qua **Nhật ký**, **Truy vấn**, **Báo cáo** để kiểm tra kết quả.
7. Tránh nhập thông tin không được phép công bố: trang Public không có đăng nhập, dữ liệu có thể bị lộ cho người truy cập cùng thiết bị.

## 5. Giới hạn kỹ thuật
- Các Agent vẫn là bộ quy tắc JavaScript, không phải mô hình AI thực sự.
- Không có backend hoặc API, không xử lý PDF thật, chưa tự kết nối kế toán, Base, eOffice, SCADA.
- Không kiểm tra chữ ký số, ngân hàng hoặc tính xác thực của nguồn chứng từ.
- Kết quả 'Có khai báo' chỉ chứng minh rằng người dùng tích chọn và ghi mã bằng chứng; **không chứng minh tài liệu tồn tại, hợp lệ hoặc đúng quyền**.
- Thông tin quy chế là **chỉ mục và diễn giải gọn**, không đăng bản scan, toàn văn hoặc tài liệu nội bộ lên GitHub Public.

## 6. Tiêu chí kiểm thử
- Mở giao diện 3.1, chạy 48 tình huống không lỗi.
- Bước mua nhỏ lẻ: chọn 4, 15, 50 triệu → có checklist Điều 19 tương ứng.
- Chỉ định thầu: giá gói thầu 100, giá thương thảo 94 → tỷ lệ tính 6%; 100/97 → 3% và cảnh báo.
- Người mua sắm và thẩm định trùng mã → yêu cầu kiểm tra độc lập.
- Hồ sơ chưa cung cấp bằng chứng → **Chưa xác minh**, không báo “đạt”.
- Kết quả kiểm tra tạo log bàn giao và đầu việc có cùng caseId; chạy lại không tạo đầu việc trùng.
- Kết quả không chứa tài liệu mật hay tên người thật.

## 7. Bước để thành hệ thống doanh nghiệp thực
- Backend, PostgreSQL, đăng nhập, phân quyền và nhật ký chống sửa.
- Phân tích PDF/OCR có xác minh từng trang, đối chiếu bản ký và các văn bản sửa đổi.
- Rulebook có phiên bản, hiệu lực, điều khoản, xác minh thủ công trước khi cho máy chặn.
- Agent AI chạy server-side; human approval theo phân cấp; tích hợp có kiểm soát.

**CTY AI 3.1 là nền tảng DEMO; không sử dụng để phê duyệt hồ sơ thật.**
