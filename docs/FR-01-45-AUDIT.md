# Theo dõi hoàn thiện 45 Functional Requirements – appEduai

Nguồn: tài liệu đề tài **AI Learning Assistant** do người dùng cung cấp, 3 trang, FR-01 đến FR-45.

Rà soát ban đầu dựa trên **source code GitHub** ngày 17/10/2026, không thay thế kiểm thử trực tiếp. Mọi chức năng phải chạy trên iPhone/Expo Go trước khi ghi **PASS**. Backend demo đang dùng Render; không dùng dữ liệu hoặc mật khẩu thật.

## Quy ước trạng thái

- **Có code**: Tìm thấy đường triển khai trong source; **chưa mặc nhiên PASS**.
- **Not Run trong bảng kiểm thử FR:** chỉ cho biết chưa có biên bản kiểm thử riêng theo bảng audit này; **không có nghĩa chức năng chưa được code hoặc phải kiểm thử lại từng FR**. Các module cũ đã có các lượt kiểm thử trước khi rà soát 45 FR. Ưu tiên một lượt regression cuối xuyên suốt ứng dụng.
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
| FR-05 | Dữ liệu riêng theo tài khoản | Đã triển khai chặn public uploads và kiểm thử A/B, API, file trên iPhone/local | Hai tài khoản A/B không truy cập chéo tài liệu, Summary/Chat, không xem được file gốc qua URL công khai | **PASS 8/8** (người dùng xác nhận) |
| FR-06 | Upload tài liệu | Có code | Tải file mẫu lên | Not Run |
| FR-07 | PDF, DOCX, TXT | Có code | Tải từng định dạng | Not Run |
| FR-08 | Danh sách tài liệu | Có code | Kiểm tra danh sách vừa upload | Not Run |
| FR-09 | Tên, ngày tải, kích thước | Có code | Mở thẻ/chi tiết tài liệu | Not Run |
| FR-10 | Đổi tên tài liệu | Có code | Đổi tên và tải lại danh sách | Not Run |
| FR-11 | Xóa tài liệu | Đã triển khai và kiểm thử trên iPhone, file vật lý và dữ liệu liên quan | Xóa tài liệu, file upload, tóm tắt, Chat; không ảnh hưởng dữ liệu khác | **PASS 7/7** (người dùng xác nhận) |
| FR-12 | Tổ chức theo môn học/chủ đề | Đã sửa trên feature và test iPhone | Gán môn/chủ đề, nhóm, lọc, chưa phân loại, mở lại | **PASS 8/8** (người dùng xác nhận) |
| FR-13 | Lưu nội dung tài liệu cho AI | Đã có code và kiểm thử iPhone | SUM-01 (đọc văn bản đã trích xuất và dùng cho AI) | **PASS** (thuộc bộ SUM-01–09, người dùng xác nhận 9/9) |
| FR-14 | Yêu cầu AI tóm tắt tài liệu | Đã có code và kiểm thử iPhone | SUM-02 (tạo tóm tắt qua UI) | **PASS** (thuộc bộ SUM-01–09, người dùng xác nhận 9/9) |
| FR-15 | Trích xuất văn bản PDF | Đã có code và kiểm thử iPhone | SUM-01 (trích xuất văn bản PDF) | **PASS** (thuộc bộ SUM-01–09, người dùng xác nhận 9/9) |
| FR-16 | Gửi nội dung phù hợp tới AI API | Đã có code và kiểm thử iPhone | SUM-02 (đưa nội dung vào luồng Gemini Summary) | **PASS** (thuộc bộ SUM-01–09, người dùng xác nhận 9/9) |
| FR-17 | Tóm tắt dựa trên tài liệu | Đã có code và kiểm thử iPhone | SUM-03 (đối chiếu 3 ý với PDF) | **PASS** (thuộc bộ SUM-01–09, người dùng xác nhận 9/9) |
| FR-18 | Ngắn/trung bình/chi tiết | Đã có code và kiểm thử iPhone | SUM-04/05/06 (ngắn, vừa, chi tiết) | **PASS** (thuộc bộ SUM-01–09, người dùng xác nhận 9/9) |
| FR-19 | Tóm tắt theo chương/phần | Đã hoàn thiện trên branch và kiểm thử iPhone | Phân biệt đúng 3 chương, tóm tắt đúng chương, lưu lịch sử đúng chương | **PASS** (người dùng xác nhận toàn bộ) |
| FR-20 | Kết quả tóm tắt dễ đọc | Đã có code và kiểm thử iPhone | SUM-07 (định dạng dễ đọc) | **PASS** (thuộc bộ SUM-01–09, người dùng xác nhận 9/9) |
| FR-21 | Lưu bản tóm tắt | Đã có code và kiểm thử iPhone | SUM-08 (tự lưu lịch sử) | **PASS** (thuộc bộ SUM-01–09, người dùng xác nhận 9/9) |
| FR-22 | Xem lại bản tóm tắt | Đã có code và kiểm thử iPhone | SUM-09 (mở lại chi tiết và lưu bền) | **PASS** (thuộc bộ SUM-01–09, người dùng xác nhận 9/9) |
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
8. **FR-05** – **PASS 8/8:** người dùng xác nhận phân quyền A/B, API và URL file upload. Nhóm Summary FR-13–18, FR-20–22 cũng đã PASS 9/9.

## Rủi ro demo ngoài FR

- `/auth/forgot-password` trả `resetToken` trực tiếp cho caller không xác thực: **không an toàn cho production**.
- Trên `main`/Render (chưa merge), `/uploads` vẫn dùng static public; branch `feature/fr-completion` đã bỏ route này. File trên filesystem Render có thể mất sau deploy.
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

## FR-05 – Đã chặn public uploads, chờ kiểm thử trên iPhone

- Lỗi phát hiện: `app.use('/uploads', express.static(...))` cho phép đọc file vật lý mà không có JWT; bỏ route static công khai trên branch feature. Từ nay URL `/uploads/<filename>` phải trả 404, không trả nội dung PDF/TXT.
- API Documents, Summaries, Chat có JWT và truy vấn dữ liệu theo `userId`, cần kiểm tra lại hành vi thực tế với hai tài khoản thử A/B.
- Việc tắt static uploads **không tạo mới một API tải file riêng tư**; chức năng học tập hiện dùng văn bản OCR/extractedText, Summary, Chat. Nếu sau này cần tải lại bản PDF gốc thì bổ sung endpoint tải file với xác thực và kiểm tra chủ sở hữu, không mở lại `/uploads` công khai.

| Case | Thao tác | Expected |
|---|---|---|
| TC-FR05-01 | A đăng nhập, upload file A và tạo summary/chat | Chỉ A thấy dữ liệu A |
| TC-FR05-02 | Đăng xuất A, đăng nhập B | Danh sách tài liệu, summary/chat không có dữ liệu A |
| TC-FR05-03 | B upload file B và tạo summary/chat | B thấy dữ liệu B; không ghi đè dữ liệu A |
| TC-FR05-04 | Trở lại A | File, summary, chat của A còn; file B không xuất hiện |
| TC-FR05-05 | Dùng JWT B thử GET/PUT/DELETE documentId của A (chỉ dùng dữ liệu test) | B bị từ chối 404/403, không sửa/xóa tài liệu A |
| TC-FR05-06 | Dùng JWT B thử Summary/Chat documentId của A | B không thể xem hay hỏi từ tài liệu A |
| TC-FR05-07 | Không đăng nhập, thử mở trực tiếp URL `/uploads/<tên-file-thử>` | 404; không trả nội dung file |
| TC-FR05-08 | A đăng nhập lại và dùng Summary/Chat của chính A | Hoạt động như trước, không ảnh hưởng regression |

**Trạng thái:** FR-05 `Not Run`, chưa đánh dấu PASS. Test cần Backend local từ branch `feature/fr-completion`; Render `main` vẫn có route cũ nên không dùng để đánh giá thay đổi này.

## Xác nhận FR-05 – 18/10/2026

- Người dùng xác nhận **FR-05 PASS 8/8** sau khi kiểm thử hai tài khoản A/B, API truy cập tài liệu và URL file upload trên Backend local. Ghi nhận kết quả kiểm thử thủ công; không suy rộng thành kiểm toán bảo mật toàn diện.
- Các yêu cầu tiếp theo cần xác nhận trực tiếp: **FR-13 đến FR-18, FR-20 đến FR-22**. FR-19 đã có PASS riêng và không cần kiểm thử lại nếu không phát sinh regression.

## Nhóm hồi quy Summary FR-13–18, FR-20–22 – PASS 9/9 trên iPhone

Dùng tài liệu PDF có văn bản đọc được và ba chương đã dùng kiểm thử FR-19, không cần upload lại nếu tài liệu còn trên Backend local. Ưu tiên chế độ **Toàn bộ tài liệu** để phân biệt với FR-19.

| TC | FR bao phủ | Thao tác trên iPhone / Backend | Expected | Actual |
|---|---|---|---|---|
| SUM-01 | FR-13, FR-15 | Mở **Tài liệu → Chi tiết** PDF; xem phần **Nội dung tài liệu** | Có văn bản trích xuất, đối chiếu được 2–3 câu với PDF; dữ liệu sẵn cho AI | **PASS** (người dùng xác nhận) |
| SUM-02 | FR-14, FR-16 | **AI Tóm tắt → Toàn bộ tài liệu → Vừa → Tạo bản tóm tắt**; nếu có thể, xem log Backend | Tạo thành công; Backend dùng văn bản đã trích xuất làm nguồn và gửi cho Gemini (cache có thể được dùng với cùng phạm vi/độ dài) | **PASS** (người dùng xác nhận) |
| SUM-03 | FR-17 | Đối chiếu ít nhất 3 ý trong tóm tắt với PDF gốc | Những ý chính đúng nguồn, không bịa sự kiện/chương không có trong PDF | **PASS** (người dùng xác nhận) |
| SUM-04 | FR-18 | Chọn **Ngắn**, tạo tóm tắt toàn bộ | Hiển thị bản ngắn giữ ý chính | **PASS** (người dùng xác nhận) |
| SUM-05 | FR-18 | Chọn **Vừa**, tạo tóm tắt toàn bộ | Hiển thị bản vừa có thêm giải thích so với ngắn (độ dài không nhất thiết tăng đúng tỉ lệ) | **PASS** (người dùng xác nhận) |
| SUM-06 | FR-18 | Chọn **Chi tiết**, tạo tóm tắt toàn bộ | Hiển thị bản chi tiết, có nhiều thông tin phù hợp hơn | **PASS** (người dùng xác nhận) |
| SUM-07 | FR-20 | Đọc kết quả trên iPhone, cuộn, sao chép thử một đoạn | Dễ đọc, xuống dòng hợp lý, không thấy dấu Markdown thừa như `**`/ `#` | **PASS** (người dùng xác nhận) |
| SUM-08 | FR-21 | Tạo tóm tắt, kiểm tra trạng thái **Đã lưu vào lịch sử** | Tóm tắt được tự lưu; không bắt buộc nút Lưu riêng theo thiết kế hiện tại | **PASS** (người dùng xác nhận) |
| SUM-09 | FR-22 | Mở **Lịch sử → Chi tiết**, đóng app/mở lại và kiểm tra các bản ngắn/vừa/chi tiết | Có bản ghi theo từng mức; mở lại vẫn hiển thị đầy đủ nội dung, ngày và phạm vi | **PASS** (người dùng xác nhận) |

**Kết quả:** Người dùng đã kiểm thử SUM-01 đến SUM-09 và xác nhận PASS 9/9; FR-19 đã PASS riêng từ trước.

**Các đợt còn lại, nên gộp theo màn hình:**

1. Summary: FR-13–18, FR-20–22 – **PASS 9/9**, đã hoàn thành.
2. Documents: FR-06–10 (PDF/DOCX/TXT, danh sách, metadata, đổi tên).
3. Chat AI: FR-23–29 (hỏi đáp, nguồn tài liệu, ngữ cảnh, mới hội thoại).
4. Scanner + Solver: FR-31–36, FR-38–42 và FR-44.
5. Auth + Profile: FR-01–04; FR-03 và luồng reset token phải đánh giá bảo mật cẩn thận.

Đây là các nhóm chờ kiểm thử, **không phải xác nhận PASS**.

## Xác nhận Summary SUM-01–09 – 18/10/2026

- Người dùng xác nhận **9/9 bước PASS** trên iPhone cho nhóm Summary SUM-01 tới SUM-09.
- Ghi PASS riêng cho FR-13, FR-14, FR-15, FR-16, FR-17, FR-18, FR-20, FR-21, FR-22 (9 FR), không gộp số bước kiểm thử với số lượng FR.
- FR-19 đã được kiểm thử và PASS trước đó; không thay đổi.
- **Nhóm tiếp theo:** Documents FR-06–10 (upload PDF/DOCX/TXT, danh sách, metadata, đổi tên). Chờ người dùng thử nên chưa PASS.

## Documents FR-06–10 – kiểm thử iPhone (chưa chạy)

Code đã có: nút **+ Tải lên** dùng Expo DocumentPicker, Backend chấp nhận PDF/DOCX/TXT và trích xuất văn bản; danh sách nhóm tài liệu; màn hình chi tiết hiển thị tên, ngày tải, kích thước, loại file; nút **Đổi tên** với xác nhận. Đã sửa thêm nhãn loại file khi tên được đổi không có phần mở rộng: vẫn ưu tiên `fileType` đã lưu, không lấy toàn bộ tiêu đề làm loại file.

**Dữ liệu test:** Ba file PDF, DOCX, TXT riêng biệt, mỗi file có văn bản thực, dung lượng dưới 10 MB; đặt tên dễ phân biệt. Chạy Backend local và Expo Go cùng branch. Dùng tài khoản thử, không xóa dữ liệu chính.

| TC | FR | Thao tác trên iPhone | Expected | Actual |
|---|---|---|---|---|
| DOC-01 | FR-06, FR-07 | Tài liệu → **+ Tải lên** → chọn PDF có text | Upload thành công, có trong danh sách | Not Run |
| DOC-02 | FR-07 | Tải file DOCX chứa văn bản | Upload thành công, mở chi tiết có nội dung trích xuất | Not Run |
| DOC-03 | FR-07 | Tải file TXT UTF-8 chứa tiếng Việt | Upload thành công, nội dung trích xuất giữ dấu tiếng Việt | Not Run |
| DOC-04 | FR-08 | Kiểm tra danh sách ba file, vuốt làm mới, thoát và mở lại màn hình | Đủ ba file, không trùng/mất file, đúng tài khoản | Not Run |
| DOC-05 | FR-09 | Mở chi tiết từng file | Tên, ngày tải, kích thước, định dạng PDF/DOCX/TXT đúng; kích thước không phải Không xác định với file có dữ liệu | Not Run |
| DOC-06 | FR-10 | Chọn Đổi tên file PDF thành tên mới **không có đuôi .pdf**, nhấn Lưu | Tên hiển thị thay đổi; loại file vẫn **PDF**; mở chi tiết bình thường | Not Run |
| DOC-07 | FR-10 | Vuốt làm mới, rời màn hình hoặc đăng nhập lại | Tên mới được lưu bền; các tài liệu khác giữ nguyên | Not Run |
| DOC-08 | FR-10 | Thử đổi tên thành khoảng trắng rồi Lưu; sau đó thử Đổi tên → Hủy | Không lưu tên trống; Hủy không thay đổi tên tài liệu | Not Run |

**Lưu ý:** Đổi tên trong ứng dụng hiện cập nhật tên hiển thị trong MongoDB, không đổi tên file vật lý trong `backend/uploads`. Không được xem đây là lỗi nếu tài liệu vẫn mở/tóm tắt đúng và loại file còn chính xác. Nút Xóa đã được kiểm thử ở FR-11, không cần xóa lại ở nhóm này.

**Trạng thái:** FR-06–10 **Not Run** cho tới khi người dùng xác nhận cả tám trường hợp trên iPhone. Nếu DOC-02/03 không có dữ liệu OCR/trích xuất hoặc DOC-06 hiển thị sai loại file, ghi FAIL cùng hình/log.

## Release gate – Chỉ kiểm thử tổng hợp một lần trước khi merge main

**Trạng thái code:** Đã rà soát các đường triển khai cho FR-01–45; các phần bổ sung/khắc phục tập trung trên `feature/fr-completion`. **Không yêu cầu kiểm thử lại từng FR**. Các FR đã được người dùng xác nhận trong bảng vẫn được giữ nguyên. Các FR khác không tự động coi là PASS chỉ vì tìm thấy code.

**Automated regression:** GitHub Actions `.github/workflows/regression.yml` chạy `npm test` (Node backend tests) và `npm run check:ios` (Expo iOS export). Workflow thành công ở commit `aa7432932a2f0b8fb997e677a335adcf027e0905` trước bản cập nhật tài liệu này. Link: https://github.com/DuyBachh/appEduai/actions/runs/39143213569

**Smoke test duy nhất trên iPhone với Backend local:**

| ST | Luồng chính | Điều kiện PASS |
|---|---|---|
| FINAL-01 | Auth: đăng ký tài khoản thử, đăng nhập sai/đúng, cập nhật profile, đăng xuất | Login/profile ổn và token hoạt động |
| FINAL-02 | Quên mật khẩu: demo local bật `NODE_ENV=development` và `ALLOW_DEMO_RESET_TOKEN=true`; nhập mã đặt lại, reset và đăng nhập lại | Mã chỉ dùng một lần, mật khẩu mới hoạt động; token cũ không dùng lại được |
| FINAL-03 | Documents: upload PDF/DOCX/TXT, xem chi tiết metadata, đổi tên, nhóm/lọc | File hiển thị đúng loại, văn bản được trích xuất |
| FINAL-04 | Summary: 3 độ dài, phạm vi toàn file/chương, mở lịch sử | Nội dung đúng nguồn, lịch sử còn sau khi rời màn hình |
| FINAL-05 | Chat: hỏi theo tài liệu, hỏi tiếp, New Chat, bật/tắt lưu lịch sử | Ngữ cảnh và chế độ lưu hoạt động |
| FINAL-06 | Scanner/OCR: chọn ảnh và chụp ảnh; sửa OCR rồi chuyển sang Solver | Văn bản chỉnh sửa chuyển chính xác |
| FINAL-07 | Solver: phân loại, gợi ý trước/tiếp, ẩn/xem lời giải và hỏi tiếp | Kết quả đúng bài, hỏi tiếp giữ ngữ cảnh |
| FINAL-08 | Bảo vệ dữ liệu: A/B không xem được nhau; xóa file thử và dữ liệu liên quan | Phân quyền đúng, file và history liên quan bị xóa |

**Điều kiện để merge `main`:** FINAL-01 tới FINAL-08 PASS trên iPhone và CI xanh tại HEAD. Cần lưu ý Backend Render trỏ `main` có thể tự deploy; email reset production yêu cầu `RESEND_API_KEY` và `RESET_EMAIL_FROM` được cấu hình tại host (không có thì API báo 503). Không sử dụng cờ demo reset công khai.

**PR chuẩn bị merge:** https://github.com/DuyBachh/appEduai/pull/1 (draft, chưa merge).
