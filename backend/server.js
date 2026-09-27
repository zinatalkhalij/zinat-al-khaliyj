const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL environment variable.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(express.json());

const services = [
  { id: 1, name: "الشعر والتسريحات" },
  { id: 2, name: "صبغات الشعر" },
  { id: 3, name: "علاجات الشعر" },
  { id: 4, name: "تنظيف البشرة" },
  { id: 5, name: "الهيدروفيشل" },
  { id: 6, name: "منيكير وبديكير" },
  { id: 7, name: "حف الوجه" },
  { id: 8, name: "ديتوكس فروة الرأس" }
];

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL,
      booking_date DATE NOT NULL,
      booking_time TIME NOT NULL,
      notes TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

app.get("/", (req, res) => {
  res.json({ app: "Zinat Al Khalij Salon API", status: "running" });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.get("/services", (req, res) => res.json(services));

app.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, phone, service,
              booking_date AS date,
              booking_time AS time,
              notes, status, created_at AS "createdAt"
       FROM bookings
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ success: false, message: "تعذر جلب الحجوزات" });
  }
});

app.post("/bookings", async (req, res) => {
  const { name, phone, service, date, time, notes = "" } = req.body;

  if (!name || !phone || !service || !date || !time) {
    return res.status(400).json({
      success: false,
      message: "يرجى إدخال جميع البيانات المطلوبة"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings
       (name, phone, service, booking_date, booking_time, notes)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, name, phone, service,
                 booking_date AS date,
                 booking_time AS time,
                 notes, status, created_at AS "createdAt"`,
      [name, phone, service, date, time, notes]
    );

    res.status(201).json({
      success: true,
      message: "تم استلام الحجز بنجاح",
      booking: result.rows[0]
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "تعذر حفظ الحجز" });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Database init failed:", e);
    process.exit(1);
  });
