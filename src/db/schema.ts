import {
  pgTable,
  uuid,
  text,
  decimal,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sales = pgTable("sales", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  quantidadeAnimais: integer("quantidade_animais").notNull(),
  pesoBruto: decimal("peso_bruto", { precision: 10, scale: 2 }).notNull(),
  pesoLiquido: decimal("peso_liquido", { precision: 10, scale: 2 }).notNull(),
  arrobas: decimal("arrobas", { precision: 10, scale: 2 }).notNull(),
  precoArroba: decimal("preco_arroba", { precision: 10, scale: 2 }).notNull(),
  valorTotal: decimal("valor_total", { precision: 12, scale: 2 }).notNull(),
  observacao: text("observacao"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const costs = pgTable("costs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tipo: text("tipo").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  descricao: text("descricao"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  status: text("status").notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
});
