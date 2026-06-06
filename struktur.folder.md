inventory-system/
│
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       └── V1/
│   │   │   │           ├── AuthController.php
│   │   │   │           ├── ProfileController.php
│   │   │   │           ├── CategoryController.php
│   │   │   │           ├── ItemController.php
│   │   │   │           ├── StockInController.php
│   │   │   │           ├── StockOutController.php
│   │   │   │           ├── AdminReportController.php
│   │   │   │           └── ActivityLogController.php
│   │   │   │
│   │   │   └── Middleware/
│   │   │       ├── AdminMiddleware.php
│   │   │       └── StaffMiddleware.php
│   │   │
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Category.php
│   │       ├── Item.php
│   │       ├── StockIn.php
│   │       ├── StockOut.php
│   │       └── ActivityLog.php
│   │
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │
│   ├── routes/
│   │   └── api.php
│   │
│   ├── storage/
│   ├── Dockerfile
│   └── .env
│
├── frontend/                 # React Vite
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosClient.js
│   │   │   ├── authApi.js
│   │   │   ├── itemApi.js
│   │   │   ├── categoryApi.js
│   │   │   ├── stockInApi.js
│   │   │   ├── stockOutApi.js
│   │   │   └── adminApi.js
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Button.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── StaffLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── staff/
│   │   │   │   ├── StaffDashboard.jsx
│   │   │   │   ├── ItemList.jsx
│   │   │   │   ├── StockInCreate.jsx
│   │   │   │   ├── StockOutCreate.jsx
│   │   │   │   ├── TransactionHistory.jsx
│   │   │   │   └── Profile.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageItems.jsx
│   │   │       ├── ManageCategories.jsx
│   │   │       ├── ManageStaff.jsx
│   │   │       ├── ManageStockIn.jsx
│   │   │       ├── ManageStockOut.jsx
│   │   │       ├── Reports.jsx
│   │   │       └── ActivityLogs.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── router/
│   │   │   └── index.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   └── backend.conf
│
├── docker-compose.yml
└── README.md