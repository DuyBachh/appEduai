# appEduai — AI Learning Assistant

Ứng dụng hỗ trợ sinh viên học tập bằng AI: quản lý tài liệu, tóm tắt nội dung, hỏi đáp theo tài liệu, OCR hình ảnh và gợi ý giải bài tập.

> **Phạm vi:** Bài tập môn học/demo. Chưa được đánh giá bảo mật để dùng với tài khoản hoặc dữ liệu cá nhân thật trên production.

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Mobile | React Native, Expo SDK 57, React 19 |
| Điều hướng | React Navigation (Stack, Bottom Tabs) |
| Backend | Node.js, Express 5, REST API |
| Cơ sở dữ liệu | MongoDB |
| AI | Google Gemini qua @google/genai |
| Xác thực | JWT, bcrypt |
| Upload/trích xuất tài liệu | Multer, pdf-parse, mammoth |
| OCR | Gemini multimodal AI |
| Token trên ứng dụng | AsyncStorage |

## Chức năng hiện có

- **Tài khoản:** Đăng ký, đăng nhập/đăng xuất, xem và cập nhật hồ sơ, quên/đặt lại mật khẩu (demo).
- **Tài liệu:** Upload PDF/DOCX/TXT; xem danh sách, đổi tên, phân loại môn học/chủ đề, xóa bản ghi kèm file vật lý và dữ liệu AI liên quan. Giới hạn **10 MB/file**.
- **AI Summary:** Tóm tắt tài liệu với 3 mức ngắn/vừa/chi tiết, chọn chương/phần hoặc toàn bộ tài liệu; tự lưu, xem và quản lý lịch sử.
- **AI Chat:** Đặt câu hỏi dựa trên tài liệu, tiếp tục hội thoại; tùy chọn bật/tắt lưu lịch sử và xóa hội thoại.
- **Scanner/OCR:** Chụp ảnh hoặc chọn ảnh; nhận dạng văn bản, xem/chỉnh sửa kết quả. Backend hỗ trợ JPG/JPEG, PNG, WEBP, HEIC, HEIF, tối đa **10 MB/ảnh**.
- **AI Solver:** Nhập đề hoặc chuyển OCR từ Scanner; xem gợi ý, chỉ mở lời giải đầy đủ khi cần và hỏi tiếp theo ngữ cảnh bài giải.

## Cấu trúc dự án

~~~text
appEduai/
├── App.js
├── app.json
├── assets/
├── src/
│   ├── components/           # Component dùng chung
│   ├── features/
│   │   ├── auth/             # Đăng nhập, đăng ký, reset mật khẩu
│   │   ├── chat/             # Chat và lịch sử
│   │   ├── documents/        # Tài liệu
│   │   ├── home/             # Trang chủ
│   │   ├── profile/          # Hồ sơ
│   │   ├── scanner/          # Camera/OCR
│   │   ├── solver/           # Bài tập và gợi ý
│   │   └── summary/          # Tóm tắt và lịch sử
│   ├── navigation/           # Auth/Main/AppNavigator
│   ├── services/             # API và lưu JWT
│   ├── styles/
│   └── utils/
├── backend/
│   ├── app.js                # Express và routes
│   ├── server.js             # Start server + MongoDB
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── prompts/
│   ├── routes/
│   ├── services/
│   └── utils/
├── package.json
└── .gitignore
~~~



## Chuẩn bị

- Node.js/npm tương thích với **Expo SDK 57**, Expo Go trên điện thoại.
- MongoDB hoặc MongoDB Atlas và chuỗi kết nối.
- Gemini API key để sử dụng các chức năng AI.
- Internet cho các API AI và khi kết nối với Render.

## Cài đặt và chạy

### 1. Tải project

~~~bash
git clone https://github.com/DuyBachh/appEduai.git
cd appEduai
npm install
~~~

### 2. Cài Backend và cấu hình môi trường

~~~bash
cd backend
npm install
~~~

Tạo backend/.env từ backend/.env.example. Trong PowerShell (đang ở thư mục backend):

~~~powershell
Copy-Item .env.example .env
~~~

Hoặc macOS/Linux:

~~~bash
cp .env.example .env
~~~

Điền thông tin **thật** vào backend/.env:

~~~dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=
RESET_EMAIL_FROM=
ALLOW_DEMO_RESET_TOKEN=false
~~~

**Không commit** .env, khóa API, JWT secret hoặc thông tin truy cập MongoDB.

### 3. Khởi động Backend local

**Chạy từ thư mục backend**, không phải thư mục gốc:

~~~bash
node server.js
~~~

Backend phải kết nối MongoDB thành công mới mở server. Địa chỉ mặc định:

- API: http://localhost:5000/api
- Health: http://localhost:5000/api/health

### 4. Chọn Backend cho Expo

App mặc định dùng Render. Để test Backend local, tạo file `.env` tại **thư mục gốc** và đặt biến `EXPO_PUBLIC_API_BASE_URL`, thay vì sửa source:

~~~dotenv
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:5000/api
~~~

Đây chỉ là ví dụ. Thay bằng IPv4 của máy chạy Backend; bỏ biến để dùng Render. Khởi động lại Expo với `npx expo start -c` và không commit `.env`.

- Dùng ipconfig trên Windows để lấy IPv4 đúng của Wi-Fi/Ethernet.
- Điện thoại phải kết nối được tới máy tính qua mạng nội bộ; kiểm tra Firewall.
- Nếu dùng Render, không cần chạy node server.js trên máy.
- **Quan trọng:** Kiểm tra branch và commit đang được deploy trên Render hoặc đang chạy local trước khi đánh giá kết quả test. Đổi branch trong VS Code **không** tự động đổi bản deploy trên Render.
- Không commit IP mạng nội bộ cá nhân vào source code.

### 5. Chạy ứng dụng

Mở terminal mới **tại thư mục gốc**:

~~~bash
npx expo start -c
~~~

Mở Expo Go trên điện thoại, quét mã QR. Bật quyền camera/thư viện khi thử OCR/Scanner.

## REST API

Base URL: http://localhost:5000/api hoặc https://appeduai-backend.onrender.com/api.

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | /health | Trạng thái Backend |
| POST | /auth/register | Đăng ký |
| POST | /auth/login | Đăng nhập và lấy JWT |
| POST | /auth/logout | Phản hồi đăng xuất |
| GET | /auth/me | Thông tin tài khoản |
| PUT | /auth/profile | Đổi tên người dùng |
| POST | /auth/forgot-password | Gửi mã đặt lại qua email hoặc demo local có kiểm soát |
| POST | /auth/reset-password | Đặt lại mật khẩu |
| POST | /documents | Tạo bản ghi tài liệu |
| POST | /documents/upload | Upload tài liệu (multipart/form-data) |
| GET | /documents | Danh sách tài liệu |
| GET | /documents/:id | Chi tiết tài liệu |
| PUT | /documents/:id | Cập nhật tài liệu |
| DELETE | /documents/:id | Xóa tài liệu, file upload và dữ liệu AI liên quan |
| POST | /summaries/documents/:documentId | Tạo tóm tắt, tùy chọn sectionId |
| GET | /summaries/documents/:documentId/sections | Liệt kê chương/phần |
| GET | /summaries/documents/:documentId | Lịch sử tóm tắt |
| GET | /summaries/:summaryId | Chi tiết bản tóm tắt |
| DELETE | /summaries/:summaryId | Xóa bản tóm tắt |
| POST | /chat | Chat với tài liệu |
| GET | /chat/conversations | Danh sách hội thoại |
| GET | /chat/conversations/:conversationId/messages | Tin nhắn |
| DELETE | /chat/conversations/:conversationId | Xóa hội thoại |
| POST | /solver | Giải bài tập |
| POST | /solver/follow-up | Hỏi tiếp theo đề và lời giải |
| POST | /ocr | Trích xuất văn bản từ ảnh |

Các endpoint Documents, Summary, Chat, Solver, OCR và /auth/me, /auth/profile yêu cầu header Authorization: Bearer <JWT>.

Ví dụ Postman:

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

Upload tài liệu dùng **Body → form-data**, key **file** (type File); OCR dùng key **image** (type File).

## Kiểm thử

Đã kiểm thử **thủ công** các module Summary, Chat, OCR, Solver, Auth, Documents bằng Postman/Expo Go và kiểm thử điều hướng sau refactor. Kết quả thủ công không thay thế kiểm thử tự động hay kiểm tra bảo mật.

- Kiểm tra đăng nhập/đăng xuất, lỗi thiếu JWT, phân quyền theo tài khoản.
- Kiểm tra upload, xem/sửa/xóa tài liệu, trích xuất nội dung.
- Kiểm tra Summary, Chat, OCR, Solver và điều hướng trên Expo.
- Kiểm tra Backend được chạy từ đúng **commit** trước mỗi đợt test.

Backend có test Node (`backend/tests/*.test.js`). Chạy ở thư mục gốc:

~~~bash
npm ci
npm ci --prefix backend
npm test
npm run check:ios
~~~

GitHub Actions tự chạy kiểm thử và đóng gói Expo iOS khi push nhánh hoặc tạo PR vào `main`. Bộ test tự động không thay thế kiểm thử tích hợp trên iPhone.

## Giới hạn và bảo mật (quan trọng)

1. **Quên mật khẩu:** API phát mã ngẫu nhiên, chỉ lưu SHA-256 của mã và cho dùng một lần trong 15 phút. Khi deploy cần cấu hình `RESEND_API_KEY` cùng `RESET_EMAIL_FROM` để gửi mã qua email, không trả mã qua API. Nếu thiếu dịch vụ email, endpoint trả 503. Demo local chỉ bật khi `NODE_ENV=development` và `ALLOW_DEMO_RESET_TOKEN=true` (sẽ trả mã qua API); **không bật trên Render hoặc server public**.
2. Tệp nằm tại `backend/uploads` trên filesystem, không phục vụ công khai qua `/uploads/*`. Nếu môi trường deploy không có lưu trữ bền vững, file có thể mất khi deploy lại. Cần bổ sung API tải file riêng với JWT nếu tương lai muốn tải lại PDF gốc.
3. Xóa tài liệu sẽ xóa tóm tắt, hội thoại và file gốc; MongoDB/filesystem không có transaction chung, lỗi gián đoạn cần kiểm tra hoặc dọn bổ sung.
4. Tắt lưu lịch sử Chat và hỏi tiếp Solver không ghi vào MongoDB, nhưng nội dung vẫn được gửi tới Gemini theo điều khoản dịch vụ.
5. Kết quả Gemini phụ thuộc mạng, quota và model; chỉ phục vụ học tập tham khảo.

## Quy trình kiểm thử tổng hợp trước khi merge `main`

1. Chạy `npm test` và `npm run check:ios`, hoặc kiểm tra GitHub Actions xanh tại HEAD.
2. Với Backend local, cấu hình MongoDB, Gemini và email reset hoặc demo local, dùng tài khoản/tài liệu thử.
3. Thử một lần xuyên suốt trên iPhone: Auth/Reset → Documents → Summary → Chat → Scanner/OCR → Solver → Profile/Logout, bao gồm hai tài khoản để xác nhận dữ liệu tách biệt.
4. Chỉ merge `feature/fr-completion` vào `main` sau khi đợt test cuối PASS; Render trỏ `main` có thể tự deploy, nên cần thiết lập biến môi trường trước khi coi bản deploy đủ tính năng.
## Tham khảo

- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started/)
- [Express](https://expressjs.com/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Gemini API](https://ai.google.dev/gemini-api/docs)
