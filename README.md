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

## Render Deploy

Render must receive MongoDB settings from environment variables. Do not deploy with a local `127.0.0.1` MongoDB URL.

Set these in Render service settings under **Environment**:

```text
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.example.mongodb.net/dscts_app?retryWrites=true&w=majority
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://your-render-service.onrender.com
```

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Default admin:

- Email: `admin@example.com`
- Password: `Admin12345`
