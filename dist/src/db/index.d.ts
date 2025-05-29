import postgres from 'postgres';
declare const postgresdb: import("drizzle-orm/postgres-js").PostgresJsDatabase<{
    bulbStates: import("drizzle-orm/pg-core").PgTableWithColumns<{
        name: "bulb_states";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/pg-core").PgColumn<{
                name: "id";
                tableName: "bulb_states";
                dataType: "number";
                columnType: "PgSerial";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: true;
                isPrimaryKey: true;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            kitchen: import("drizzle-orm/pg-core").PgColumn<{
                name: "kitchen";
                tableName: "bulb_states";
                dataType: "boolean";
                columnType: "PgBoolean";
                data: boolean;
                driverParam: boolean;
                notNull: true;
                hasDefault: true;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            bedroom: import("drizzle-orm/pg-core").PgColumn<{
                name: "bedroom";
                tableName: "bulb_states";
                dataType: "boolean";
                columnType: "PgBoolean";
                data: boolean;
                driverParam: boolean;
                notNull: true;
                hasDefault: true;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            hall: import("drizzle-orm/pg-core").PgColumn<{
                name: "hall";
                tableName: "bulb_states";
                dataType: "boolean";
                columnType: "PgBoolean";
                data: boolean;
                driverParam: boolean;
                notNull: true;
                hasDefault: true;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
        };
        dialect: "pg";
    }>;
}> & {
    $client: postgres.Sql<{}>;
};
export default postgresdb;
//# sourceMappingURL=index.d.ts.map