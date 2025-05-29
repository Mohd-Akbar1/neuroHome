// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL as string,
// });

// export const db = drizzle(pool);

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Client } from "pg";
import * as schema from "../db/schema"



// export let client = new Client({
//   host: envConfigs.db.host,
//   port: envConfigs.db.port,
//   user: envConfigs.db.user,
//   password: envConfigs.db.password,
//   database: envConfigs.db.database
// });

// export const client=new Client(process.env.DATABASE_URL as string)

// client.connect().then(()=>{
//   console.info("Postgress Client is Connected Successfully")
  
// }).catch((err:any)=>{
//   console.error("Error connecting DB : ",err)
  
// });



import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'


const connectionString = process.env.DATABASE_URL

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })



        

const postgresdb = drizzle(client,{schema:{...schema}});

export default postgresdb