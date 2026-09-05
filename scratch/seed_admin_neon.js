const { neon } = require("@neondatabase/serverless");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_ufA7LNWO3tBH@ep-orange-glade-b367lj3v-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(connectionString);

async function seedAdmin() {
  console.log("Seeding admin into Neon DB...");

  // 1. Ensure users table exists
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 2. Insert admin into users table so it shows in the users table in Neon Console
  await sql`
    INSERT INTO users (full_name, phone, password)
    VALUES ('Quản Trị Viên Admin', 'admin', 'admin123@')
    ON CONFLICT (phone) 
    DO UPDATE SET 
      password = 'admin123@',
      full_name = 'Quản Trị Viên Admin';
  `;

  // 3. Ensure admins table also exists and contains admin
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    INSERT INTO admins (username, password)
    VALUES ('admin', 'admin123@')
    ON CONFLICT (username) 
    DO UPDATE SET password = 'admin123@';
  `;

  console.log("SUCCESS! Admin inserted into Neon PostgreSQL DB!");
  const users = await sql`SELECT id, full_name, phone, password, created_at FROM users;`;
  console.log("Users in Neon:", users);
}

seedAdmin().catch(console.error);
