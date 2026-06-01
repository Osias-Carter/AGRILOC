import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, assertDatabaseReady } from './db.js';
import { mapBooking, mapMachine, mapNotification, mapUser } from './mappers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 4000);
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5174';
const jwtSecret = process.env.JWT_SECRET || 'agriloc-dev-secret-change-me';

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

function signUser(user) {
  return jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });
}

async function getUserById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] ? mapUser(rows[0]) : null;
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      res.status(401).json({ message: 'Authentification requise.' });
      return;
    }

    const payload = jwt.verify(token, jwtSecret);
    const user = await getUserById(payload.sub);
    if (!user) {
      res.status(401).json({ message: 'Utilisateur introuvable.' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Session invalide ou expirée.' });
  }
}

app.get('/api', (_req, res) => {
  res.json({
    name: 'AGRILOC API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      login: 'POST /api/auth/login',
      me: '/api/auth/me',
      bootstrap: '/api/bootstrap',
      machines: '/api/machines',
      bookings: '/api/bookings',
      notifications: '/api/notifications'
    }
  });
});

app.get('/api/health', async (_req, res) => {
  try {
    await assertDatabaseReady();
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    res.status(503).json({ ok: false, database: 'unavailable', message: error.message });
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const row = rows[0];
    if (!row || !bcrypt.compareSync(password || '', row.password_hash)) {
      res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
      return;
    }

    const user = mapUser(row);
    res.json({ user, token: signUser(user) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { role, fullName, companyName, email, phone, password, city, region } = req.body;
    if (!role || !fullName || !email || !phone || !password || !city || !region) {
      res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }
    if (role !== 'farmer' && role !== 'supplier') {
      res.status(400).json({ message: 'Rôle invalide.' });
      return;
    }
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      return;
    }
    const id = `u-${Date.now()}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const initials = fullName
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

    await pool.query(
      `INSERT INTO users 
       (id, role, full_name, company_name, email, phone, password_hash, city, region, avatar_initials, is_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [id, role, fullName, companyName || null, email, phone, passwordHash, city, region, initials]
    );

    const user = {
      id,
      role,
      fullName,
      companyName: companyName || null,
      email,
      phone,
      city,
      region,
      avatarInitials: initials,
      isVerified: true
    };
    res.status(201).json({ user, token: signUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json(req.user);
});

app.get('/api/test-accounts', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, role, full_name, company_name, email, city, region
       FROM users
       ORDER BY FIELD(role, 'farmer', 'supplier', 'admin'), full_name`
    );
    res.json(rows.map(row => ({
      id: row.id,
      role: row.role,
      name: row.full_name,
      companyName: row.company_name,
      email: row.email,
      password: row.role === 'admin' ? 'admin123' : 'password123',
      city: row.city,
      region: row.region
    })));
  } catch (error) {
    next(error);
  }
});

app.get('/api/bootstrap', async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const [machines] = await pool.query(machineSelectSql());
    const [bookings] = await pool.query(bookingSelectSql());
    const [notifications] = userId
      ? await pool.query('SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC, id DESC', [userId])
      : await pool.query('SELECT * FROM notifications ORDER BY created_at DESC, id DESC');
    const [users] = await pool.query('SELECT * FROM users ORDER BY created_at ASC');

    res.json({
      users: users.map(mapUser),
      machines: machines.map(mapMachine),
      bookings: bookings.map(mapBooking),
      notifications: notifications.map(mapNotification)
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/machines', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(machineSelectSql('ORDER BY m.created_at DESC, m.id DESC'));
    res.json(rows.map(mapMachine));
  } catch (error) {
    next(error);
  }
});

app.post('/api/machines', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'supplier' && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Seuls les fournisseurs peuvent publier une machine.' });
      return;
    }

    const machine = {
      id: req.body.id || `m-${Date.now()}`,
      supplierId: req.body.supplierId || req.user.id,
      name: req.body.name,
      category: req.body.category,
      brand_model: req.body.brand_model || '',
      power_hp: req.body.power_hp || null,
      daily_price: Number(req.body.daily_price || 0),
      location_city: req.body.location_city,
      location_region: req.body.location_region,
      description: req.body.description || '',
      images: req.body.images?.length ? req.body.images : ['/machines/massey-ferguson-375.png'],
      status: req.body.status || 'available',
      average_rating: Number(req.body.average_rating || 5)
    };

    await pool.query(
      `INSERT INTO machines
       (id, supplier_id, name, category, brand_model, power_hp, daily_price, location_city, location_region, description, images, status, average_rating)
       VALUES (:id, :supplierId, :name, :category, :brand_model, :power_hp, :daily_price, :location_city, :location_region, :description, :images, :status, :average_rating)`,
      { ...machine, images: JSON.stringify(machine.images) }
    );

    const [rows] = await pool.query(`${machineSelectSql()} WHERE m.id = ?`, [machine.id]);
    res.status(201).json(mapMachine(rows[0]));
  } catch (error) {
    next(error);
  }
});

app.post('/api/bookings', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'farmer' && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Seuls les agriculteurs peuvent réserver.' });
      return;
    }

    const booking = {
      id: req.body.id || `b-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: req.body.farmerId || req.user.id,
      machineId: req.body.machineId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      totalDays: Number(req.body.totalDays),
      totalPrice: Number(req.body.totalPrice),
      status: 'pending',
      deliveryRequired: Boolean(req.body.deliveryRequired),
      deliveryAddress: req.body.deliveryAddress || ''
    };

    await pool.query(
      `INSERT INTO bookings
       (id, farmer_id, machine_id, start_date, end_date, total_days, total_price, status, delivery_required, delivery_address)
       VALUES (:id, :farmerId, :machineId, :startDate, :endDate, :totalDays, :totalPrice, :status, :deliveryRequired, :deliveryAddress)`,
      booking
    );

    const [rows] = await pool.query(`${bookingSelectSql()} WHERE b.id = ?`, [booking.id]);
    res.status(201).json(mapBooking(rows[0]));
  } catch (error) {
    next(error);
  }
});

app.patch('/api/bookings/:id/status', requireAuth, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { status, payment } = req.body;
    const validStatuses = new Set(['pending', 'confirmed', 'ongoing', 'completed', 'cancelled']);
    if (!validStatuses.has(status)) {
      res.status(400).json({ message: 'Statut invalide.' });
      return;
    }

    await connection.beginTransaction();
    const [rows] = await connection.query(
      `SELECT b.*, m.supplier_id
       FROM bookings b
       JOIN machines m ON m.id = b.machine_id
       WHERE b.id = ?
       FOR UPDATE`,
      [req.params.id]
    );

    if (!rows.length) {
      await connection.rollback();
      res.status(404).json({ message: 'Réservation introuvable.' });
      return;
    }

    const booking = rows[0];
    const canManage = req.user.role === 'admin'
      || booking.farmer_id === req.user.id
      || booking.supplier_id === req.user.id;
    if (!canManage) {
      await connection.rollback();
      res.status(403).json({ message: 'Accès refusé pour cette réservation.' });
      return;
    }

    await connection.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);

    if (status === 'ongoing' && payment) {
      await connection.query(
        `INSERT INTO payments (id, booking_id, provider, amount, currency, status, last4, receipt)
         VALUES (?, ?, ?, ?, 'XOF', 'captured', ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), receipt = VALUES(receipt)`,
        [payment.id, req.params.id, payment.method, Number(payment.amount), payment.last4 || null, JSON.stringify(payment)]
      );
    }

    if (status === 'confirmed' || status === 'ongoing') {
      await connection.query('UPDATE machines SET status = ? WHERE id = ?', ['rented', booking.machine_id]);
    }
    if (status === 'cancelled' || status === 'completed') {
      await connection.query('UPDATE machines SET status = ? WHERE id = ?', ['available', booking.machine_id]);
    }

    await connection.commit();
    const [updatedRows] = await pool.query(`${bookingSelectSql()} WHERE b.id = ?`, [req.params.id]);
    res.json(mapBooking(updatedRows[0]));
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

app.post('/api/notifications', requireAuth, async (req, res, next) => {
  try {
    const notification = {
      id: req.body.id || `n-${Date.now()}`,
      userId: req.body.userId || req.user.id,
      text: req.body.text,
      time: req.body.time || 'À l\'instant',
      isRead: Boolean(req.body.isRead),
      targetPage: req.body.targetPage || 'home'
    };

    await pool.query(
      `INSERT INTO notifications (id, user_id, text, time_label, is_read, target_page)
       VALUES (:id, :userId, :text, :time, :isRead, :targetPage)`,
      notification
    );

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/notifications/read', requireAuth, async (req, res, next) => {
  try {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ? OR user_id IS NULL', [req.user.id]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

function machineSelectSql(order = 'ORDER BY m.created_at ASC, m.id ASC') {
  return `
    SELECT m.*, u.full_name AS supplier_name, u.company_name AS supplier_company,
           u.city AS supplier_city, u.region AS supplier_region
    FROM machines m
    JOIN users u ON u.id = m.supplier_id
    ${order}
  `;
}

function bookingSelectSql(order = 'ORDER BY b.created_at DESC, b.id DESC') {
  return `
    SELECT b.*, f.full_name AS farmer_name, f.city AS farmer_city, f.region AS farmer_region,
           p.receipt AS payment_receipt
    FROM bookings b
    JOIN users f ON f.id = b.farmer_id
    LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'captured'
    ${order}
  `;
}

// Serve static assets from the React build
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback all non-API requests to React index.html for client-side routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Erreur serveur AGRILOC.', detail: error.message });
});

app.listen(port, () => {
  console.log(`AGRILOC API ready on http://0.0.0.0:${port}`);
});
