# Danh mục 48 tình huống giả định — CTY AI 2.0

> Đây không phải danh sách hồ sơ thật của GSC. Mọi tình huống, số tiền, người phụ trách và cảnh báo đều là dữ liệu thử nghiệm.

## 1. Sản xuất điện

1. **Sản lượng tổ máy thấp hơn kế hoạch** — Sản lượng giảm 12% trong tuần; cần phân tích thời gian dừng máy và nước về hồ. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: production_gap, missing_measurement)
2. **Đối chiếu số liệu công tơ điện** — Báo cáo vận hành và số liệu giao nhận điện không khớp trong ca. (Ưu tiên: Khẩn; giá trị giả định: không áp dụng; cờ giả lập: reconcile_gap)
3. **Giá bán bình quân biến động** — Sản lượng tăng nhưng doanh thu không tăng tương ứng; yêu cầu phân tích giá bán. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: price_variance)
4. **Dừng tổ máy ngoài kế hoạch** — Tổ máy dừng bất thường; cần xác nhận biên bản và thời điểm khôi phục. (Ưu tiên: Khẩn; giá trị giả định: không áp dụng; cờ giả lập: safety_incident, missing_record)
5. **Thiếu dữ liệu đo lưu lượng** — Dữ liệu lưu lượng ngày không được cập nhật đầy đủ. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: missing_measurement)
6. **Báo cáo điện mặt trời áp mái** — Hồ sơ tổng hợp điện mặt trời tháng đã có biên bản và dữ liệu xác nhận. (Ưu tiên: Thấp; giá trị giả định: không áp dụng; cờ giả lập: không có cảnh báo)

## 2. Tài chính – kế toán

1. **Đối chiếu số dư tài khoản ngân hàng** — Số dư sao kê ngân hàng và sổ kế toán chênh lệch, chưa giải trình. (Ưu tiên: Khẩn; giá trị giả định: 680 triệu đồng; cờ giả lập: reconcile_gap, missing_record)
2. **Dự báo dòng tiền 90 ngày** — Lịch thu tiền bán điện và dự kiến chi chưa được xác nhận đầy đủ. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: missing_forecast)
3. **Chi phí quản lý tăng bất thường** — Chi phí quản lý tăng 18% so với ngân sách mô phỏng. (Ưu tiên: Cao; giá trị giả định: 240 triệu đồng; cờ giả lập: budget_overrun)
4. **Hoàn thiện bộ hồ sơ thuế kỳ này** — Tờ khai đã lập nhưng thiếu bảng đối chiếu hóa đơn đầu vào. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: missing_docs)
5. **Kế hoạch chi trả cổ tức mô phỏng** — Dự kiến chi trả cổ tức; chưa có tài liệu xác minh quyết định cấp có thẩm quyền. (Ưu tiên: Khẩn; giá trị giả định: 5200 triệu đồng; cờ giả lập: missing_approval, cash_pressure)
6. **Công nợ khách hàng quá hạn** — Khoản phải thu quá hạn, chưa có xác nhận đối chiếu hoặc lịch thu hồi. (Ưu tiên: Khẩn; giá trị giả định: 920 triệu đồng; cờ giả lập: late_deadline, missing_record)

## 3. Mua sắm – hợp đồng

1. **Thanh toán thiết bị thiếu nghiệm thu** — Đề nghị thanh toán hợp đồng sửa chữa có hóa đơn nhưng thiếu biên bản nghiệm thu. (Ưu tiên: Khẩn; giá trị giả định: 800 triệu đồng; cờ giả lập: missing_acceptance, missing_docs)
2. **Điều khoản không tạm ứng nhưng trả 50%** — Hợp đồng ghi không tạm ứng, đồng thời thanh toán 50% ngay khi ký. (Ưu tiên: Khẩn; giá trị giả định: 350 triệu đồng; cờ giả lập: contract_conflict, cash_pressure)
3. **Nhiều đề nghị mua sắm cùng một hạng mục** — Ba đề nghị mua sắm trong tháng cho cùng nhóm vật tư cần rà soát phạm vi và căn cứ. (Ưu tiên: Khẩn; giá trị giả định: 420 triệu đồng; cờ giả lập: split_purchase)
4. **Hồ sơ lựa chọn nhà cung cấp** — Hồ sơ có báo giá nhưng thiếu văn bản phê duyệt kết quả lựa chọn. (Ưu tiên: Cao; giá trị giả định: 290 triệu đồng; cờ giả lập: missing_approval)
5. **Đề nghị mua sắm vượt dự toán** — Giá trị đặt hàng cao hơn dự toán mô phỏng được duyệt. (Ưu tiên: Khẩn; giá trị giả định: 610 triệu đồng; cờ giả lập: budget_overrun)
6. **Hóa đơn sai thông tin đơn vị mua** — Thông tin người mua trên hóa đơn chưa khớp hợp đồng; chưa phát hành thanh toán. (Ưu tiên: Cao; giá trị giả định: 72 triệu đồng; cờ giả lập: invoice_mismatch)

## 4. Dự án – đầu tư

1. **Tiến độ khảo sát dự án thủy điện** — Nhà tư vấn giao sản phẩm chậm so với mốc hợp đồng. (Ưu tiên: Khẩn; giá trị giả định: 1500 triệu đồng; cờ giả lập: late_deadline, missing_record)
2. **Quyết toán chi phí xây dựng cơ bản** — Hạng mục hoàn thành nhưng bộ quyết toán chưa đủ biên bản. (Ưu tiên: Cao; giá trị giả định: 1250 triệu đồng; cờ giả lập: missing_docs, budget_overrun)
3. **Thẩm định hiệu quả dự án mới** — Phương án đầu tư chưa có phân tích độ nhạy dòng tiền và giả định vận hành. (Ưu tiên: Khẩn; giá trị giả định: 4800 triệu đồng; cờ giả lập: missing_forecast)
4. **Rà soát hợp đồng tư vấn kéo dài** — Hợp đồng tư vấn nghiên cứu nhiều năm chưa cập nhật sản phẩm và nghiệm thu. (Ưu tiên: Khẩn; giá trị giả định: 890 triệu đồng; cờ giả lập: late_deadline, contract_conflict)
5. **Lệch tiến độ giải ngân** — Giải ngân thực tế thấp hơn kế hoạch; thiếu giải thích tiến độ các gói. (Ưu tiên: Cao; giá trị giả định: 2100 triệu đồng; cờ giả lập: production_gap, missing_record)
6. **Dự án mái nhà xưởng điện mặt trời** — Bộ hồ sơ nghiên cứu giả định đã có đề xuất kỹ thuật, kinh tế và mốc triển khai. (Ưu tiên: Thấp; giá trị giả định: 740 triệu đồng; cờ giả lập: không có cảnh báo)

## 5. Bảo trì – vật tư

1. **Bảo dưỡng tổ máy định kỳ** — Công việc bảo dưỡng dự kiến nhưng chưa có phiếu xác nhận hoàn thành. (Ưu tiên: Cao; giá trị giả định: 140 triệu đồng; cờ giả lập: missing_record, late_deadline)
2. **Kiểm định thiết bị nâng hạ** — Thiết bị đến hạn kiểm định, chưa thấy hồ sơ chứng nhận mới. (Ưu tiên: Khẩn; giá trị giả định: 44 triệu đồng; cờ giả lập: safety_incident, late_deadline)
3. **Tồn kho vật tư chậm luân chuyển** — Một số vật tư dự phòng có tồn lâu cần đánh giá khả năng sử dụng. (Ưu tiên: Cao; giá trị giả định: 185 triệu đồng; cờ giả lập: inventory_stale)
4. **Sự cố rơ-le bảo vệ** — Thiết bị báo lỗi nhiều lần; lịch sử kiểm tra chưa được tổng hợp. (Ưu tiên: Khẩn; giá trị giả định: 96 triệu đồng; cờ giả lập: safety_incident, missing_record)
5. **Chi phí sửa chữa vượt kế hoạch** — Dự toán sửa chữa tăng so với phê duyệt ban đầu. (Ưu tiên: Cao; giá trị giả định: 360 triệu đồng; cờ giả lập: budget_overrun)
6. **Nhật ký bảo trì đã hoàn thiện** — Biên bản bảo trì mô phỏng có xác nhận và dữ liệu đo kiểm đầy đủ. (Ưu tiên: Thấp; giá trị giả định: 35 triệu đồng; cờ giả lập: không có cảnh báo)

## 6. Nhân sự – tiền lương

1. **Đối chiếu tiền lương ca kíp** — Bảng chấm công và bảng tính ca kíp có số giờ khác nhau. (Ưu tiên: Cao; giá trị giả định: 68 triệu đồng; cờ giả lập: reconcile_gap)
2. **Tăng ca vượt mức dự kiến** — Số giờ tăng ca phát sinh cao; hồ sơ phê duyệt chưa đầy đủ. (Ưu tiên: Cao; giá trị giả định: 45 triệu đồng; cờ giả lập: missing_approval, budget_overrun)
3. **Thanh toán công tác phí** — Đề nghị công tác phí thiếu bảng tổng hợp chứng từ liên quan. (Ưu tiên: Vừa; giá trị giả định: 16 triệu đồng; cờ giả lập: missing_docs)
4. **Kế hoạch tuyển dụng kỹ thuật** — Đề xuất nhân sự chưa có phê duyệt nhu cầu tuyển dụng. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: missing_approval)
5. **Chấm công không khớp lịch trực** — Lịch trực nhà máy và bảng tổng hợp công có khác biệt cần xác minh. (Ưu tiên: Khẩn; giá trị giả định: không áp dụng; cờ giả lập: reconcile_gap)
6. **Phân phối quỹ an toàn điện** — Danh sách dự kiến phân phối chưa có bảng đối chiếu điều kiện và đề xuất xét duyệt. (Ưu tiên: Khẩn; giá trị giả định: 110 triệu đồng; cờ giả lập: missing_docs, missing_approval)

## 7. Quản trị – văn thư

1. **Dự thảo nghị quyết HĐQT** — Dự thảo nội dung về tài chính chưa kèm hồ sơ xác định thẩm quyền. (Ưu tiên: Khẩn; giá trị giả định: không áp dụng; cờ giả lập: missing_approval)
2. **Báo cáo giám sát quý giả định** — Dự thảo báo cáo cần đối chiếu số liệu tài chính và tài liệu giải trình. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: reconcile_gap, missing_record)
3. **Danh sách cổ đông và tài liệu họp** — Hồ sơ lưu trữ tài liệu họp thiếu bảng kiểm soát phiên bản. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: missing_record)
4. **Biên bản họp giao ban điều hành** — Biên bản có kết luận nhưng chưa giao người chịu trách nhiệm và hạn xử lý. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: no_owner, late_deadline)
5. **Quy trình luân chuyển văn bản** — Văn bản đến chưa có bằng chứng phân công và nhật ký xử lý. (Ưu tiên: Cao; giá trị giả định: không áp dụng; cờ giả lập: missing_record)
6. **Công bố thông tin định kỳ** — Bộ hồ sơ công bố thông tin giả định đầy đủ checklist và lịch theo dõi. (Ưu tiên: Thấp; giá trị giả định: không áp dụng; cờ giả lập: không có cảnh báo)

## 8. An toàn – môi trường

1. **Cảnh báo mực nước hồ tăng** — Mực nước tăng nhanh; cần xác minh số liệu đo và thông báo trực ca. (Ưu tiên: Khẩn; giá trị giả định: không áp dụng; cờ giả lập: safety_incident, missing_measurement)
2. **Rà soát kế hoạch PCTT và TKCN** — Danh sách thiết bị ứng phó còn thiếu trạng thái sẵn sàng. (Ưu tiên: Khẩn; giá trị giả định: 95 triệu đồng; cờ giả lập: missing_docs, safety_incident)
3. **Diễn tập phương án PCCC** — Đến lịch diễn tập; chưa có đủ danh sách tham gia và xác nhận. (Ưu tiên: Cao; giá trị giả định: 18 triệu đồng; cờ giả lập: late_deadline, missing_record)
4. **Kiểm tra hồ sơ an toàn đập** — Hồ sơ kiểm tra định kỳ chưa được cập nhật trên hệ thống. (Ưu tiên: Khẩn; giá trị giả định: 120 triệu đồng; cờ giả lập: missing_record, safety_incident)
5. **Kiểm định bình chữa cháy** — Một phần thiết bị chưa có xác nhận kiểm tra theo danh mục. (Ưu tiên: Cao; giá trị giả định: 12 triệu đồng; cờ giả lập: late_deadline)
6. **Báo cáo an toàn và môi trường** — Bộ báo cáo mô phỏng đã có lịch và kết quả đối chiếu. (Ưu tiên: Thấp; giá trị giả định: không áp dụng; cờ giả lập: không có cảnh báo)

## Cơ chế phối hợp

- **Sản xuất điện:** Vận hành → Bảo trì → Tài chính → An toàn → Kiểm soát chéo → Thư ký.
- **Tài chính – kế toán:** Tài chính → Kế toán → Pháp chế → Kiểm soát chéo → Thư ký.
- **Mua sắm – hợp đồng:** Mua sắm → Tài chính → Pháp chế → Kế toán → Kiểm soát chéo → Thư ký.
- **Dự án – đầu tư:** Đầu tư → Tài chính → Pháp chế → An toàn → Kiểm soát chéo → Thư ký.
- **Bảo trì – vật tư:** Bảo trì → Vận hành → Mua sắm → An toàn → Tài chính → Kiểm soát chéo → Thư ký.
- **Nhân sự – tiền lương:** Nhân sự → Tài chính → Pháp chế → Kế toán → Kiểm soát chéo → Thư ký.
- **Quản trị – văn thư:** Văn thư → Pháp chế → Tài chính → Kiểm soát chéo → Thư ký.
- **An toàn – môi trường:** An toàn → Vận hành → Bảo trì → Pháp chế → Kiểm soát chéo → Thư ký.
