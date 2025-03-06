CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"hash_password" varchar NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
