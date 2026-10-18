# appEduai — AI Learning Assistant

Ứng dụng di động hỗ trợ sinh viên **học tập với tài liệu và AI**, phát triển bằng **React Native + Expo**. Sinh viên có thể quản lý tài liệu, tóm tắt PDF, hỏi đáp theo nội dung tài liệu, nhận dạng đề bài từ hình ảnh và xem gợi ý giải bài tập.

> **Phạm vi:** Đồ án/bài tập học phần — **45 Functional Requirements (FR-01 đến FR-45)** trong đề tài *AI Learning Assistant*. Đây là ứng dụng **demo học tập**, chưa phải sản phẩm dành cho dữ liệu hoặc tài khoản cá nhân thật.

- **GitHub:** https://github.com/DuyBachh/appEduai
- **Backend API (Render):** https://appeduai-backend.onrender.com/api
- **Health endpoint:** https://appeduai-backend.onrender.com/api/health
- **Frontend:** Mở bằng **Expo Go trên iPhone** (quét QR sau khi chạy Expo trên máy tính). **Render không host giao diện React Native**.

## Mục lục

1. [Chức năng theo đề tài](#chức-năng-theo-đề-tài)
2. [Luồng sử dụng](#luồng-sử-dụng)
3. [Công nghệ và kiến trúc](#công-nghệ-và-kiến-trúc)
4. [Cài đặt và chạy bằng Expo Go + Render](#cài-đặt-và-chạy-bằng-expo-go--render)
5. [Chạy Backend local (tùy chọn)](#chạy-backend-local-tùy-chọn)
6. [Cấu trúc source code](#cấu-trúc-source-code)
7. [REST API](#rest-api)
8. [Kiểm thử](#kiểm-thử)
9. [Giới hạn của bản demo](#giới-hạn-của-bản-demo)
10. [Tài liệu tham khảo](#tài-liệu-tham-khảo)

## Chức năng theo đề tài

45 yêu cầu được chia thành đúng **6 nhóm** theo file đề tài. Các chức năng dưới đây đều có đường triển khai trong source. Điều này không có nghĩa từng FR đã được chứng nhận bằng một bộ test riêng.

| Nhóm | Functional Requirements | Chức năng triển khai |
| --- | --- | --- |
| **1. Quản lý tài khoản** | **FR-01–FR-05** | Đăng ký email/mật khẩu; đăng nhập/đăng xuất; quên/đặt lại mật khẩu **demo không gửi email**; cập nhật tên; phân quyền dữ liệu theo tài khoản. |
| **2. Quản lý tài liệu học tập** | **FR-06–FR-13** | Tải PDF, DOCX, TXT; danh sách/chi tiết (tên, ngày tải, kích thước); đổi tên; xóa; nhóm/lọc theo môn học hoặc chủ đề; lưu nội dung trích xuất phục vụ AI. |
| **3. AI tóm tắt tài liệu** | **FR-14–FR-22** | Trích xuất văn bản PDF; dùng Gemini tóm tắt theo tài liệu; ba mức **ngắn / trung bình / chi tiết**; tóm tắt toàn bộ hoặc theo chương/phần; trình bày và lưu lịch sử. |
| **4. AI hỏi đáp dựa trên tài liệu** | **FR-23–FR-30** | Chat theo tài liệu đã tải; ưu tiên tài liệu làm nguồn; hỏi tiếp theo ngữ cảnh; tạo hội thoại mới; tùy chọn **lưu / không lưu lịch sử**. |
| **5. Quét ảnh đề bài bằng AI** | **FR-31–FR-37** | Camera hoặc chọn ảnh; nhận dạng bằng AI/OCR; xem và chỉnh sửa văn bản; chuyển đề đã nhận dạng sang AI Solver. |
| **6. AI gợi ý lời giải** | **FR-38–FR-45** | Phân tích và xác định chủ đề đề bài; gợi ý từng bước và gợi ý tiếp; giải thích khái niệm; chỉ mở lời giải đầy đủ khi được yêu cầu; hỏi tiếp về lời giải. |

### Chi tiết một số luồng

**Quên mật khẩu (FR-03) — phiên bản demo theo bài:**

1. Ở màn hình Đăng nhập, mở **Quên mật khẩu** và nhập email tài khoản demo đã đăng ký.
2. Backend tạo mã đặt lại có hiệu lực **15 phút**, trả mã tự động cho ứng dụng.
3. Ứng dụng chuyển tới màn hình **Đặt lại mật khẩu**. Người dùng chỉ cần nhập mật khẩu mới và xác nhận.
4. Đăng nhập lại bằng mật khẩu mới. **Không gửi Gmail/email, không có bước OTP**.

**Tóm tắt:** Chọn tài liệu → chọn toàn bộ hoặc một chương/phần → chọn mức độ dài → tạo tóm tắt → xem lại trong lịch sử. Nếu tài liệu không có tiêu đề chương rõ ràng, hệ thống chia phần dự phòng từ văn bản trích xuất.

**Hỏi đáp:** Chọn tài liệu → đặt câu hỏi → hỏi tiếp trong cùng cuộc hội thoại. Nếu tắt lưu lịch sử, các lượt trao đổi chỉ được giữ tạm trong phiên trên giao diện, không tạo hội thoại lưu trong MongoDB.

**OCR → Solver:** Chụp/chọn ảnh → nhận dạng văn bản → sửa nội dung OCR nếu cần → gửi sang Solver → xem gợi ý/giải thích → chủ động mở lời giải đầy đủ hoặc đặt câu hỏi tiếp.

## Luồng sử dụng

~~~text
Expo Go (iPhone)
    |
    | React Native + Expo SDK 57
    | HTTPS / REST API + JWT
    v
Render: Node.js / Express backend
    |
    +---- MongoDB: users, documents, summaries, conversations, messages
    |
    +---- Gemini API: Summary, Chat, OCR, Solver
    |
    +---- backend/uploads: file PDF / DOCX / TXT (filesystem)
~~~

**Ghi chú:** Ứng dụng React Native được phát trong quá trình phát triển bởi Expo trên máy tính, sau đó chạy trong Expo Go trên iPhone. Backend được triển khai độc lập trên Render. Không cần chạy Backend local khi sử dụng Render.

## Công nghệ và kiến trúc

| Thành phần | Công nghệ |
| --- | --- |
| Mobile | React Native 0.86, Expo SDK 57, React 19 |
| Điều hướng | React Navigation (Stack + Bottom Tabs) |
| Backend | Node.js, Express 5, REST API |
| Database | MongoDB |
| Generative AI | Google Gemini (thư viện `@google/genai`) |
| Xác thực | JWT, bcrypt |
| Lưu token phía ứng dụng | AsyncStorage |
| Upload tài liệu | Multer (giới hạn 10 MB/file) |
| Trích xuất PDF / DOCX / TXT | `pdf-parse`, `mammoth`, đọc UTF-8 |
| Ảnh/OCR | `expo-camera`, `expo-image-picker` và Gemini multimodal |
| Triển khai Backend | Render, theo branch `main` |

Hầu hết các API xử lý dữ liệu học tập yêu cầu JWT và đối chiếu tài khoản sở hữu bản ghi. File upload gốc không được public qua route static `/uploads/*`.

## Cài đặt và chạy bằng Expo Go + Render

**Đây là cách chạy thông thường của project. Không cần thêm IP local hoặc chỉnh sửa `src/services/api.js`.**

### Yêu cầu

- Node.js và npm tương thích với Expo SDK 57 (khuyên dùng Node.js 22 LTS).
- VS Code / terminal PowerShell trên Windows hoặc terminal tương đương.
- iPhone cài **Expo Go**, có kết nối Internet.
- Backend trên Render và MongoDB/Gemini đã được cấu hình sẵn.

### 1. Tải project

Nếu chưa có source:

~~~powershell
git clone https://github.com/DuyBachh/appEduai.git
cd appEduai
npm ci
~~~

Nếu project đã có trên máy:

~~~powershell
cd "D:\Code\React Native\appEduai"
git switch main
git pull --ff-only origin main
npm ci
~~~

**Lưu ý:** Nếu Git báo có file đang sửa và không pull được, hãy kiểm tra `git status` rồi sao lưu/stash thay đổi trước khi pull. Không dùng `git reset --hard` khi chưa chắc chắn.

### 2. Kiểm tra cấu hình API

Mặc định `src/services/api.js` sử dụng:

~~~text
https://appeduai-backend.onrender.com/api
~~~

- Dùng **Render**: không cần tạo file `.env` ở thư mục gốc và **không cần** khai báo `EXPO_PUBLIC_API_BASE_URL`.
- Nếu trước đây bạn đã thêm `EXPO_PUBLIC_API_BASE_URL` trỏ IP LAN, hãy bỏ cấu hình đó trước khi chạy lại Expo.
- Không commit mật khẩu, JWT secret hay API key. Biến `EXPO_PUBLIC_*` được nhúng vào ứng dụng và **không dùng để lưu bí mật**.

### 3. Khởi động Expo

~~~powershell
npx expo start -c
~~~

Mở **Expo Go trên iPhone**, quét mã QR rồi đăng nhập bằng **tài khoản demo**. Khi quét ảnh, cần cho phép truy cập Camera/Thư viện ảnh theo yêu cầu của hệ điều hành.

Backend Render có thể mất thời gian khởi động sau thời gian không sử dụng; nếu truy cập lần đầu chậm, hãy kiểm tra Health endpoint trước.

## Chạy Backend local (tùy chọn)

Chỉ thực hiện nếu muốn phát triển/sửa Backend riêng. **Không phải bước bắt buộc khi dùng Render.**

Từ thư mục gốc:

~~~powershell
npm ci --prefix backend
Copy-Item backend/.env.example backend/.env
~~~

Trong `backend/.env`, cấu hình các biến cần thiết:

~~~dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
~~~

File `backend/.env.example` có thể còn cờ demo `ALLOW_DEMO_RESET_TOKEN` từ phiên bản trước. Trong code FR-03 hiện tại, **cờ này không quyết định việc reset**; không cần bật cờ để kết nối Render.

Chạy Backend (terminal 1):

~~~powershell
cd backend
node server.js
~~~

Nếu muốn ứng dụng iPhone gọi Backend local, tạo `.env` **tại thư mục gốc**:

~~~dotenv
EXPO_PUBLIC_API_BASE_URL=http://<IP-LAN-CUA-MAY-TINH>:5000/api
~~~

Thay `<IP-LAN-CUA-MAY-TINH>` bằng IPv4 thực tế (xem `ipconfig`); điện thoại và máy tính phải có kết nối mạng tới nhau. Sau đó khởi động lại Expo ở thư mục gốc:

~~~powershell
npx expo start -c
~~~

Để quay lại Render, xóa biến `EXPO_PUBLIC_API_BASE_URL` trong root `.env` rồi khởi động lại Expo. Không commit `.env`.

## Cấu trúc source code

~~~text
appEduai/
├── App.js
├── app.json
├── assets/
├── src/
│   ├── components/               # Thành phần dùng chung
│   ├── features/
│   │   ├── auth/                 # Đăng ký, đăng nhập, reset
│   │   ├── documents/            # Danh sách, chi tiết, upload, phân loại
│   │   ├── summary/              # Tóm tắt và lịch sử
│   │   ├── chat/                 # Q&A theo tài liệu
│   │   ├── scanner/              # Camera, ảnh và OCR
│   │   ├── solver/               # Phân tích bài và gợi ý
│   │   ├── home/                 # Trang chủ
│   │   └── profile/              # Hồ sơ cá nhân
│   ├── navigation/               # AuthNavigator, MainNavigator
│   ├── services/                 # API chung, token
│   └── styles/
├── backend/
│   ├── app.js                    # Express routes, middleware
│   ├── server.js                 # Khởi động server và kết nối MongoDB
│   ├── config/                   # Database và AI
│   ├── controllers/              # Nhận request, trả response
│   ├── routes/                   # Khai báo API
│   ├── services/                 # Nghiệp vụ các module
│   ├── models/                   # Cấu trúc bản ghi
│   ├── prompts/                  # Prompt Chat/Summary/OCR/Solver
│   ├── middleware/               # JWT, upload, error
│   ├── utils/
│   └── tests/                   # Unit tests Node
├── docs/
│   └── FR-01-45-AUDIT.md        # Bảng rà soát chi tiết FR
├── .github/workflows/
│   └── regression.yml           # Backend tests + kiểm tra Expo iOS bundle
└── package.json
~~~

## REST API

Base URL: `https://appeduai-backend.onrender.com/api` (Render) hoặc `http://localhost:5000/api` (Backend local).

| Method | Endpoint | Ý nghĩa |
| --- | --- | --- |
| GET | `/health` | Kiểm tra Backend |
| POST | `/auth/register` | Đăng ký |
| POST | `/auth/login` | Đăng nhập, cấp JWT |
| POST | `/auth/logout` | Phản hồi đăng xuất |
| GET | `/auth/me` | Xem thông tin tài khoản |
| PUT | `/auth/profile` | Cập nhật tên người dùng |
| POST | `/auth/forgot-password` | Bắt đầu reset mật khẩu demo, trả mã tự động cho app |
| POST | `/auth/reset-password` | Đặt lại mật khẩu |
| POST | `/documents` | Tạo bản ghi tài liệu |
| POST | `/documents/upload` | Upload file PDF/DOCX/TXT (form-data: `file`) |
| GET | `/documents` | Danh sách tài liệu |
| GET | `/documents/:id` | Chi tiết tài liệu |
| PUT | `/documents/:id` | Đổi tên / phân loại tài liệu |
| DELETE | `/documents/:id` | Xóa tài liệu và dữ liệu liên quan |
| GET | `/summaries/documents/:documentId/sections` | Danh sách chương/phần |
| POST | `/summaries/documents/:documentId` | Tạo tóm tắt |
| GET | `/summaries/documents/:documentId` | Lịch sử tóm tắt theo tài liệu |
| GET | `/summaries/:summaryId` | Chi tiết tóm tắt |
| DELETE | `/summaries/:summaryId` | Xóa bản tóm tắt |
| POST | `/chat` | Hỏi đáp với tài liệu |
| GET | `/chat/conversations` | Lịch sử hội thoại |
| GET | `/chat/conversations/:conversationId/messages` | Danh sách tin nhắn |
| DELETE | `/chat/conversations/:conversationId` | Xóa hội thoại |
| POST | `/ocr` | Nhận dạng văn bản từ ảnh (form-data: `image`) |
| POST | `/solver` | Phân tích và gợi ý giải bài |
| POST | `/solver/follow-up` | Hỏi tiếp về bài đã giải |

**Xác thực:** `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/health` là public. Những API tài liệu, Summary, Chat, Solver, OCR và Profile yêu cầu header `Authorization: Bearer <JWT>`.

**Ví dụ gọi Solver:**

~~~http
POST /api/solver
Authorization: Bearer <JWT>
Content-Type: application/json
~~~

~~~json
{
  "question": "Giải phương trình 2x + 4 = 10"
}
~~~

## Kiểm thử

### Kết quả đã ghi nhận

- **Final Regression trên iPhone / Expo Go:** Người kiểm thử xác nhận **PASS 8/8** cho các luồng chính.
- **FR-03 (reset mật khẩu không email) trên Expo Go + Render:** Người kiểm thử xác nhận **PASS** sau khi sửa lỗi thông báo email chưa đăng ký.
- **GitHub Actions:** Các lượt kiểm thử Backend và xuất bundle Expo iOS của nhánh `main` đã PASS trong giai đoạn hoàn thiện.
- **Chi tiết theo FR:** Xem `docs/FR-01-45-AUDIT.md`. Một số dòng `Not Run` trong bảng cũ chưa được đồng bộ với đợt regression cuối; không nên hiểu là tính năng không có hoặc chưa hoàn thành.

### Chạy bộ test hiện có

Tại thư mục gốc project:

~~~powershell
npm ci
npm ci --prefix backend
npm test
npm run check:ios
~~~

- `npm test`: Chạy các bài kiểm thử Node tại `backend/tests/`.
- `npm run check:ios`: Xuất bundle Expo iOS để phát hiện lỗi đóng gói.
- GitHub Actions: [Final regression](https://github.com/DuyBachh/appEduai/actions/workflows/regression.yml).

**Phạm vi:** Test tự động không thay thế kiểm thử AI thực tế qua Gemini/MongoDB, kiểm thử bảo mật, hay kiểm thử toàn diện từng FR trên thiết bị.

## Giới hạn của bản demo

1. **Reset Password FR-03:** Không gửi email và không có OTP. API trả token reset cho app sau khi nhập email đã đăng ký; token được lưu dưới dạng hash SHA-256, có hiệu lực **15 phút** và dùng **một lần**. **Nguy cơ bảo mật:** trên server công khai, người biết email của tài khoản có thể chiếm quyền đặt lại mật khẩu. **Chỉ sử dụng tài khoản giả/dữ liệu thử**, tuyệt đối không dùng tài khoản hoặc mật khẩu thật. Trước khi triển khai cho người dùng thật phải thay bằng một bước xác minh quyền sở hữu tài khoản.
2. **File gốc trên Render:** File được lưu tại `backend/uploads` trên filesystem. Nếu dịch vụ không có ổ đĩa bền vững, các file có thể mất khi restart/redeploy. Dữ liệu MongoDB và file lưu trên máy chủ không có transaction chung.
3. **PDF và chia chương:** Tài liệu PDF dạng scan ảnh có thể không trích xuất được văn bản bằng parser hiện tại. Phát hiện chương dựa trên tiêu đề; trường hợp tiêu đề không rõ ràng thì chia phần dự phòng, không cam kết đúng cấu trúc chương gốc.
4. **Chat theo tài liệu:** Prompt yêu cầu AI ưu tiên nội dung tài liệu và thừa nhận khi thiếu dữ kiện. Với tài liệu dài, Backend chọn các đoạn phù hợp để đưa vào ngữ cảnh, nên kết quả còn phụ thuộc giới hạn ngữ cảnh và chất lượng mô hình.
5. **AI:** Kết quả Gemini phụ thuộc kết nối Internet, hạn mức API và cách diễn giải của mô hình; lời giải chỉ là tài liệu tham khảo.
6. **Bảo mật/triển khai:** Project phục vụ mục tiêu học tập, không có cam kết production-ready. Không lưu thông tin bí mật trong repository hoặc trong biến `EXPO_PUBLIC_*`.

## Tài liệu tham khảo

- [Đề tài / bảng 45 Functional Requirements](docs/FR-01-45-AUDIT.md)
- [Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/drivers/node/current/)
- [Gemini API](https://ai.google.dev/gemini-api/docs)
