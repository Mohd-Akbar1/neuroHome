CREATE TABLE "bulb_states" (
	"id" serial PRIMARY KEY NOT NULL,
	"kitchen" boolean DEFAULT false NOT NULL,
	"bedroom" boolean DEFAULT false NOT NULL,
	"hall" boolean DEFAULT false NOT NULL
);
