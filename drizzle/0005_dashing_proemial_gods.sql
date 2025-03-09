ALTER TABLE "columns" ALTER COLUMN "type" SET DEFAULT 'string';--> statement-breakpoint
ALTER TABLE "columns" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "columns" ALTER COLUMN "required" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "columns" ALTER COLUMN "required" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rows" ALTER COLUMN "data" SET NOT NULL;