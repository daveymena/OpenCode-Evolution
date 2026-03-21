import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull().unique(),
  description: text("description"),
  type: text("type"), // web, python, app, etc.
  notes: text("notes"), // Global knowledge about this project
  metadata: jsonb("metadata").$type<{
    framework?: string;
    lastStartedAt?: string;
    gitRepo?: string;
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workspaceStateTable = pgTable("workspace_state", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g. "active_project_id", "last_open_file"
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;

export const insertWorkspaceStateSchema = createInsertSchema(workspaceStateTable).omit({ id: true, updatedAt: true });
export type InsertWorkspaceState = z.infer<typeof insertWorkspaceStateSchema>;
export type WorkspaceState = typeof workspaceStateTable.$inferSelect;
