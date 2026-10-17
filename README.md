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
- **Tài liệu:** Upload PDF/DOCX/TXT; xem danh sách, thông tin/chi tiết, đổi tên, phân loại môn học/chủ đề và xóa bản ghi. Giới hạn **10 MB/file**.
- **AI Summary:** Tóm tắt tài liệu với 3 mức ngắn/trung bình/chi tiết; xem và quản lý lịch sử tóm tắt.
- **AI Chat:** Đặt câu hỏi dựa trên tài liệu, tiếp tục hội thoại, xem lịch sử và xóa hội thoại.
- **Scanner/OCR:** Chụp ảnh hoặc chọn ảnh; nhận dạng văn bản, xem/chỉnh sửa kết quả. Backend hỗ trợ JPG/JPEG, PNG, WEBP, HEIC, HEIF, tối đa **10 MB/ảnh**.
- **AI Solver:** Nhập câu hỏi hoặc lấy nội dung từ ảnh qua OCR; xem gợi ý từng bước, giải thích và lời giải tham khảo.

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
git clone -b refactor/project-structure https://github.com/DuyBachh/appEduai.git
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

File cấu hình: src/services/api.js, hằng số API_BASE_URL. Hiện tại project trỏ về Render:

~~~javascript
export const API_BASE_URL =
    "https://appeduai-backend.onrender.com/api";
~~~

Để chạy Backend local trên **điện thoại**, đổi thành IP mạng nội bộ thực tế của máy tính (ví dụ, không phải IP cố định):

~~~javascript
export const API_BASE_URL = "http://192.168.1.10:5000/api";
~~~

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
| POST | /auth/forgot-password | Yêu cầu token reset (demo) |
| POST | /auth/reset-password | Đặt lại mật khẩu |
| POST | /documents | Tạo bản ghi tài liệu |
| POST | /documents/upload | Upload tài liệu (multipart/form-data) |
| GET | /documents | Danh sách tài liệu |
| GET | /documents/:id | Chi tiết tài liệu |
| PUT | /documents/:id | Cập nhật tài liệu |
| DELETE | /documents/:id | Xóa bản ghi tài liệu |
| POST | /summaries/documents/:documentId | Tạo tóm tắt |
| GET | /summaries/documents/:documentId | Lịch sử tóm tắt |
| GET | /summaries/:summaryId | Chi tiết bản tóm tắt |
| DELETE | /summaries/:summaryId | Xóa bản tóm tắt |
| POST | /chat | Chat với tài liệu |
| GET | /chat/conversations | Danh sách hội thoại |
| GET | /chat/conversations/:conversationId/messages | Tin nhắn |
| DELETE | /chat/conversations/:conversationId | Xóa hội thoại |
| POST | /solver | Giải bài tập |
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

Backend **chưa có bộ automated test chính thức**: script npm test trong backend/package.json vẫn là placeholder.

## Giới hạn và bảo mật (quan trọng)

1. **Forgot Password chỉ dùng cho demo:** API /auth/forgot-password hiện **trả resetToken trực tiếp** cho người nhập email. Đây là lỗ hổng có thể dẫn tới chiếm quyền tài khoản nếu triển khai công khai. **Không dùng email/mật khẩu thật**, và không dùng cơ chế này cho production; trước khi dùng thực tế cần xác minh chủ sở hữu tài khoản (ví dụ gửi link reset qua email).
2. Tệp upload được lưu trong backend/uploads/ trên filesystem. Nếu host (ví dụ Render) không có persistent storage, tệp có thể mất khi redeploy/khởi động lại. API xóa tài liệu hiện xóa bản ghi MongoDB, không đảm bảo xóa tệp vật lý.
3. Kết quả Gemini phụ thuộc Internet, hạn mức API và mô hình; nội dung AI chỉ mang tính tham khảo.
4. Việc phát triển trên branch refactor/project-structure **không có nghĩa đã merge vào main**.

## Tham khảo

- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started/)
- [Express](https://expressjs.com/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Gemini API](https://ai.google.dev/gemini-api/docs)
