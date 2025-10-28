import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1761677589281 implements MigrationInterface {
    name = 'InitialSchema1761677589281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "expenses" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "price" numeric NOT NULL, "date" TIMESTAMP NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "categoryId" integer NOT NULL, "bankCardId" integer, CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank_cards" ("id" SERIAL NOT NULL, "bank_name" character varying NOT NULL, "card_number" character varying(16) NOT NULL, "balance" integer DEFAULT '0', "userId" integer, CONSTRAINT "PK_1fce641a809c455751dbebc8d01" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "incomes" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "price" numeric NOT NULL, "date" TIMESTAMP NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "categoryId" integer NOT NULL, "bankCardId" integer, CONSTRAINT "PK_d737b3d0314c1f0da5461a55e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."categories_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" "public"."categories_type_enum" NOT NULL, "icon" character varying, "userId" integer, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notes" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."receivables-debts_type_enum" AS ENUM('receivable', 'debt')`);
        await queryRunner.query(`CREATE TYPE "public"."receivables-debts_status_enum" AS ENUM('pendding', 'paid')`);
        await queryRunner.query(`CREATE TABLE "receivables-debts" ("id" SERIAL NOT NULL, "type" "public"."receivables-debts_type_enum" NOT NULL, "price" integer NOT NULL, "status" "public"."receivables-debts_status_enum" NOT NULL DEFAULT 'pendding', "person" character varying NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_580e651a7e3fa2e798f505104e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."checks_type_enum" AS ENUM('pay', 'receive')`);
        await queryRunner.query(`CREATE TYPE "public"."checks_status_enum" AS ENUM('pendding', 'paid', 'returned')`);
        await queryRunner.query(`CREATE TABLE "checks" ("id" SERIAL NOT NULL, "type" "public"."checks_type_enum" NOT NULL, "status" "public"."checks_status_enum" NOT NULL DEFAULT 'pendding', "price" numeric NOT NULL, "bank" character varying NOT NULL, "payable" character varying NOT NULL, "issued" TIMESTAMP NOT NULL, "due_date" TIMESTAMP NOT NULL, "serial" character varying, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_5b78bc7432d3654a701ca5f35e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."installments_status_enum" AS ENUM('pendding', 'paid')`);
        await queryRunner.query(`CREATE TABLE "installments" ("id" SERIAL NOT NULL, "price" numeric NOT NULL, "status" "public"."installments_status_enum" NOT NULL DEFAULT 'pendding', "due_date" TIMESTAMP NOT NULL, "loanId" integer, CONSTRAINT "PK_c74e44aa06bdebef2af0a93da1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."loans_status_enum" AS ENUM('pendding', 'paid')`);
        await queryRunner.query(`CREATE TYPE "public"."loans_period_installment_enum" AS ENUM('weekly', 'monthly', 'yearly')`);
        await queryRunner.query(`CREATE TABLE "loans" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "giver_name" character varying NOT NULL, "total_price" numeric NOT NULL, "description" character varying, "status" "public"."loans_status_enum" NOT NULL DEFAULT 'pendding', "count_installment" integer NOT NULL, "first_date_installment" TIMESTAMP NOT NULL, "period_installment" "public"."loans_period_installment_enum" NOT NULL DEFAULT 'monthly', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_5c6942c1e13e4de135c5203ee61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reminders_type_enum" AS ENUM('check', 'loan')`);
        await queryRunner.query(`CREATE TABLE "reminders" ("id" SERIAL NOT NULL, "type" "public"."reminders_type_enum" NOT NULL, "is_sent" boolean NOT NULL DEFAULT false, "dueDates" jsonb NOT NULL, "entity_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_38715fec7f634b72c6cf7ea4893" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "phone" character varying(11) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."watchlists_status_enum" AS ENUM('pendding', 'purchased')`);
        await queryRunner.query(`CREATE TYPE "public"."watchlists_waiting_period_enum" AS ENUM('day', 'week', 'month', 'year')`);
        await queryRunner.query(`CREATE TABLE "watchlists" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "total_price" integer, "status" "public"."watchlists_status_enum" NOT NULL DEFAULT 'pendding', "waiting_period" "public"."watchlists_waiting_period_enum" NOT NULL, "current_budget" integer NOT NULL, "required_savings_per_day" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_aa3c717b50a10f7a435c65eda5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."watchlist_items_status_enum" AS ENUM('pendding', 'purchased')`);
        await queryRunner.query(`CREATE TABLE "watchlist_items" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "price" integer NOT NULL, "description" character varying, "count" integer NOT NULL DEFAULT '1', "status" "public"."watchlist_items_status_enum" NOT NULL DEFAULT 'pendding', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "watchlistId" integer, CONSTRAINT "PK_0a02323c5cc02e094871f24062b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_3d211de716f0f14ea7a8a4b1f2c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_ac0801a1760c5f9ce43c03bacd0" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_d801d3aef1918b65cd1113a0b27" FOREIGN KEY ("bankCardId") REFERENCES "bank_cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_cards" ADD CONSTRAINT "FK_aa293113503ae2172047740f2a8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incomes" ADD CONSTRAINT "FK_f6b7c6bbe04a203dfc67ae627ab" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incomes" ADD CONSTRAINT "FK_fbef3dc1374cddde596333d66f0" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incomes" ADD CONSTRAINT "FK_adba53ad3819ebe1ccedc3f8b7e" FOREIGN KEY ("bankCardId") REFERENCES "bank_cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_829532ff766505ad7c71592c6a5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receivables-debts" ADD CONSTRAINT "FK_35de32591c0b6e8fe1c7dd4c595" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checks" ADD CONSTRAINT "FK_9322f6d3b398e243aaef8d0b1b8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "installments" ADD CONSTRAINT "FK_b900fc2e2dd7f457a32fdd52850" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_4c2ab4e556520045a2285916d45" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminders" ADD CONSTRAINT "FK_f8e4bc520d9e692652afaf3308b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watchlists" ADD CONSTRAINT "FK_4ee2b11c974ca3f516a391e1543" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watchlist_items" ADD CONSTRAINT "FK_710da2b72379823ed515e5ea9eb" FOREIGN KEY ("watchlistId") REFERENCES "watchlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "watchlist_items" DROP CONSTRAINT "FK_710da2b72379823ed515e5ea9eb"`);
        await queryRunner.query(`ALTER TABLE "watchlists" DROP CONSTRAINT "FK_4ee2b11c974ca3f516a391e1543"`);
        await queryRunner.query(`ALTER TABLE "reminders" DROP CONSTRAINT "FK_f8e4bc520d9e692652afaf3308b"`);
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_4c2ab4e556520045a2285916d45"`);
        await queryRunner.query(`ALTER TABLE "installments" DROP CONSTRAINT "FK_b900fc2e2dd7f457a32fdd52850"`);
        await queryRunner.query(`ALTER TABLE "checks" DROP CONSTRAINT "FK_9322f6d3b398e243aaef8d0b1b8"`);
        await queryRunner.query(`ALTER TABLE "receivables-debts" DROP CONSTRAINT "FK_35de32591c0b6e8fe1c7dd4c595"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_829532ff766505ad7c71592c6a5"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741"`);
        await queryRunner.query(`ALTER TABLE "incomes" DROP CONSTRAINT "FK_adba53ad3819ebe1ccedc3f8b7e"`);
        await queryRunner.query(`ALTER TABLE "incomes" DROP CONSTRAINT "FK_fbef3dc1374cddde596333d66f0"`);
        await queryRunner.query(`ALTER TABLE "incomes" DROP CONSTRAINT "FK_f6b7c6bbe04a203dfc67ae627ab"`);
        await queryRunner.query(`ALTER TABLE "bank_cards" DROP CONSTRAINT "FK_aa293113503ae2172047740f2a8"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_d801d3aef1918b65cd1113a0b27"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_ac0801a1760c5f9ce43c03bacd0"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_3d211de716f0f14ea7a8a4b1f2c"`);
        await queryRunner.query(`DROP TABLE "watchlist_items"`);
        await queryRunner.query(`DROP TYPE "public"."watchlist_items_status_enum"`);
        await queryRunner.query(`DROP TABLE "watchlists"`);
        await queryRunner.query(`DROP TYPE "public"."watchlists_waiting_period_enum"`);
        await queryRunner.query(`DROP TYPE "public"."watchlists_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "reminders"`);
        await queryRunner.query(`DROP TYPE "public"."reminders_type_enum"`);
        await queryRunner.query(`DROP TABLE "loans"`);
        await queryRunner.query(`DROP TYPE "public"."loans_period_installment_enum"`);
        await queryRunner.query(`DROP TYPE "public"."loans_status_enum"`);
        await queryRunner.query(`DROP TABLE "installments"`);
        await queryRunner.query(`DROP TYPE "public"."installments_status_enum"`);
        await queryRunner.query(`DROP TABLE "checks"`);
        await queryRunner.query(`DROP TYPE "public"."checks_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."checks_type_enum"`);
        await queryRunner.query(`DROP TABLE "receivables-debts"`);
        await queryRunner.query(`DROP TYPE "public"."receivables-debts_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."receivables-debts_type_enum"`);
        await queryRunner.query(`DROP TABLE "notes"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`);
        await queryRunner.query(`DROP TABLE "incomes"`);
        await queryRunner.query(`DROP TABLE "bank_cards"`);
        await queryRunner.query(`DROP TABLE "expenses"`);
    }

}
