import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const schemaPath = path.resolve('database/schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

try {
  await connection.query(sql);
  console.log('Base AGRILOC initialisée avec succès.');
} finally {
  await connection.end();
}
