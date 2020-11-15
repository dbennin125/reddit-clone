import { Migration } from '@mikro-orm/migrations';

export class Migration20201115194002 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "password" text not null;');
  }

}
