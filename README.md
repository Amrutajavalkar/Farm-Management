<<<<<<< HEAD
# Farm Ledger v2 — Accounts, Connections & Work Requests

This version adds real **Farmer** and **Worker** accounts on top of the original Labour / Crops / Selling ledger.

## What's new in v2
- **Login / Register** with a role: Farmer or Worker.
- **Connections**: a worker can search for and add any number of farmers as "owners"; a farmer can likewise search for and add workers. A connection only becomes active once the *other* side accepts it.
- **Privacy by connection**: a worker's "I'm free for work" status is visible only to farmers they're connected with — never public. A farmer's vacancy postings are visible only to workers they're connected with.
- **Work Requests**: either side of an accepted connection can send a direct request ("I need you on this date" / "I'm available, please consider me"), which the other side accepts or declines.
- **Linked to your existing Labour records**: the moment a work request is accepted between a farmer and a worker, a Labour record is automatically created (or reused) linking that worker's real account to the farmer's Labour tab — so the farmer can immediately start logging work days and payments against a real, connected worker instead of just a typed-in name. The worker can see that same running total for every farmer they work with under their own **My Work** tab.
- Every farmer's Labour, Crops, and Selling data is now private to their own account (previously it was a single shared ledger).

## 1. Get a MongoDB connection string
Same as before — see the Atlas steps:
1. Create a free (M0) cluster at https://www.mongodb.com/cloud/atlas.
2. Create a database user and allow your IP under Network Access.
3. Copy the connection string from **Connect > Drivers**.
=======
# Farm Ledger — MongoDB Setup

## 1. Get a MongoDB connection string
Easiest option is MongoDB Atlas (free tier):
1. Create an account at https://www.mongodb.com/cloud/atlas and create a free (M0) cluster.
2. Under **Database Access**, create a user with a username/password.
3. Under **Network Access**, add your IP (or `0.0.0.0/0` while testing).
4. Click **Connect > Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority`

(If you'd rather run MongoDB locally, install it and use `mongodb://localhost:27017/farm_ledger` instead.)
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69

## 2. Configure the server
```bash
cd server
cp .env.example .env
```
<<<<<<< HEAD
Fill in:
```
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/farm_ledger?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=some-long-random-string-you-make-up
```
`JWT_SECRET` can be any long random string — it's used to sign login sessions. Generate one quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Install and run
=======
Edit `.env` and paste your connection string into `MONGO_URI` (add `/farm_ledger` as the database name before the `?`), e.g.:
```
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/farm_ledger?retryWrites=true&w=majority
PORT=5000
```

## 3. Install dependencies and run
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
```bash
cd server
npm install
npm start
```
<<<<<<< HEAD

## 4. Open the app
Visit **http://localhost:5000**. Register once as a Farmer and once as a Worker (e.g. two different browsers or an incognito window) to try the connection flow end to end:
1. As the Worker, go to **My Farmers**, search for the Farmer by name/email, and click **Connect**.
2. As the Farmer, go to **Workers**, accept the pending request.
3. As the Worker, toggle **I am free for work**.
4. As the Farmer, see the worker show up as "Free" under Connected Workers, and click **Request Work** (or the worker can send a request to the farmer the same way).
5. Once either side accepts a Work Request, a Labour record is created automatically — check the Farmer's **Labour** tab.

## Project structure
```
farm-ledger-v2/
├── public/
│   └── index.html            # Login/register + role-based tabs, calls the API below
└── server/
    ├── server.js
    ├── middleware/
    │   └── auth.js            # JWT verification + role guard
    ├── models/
    │   ├── User.js             # farmer/worker accounts, worker availability fields
    │   ├── Connection.js       # farmer <-> worker relationship (pending/accepted/rejected)
    │   ├── Vacancy.js          # farmer job postings
    │   ├── WorkRequest.js      # direct requests between a connected farmer & worker
    │   ├── Labour.js           # now has `farmer` (owner) and optional `worker` (linked account)
    │   ├── Crop.js             # now has `farmer` (owner)
    │   └── Sale.js
    └── routes/
        ├── auth.js             # register, login, /me
        ├── users.js            # search the opposite account type
        ├── connections.js      # request / accept / reject / list / remove
        ├── availability.js     # worker toggles status; farmer views connected workers' status
        ├── vacancies.js        # farmer posts; connected workers browse
        ├── workRequests.js     # create / accept / decline; accepting links a Labour record
        ├── labours.js          # now auth-scoped per farmer, plus /mine-as-worker for workers
        ├── crops.js            # now auth-scoped per farmer
        └── sales.js            # ownership checked via the parent crop's farmer
```

## API reference (new/changed endpoints)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password, role, phone, village }` → `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/api/auth/me` | Current logged-in user |
| GET | `/api/users/search?q=` | Search the opposite account type by name/email |
| POST | `/api/connections` | `{ targetUserId }` — send a connection request |
| GET | `/api/connections?status=` | List your connections |
| PUT | `/api/connections/:id/accept` | Accept a request sent to you |
| PUT | `/api/connections/:id/reject` | Decline a request sent to you |
| DELETE | `/api/connections/:id` | Remove an existing connection |
| PUT | `/api/availability/me` | (worker) `{ isAvailable, note }` |
| GET | `/api/availability/connected-workers` | (farmer) connected workers + their availability |
| POST | `/api/vacancies` | (farmer) `{ title, description, date, wageOffered }` |
| GET | `/api/vacancies/mine` | (farmer) your own postings |
| GET | `/api/vacancies/visible` | (worker) open postings from connected farmers only |
| PUT | `/api/vacancies/:id/close` / DELETE | (farmer) manage a posting |
| POST | `/api/work-requests` | `{ targetUserId, message, proposedDate, vacancyId? }` |
| GET | `/api/work-requests` | Requests you sent or received |
| PUT | `/api/work-requests/:id/accept` | Accept — also links/creates a Labour record |
| PUT | `/api/work-requests/:id/decline` | Decline |
| GET | `/api/labours/mine-as-worker` | (worker) your own wage/payment history across every farmer |
| GET/POST/PUT/DELETE | `/api/labours`, `/api/crops`, `/api/sales` | Same as before, now scoped to the logged-in farmer |

## Notes for next steps
- Passwords are hashed with bcrypt; sessions use a JWT stored in the browser's `localStorage`.
- A connection can be removed by either side at any time — removing it does **not** delete any Labour history already created.
- If you want farmers to see *all* workers (a public directory) rather than only by search, that's a small change to `/api/users/search` to drop the query requirement.
=======
You should see:
```
Connected to MongoDB
Farm Ledger server running on http://localhost:5000
```

## 4. Open the app
Visit **http://localhost:5000** — the same UI as before, now reading and writing to your MongoDB database.

## Project structure
```
farm-ledger/
├── public/
│   └── index.html          # Frontend (calls the API below)
└── server/
    ├── server.js            # Express app entry point
    ├── models/
    │   ├── Labour.js        # name, workdays[], payments[]
    │   └── Crop.js          # name, seedPrice, labourAmount, fertilizerAmount, sprayAmount, otherAmount, revenue
    ├── routes/
    │   ├── labours.js       # /api/labours ...
    │   └── crops.js         # /api/crops ...
    └── .env                 # your MONGO_URI (not committed)
```

## API reference
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/labours` | List all labourers |
| POST | `/api/labours` | Add labourer `{ name }` |
| DELETE | `/api/labours/:id` | Remove labourer |
| POST | `/api/labours/:id/workdays` | Add work day `{ date, wage }` |
| DELETE | `/api/labours/:id/workdays/:workdayId` | Remove a work day |
| POST | `/api/labours/:id/payments` | Add payment `{ date, amount, reason }` |
| DELETE | `/api/labours/:id/payments/:paymentId` | Remove a payment |
| GET | `/api/crops` | List all crops |
| POST | `/api/crops` | Add crop `{ name }` |
| PUT | `/api/crops/:id` | Update any of: `seedPrice, labourAmount, fertilizerAmount, sprayAmount, otherAmount, revenue` |
| DELETE | `/api/crops/:id` | Remove crop |

## Next steps to discuss
- **Hosting**: e.g. Render/Railway for the server, Atlas for the database.
- **Auth**: right now anyone with the URL can see/edit all data — worth adding a login if more than one person uses it.
- **Multiple farms/users**: if this should support more than one farmer's data, we'd add a `userId` field to each record.
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
