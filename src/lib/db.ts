import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_ufA7LNWO3tBH@ep-orange-glade-b367lj3v-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

export const sql = neon(connectionString);
