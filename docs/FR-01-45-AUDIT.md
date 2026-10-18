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
| FR-11 | Xóa tài liệu | Đã triển khai và kiểm thử trên iPhone, file vật lý và dữ liệu liên quan | Xóa tài liệu, file upload, tóm tắt, Chat; không ảnh hưởng dữ liệu khác | **PASS 7/7** (người dùng xác nhận) |
| FR-12 | Tổ chức theo môn học/chủ đề | Đã sửa trên feature và test iPhone | Gán môn/chủ đề, nhóm, lọc, chưa phân loại, mở lại | **PASS 8/8** (người dùng xác nhận) |
| FR-13 | Lưu nội dung tài liệu cho AI | Có code | Trích xuất văn bản rồi chạy Summary/Chat | Not Run |
| FR-14 | Yêu cầu AI tóm tắt tài liệu | Có code | Chọn file và tạo tóm tắt | Not Run |
| FR-15 | Trích xuất văn bản PDF | Có code | PDF có text, kiểm tra nội dung trích xuất | Not Run |
| FR-16 | Gửi nội dung phù hợp tới AI API | Có code | Tạo Summary qua backend | Not Run |
| FR-17 | Tóm tắt dựa trên tài liệu | Cần kiểm thử | Đối chiếu 3 ý với PDF gốc | Not Run |
| FR-18 | Ngắn/trung bình/chi tiết | Có code | Tạo đủ 3 mức | Not Run |
| FR-19 | Tóm tắt theo chương/phần | Đã hoàn thiện trên branch và kiểm thử iPhone | Phân biệt đúng 3 chương, tóm tắt đúng chương, lưu lịch sử đúng chương | **PASS** (người dùng xác nhận toàn bộ) |
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
| FR-30 | Cho chọn lưu/không lưu lịch sử | Đã triển khai trên branch, kiểm thử iPhone | Bật lưu và mở lại; tắt lưu, hỏi tiếp trong phiên, không xuất hiện trong lịch sử; đổi chế độ | **PASS** (người dùng xác nhận) |
| FR-31 | Chụp ảnh đề bài | Có code | Dùng camera trên iPhone | Not Run |
| FR-32 | Chọn ảnh từ thiết bị | Có code | Chọn ảnh từ Photos | Not Run |
| FR-33 | OCR/multimodal AI | Có code | Chạy nhận dạng văn bản từ ảnh | Not Run |
| FR-34 | Chuyển kết quả OCR thành text | Có code | Kiểm tra output dạng text | Not Run |
| FR-35 | Hiển thị nội dung nhận dạng | Có code | Đối chiếu với ảnh gốc | Not Run |
| FR-36 | Sửa nội dung OCR | Có code | Sửa một từ rồi xác nhận | Not Run |
| FR-37 | Gửi đề OCR để AI phân tích | Đã triển khai và kiểm thử trên iPhone | OCR → sửa nội dung → chuyển sang Solver → giải bài; thử ảnh khác, rỗng và camera | **PASS 7/7** (người dùng xác nhận) |
| FR-38 | AI phân tích đề bài | Có code | Gửi đề cho Solver | Not Run |
| FR-39 | Xác định loại bài/chủ đề | Có code | Kiểm tra type/topic trả về | Not Run |
| FR-40 | Gợi ý từng bước | Có code | Xem danh sách hints | Not Run |
| FR-41 | Yêu cầu gợi ý tiếp theo | Có code | Nhấn nút gợi ý tiếp theo | Not Run |
| FR-42 | Giải thích khái niệm | Có code | Kiểm tra phần explanation | Not Run |
| FR-43 | Xem lời giải khi sinh viên yêu cầu | Đã code và kiểm thử trên iPhone | Các bước và đáp án chỉ hiện khi chọn xem, có thể ẩn và bắt đầu bài mới | **PASS** (thuộc bộ 8/8 chung, người dùng xác nhận) |
| FR-44 | Phân biệt hint/giải thích/lời giải | Có code | So sánh 3 phần trên Solver | Not Run |
| FR-45 | Hỏi tiếp về lời giải | Đã code và kiểm thử trên iPhone | Gửi câu hỏi dựa trên lời giải, hỏi tiếp theo ngữ cảnh; API follow-up chạy sau khi cập nhật Backend | **PASS** (thuộc bộ 8/8 chung, người dùng xác nhận) |

## Danh sách công việc ưu tiên

1. **FR-12** – Bộ lọc môn học + tự nhóm theo môn học/chủ đề đã **PASS 8/8** theo kết quả kiểm thử người dùng trên iPhone; khuyến nghị thêm edge tests đổi/xóa nhóm và chuẩn hóa môn học.
2. **FR-19** – **PASS:** người dùng xác nhận nhận diện, tóm tắt đúng phạm vi ba chương, tên chương và lịch sử đều chính xác trên iPhone.
3. **FR-30** – **PASS:** người dùng xác nhận các luồng bật/tắt lưu lịch sử, hỏi tiếp trong phiên và chuyển chế độ trên iPhone.
4. **FR-37** – **PASS 7/7:** người dùng xác nhận toàn bộ luồng OCR → Solver trên iPhone.
5. **FR-45** – **PASS:** người dùng xác nhận hỏi tiếp về lời giải hoạt động sau khi khắc phục lỗi 404 Backend local.
6. **FR-43** – **PASS:** người dùng xác nhận chế độ xem/ẩn lời giải theo yêu cầu hoạt động trên iPhone.
7. **FR-11** – **PASS 7/7:** người dùng xác nhận đã xóa được tài liệu, file upload vật lý và dữ liệu liên quan; giữ dữ liệu khác nguyên vẹn.
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

## Xác nhận FR-19 – 18/10/2026 (cập nhật)

Người dùng xác nhận các kiểm tra cuối FR-19 đều PASS: tóm tắt riêng từng chương không lẫn nội dung và ghi đúng chương trong lịch sử. Đây là kết quả kiểm thử thủ công từ người dùng.

## FR-30 – Kiểm thử iPhone (chưa chạy)

| Test case | Thao tác | Expected |
|---|---|---|
| TC-FR30-01 | Bật lưu lịch sử (mặc định), gửi câu hỏi | Hội thoại tạo và lưu như trước |
| TC-FR30-02 | Rời Chat, vào lịch sử và mở lại hội thoại | Tin nhắn còn đầy đủ |
| TC-FR30-03 | Tạo chat mới, tắt lưu lịch sử, gửi câu hỏi | Nhận trả lời bình thường, không sinh bản ghi trong MongoDB |
| TC-FR30-04 | Chế độ tắt, hỏi câu tiếp theo liên quan | AI dùng được ngữ cảnh tạm thời trong phiên |
| TC-FR30-05 | Rời phiên tắt lưu, mở lại lịch sử | Không thấy hội thoại tạm thời |
| TC-FR30-06 | Đổi chế độ giữa phiên | Thông báo xác nhận, bắt đầu chat mới; lịch sử đã lưu trước đó không bị xóa |
| TC-FR30-07 | Không có JWT / yêu cầu sai dữ liệu history | API chặn theo kiểm tra quyền và dữ liệu |

**Phụ thuộc:** FR-30 thêm giao diện và API vào branch feature; Render vẫn chạy main, cần Backend local từ cùng branch để test. Test helper: `node --test backend/tests/ephemeralChat.test.js`.

**Giới hạn cần nêu:** Chế độ không lưu không ghi `conversations` hoặc `messages` vào MongoDB; văn bản trao đổi vẫn gửi tới Gemini để trả lời và có thể chịu chính sách lưu trữ của nhà cung cấp AI. Không mô tả chế độ này là bảo đảm ẩn danh hoặc không lưu dữ liệu ở mọi hệ thống.

## Cải thiện hiển thị phản hồi Chat AI – 18/10/2026

- Điều chỉnh prompt Gemini để ưu tiên văn bản thuần, xuống dòng dễ đọc trên màn hình điện thoại.
- Backend chuẩn hóa kết quả AI trước khi trả và lưu; chuyển dấu đầu dòng Markdown `*` hoặc `-` thành `•`, bỏ dấu `**`/dấu nhấn mạnh, tiêu đề `#` và code fence.
- Frontend hiển thị cả lịch sử AI cũ bằng định dạng sạch, **không sửa nội dung tin nhắn người dùng** và không làm thay đổi bản ghi cũ trong MongoDB.
- Giữ ký hiệu toán học hợp lệ như `2 * 3`, `x*y*z`.
- Bộ test làm sạch văn bản: 7/7 trường hợp đạt qua kiểm tra hàm với môi trường JavaScript; cần chạy `node --test backend/tests/cleanChatAnswer.test.js` trên máy người dùng và kiểm thử Chat với Gemini thực tế.
- FR-30 vẫn **Not Run** trên iPhone, chưa được coi là PASS.

## Xác nhận hiển thị Chat AI – 18/10/2026

- Hiển thị Chat AI: người dùng xác nhận PASS trên iPhone sau khi sửa lỗi ký tự Markdown thừa.
- FR-30 (lưu/không lưu lịch sử) là hạng mục riêng; chưa có xác nhận PASS 2 chế độ nên vẫn Not Run.

## Xác nhận FR-30 – 18/10/2026

Người dùng xác nhận kiểm thử FR-30 **PASS** sau khi được hướng dẫn kiểm tra chế độ lưu, không lưu, hỏi tiếp và đổi chế độ. Đây là báo cáo kiểm thử thủ công từ người dùng. Chưa có xác nhận kiểm tra trực tiếp MongoDB độc lập.

## FR-37 – Bài kiểm thử iPhone (chưa chạy)

| TC | Bước chính | Kết quả mong đợi |
|---|---|---|
| TC-FR37-01 | Scanner → chọn ảnh chứa đề toán → Nhận diện | Hiển thị văn bản OCR và có nút **Đưa sang AI Solver** |
| TC-FR37-02 | Sửa lỗi OCR trong ô văn bản, nhấn Đưa sang AI Solver | Mở đúng màn hình Solver, đề điền sẵn **theo nội dung đã chỉnh**, không phải văn bản OCR gốc |
| TC-FR37-03 | Nhấn Giải bài tập | AI trả kết quả phân tích bài tập; các bước/gợi ý hiện đúng như trước |
| TC-FR37-04 | Quay về Scanner và thay bằng ảnh khác | Vẫn có thể OCR và chuyển bài mới, không bị giữ đề bài cũ |
| TC-FR37-05 | Xóa trống nội dung đã nhận dạng | Nút chuyển Solver bị vô hiệu hóa; có thể khôi phục lại OCR gốc |
| TC-FR37-06 | Văn bản OCR dài hơn 6000 ký tự | Hiển thị cảnh báo và không cho chuyển sang Solver |
| TC-FR37-07 | Chụp ảnh bằng camera rồi làm lại luồng | Chuyển đề từ camera sang Solver hoạt động giống ảnh thư viện |

Các thay đổi chỉ nằm ở Frontend; không cần endpoint mới vì Solver đã có API giải bài toán. **Trạng thái FR-37: đã code, chưa PASS.**

## Xác nhận FR-37 – 18/10/2026

- **FR-37 PASS 7/7** theo người dùng đã kiểm thử đầy đủ TC-FR37 trên iPhone.
- Hai yêu cầu tiếp theo **FR-43 và FR-45** đang triển khai trên `feature/fr-completion`; không đánh dấu PASS khi chưa có kết quả test trực tiếp.

## FR-43 & FR-45 – Triển khai 18/10/2026, chờ kiểm thử

- **FR-43:** Kết quả Solver vẫn gồm phân loại, chủ đề, gợi ý từng bước, và giải thích ban đầu. Các bước giải + đáp án cuối chỉ hiển thị khi người dùng nhấn **Xem lời giải đầy đủ**; nút này có thể đóng lại. Đây là kiểm soát hiển thị trên UI: JSON Backend vẫn chứa các bước và đáp án sau lần giải đầu tiên.
- **FR-45:** Sau khi giải, phần **Hỏi thêm về bài giải** cho phép hỏi vì sao một bước đúng, hỏi tiếp từ câu trả lời trước; tối đa 6 tin gần nhất được gửi cùng đề gốc và kết quả đã giải tới `POST /api/solver/follow-up` có JWT.
- **Lưu trữ:** Lịch sử hỏi tiếp Solver chỉ nằm trong bộ nhớ màn hình, không ghi MongoDB. Nội dung vẫn được gửi sang dịch vụ Gemini và chịu chính sách của nhà cung cấp AI.
- **An toàn dữ liệu:** Backend giới hạn độ dài câu hỏi, đề bài, số bước, kết quả, số lượng tin nhắn, và lọc `role`. Không đọc dữ liệu người khác từ DB theo ngữ cảnh do người dùng cung cấp.
- **Bộ test:** `node --test backend/tests/solverFollowUp.test.js`, các trường hợp kiểm tra validation/prompt đạt 5/5 trong JavaScript; chưa chạy tích hợp Gemini.

| TC | Thực hiện trên iPhone | Expected |
|---|---|---|
| TC-FR43-01 | Giải đề mới | Có gợi ý + giải thích; chưa thấy danh sách bước giải và đáp án |
| TC-FR43-02 | Nhấn **Xem lời giải đầy đủ** | Hiển thị toàn bộ bước và đáp án |
| TC-FR43-03 | Nhấn **Ẩn lời giải đầy đủ** | Các bước và đáp án được ẩn lại |
| TC-FR43-04 | Giải đề khác | Lời giải lại ẩn theo mặc định |
| TC-FR45-01 | Sau khi giải, hỏi “Vì sao bước 2 làm như vậy?” | AI trả lời phù hợp bài hiện tại |
| TC-FR45-02 | Hỏi tiếp “Có cách nào khác không?” | AI hiểu ngữ cảnh từ câu hỏi và bài giải trước |
| TC-FR45-03 | Thử gửi câu hỏi rỗng | Nút Gửi bị vô hiệu hóa |
| TC-FR45-04 | Giải bài mới và hỏi tiếp | Không dùng nhầm ngữ cảnh bài trước |
| TC-FR45-05 | Thử khi Backend/Gemini lỗi | Có lỗi rõ ràng, vẫn giữ nội dung để gửi lại |

**Chú ý:** Render `main` chưa được cập nhật. Kiểm thử FR-45 cần Backend local đang chạy `feature/fr-completion`; chỉ cập nhật Expo mà không khởi động Backend mới sẽ trả lỗi 404.

## Sửa giao diện Solver và lỗi 404 local – 18/10/2026

- Đã xóa dòng **Ví dụ: ...** ở thẻ Hỏi thêm về bài giải, thay placeholder chứa ví dụ toán ở ô Solver thành hướng dẫn trung tính.
- Đã kiểm tra source GitHub: `backend/app.js` mount `/api/solver` và `backend/routes/solverRoutes.js` có `POST /follow-up`. Không thay đổi đường dẫn API.
- Log người dùng: `POST http://192.168.1.204:5000/api/solver/follow-up` trả **404**. Giả thuyết chính: Backend local vẫn chạy source cũ hoặc tiến trình khác chiếm port 5000; chưa thể xác minh từ máy người dùng.
- Giao diện sẽ thông báo cụ thể khi gặp lỗi 404 để hướng dẫn đồng bộ rồi khởi động lại Backend từ `feature/fr-completion`.
- **FR-43, FR-45 vẫn Not Run / chưa PASS** cho tới khi người dùng kiểm tra lại trên iPhone.

## Xác nhận FR-43 & FR-45 – 18/10/2026

- Người dùng phản hồi **đã PASS** sau khi kiểm thử lại Solver trên iPhone và khắc phục lỗi `404 /api/solver/follow-up`.
- Ghi **FR-43 PASS**, **FR-45 PASS** dựa trên báo cáo kiểm thử thủ công. Chưa có kiểm thử độc lập mọi trường hợp lỗi API.
- Thay đổi giao diện đã xóa các câu ví dụ ở ô Solver và phần Hỏi thêm về bài giải.

- Bổ sung xác nhận: người dùng báo **FR-43 và FR-45 PASS 8/8 bước** trên iPhone (tổng bộ kịch bản hai FR); không hiểu là 8/8 cho từng FR riêng lẻ.

## FR-11 – Triển khai 18/10/2026, chờ kiểm thử

**Đã sửa trên `feature/fr-completion`:**
- API `DELETE /api/documents/:id` xác minh tài liệu thuộc tài khoản đăng nhập trước khi xóa.
- Xóa các `messages` từ cuộc trò chuyện thuộc tài liệu, xóa các `conversations`, các `summaries`, sau đó xóa bản ghi `documents`.
- Chỉ được xóa file trong `backend/uploads` khi `uri` khớp tên do hệ thống upload sinh ra (`/uploads/<timestamp>-<random>.(pdf|docx|txt)`). Không xóa URL ngoài hoặc đường dẫn do người dùng tùy ý nhập.
- Nếu file đang được bản ghi tài liệu khác tham chiếu, không xóa file chung.
- Nếu file không còn trên disk, ghi `fileStatus: already-missing`; nếu xóa file lỗi do permission/disk, giữ kết quả xóa database và trả `fileStatus: failed`, kèm cảnh báo để tránh báo sai là file đã được dọn xong.
- Frontend cảnh báo rõ xóa tài liệu sẽ xóa cả bản tóm tắt, lịch sử Chat và không thể hoàn tác.
- Bộ kiểm tra logic độc lập: **7/7 PASS** bằng JavaScript với fake collections/file operations. Chưa kiểm thử end-to-end trên MongoDB/ổ đĩa của người dùng.

**Lưu ý kỹ thuật:** Xóa trên MongoDB và filesystem không phải một giao dịch ACID thống nhất; nếu gặp lỗi DB giữa chừng có thể cần retry. Dữ liệu file trên Render có thể không tồn tại tại Backend local khác: phải upload *file thử mới* vào đúng server đang kiểm thử để xác nhận xóa file thật.

| TC | Thao tác kiểm thử thực tế | Expected |
|---|---|---|
| TC-FR11-01 | Upload PDF thử nghiệm mới vào Backend local; tạo tóm tắt, trò chuyện | Có tài liệu, bản tóm tắt, lịch sử hội thoại |
| TC-FR11-02 | Nhấn Xóa → Hủy | Tài liệu vẫn còn |
| TC-FR11-03 | Nhấn Xóa → Xác nhận | Tài liệu biến mất khỏi danh sách |
| TC-FR11-04 | Làm mới danh sách, đăng xuất và đăng nhập lại | Không thấy tài liệu đã xóa |
| TC-FR11-05 | Kiểm tra `backend/uploads` bằng tên file ứng với `uri` trước và sau | File thử không còn trên ổ đĩa |
| TC-FR11-06 | Kiểm tra MongoDB / API có quyền đối với `summaries`, `conversations`, `messages` của tài liệu bị xóa | Không còn dữ liệu liên quan của tài liệu |
| TC-FR11-07 | Có thêm tài liệu khác hoặc tài khoản khác | Tài liệu và lịch sử không liên quan vẫn còn |

**FR-11 chưa PASS:** chờ người dùng xác nhận kiểm thử trên iPhone và server local.

## Xác nhận FR-11 – 18/10/2026

- Người dùng xác nhận kiểm thử **FR-11 PASS 7/7 bước** trên iPhone, bao gồm xóa bản ghi, xóa file vật lý và các bản tóm tắt, cuộc trò chuyện và tin nhắn liên quan; thử hủy thao tác, tải lại danh sách và giữ dữ liệu khác.
- Đây là kết quả kiểm thử thủ công từ người dùng; không suy rộng sang các trường hợp xóa đồng thời hay quyền tài khoản khác chưa kiểm thử riêng.
- **Tiếp theo:** FR-05 — xác nhận dữ liệu và truy cập tệp riêng theo tài khoản A/B. Trong `backend/app.js`, `/uploads` đang được phục vụ bằng `express.static` không yêu cầu JWT; cần xử lý trước khi kết luận FR-05 PASS toàn bộ.
