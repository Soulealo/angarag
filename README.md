# DSCTS App

MongoDB-backed DSCTS app with JWT authentication, admin access control, product/category management, orders, and payment information.

## Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` values into `server/.env` and set `MONGO_URI` / `JWT_SECRET`.
3. Start MongoDB locally or point `MONGO_URI` to a running MongoDB instance.
4. Create the first admin:
   ```bash
   npm run seed:admin
   ```
5. Start the app:
   ```bash
   npm run dev
   ```

The default local URL is `http://localhost:5001`.

Default admin:

- Email: `admin@example.com`
- Password: `Admin12345`
