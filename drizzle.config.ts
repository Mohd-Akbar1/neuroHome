import { DrizzleConfig } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config(); 

export default {
  dialect: "postgresql", 
  schema: "./src/db/schema.ts",
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL as string, 
  },
}
