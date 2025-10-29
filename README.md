# 🧠 THT_API_NODE_NUTECH

Proyek ini merupakan implementasi dari **Take Home Test API Programmer** untuk posisi **Backend Developer (Node.js)** di **Nutech Integrasi**.  
Aplikasi ini dibangun menggunakan **Express.js** dengan database **MySQL**, serta mengikuti kontrak API (Swagger) dari spesifikasi yang telah diberikan.

---

## ⚙️ Fitur Utama

### 🔐 Autentikasi
- Register  
- Login (JWT)

### 👤 User Management
- Get Profile  
- Update Profile Image

### 💰 Saldo
- Get Balance  
- Top Up Saldo

### 💳 Transaksi
- Create Transaction (pembayaran layanan)  
- Get Transaction History

### 🖼️ Banner & Services
- Get Banner List  
- Get Service List

---

## 🧱 Stack Teknologi

| Komponen       | Teknologi                       |
| -------------- | ------------------------------- |
| Backend        | Node.js (Express.js)            |
| Database       | MySQL                           |
| ORM            | Raw Query (Prepared Statements) |
| Auth           | JSON Web Token (JWT)            |
| Env Management | dotenv                          |
| Server         | Nodemon (Development)           |
| Deployment     | Azure App Service               |

---

## 📂 Struktur Direktori

```
tht-api-node/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│
├── uploads/             
├── db-init.sql                
├── index.js             
├── package.json
└── README.md
```

---

## ⚡ Cara Menjalankan di Lokal

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<username>/tht-api-node.git
cd tht-api-node
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Import Database

Jalankan perintah di MySQL:
```bash
mysql -u root -p < db-init.sql
```

### 4️⃣ Buat File `.env`

Isi dengan konfigurasi berikut:

```
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=nutech_api
JWT_SECRET=your_secret_key
JWT_EXPIRES_HOURS=12
BASE_URL=http://localhost:3000
UPLOAD_DIR=uploads
```

### 5️⃣ Jalankan Server

```bash
npm run dev
```

---

## ☁️ Deployment

Proyek ini dapat di-deploy menggunakan **Railway.app** atau platform serupa.  
Berikut domain aktif proyek:

🌍 **https://thtapinodenutech-production.up.railway.app**

---

## 🧩 Desain Database

DDL lengkap tersedia pada file `db-init.sql`.

### 🗄️ Tabel Utama
- **users**  
- **banners**  
- **services**  
- **transactions**

### 🔗 Relasi
- `transactions.user_id` → `users.id`

---

## 📄 API Reference (Swagger)

Referensi kontrak API:  
🔗 **[https://api-doc-tht.nutech-integrasi.com](https://api-doc-tht.nutech-integrasi.com)**

---
