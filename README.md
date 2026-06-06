# Inventory Management System - Backend API

Ini adalah backend API REST yang dibangun menggunakan Laravel 13 dengan fitur autentikasi menggunakan Laravel Sanctum. Backend ini dirancang untuk bekerja dengan frontend React+Vite.

## Stack Teknologi

- **Framework**: Laravel 13
- **Authentication**: Laravel Sanctum
- **Database**: MySQL 8.0
- **Server Web**: Nginx (Alpine)
- **Server PHP**: PHP 8.3 FPM
- **Container**: Docker & Docker Compose
- **Database Manager**: phpMyAdmin

## Struktur Folder

```
inventory-system/
├── backend/                    # Laravel API
│   ├── app/                   # Application code
│   │   ├── Http/
│   │   │   ├── Controllers/   # API Controllers
│   │   │   └── Middleware/    # Custom Middleware
│   │   └── Models/            # Eloquent Models
│   ├── config/                # Configuration files
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── routes/
│   │   ├── api.php           # API Routes
│   │   └── web.php           # Web Routes
│   ├── storage/              # Logs, cache, uploads
│   ├── .env.example          # Environment template
│   ├── composer.json         # PHP Dependencies
│   ├── Dockerfile            # Docker configuration
│   └── README.md             # This file
├── nginx/
│   └── backend.conf          # Nginx configuration
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Project documentation
```

## Prasyarat

- Docker dan Docker Compose terinstall
- Git (untuk cloning project)

## Instalasi & Setup

### 1. Clone atau Persiapkan Project

```bash
cd /path/to/inventori-brg
```

### 2. Jalankan Docker Compose

Membangun dan menjalankan semua container (backend, nginx, mysql, phpmyadmin):

```bash
docker compose up -d --build
```

Verifikasi semua container berjalan:

```bash
docker ps
```

Expected output:
```
NAMES                        STATUS         PORTS
inventory_backend            Up             9000/tcp
inventory_nginx              Up             0.0.0.0:8000->80/tcp
inventory_mysql              Up             0.0.0.0:3306->3306/tcp
inventory_phpmyadmin         Up             0.0.0.0:8080->80/tcp
```

### 3. Instalasi Composer Dependencies

```bash
docker compose exec backend composer install
```

### 4. Generate Application Key

```bash
docker compose exec backend php artisan key:generate
```

Verifikasi file `.env` di folder `backend/` sudah memiliki `APP_KEY`:

```bash
cat backend/.env | grep APP_KEY
```

### 5. Jalankan Database Migrations

```bash
docker compose exec backend php artisan migrate --seed
```

Command ini akan:
- Membuat semua tabel di database
- Menjalankan seeders untuk membuat dummy data

### 6. Verifikasi Instalasi

Cek daftar routes:

```bash
docker compose exec backend php artisan route:list | grep api
```

Test endpoint kesehatan API:

```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Inventory API is running",
  "timestamp": "2024-01-15T10:30:45Z"
}
```

## Akun Dummy Untuk Testing

Setelah menjalankan migration dengan seeding, tersedia 2 akun berikut:

### Admin Account
- **Email**: `admin@inventory.local`
- **Password**: `password123`
- **Role**: admin

### Staff Account
- **Email**: `staff1@inventory.local`
- **Password**: `password123`
- **Role**: staff

## URL Penting

| Layanan | URL | Keterangan |
|---------|-----|-----------|
| API Backend | `http://localhost:8000` | REST API |
| Health Check | `http://localhost:8000/api/health` | Test API status |
| phpMyAdmin | `http://localhost:8080` | Database Manager |
| MySQL | `localhost:3306` | Database Server |

### Database Connection Details
- **Host**: `mysql` (dari Docker) atau `localhost:3306` (dari host)
- **Username**: `inventory_user`
- **Password**: `inventory_pass`
- **Database**: `inventory_db`
- **Root Password**: `root_password`

## API Endpoints

### Health Check (Public)
```
GET /api/health
```

### Authentication (v1)
```
POST   /api/v1/auth/register      - Register user baru
POST   /api/v1/auth/login         - Login
POST   /api/v1/auth/logout        - Logout (requires token)
GET    /api/v1/auth/me            - Get current user (requires token)
PUT    /api/v1/auth/profile       - Update profile (requires token)
```

### Categories (v1, requires auth)
```
GET    /api/v1/categories         - Get all categories
POST   /api/v1/categories         - Create category
GET    /api/v1/categories/{id}    - Get category detail
PUT    /api/v1/categories/{id}    - Update category
DELETE /api/v1/categories/{id}    - Delete category
```

### Items (v1, requires auth)
```
GET    /api/v1/items              - Get all items
POST   /api/v1/items              - Create item
GET    /api/v1/items/{id}         - Get item detail
PUT    /api/v1/items/{id}         - Update item
DELETE /api/v1/items/{id}         - Delete item
```

### Stock In (v1, requires auth)
```
GET    /api/v1/stock-ins          - Get stock in history
POST   /api/v1/stock-ins          - Record stock in
GET    /api/v1/stock-ins/{id}     - Get stock in detail
PUT    /api/v1/stock-ins/{id}     - Update stock in
DELETE /api/v1/stock-ins/{id}     - Delete stock in
```

### Stock Out (v1, requires auth)
```
GET    /api/v1/stock-outs         - Get stock out history
POST   /api/v1/stock-outs         - Record stock out
GET    /api/v1/stock-outs/{id}    - Get stock out detail
PUT    /api/v1/stock-outs/{id}    - Update stock out
DELETE /api/v1/stock-outs/{id}    - Delete stock out
```

### Activity Logs (v1, requires auth, read-only)
```
GET    /api/v1/activity-logs      - Get activity logs
GET    /api/v1/activity-logs/{id} - Get log detail
```

## Testing API dengan cURL

### 1. Test Health Endpoint
```bash
curl http://localhost:8000/api/health
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inventory.local",
    "password": "password123"
  }'
```

Response akan berisi API token:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@inventory.local",
    "role": "admin",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 3. Menggunakan Token untuk Request Protected
```bash
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."

curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Create Category
```bash
curl -X POST http://localhost:8000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Elektronik",
    "description": "Barang-barang elektronik"
  }'
```

## Database

### Struktur Tabel

#### users
- `id` - Primary Key
- `name` - Nama user
- `email` - Email unik
- `password` - Password (hashed)
- `role` - admin atau staff
- `is_active` - Status aktif
- `email_verified_at` - Verifikasi email
- `remember_token` - Remember me token
- `created_at`, `updated_at` - Timestamps

#### categories
- `id` - Primary Key
- `name` - Nama kategori (unik)
- `description` - Deskripsi
- `is_active` - Status aktif
- `created_at`, `updated_at` - Timestamps

#### items
- `id` - Primary Key
- `category_id` - Foreign Key ke categories
- `name` - Nama barang
- `sku` - Stock Keeping Unit (unik)
- `description` - Deskripsi
- `unit_price` - Harga satuan
- `stock_quantity` - Jumlah stok
- `unit` - Satuan (pcs, box, kg, dll)
- `is_active` - Status aktif
- `created_at`, `updated_at` - Timestamps

#### stock_ins
- `id` - Primary Key
- `item_id` - Foreign Key ke items
- `user_id` - Foreign Key ke users
- `quantity` - Jumlah masuk
- `reference_number` - Nomor referensi (PO, invoice, dll)
- `notes` - Catatan
- `status` - pending, completed, cancelled
- `received_at` - Waktu diterima
- `created_at`, `updated_at` - Timestamps

#### stock_outs
- `id` - Primary Key
- `item_id` - Foreign Key ke items
- `user_id` - Foreign Key ke users
- `quantity` - Jumlah keluar
- `reference_number` - Nomor referensi (SJ, dll)
- `notes` - Catatan
- `status` - pending, completed, cancelled
- `released_at` - Waktu dilepas
- `created_at`, `updated_at` - Timestamps

#### activity_logs
- `id` - Primary Key
- `user_id` - Foreign Key ke users
- `action` - create, update, delete, login, logout
- `model_type` - Jenis model
- `model_id` - ID model
- `old_values` - Data lama (JSON)
- `new_values` - Data baru (JSON)
- `ip_address` - IP address user
- `description` - Deskripsi aktivitas
- `created_at`, `updated_at` - Timestamps

## Maintenance & Troubleshooting

### Melihat Logs Container
```bash
# Backend logs
docker compose logs -f backend

# Nginx logs
docker compose logs -f nginx

# MySQL logs
docker compose logs -f mysql
```

### Reset Database
```bash
# Delete existing data
docker compose exec backend php artisan migrate:reset

# Re-run migrations
docker compose exec backend php artisan migrate --seed
```

### Masuk ke Container
```bash
# Backend
docker compose exec backend bash

# MySQL
docker compose exec mysql bash
```

### Rebuild Containers
```bash
docker compose down
docker compose up -d --build
```

### Clear Cache
```bash
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan view:clear
docker compose exec backend php artisan route:clear
```

## CORS Configuration

Backend sudah dikonfigurasi untuk menerima request dari frontend React di `http://localhost:5173`.

Konfigurasi CORS berada di `config/cors.php`. Jika perlu mengubah origin, edit file tersebut:

```php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:5173'),
    'localhost:5173',
    'localhost:3000',
],
```

## Environment Variables

Konfigurasi environment ada di file `.env` di folder `backend/`. 

Template tersedia di `.env.example`.

Key variables:
```env
APP_NAME="Inventory Management System"
APP_URL=http://localhost:8000
DB_HOST=mysql
DB_DATABASE=inventory_db
DB_USERNAME=inventory_user
DB_PASSWORD=inventory_pass
FRONTEND_URL=http://localhost:5173
SANCTUM_EXPIRATION=525600
```

## Development

### Generate Controller
```bash
docker compose exec backend php artisan make:controller Api/V1/NewController
```

### Generate Model dengan Migration
```bash
docker compose exec backend php artisan make:model NewModel -m
```

### Generate Seeder
```bash
docker compose exec backend php artisan make:seeder NewSeeder
```

### Run Tests
```bash
docker compose exec backend php artisan test
```

### Format Code dengan Pint
```bash
docker compose exec backend php artisan pint
```

## Deployment Notes

Untuk production, pastikan:

1. Set `APP_DEBUG=false` di `.env`
2. Set `APP_ENV=production` di `.env`
3. Generate unique `APP_KEY`
4. Update `FRONTEND_URL` sesuai domain frontend
5. Gunakan database managed service (RDS, CloudSQL, dll)
6. Setup HTTPS/SSL certificate
7. Configure proper database backups
8. Setup monitoring dan logging

## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Docker Documentation](https://docs.docker.com)
- [MySQL Documentation](https://dev.mysql.com/doc)

## Support

Untuk pertanyaan atau issue, hubungi tim backend development.

---

**Last Updated**: 2024-01-15
**Laravel Version**: 13.14.0
**PHP Version**: 8.3

curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inventory.local",
    "password": "password123"
  }'