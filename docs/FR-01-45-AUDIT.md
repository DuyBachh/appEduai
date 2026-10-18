# Theo dõi hoàn thiện 45 Functional Requirements – appEduai

Nguồn: tài liệu đề tài **AI Learning Assistant** do người dùng cung cấp, 3 trang, FR-01 đến FR-45.

Rà soát ban đầu dựa trên **source code GitHub** ngày 17/10/2026, không thay thế kiểm thử trực tiếp. Mọi chức năng phải chạy trên iPhone/Expo Go trước khi ghi **PASS**. Backend demo đang dùng Render; không dùng dữ liệu hoặc mật khẩu thật.

## Quy ước trạng thái

- **Có code**: Tìm thấy đường triển khai trong source; **chưa mặc nhiên PASS**.
- **Cần kiểm thử**: Chưa đủ bằng chứng hành vi thực tế.
- **Chưa đầy đủ/Chưa thấy/Lệch luồng**: Cần sửa hoặc làm rõ cách hiểu yêu cầu.
- **Đã sửa trên feature – chưa test**: Có commit trên branch `feature/fr-completion`, chưa merge `main`.

## Toàn bộ yêu cầu và kịch bản xác nhận

| FR | Yêu cầu | Rà soát code | Kiểm thử cần thực hiện | Test thực tế |
|---|---|---|---|---|
| FR-01 | Đăng ký email/mật khẩu | Có code | Đăng ký email mới, kiểm tra tài khoản | Not Run |
| FR-02 | Đăng nhập, đăng xuất | Có code | Đăng nhập đúng/sai, đăng xuất | Not Run |
| FR-03 | Quên/đặt lại mật khẩu | Demo có rủi ro | Chỉ thử với tài khoản giả; token reset hiện lộ qua API | Not Run |
| FR-04 | Cập nhật hồ sơ | Có code | Đổi tên, tải lại, kiểm tra lưu | Not Run |
| FR-05 | Dữ liệu riêng theo tài khoản | Cần kiểm thử | Tài khoản A/B không được xem/sửa dữ liệu của nhau | Not Run |
| FR-06 | Upload tài liệu | Có code | Tải file mẫu lên | Not Run |
| FR-07 | PDF, DOCX, TXT | Có code | Tải từng định dạng | Not Run |
| FR-08 | Danh sách tài liệu | Có code | Kiểm tra danh sách vừa upload | Not Run |
| FR-09 | Tên, ngày tải, kích thước | Có code | Mở thẻ/chi tiết tài liệu | Not Run |
| FR-10 | Đổi tên tài liệu | Có code | Đổi tên và tải lại danh sách | Not Run |
| FR-11 | Xóa tài liệu | Chưa đầy đủ | Xóa bản ghi; kiểm tra file vật lý có được xóa không | Not Run |
| FR-12 | Tổ chức theo môn học/chủ đề | Đã sửa trên feature và test iPhone | Gán môn/chủ đề, nhóm, lọc, chưa phân loại, mở lại | **PASS 8/8** (người dùng xác nhận) |
| FR-13 | Lưu nội dung tài liệu cho AI | Có code | Trích xuất văn bản rồi chạy Summary/Chat | Not Run |
| FR-14 | Yêu cầu AI tóm tắt tài liệu | Có code | Chọn file và tạo tóm tắt | Not Run |
| FR-15 | Trích xuất văn bản PDF | Có code | PDF có text, kiểm tra nội dung trích xuất | Not Run |
| FR-16 | Gửi nội dung phù hợp tới AI API | Có code | Tạo Summary qua backend | Not Run |
| FR-17 | Tóm tắt dựa trên tài liệu | Cần kiểm thử | Đối chiếu 3 ý với PDF gốc | Not Run |
| FR-18 | Ngắn/trung bình/chi tiết | Có code | Tạo đủ 3 mức | Not Run |
| FR-19 | Tóm tắt theo chương/phần | Đã code trên feature | Người dùng xác nhận đã tóm tắt được 3 chương; cần xác nhận không lẫn nội dung giữa các chương và lịch sử hiển thị đúng | **Partial PASS** – tóm tắt 3 chương, chờ kiểm tra phạm vi/lịch sử |
| FR-20 | Kết quả tóm tắt dễ đọc | Cần kiểm thử | Kiểm tra cấu trúc tóm tắt trên iPhone | Not Run |
| FR-21 | Lưu bản tóm tắt | Có tự lưu – cần xác nhận | Tạo tóm tắt, thoát và mở lại; đề không buộc nút Lưu riêng | Not Run |
| FR-22 | Xem lại bản tóm tắt | Có code | Mở lịch sử và chi tiết | Not Run |
| FR-23 | Đặt câu hỏi về tài liệu | Có code | Hỏi câu có đáp án trong PDF | Not Run |
| FR-24 | Sử dụng tài liệu làm nguồn | Có code | Hỏi câu dựa vào nội dung PDF | Not Run |
| FR-25 | Ưu tiên nguồn tài liệu | Cần kiểm thử | Hỏi câu không có trong tài liệu; xem cách AI từ chối | Not Run |
| FR-26 | Hiển thị câu trả lời trong chat | Có code | Gửi và nhận câu trả lời | Not Run |
| FR-27 | Duy trì ngữ cảnh hội thoại | Có code | Hỏi theo chuỗi có đại từ quy chiếu | Not Run |
| FR-28 | Câu hỏi tiếp theo theo đáp án trước | Có code | Hỏi tiếp cùng hội thoại | Not Run |
| FR-29 | Bắt đầu hội thoại mới | Có code | Dùng nút New Chat | Not Run |
| FR-30 | Lưu lịch sử nếu người dùng chọn | Chưa đầy đủ | Hiện tự lưu; cần tùy chọn lưu/không lưu | Not Run |
| FR-31 | Chụp ảnh đề bài | Có code | Dùng camera trên iPhone | Not Run |
| FR-32 | Chọn ảnh từ thiết bị | Có code | Chọn ảnh từ Photos | Not Run |
| FR-33 | OCR/multimodal AI | Có code | Chạy nhận dạng văn bản từ ảnh | Not Run |
| FR-34 | Chuyển kết quả OCR thành text | Có code | Kiểm tra output dạng text | Not Run |
| FR-35 | Hiển thị nội dung nhận dạng | Có code | Đối chiếu với ảnh gốc | Not Run |
| FR-36 | Sửa nội dung OCR | Có code | Sửa một từ rồi xác nhận | Not Run |
| FR-37 | Gửi đề OCR để AI phân tích | Cần hoàn thiện/xác nhận | Solver OCR rồi giải được; Scanner chưa chuyển trực tiếp | Not Run |
| FR-38 | AI phân tích đề bài | Có code | Gửi đề cho Solver | Not Run |
| FR-39 | Xác định loại bài/chủ đề | Có code | Kiểm tra type/topic trả về | Not Run |
| FR-40 | Gợi ý từng bước | Có code | Xem danh sách hints | Not Run |
| FR-41 | Yêu cầu gợi ý tiếp theo | Có code | Nhấn nút gợi ý tiếp theo | Not Run |
| FR-42 | Giải thích khái niệm | Có code | Kiểm tra phần explanation | Not Run |
| FR-43 | Lời giải khi sinh viên yêu cầu (có thể) | Lệch luồng tùy chọn | Hiện hiển thị lời giải ngay sau solve | Not Run |
| FR-44 | Phân biệt hint/giải thích/lời giải | Có code | So sánh 3 phần trên Solver | Not Run |
| FR-45 | Hỏi tiếp về lời giải | Chưa thấy | Hỏi tại sao một bước giải đúng, giữ ngữ cảnh | Not Run |

## Danh sách công việc ưu tiên

1. **FR-12** – Bộ lọc môn học + tự nhóm theo môn học/chủ đề đã **PASS 8/8** theo kết quả kiểm thử người dùng trên iPhone; khuyến nghị thêm edge tests đổi/xóa nhóm và chuẩn hóa môn học.
2. **FR-19** – Đã code chọn chương/phần và tóm tắt đúng phần trên feature. **Chưa test**; cần chạy Backend cùng branch trên LAN/preview vì Render hiện ở `main`; dùng tài liệu có heading rõ ràng.
3. **FR-30** – Cho lựa chọn lưu/không lưu lịch sử; Backend phải thực sự không lưu khi tắt.
4. **FR-37** – Kiểm tra Solver OCR→giải; nếu thầy yêu cầu luồng từ Scanner, thêm lệnh chuyển nội dung đã sửa sang Solver.
5. **FR-45** – Hội thoại hỏi tiếp dựa trên bài toán và lời giải Solver.
6. **FR-43** – Nếu cần demo thao tác yêu cầu riêng, chỉ hiển thị lời giải hoàn chỉnh khi nhấn nút; câu chữ đề là “có thể”.
7. **FR-11** – Xử lý file gốc khi xóa tài liệu; xem xét dữ liệu tệp của bản tóm tắt và lịch sử liên quan.
8. **FR-05, FR-17, FR-20, FR-21, FR-25** – Chạy các trường hợp xác nhận chất lượng và hành vi thực tế.

## Rủi ro demo ngoài FR

- `/auth/forgot-password` trả `resetToken` trực tiếp cho caller không xác thực: **không an toàn cho production**.
- `/uploads` là static public không yêu cầu JWT; file lưu trên filesystem Render có thể mất sau deploy.
- Chưa có bộ automated regression test chính thức/CI.

## Quy tắc làm việc

- Chỉ sửa trên `feature/fr-completion`; **không sửa, merge hoặc deploy `main` nếu chưa được người dùng yêu cầu rõ ràng**.
- Với từng FR: đọc code → sửa → kiểm tra trên iPhone → ghi Actual Result/PASS/FAIL → commit và push → tiếp tục FR khác.

## Báo cáo tiến độ 18/10/2026

- **FR-12:** User xác nhận TC-FR12-01 **PASS 8/8 bước** trên iPhone. Kiểm thử mở rộng các trường hợp lỗi biên chưa thực hiện.
- **FR-19:** Đã triển khai trong branch `feature/fr-completion`. Có endpoint `GET /api/summaries/documents/:documentId/sections`, POST summary nhận tùy chọn `sectionId`; Backend luôn lấy văn bản từ MongoDB của chủ sở hữu, không chấp nhận nguồn văn bản từ client. Hỗ trợ heading `Chương`/`Phần` hoặc chia thành các `Phần N` khi file không có heading được trích xuất. Có lưu tên chương/phần trong lịch sử.
- **Lưu ý:** Không nên nói mọi PDF đều được nhận dạng chương chính xác vì chất lượng văn bản sau trích xuất khác nhau. Kết quả FR-19 hiện vẫn **Not Run**.

## Tiến độ kiểm thử FR-19 – 18/10/2026

- Người dùng xác nhận trên iPhone đã tóm tắt được **3 chương** từ PDF mẫu.
- Chưa có xác nhận riêng về việc nội dung từng bản chỉ lấy từ chương đã chọn và hiển thị đúng tên chương trong lịch sử, nên chưa kết luận FR-19 PASS đầy đủ.
