# TripDotCom Testing Flow (Full Feature Coverage)

Use this flow to verify the app works end-to-end before demos or releases.

## 1. Test Environment Setup

1. Install dependencies:
   - `npm install`
2. Create your env file:
   - Copy `.env.example` to `.env`
3. Start and seed database:
   - Ensure MySQL is running
   - `npm run seed`
4. Start backend + frontend:
   - `npm run dev:full`
5. Open app:
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:4000`

## 2. Test Accounts

Use password: `Password123!`

- Admin: `admin@tripstay.com`
- Hotel Owner: `maria@tripstay.com`
- Hotel Staff: `ana@tripstay.com`
- Customer: `john@gmail.com`

## 3. Smoke Tests (5-10 minutes)

- App loads `/` without console/runtime error
- Search page `/search` shows hotels
- Hotel details `/hotel/:id` loads rooms
- Login page `/login` loads
- Protected routes redirect when logged out:
  - `/bookings`, `/support`, `/admin`, `/owner`, `/staff`, `/loyalty`

Pass criteria: No blank screens, no unhandled errors, correct redirects.

## 4. Authentication + RBAC Flow

### Customer auth

- Register a new customer on `/register`
- Log out and log in with same account
- Verify navbar/session persists on refresh
- Verify `/auth/me` session restore works after reload

### Partner auth

- Go to `/internal/hotel-access`
- Create Hotel Owner account (create mode)
- Create Hotel Staff account linked to owner email
- Verify owner redirects to `/owner`, staff to `/staff`

### Access control checks

- Customer cannot access `/admin`, `/owner`, `/staff`
- Owner cannot access `/admin`
- Staff cannot access `/admin` and `/owner`
- Unauthenticated user redirected to `/login` for protected routes

Pass criteria: Role gating matches expected route permissions.

## 5. Customer Booking Journey (Core E2E)

1. Log in as customer (`john@gmail.com`)
2. Search hotels from home/search page
3. Apply filters:
   - Search keyword
   - Max price
   - Star rating
4. Open hotel details page
5. Select valid check-in/check-out dates
6. Choose a room and proceed to checkout
7. Checkout validations:
   - Invalid email blocked
   - Invalid card number blocked
   - Expired card blocked
   - Invalid date range blocked
8. Complete checkout with valid data
9. Verify success screen shows:
   - Booking ID
   - Payment status
   - Transaction reference
10. Open `/bookings` and verify booking appears
11. Verify loyalty points updated after payment

Pass criteria: Booking is created, paid, and visible in booking history with correct totals.

## 6. Loyalty Flow

- Open `/loyalty` as customer
- Verify points and membership level display
- Book with coin redemption enabled (when >= 100 points)
- Confirm discount applied in checkout summary
- Confirm points are reduced by redeemed amount

Pass criteria: Coins redeem correctly and loyalty balances/tier update consistently.

## 7. Refund and Cancellation Flow

### Customer-initiated

- From `/bookings`, cancel a `Confirmed` or `PendingPayment` eligible booking
- Verify refund request succeeds
- Verify booking status changes to `Cancelled`
- Verify payment status becomes `Refunded`

### Negative refund checks

- Attempt cancellation for ineligible booking window (outside rules)
- Attempt cancellation for unpaid booking
- Attempt duplicate cancellation on already-cancelled booking

Pass criteria: Eligible cancellations succeed; invalid scenarios return clear errors.

## 8. Support Ticket Flow

### Customer side

- Open `/support`
- Create general ticket (no booking)
- Create booking-linked ticket
- Confirm ticket appears in list with `Open` status

### Admin/Owner/Staff side

- Log in as admin, owner, staff separately
- Open `/support`
- Move ticket `Open -> InProgress -> Resolved`
- Add resolution notes

Pass criteria: Ticket lifecycle updates correctly and reflects by role.

## 9. Admin Dashboard Flow (`/admin`)

- Verify dashboard loads hotels, rooms, bookings, customers, support
- Booking operations:
  - Check-in confirmed booking
  - Complete checked-in booking
  - Add internal notes
  - Cancel/refund booking
- Hotel CRUD:
  - Create, edit, delete hotel
- Room CRUD:
  - Create, edit, delete room

Pass criteria: All management actions persist and lists refresh correctly.

## 10. Owner Dashboard Flow (`/owner`)

- Verify owner sees own hotel scope data
- Booking operations (check-in/complete/cancel/notes)
- Support operations (InProgress/Resolved)
- Hotel CRUD for owner hotels
- Attempt room CRUD and record behavior

Expected note from current backend routes:
- Room create/update/delete endpoints are currently admin-only (`/rooms` POST/PUT/DELETE require `admin`).
- If owner room actions fail with `403`, log as permission/design mismatch vs UI.

## 11. Staff Dashboard Flow (`/staff`)

- Verify staff sees scoped bookings/support
- Perform:
  - Check-in
  - Complete
  - Cancel/refund
  - Add notes
  - Resolve tickets
- Verify staff cannot create/edit hotels or access admin/owner routes

Pass criteria: Staff can execute operational actions only.

## 12. API-Level Regression Checks (Quick)

Run sample checks with bearer tokens:

- `GET /api/hotels`
- `GET /api/hotels/:id`
- `POST /api/bookings` (customer token)
- `POST /api/payments` (customer token)
- `POST /api/refunds` (customer/admin token)
- `GET /api/support` (all roles, verify scoped data)
- `GET /api/loyalty/:customerId` (auth required)

Also verify role-denied cases return `403` and unauthenticated calls return `401`.

## 13. Data Integrity Checks (DB)

After major E2E run, validate in MySQL:

- `bookings`: status transitions are valid
- `payments`: Paid/Refunded rows match booking changes
- `refunds`: one row per refund action
- `loyalty`: points/tier changed as expected
- `support_tickets`: status/resolution fields updated

Pass criteria: UI state matches persisted DB state.

## 14. Non-Functional Checks

- Responsive layout at mobile/tablet/desktop
- Browser sanity: Chrome + Edge
- Error handling: API down scenario shows graceful messages
- Basic performance: search and dashboards load without severe lag

## 15. Release Sign-Off Checklist

Ship only if all are true:

- Smoke tests passed
- Auth and RBAC passed
- Customer booking E2E passed
- Refund/support/loyalty passed
- Admin/Owner/Staff flows passed (or known issues documented)
- No P0/P1 defects open

## Suggested Execution Order Per Cycle

1. Smoke
2. Auth + RBAC
3. Customer E2E booking/payment
4. Refund + loyalty
5. Support workflow
6. Admin/Owner/Staff dashboards
7. API + DB integrity checks

This keeps high-risk booking/payment features verified early.
