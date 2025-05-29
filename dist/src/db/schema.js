"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulbStates = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.bulbStates = (0, pg_core_1.pgTable)('bulb_states', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    kitchen: (0, pg_core_1.boolean)('kitchen').notNull().default(false),
    bedroom: (0, pg_core_1.boolean)('bedroom').notNull().default(false),
    hall: (0, pg_core_1.boolean)('hall').notNull().default(false),
});
//# sourceMappingURL=schema.js.map