import {
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const bookingStatus = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "expired",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "authorized",
  "paid",
  "denied",
  "cancelled",
  "expired",
  "refunded",
  "partial_refund",
]);

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: varchar("order_id", { length: 64 }).notNull().unique(),
  accommodationId: varchar("accommodation_id", { length: 64 }).notNull(),
  guestName: varchar("guest_name", { length: 120 }).notNull(),
  guestEmail: varchar("guest_email", { length: 255 }).notNull(),
  guestPhone: varchar("guest_phone", { length: 32 }).notNull(),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  guestCount: integer("guest_count").notNull(),
  totalAmount: integer("total_amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("IDR"),
  status: bookingStatus("status").notNull().default("pending"),
  paymentStatus: paymentStatus("payment_status").notNull().default("pending"),
  midtransTransactionId: varchar("midtrans_transaction_id", { length: 64 }),
  snapToken: text("snap_token"),
  snapRedirectUrl: text("snap_redirect_url"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const paymentNotifications = pgTable("payment_notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  transactionStatus: varchar("transaction_status", { length: 32 }).notNull(),
  fraudStatus: varchar("fraud_status", { length: 32 }),
  payload: jsonb("payload").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
