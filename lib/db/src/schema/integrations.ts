import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const integrationsTable = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // e.g., 'google_drive', 'google_calendar'
  accountEmail: text("account_email").notNull(),
  provider: text("provider").notNull(), // 'google', 'github', etc.
  credentials: jsonb("credentials").notNull(), // auth tokens or encrypted pwd (not recommended but for this task...)
  isActive: text("is_active").default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cloudFilesTable = pgTable("cloud_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  integrationId: uuid("integration_id").references(() => integrationsTable.id),
  fileId: text("file_id").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type"),
  mimeType: text("mime_type"),
  webLink: text("web_link"),
  metadata: jsonb("metadata"),
  lastSynced: timestamp("last_synced").defaultNow(),
});
