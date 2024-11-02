import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from './schema';
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });


const sql = neon('postgresql://expensems_owner:LFRf8p1JvMCI@ep-dawn-fire-a5o9hwuk.us-east-2.aws.neon.tech/expensems?sslmode=require');
export const db = drizzle(sql, { schema });
