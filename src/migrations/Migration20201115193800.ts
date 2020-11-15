import { Migration } from "@mikro-orm/migrations";

export class Migration20201115193800 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "password_hash" to "email";');

    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");'
    );
  }
}
