-- Preferível: na pasta do projeto, com DATABASE_URL no .env.local: `npm run db:migrate`
-- Se a CLI falhar: executar UMA vez no Neon → SQL Editor → colar → Run.
-- Não misturar com `db:migrate` já aplicado (as tabelas já existem).

CREATE TABLE "costs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"date" timestamp NOT NULL,
	"descricao" text,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"quantidade_animais" integer NOT NULL,
	"peso_bruto" numeric(10, 2) NOT NULL,
	"peso_liquido" numeric(10, 2) NOT NULL,
	"arrobas" numeric(10, 2) NOT NULL,
	"preco_arroba" numeric(10, 2) NOT NULL,
	"valor_total" numeric(12, 2) NOT NULL,
	"observacao" text,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_subscription_id" text,
	"status" text NOT NULL,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"stripe_customer_id" text,
	"subscription_status" text DEFAULT 'inactive',
	"trial_ends_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "costs" ADD CONSTRAINT "costs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id");
