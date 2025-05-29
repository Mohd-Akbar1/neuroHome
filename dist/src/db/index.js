"use strict";
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL as string,
// });
// export const db = drizzle(pool);
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Client } from "pg";
const schema = __importStar(require("../db/schema"));
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
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const connectionString = process.env.DATABASE_URL;
// Disable prefetch as it is not supported for "Transaction" pool mode
const client = (0, postgres_1.default)(connectionString, { prepare: false });
const postgresdb = (0, postgres_js_1.drizzle)(client, { schema: Object.assign({}, schema) });
exports.default = postgresdb;
//# sourceMappingURL=index.js.map