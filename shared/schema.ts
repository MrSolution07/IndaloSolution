import { pgTable, text, serial, integer, boolean, timestamp, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("consumer"),
  fullName: text("full_name"),
  company: text("company"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  fullName: true,
  company: true,
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").notNull(),
  producer: text("producer").notNull(),
  region: text("region").notNull(),
  year: text("year"),
  alcohol: text("alcohol"),
  volume: text("volume"),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
  isVerified: boolean("is_verified").default(true).notNull(),
  blockchainId: text("blockchain_id").unique(),
  tastingNotes: text("tasting_notes"),
  pairings: text("pairings"),
  producerInfo: text("producer_info"),
  awards: text("awards"),
  certifications: text("certifications").array(),
  sustainabilityInfo: text("sustainability_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  categoryId: true,
  producer: true,
  region: true,
  year: true,
  alcohol: true,
  volume: true,
  price: true,
  imageUrl: true,
  isVerified: true,
  blockchainId: true,
  tastingNotes: true,
  pairings: true,
  producerInfo: true,
  awards: true,
  certifications: true,
  sustainabilityInfo: true,
});

// Supply Chain table
export const supplyChainEvents = pgTable("supply_chain_events", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  stage: text("stage").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  verifiedBy: text("verified_by").notNull(),
  blockchainRef: text("blockchain_ref"),
  icon: text("icon"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSupplyChainEventSchema = createInsertSchema(supplyChainEvents).pick({
  productId: true,
  stage: true,
  description: true,
  date: true,
  location: true,
  verifiedBy: true,
  blockchainRef: true,
  icon: true,
  metadata: true,
});

// Verification table
export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isValid: boolean("is_valid").notNull(),
  deviceInfo: text("device_info"),
  location: text("location"),
  ipAddress: text("ip_address"),
  metadata: json("metadata"),
});

export const insertVerificationSchema = createInsertSchema(verifications).pick({
  productId: true,
  userId: true,
  isValid: true,
  deviceInfo: true,
  location: true,
  ipAddress: true,
  metadata: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type SupplyChainEvent = typeof supplyChainEvents.$inferSelect;
export type InsertSupplyChainEvent = z.infer<typeof insertSupplyChainEventSchema>;

export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
