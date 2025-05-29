import { pgTable, boolean, serial } from 'drizzle-orm/pg-core';

export const bulbStates = pgTable('bulb_states', {
  id: serial('id').primaryKey(),
  kitchen: boolean('kitchen').notNull().default(false),
  bedroom: boolean('bedroom').notNull().default(false),
  hall: boolean('hall').notNull().default(false),
});
