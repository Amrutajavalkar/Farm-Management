# Farm Ledger — MongoDB Setup

## 1. Get a MongoDB connection string
Easiest option is MongoDB Atlas (free tier):
1. Create an account at https://www.mongodb.com/cloud/atlas and create a free (M0) cluster.
2. Under **Database Access**, create a user with a username/password.
3. Under **Network Access**, add your IP (or `0.0.0.0/0` while testing).
4. Click **Connect > Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority`

(If you'd rather run MongoDB locally, install it and use `mongodb://localhost:27017/farm_ledger` instead.)

## 2. Configure the server
```bash
cd server
cp .env.example .env
```
Edit `.env` and paste your connection string into `MONGO_URI` (add `/farm_ledger` as the database name before the `?`), e.g.:
```
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/farm_ledger?retryWrites=true&w=majority
PORT=5000
```

## 3. Install dependencies and run
```bash
cd server
npm install
npm start
```
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
