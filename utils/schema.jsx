import { pgTable, serial, varchar, integer} from "drizzle-orm/pg-core";


export const Budgets = pgTable("budgets", {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: integer('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('created_by').notNull()
})
