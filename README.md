# Homely

Landing page dan sistem reservasi akomodasi berbasis Next.js. Pengunjung dapat memilih akomodasi, mengisi data booking, dan membayar melalui Midtrans Snap. Data booking dan perubahan status pembayaran disimpan di PostgreSQL dengan Drizzle ORM.

## Menjalankan project

1. Install dependency dengan `npm install`.
2. Salin `.env.example` menjadi `.env.local`, lalu isi koneksi PostgreSQL dan kredensial Midtrans Sandbox.
3. Jalankan migrasi dengan `npm run db:migrate`.
4. Jalankan aplikasi dengan `npm run dev`.
5. Buka `http://localhost:3000`.

## Environment

- `DATABASE_URL`: connection string PostgreSQL.
- `DATABASE_MIGRATION_URL`: connection string langsung untuk migrasi. Pada PostgreSQL lokal nilainya boleh sama dengan `DATABASE_URL`.
- `MIDTRANS_SERVER_KEY`: Server Key Midtrans, hanya digunakan di server.
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`: Client Key untuk Snap di browser.
- `MIDTRANS_IS_PRODUCTION`: `false` untuk Sandbox atau `true` untuk Production.
- `NEXT_PUBLIC_APP_URL`: alamat aplikasi untuk callback dan redirect.

## Alur pembayaran

1. Browser mengirim data tamu dan tanggal ke `POST /api/bookings`.
2. Server memvalidasi ketersediaan dan menghitung total dari katalog server.
3. Booking pending disimpan selama 30 menit dan server membuat token Midtrans Snap.
4. Browser membuka Snap menggunakan token tersebut.
5. Midtrans mengirim hasil ke `POST /api/payments/midtrans`.
6. Server memverifikasi signature dan nominal sebelum mengubah status booking.
7. Halaman `/booking/status` membaca hasil terbaru dari database.

Atur Payment Notification URL di dashboard Midtrans menjadi:

```text
https://domain-anda.com/api/payments/midtrans
```

## Perintah

- `npm run dev`: menjalankan server development.
- `npm run lint`: memeriksa kualitas kode.
- `npm run build`: membuat build production.
- `npm run db:generate`: membuat migrasi dari perubahan skema.
- `npm run db:migrate`: menerapkan migrasi ke PostgreSQL.
- `npm run db:studio`: membuka Drizzle Studio.

## Struktur utama

- `app`: halaman dan endpoint Next.js.
- `db`: koneksi, skema, dan tipe database.
- `drizzle`: file migrasi PostgreSQL.
- `lib`: validasi booking dan integrasi layanan.
- `public`: aset gambar dalam format WebP.

## Verifikasi

Jalankan `npm run lint` dan `npm run build` sebelum membuat pull request.
