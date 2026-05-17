"# WhiteCircle Group - Test Credentials

## Admin Account
- Email: `admin@whitecircle.in`
- Password: `Admin@123`
- Role: `admin`

## Accountant Account (Seeded)
- Email: `accountant@whitecircle.in`
- Password: `Account@123`
- Role: `accountant`

## Test Client Account
- Register fresh via `/register` page with any email/password (role: client)

## Auth Endpoints
- POST `/api/auth/register` - body: `{name, email, phone?, password, business_name?}`
- POST `/api/auth/login` - body: `{email, password}`
- POST `/api/auth/logout`
- GET  `/api/auth/me` (returns user object)

## Auth Notes
- JWT token returned in response body AND set as `access_token` httponly cookie
- Frontend stores token in localStorage as `wc_token` (fallback for cross-domain)
- Frontend sends both `Authorization: Bearer <token>` header and cookies
"