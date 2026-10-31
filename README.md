# Lửa Hồng BBQ

Website quán nướng than hoa: thực đơn và combo, giỏ hàng đặt món mang về, đặt bàn online, khuyến mãi, thư viện ảnh và trang quản trị. Giao diện tiếng Việt, làm bằng Next.js (App Router) và TypeScript.

## Chức năng

- Trang chủ, thực đơn đầy đủ, combo cho từng nhóm
- Giỏ hàng lưu trong trình duyệt, đặt món mang về (thanh toán tiền mặt khi nhận)
- Đặt bàn online theo chi nhánh, ngày và giờ
- Khuyến mãi (danh sách và bài chi tiết) và thư viện ảnh
- Trang `/admin`: xem và xác nhận đặt bàn, nhận đơn mang về, sửa thực đơn, combo và khuyến mãi mà không cần sửa code
- Giá luôn được máy chủ tính lại, không tin giá do trình duyệt gửi lên
- Chống spam cơ bản: ô ẩn (honeypot) và giới hạn số lần gửi theo IP

## Chạy local

```bash
npm install
cp .env.example .env.local   # rồi sửa ADMIN_PASSWORD và SESSION_SECRET
npm run dev
```

Mở http://localhost:3000. Khi chưa có `BLOB_READ_WRITE_TOKEN`, dữ liệu (đặt bàn, đơn hàng, nội dung đã sửa) lưu trong thư mục `.data/` (đã nằm trong `.gitignore`).

## Biến môi trường

| Tên | Bắt buộc | Ý nghĩa |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Có | Mật khẩu đăng nhập `/admin` |
| `SESSION_SECRET` | Có | Chuỗi ngẫu nhiên từ 32 ký tự để ký cookie đăng nhập |
| `BLOB_READ_WRITE_TOKEN` | Khi deploy | Token của Vercel Blob, Vercel tự thêm khi kết nối Blob store với project |
| `NEXT_PUBLIC_SITE_URL` | Không | Địa chỉ website, dùng cho sitemap và metadata |

## Lưu dữ liệu

Không dùng database. Mỗi đặt bàn và mỗi đơn hàng là một file JSON trong Vercel Blob ở chế độ private (`bookings/`, `orders/`), nội dung website nằm trong `content.json`. Cách này đủ cho một quán nhỏ. Nếu lượng đơn lớn hoặc cần báo cáo, hãy chuyển phần `src/lib/store.ts` sang Postgres.

## Deploy lên Vercel

1. Import repo vào Vercel (framework tự nhận Next.js).
2. Tạo một Blob store (Storage, Blob) và kết nối với project để có `BLOB_READ_WRITE_TOKEN`.
3. Thêm `ADMIN_PASSWORD` và `SESSION_SECRET` ở Settings, Environment Variables.
4. Deploy, rồi vào `/admin` để đăng nhập.

## Thay nội dung mẫu

- Tên quán, chi nhánh, hotline, phí giao hàng, review: `src/lib/data.ts`
- Thực đơn, combo, khuyến mãi mặc định: `src/lib/data.ts` (phần `SEED`). Sau khi sửa trong `/admin`, dữ liệu trong Blob sẽ được ưu tiên.
- Hình minh hoạ: `src/components/Art.tsx`. Thay bằng ảnh thật khi có.

## Cấu trúc

```
src/app/(site)/     các trang công khai
src/app/admin/      trang quản trị
src/app/api/        API đặt bàn, đặt món và admin
src/components/     giao diện dùng chung, giỏ hàng, form
src/lib/            dữ liệu mẫu, lưu trữ, xác thực, kiểm tra dữ liệu
```
