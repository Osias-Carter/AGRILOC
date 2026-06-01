CREATE DATABASE IF NOT EXISTS agriloc
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agriloc;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS machines;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id VARCHAR(32) PRIMARY KEY,
  role ENUM('farmer', 'supplier', 'admin') NOT NULL,
  full_name VARCHAR(160) NOT NULL,
  company_name VARCHAR(180) NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  phone VARCHAR(40) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  avatar_initials VARCHAR(8) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE machines (
  id VARCHAR(32) PRIMARY KEY,
  supplier_id VARCHAR(32) NOT NULL,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  brand_model VARCHAR(120),
  power_hp INT NULL,
  daily_price INT NOT NULL,
  location_city VARCHAR(100) NOT NULL,
  location_region VARCHAR(100) NOT NULL,
  description TEXT,
  images JSON NOT NULL,
  status ENUM('available', 'rented', 'maintenance') NOT NULL DEFAULT 'available',
  average_rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_machines_supplier
    FOREIGN KEY (supplier_id) REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE TABLE bookings (
  id VARCHAR(32) PRIMARY KEY,
  farmer_id VARCHAR(32) NOT NULL,
  machine_id VARCHAR(32) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INT NOT NULL,
  total_price INT NOT NULL,
  status ENUM('pending', 'confirmed', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  delivery_required BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_address VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_farmer
    FOREIGN KEY (farmer_id) REFERENCES users(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_bookings_machine
    FOREIGN KEY (machine_id) REFERENCES machines(id)
    ON DELETE RESTRICT
);

CREATE TABLE payments (
  id VARCHAR(40) PRIMARY KEY,
  booking_id VARCHAR(32) NOT NULL,
  provider ENUM('stripe', 'tmoney', 'flooz') NOT NULL,
  amount INT NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'XOF',
  status ENUM('authorized', 'captured', 'failed', 'refunded') NOT NULL DEFAULT 'captured',
  last4 VARCHAR(8) NULL,
  receipt JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_booking
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
    ON DELETE CASCADE
);

CREATE TABLE notifications (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(32) NULL,
  text VARCHAR(255) NOT NULL,
  time_label VARCHAR(40) NOT NULL DEFAULT 'À l''instant',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  target_page VARCHAR(40) NOT NULL DEFAULT 'home',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

INSERT INTO users (id, role, full_name, company_name, email, phone, password_hash, city, region, avatar_initials, is_verified, created_at)
VALUES
('u-farmer-1', 'farmer', 'Koffi Kouma', NULL, 'koffi@agriloc.test', '+22890123456', '$2b$10$uhc1ftTJ0mktvkP2SP1mNOGeF5OwjAEHcT6qnDjpe936ZBL80WNOm', 'Atakpamé', 'Plateaux', 'KK', TRUE, CURRENT_TIMESTAMP),
('u-farmer-2', 'farmer', 'Afi Mensah', NULL, 'afi@agriloc.test', '+22893112233', '$2b$10$uhc1ftTJ0mktvkP2SP1mNOGeF5OwjAEHcT6qnDjpe936ZBL80WNOm', 'Tsévié', 'Maritime', 'AM', TRUE, CURRENT_TIMESTAMP),
('u-supplier-1', 'supplier', 'Kodjo Amouzou', 'AgriTech Togo S.A.', 'supplier@agriloc.test', '+22890202020', '$2b$10$uhc1ftTJ0mktvkP2SP1mNOGeF5OwjAEHcT6qnDjpe936ZBL80WNOm', 'Lomé', 'Maritime', 'AT', TRUE, CURRENT_TIMESTAMP),
('u-supplier-2', 'supplier', 'Essowè Nadjo', 'Savane Agro Machines', 'savane@agriloc.test', '+22891212121', '$2b$10$uhc1ftTJ0mktvkP2SP1mNOGeF5OwjAEHcT6qnDjpe936ZBL80WNOm', 'Kara', 'Kara', 'SA', TRUE, CURRENT_TIMESTAMP),
('u-admin-1', 'admin', 'Admin AGRILOC', 'AGRILOC', 'admin@agriloc.test', '+22890000000', '$2b$10$FoYoIN4aOagaqy.YeUHqRejGXAoykGJk0w.81pz792aL703ya.rAC', 'Lomé', 'Maritime', 'AD', TRUE, CURRENT_TIMESTAMP);

INSERT INTO machines (id, supplier_id, name, category, brand_model, power_hp, daily_price, location_city, location_region, description, images, status, average_rating, created_at)
VALUES
('m1', 'u-supplier-1', 'Tracteur Massey Ferguson 375', 'Tracteur', 'MF-375 (75 HP)', 75, 75000, 'Atakpamé', 'Plateaux', 'Tracteur robuste de 75 chevaux pour labours profonds, hersage et préparation de grandes parcelles de maïs ou coton. Chauffeur inclus.', JSON_ARRAY('/machines/massey-ferguson-375.png'), 'available', 4.8, CURRENT_TIMESTAMP),
('m2', 'u-supplier-1', 'Motoculteur Kubota KRT140', 'Motoculteur', 'Kubota-KRT (14 HP)', 14, 25000, 'Tsévié', 'Maritime', 'Motoculteur agile pour maraîchage, riziculture irriguée et fraisage fin des sols. Roto-fraise et soc fournis.', JSON_ARRAY('/machines/kubota-krt140.png'), 'available', 4.6, CURRENT_TIMESTAMP),
('m3', 'u-supplier-1', 'Moissonneuse-batteuse John Deere W330', 'Moissonneuse', 'JD-W330 (185 HP)', 185, 150000, 'Sokodé', 'Centrale', 'Moissonneuse performante pour riz pluvial et maïs, avec chauffeur expert certifié et faible taux de perte.', JSON_ARRAY('/machines/john-deere-w330.png'), 'available', 4.9, CURRENT_TIMESTAMP),
('m4', 'u-supplier-2', 'Pulvérisateur Tracté Agrator 1200L', 'Pulvérisateur', 'Agrator-1200', NULL, 35000, 'Kara', 'Kara', 'Pulvérisateur grande capacité avec rampe 15m pour fertilisation et protection biologique des cotonniers.', JSON_ARRAY('/machines/agrator-1200l.png'), 'available', 4.5, CURRENT_TIMESTAMP),
('m5', 'u-supplier-2', 'Pompe d''irrigation Solaire LORENTZ', 'Pompe', 'Lorentz-PS2-150', NULL, 15000, 'Dapaong', 'Savanes', 'Système solaire complet pour irrigation maraîchère avec panneaux et tuyaux souples.', JSON_ARRAY('/machines/lorentz-pompe.png'), 'rented', 4.7, CURRENT_TIMESTAMP),
('m6', 'u-supplier-1', 'Tracteur New Holland TT75', 'Tracteur', 'TT75 4WD', 75, 68000, 'Kpalimé', 'Plateaux', 'Tracteur 4 roues motrices fiable pour labour, remorquage et transport de récoltes en zone vallonnée.', JSON_ARRAY('/machines/massey-ferguson-375.png'), 'available', 4.6, CURRENT_TIMESTAMP),
('m7', 'u-supplier-2', 'Semoir mécanique 6 rangs', 'Semoir', 'AgroSeed S6', NULL, 28000, 'Notsé', 'Plateaux', 'Semoir précis pour maïs, soja et sorgho. Réglage de densité et assistance opérateur inclus.', JSON_ARRAY('/machines/agrator-1200l.png'), 'available', 4.4, CURRENT_TIMESTAMP),
('m8', 'u-supplier-1', 'Décortiqueuse riz mobile', 'Décortiqueuse', 'RicePro Mobile 900', NULL, 42000, 'Aného', 'Maritime', 'Unité mobile pour décorticage de riz avec opérateur, rendement adapté aux coopératives villageoises.', JSON_ARRAY('/machines/john-deere-w330.png'), 'available', 4.5, CURRENT_TIMESTAMP),
('m9', 'u-supplier-2', 'Motopompe diesel Robin 3 pouces', 'Pompe', 'Robin PTD-306', NULL, 18000, 'Mango', 'Savanes', 'Motopompe diesel pour irrigation et drainage, idéale pour parcelles éloignées sans accès solaire.', JSON_ARRAY('/machines/lorentz-pompe.png'), 'maintenance', 4.2, CURRENT_TIMESTAMP),
('m10', 'u-supplier-1', 'Broyeur de résidus végétaux', 'Broyeur', 'BioMulch B500', NULL, 32000, 'Sokodé', 'Centrale', 'Broyeur mobile pour résidus de récolte, compostage et préparation de paillage agricole.', JSON_ARRAY('/machines/kubota-krt140.png'), 'available', 4.3, CURRENT_TIMESTAMP);

INSERT INTO bookings (id, farmer_id, machine_id, start_date, end_date, total_days, total_price, status, delivery_required, delivery_address, created_at)
VALUES
('b-9382', 'u-farmer-1', 'm5', '2026-05-24', '2026-05-26', 3, 49500, 'ongoing', TRUE, 'Champ de riz, Dapaong Sud'),
('b-5201', 'u-farmer-1', 'm2', '2026-05-15', '2026-05-16', 2, 55000, 'completed', FALSE, '', CURRENT_TIMESTAMP),
('b-7104', 'u-farmer-2', 'm3', '2026-06-10', '2026-06-12', 3, 495000, 'pending', TRUE, 'Coopérative de riz, Sokodé Est', CURRENT_TIMESTAMP),
('b-6840', 'u-farmer-1', 'm1', '2026-06-15', '2026-06-16', 2, 165000, 'confirmed', TRUE, 'Ferme Kouma, Atakpamé Nord', CURRENT_TIMESTAMP);

INSERT INTO payments (id, booking_id, provider, amount, currency, status, last4, receipt, created_at)
VALUES
('pay_DEMO9382', 'b-9382', 'flooz', 49500, 'XOF', 'captured', '3456', JSON_OBJECT('id', 'pay_DEMO9382', 'method', 'flooz', 'last4', '3456', 'amount', 49500, 'createdAt', '24/05/2026 09:30'), CURRENT_TIMESTAMP),
('pay_DEMO5201', 'b-5201', 'stripe', 55000, 'XOF', 'captured', '4242', JSON_OBJECT('id', 'pay_DEMO5201', 'method', 'stripe', 'last4', '4242', 'amount', 55000, 'createdAt', '15/05/2026 14:10'), CURRENT_TIMESTAMP);

INSERT INTO notifications (id, user_id, text, time_label, is_read, target_page, created_at)
VALUES
('n1', 'u-farmer-1', 'Bienvenue sur la plateforme AGRILOC Togo !', 'Il y a 2 jours', FALSE, 'home', CURRENT_TIMESTAMP),
('n2', 'u-farmer-1', 'Paiement Flooz validé pour la Pompe LORENTZ !', 'Il y a 3 heures', FALSE, 'farmer', CURRENT_TIMESTAMP),
('n3', 'u-supplier-1', 'Nouvelle demande de réservation pour la moissonneuse John Deere W330.', 'Il y a 1 heure', FALSE, 'supplier', CURRENT_TIMESTAMP),
('n4', 'u-admin-1', 'Base de démonstration prête pour validation hébergement.', 'À l''instant', FALSE, 'admin', CURRENT_TIMESTAMP);
