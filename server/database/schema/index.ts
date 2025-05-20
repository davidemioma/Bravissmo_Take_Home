import {
  pgTable,
  text,
  uuid,
  timestamp,
  pgEnum,
  real,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

export const ProductType = pgEnum("productType", [
  "Bras",
  "Swimwear",
  "Sports Bras",
  "Sports Wear",
  "Nightwear",
  "Vest Tops",
  "lingerie",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerkId").unique().notNull(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  images: varchar("images").array(),
  type: ProductType("productType").notNull(),
  color: text("color").notNull(),
  price: real("price").notNull(),
  quantity: real("quantity").default(0),
  sizes: text("sizes").array(),
  bandSizes: integer("bandSizes").array(),
  cupSizes: integer("cupSizes").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItem = pgTable("cartItem", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("productId")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  quantity: real("quantity").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("productId")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  comment: text("comment").notNull(),
  rating: real("rating").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
