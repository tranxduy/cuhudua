# CTY AI 2.0 — Multi-Agent Enterprise Simulator

**Bản mô phỏng Public; không chứa dữ liệu vận hành thật, tài liệu mật hay tài khoản API.**

## Mục tiêu
Tạo không gian thử nghiệm quản lý công việc của doanh nghiệp thủy điện: từ hồ sơ đầu vào đến phân công nhiều Agent, chạy theo quan hệ phụ thuộc, đối chiếu chéo, lập đầu việc và trình người có thẩm quyền.

## Quy mô
- **48** tình huống giả định, **8** lĩnh vực nghiệp vụ.
- **9** nhóm cơ quan/đơn vị hoặc đầu mối chức năng mô phỏng.
- **31** người có tên, chức danh hoàn toàn giả định.
- **12** Agent chuyên trách và bộ điều phối trung tâm.
- **8** sơ đồ phụ thuộc tương ứng từng nhóm nghiệp vụ.

## Tính năng
- Bảng điều hành 5 phút; cảnh báo và thống kê.
- Xem/tìm/lọc hồ sơ, tạo hồ sơ mới, phân công người giả định.
- Một nút **Chạy 48 tình huống** và chạy riêng từng hồ sơ hoặc từng bước.
- Agent xử lý theo điều kiện đầu vào; kết quả chuyển sang Agent phụ thuộc; Kiểm soát chéo là bước trước Thư ký.
- Nhật ký giao tiếp cho từng hồ sơ, kết luận và cảnh báo; Thư ký tạo công việc kiểm tra bổ sung.
- Người quản lý ghi nhận hoặc yêu cầu bổ sung (chỉ là trạng thái mô phỏng).
- Danh sách bộ phận/nhân viên giả, mạng quan hệ 12 Agent.
- Lưu tại localStorage của trình duyệt; xuất JSON/CSV, nhập JSON và đặt lại dữ liệu demo.

## Cách chạy
1. Mở `index.html` hoặc GitHub Pages `/cuhudua/cty-ai-2-0/`.
2. Nhấn **Chạy 48 tình huống**.
3. Vào **48 hồ sơ**, mở một hồ sơ để xem luồng Agent và sự kiện bàn giao.
4. Vào **Mạng Agent** để xem quan hệ vào/ra theo loại nghiệp vụ.
5. Vào **Công việc** để đánh dấu các công việc được Agent Thư ký tạo.
6. Xuất JSON để lưu bản sao; dữ liệu không tự đồng bộ giữa thiết bị.

## Nguồn định hướng nghiệp vụ
- Điều lệ Công ty cổ phần Thủy điện Geruco Sông Côn (bản 2025).
- Quy chế quản trị nội bộ (2023); Quy chế HĐQT và Ban Kiểm soát (2023).
- Quyết định số 252/QĐ-GSC (30/8/2018) về chức năng nhiệm vụ các bộ phận.
- Quyết định số 29/QĐ-HĐQT.GSC (31/12/2025) về mua sắm hoạt động SXKD thường xuyên.
- Quyết định số 241/QĐ-GSC (31/12/2023) về công tác văn thư, lưu trữ.
- Báo cáo BKS kết quả kiểm tra giám sát quý I/2026.

**Các tài liệu trên chỉ được dùng để gợi ý nhóm nghiệp vụ và tình huống; không sao chép toàn văn. Mã nguồn không khẳng định đã kiểm tra được điều khoản hoặc xác định tính tuân thủ.** Nhóm “Đầu mối an toàn” là nhóm chức năng mô phỏng, không khẳng định cơ cấu phòng ban chính thức tại thời điểm hiện tại.

## Nguyên tắc an toàn và giới hạn
- Không có AI mô hình ngôn ngữ thực, không có backend, không có kết nối Base, Google, SCADA, kế toán hoặc ngân hàng.
- Không có xác thực và phân quyền thực; không nhập dữ liệu doanh nghiệp không công khai vào website.
- Bộ quy tắc chỉ **gợi ý các điểm cần kiểm tra** từ cờ tình huống đã được tạo sẵn.
- Không tự ký, duyệt, hạch toán, chuyển tiền, quyết định đấu thầu hoặc tác động vận hành công trình.
- Ban Kiểm soát là thiết chế giám sát độc lập; Agent “Kiểm soát chéo” trên web chỉ là vai trò phần mềm mô phỏng, không đại diện BKS thực tế.
- Mọi tên và vai trò nhân viên chỉ là tên giả. Giá trị tiền trong ví dụ không phải giá trị giao dịch của công ty.

## Kiểm thử hiện có
- Biên dịch cú pháp JavaScript giao diện: đạt.
- Kiểm tra phụ thuộc không vòng lặp của 8 luồng: đạt.
- Chạy tự động trên 48 tình huống bằng môi trường mô phỏng đối tượng DOM: đạt **48/48**.
- Đã sinh **282** kết quả Agent, **330** lần bàn giao kết quả, **42** hồ sơ cần rà soát, **42** công việc theo dõi.
- **Chưa** kiểm thử trình duyệt thực tế đầy đủ hay xác nhận GitHub Pages đang phục vụ đường dẫn.

## Lộ trình để thành hệ thống AI thực
Bổ sung máy chủ riêng để quản lý tài khoản và phân quyền, cơ sở dữ liệu PostgreSQL, kho hồ sơ bảo mật, xác thực chữ ký và nhật ký chống sửa, hàng đợi công việc, API AI chạy ở phía máy chủ, kết nối có kiểm soát với hệ thống công ty và bộ kiểm thử hồi quy.

> Khu vực khác trong repository `cuhudua` được giữ nguyên; ứng dụng tồn tại độc lập trong thư mục `cty-ai-2-0`.
