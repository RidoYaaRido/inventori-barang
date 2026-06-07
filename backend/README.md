<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Inventory API Curl Examples

Base URL:

```bash
http://localhost:8000/api/v1
```

Login admin:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inventory.local","password":"password123"}'
```

Set token:

```bash
TOKEN="paste_token_dari_response_login"
```

Get categories:

```bash
curl http://localhost:8000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN"
```

Create category:

```bash
curl -X POST http://localhost:8000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Gudang","description":"Kategori perlengkapan gudang","is_active":true}'
```

Get items:

```bash
curl "http://localhost:8000/api/v1/items?per_page=10" \
  -H "Authorization: Bearer $TOKEN"
```

Create item:

```bash
curl -X POST http://localhost:8000/api/v1/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category_id":1,"name":"Scanner Barcode","sku":"PKT-SCN-001","description":"Scanner barcode USB","unit_price":450000,"stock_quantity":4,"unit":"unit","is_active":true}'
```

Search item:

```bash
curl "http://localhost:8000/api/v1/items?search=laptop" \
  -H "Authorization: Bearer $TOKEN"
```

Low stock item:

```bash
curl http://localhost:8000/api/v1/items/low-stock \
  -H "Authorization: Bearer $TOKEN"
```

Upload bukti stock in:

```bash
curl -X POST http://localhost:8000/api/v1/stock-ins/1/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "attachment=@/path/to/bukti-stock-in.pdf"
```

Upload bukti stock out:

```bash
curl -X POST http://localhost:8000/api/v1/stock-outs/1/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "attachment=@/path/to/bukti-stock-out.jpg"
```

Test stock out dengan quantity melebihi stok:

```bash
curl -X POST http://localhost:8000/api/v1/stock-outs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id":1,"quantity":999999,"reference_number":"SO-TEST-OVER-STOCK","notes":"Test stok tidak cukup"}'
```

Test update quantity stock out:

```bash
curl -X PUT http://localhost:8000/api/v1/stock-outs/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":2,"reference_number":"SO-UPDATED-001","notes":"Update jumlah barang keluar"}'
```

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
