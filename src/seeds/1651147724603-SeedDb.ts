// Packages
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1651147724603 implements MigrationInterface {
  name = 'SeedDb1651147724603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`);

    // password is 123
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('cross', 'cross1@gmail.com', 
      '$2b$10$TL5P.Xcr804WLfzdxDTY...muRamnd8QCoF08tzYMc.MdM7rzMV.q')`,
    );

    await queryRunner.query(`INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
      VALUES ('first-article', 'First article', 'first article desc', 'first article body', 'coffee,dragons', 1)`);

    await queryRunner.query(`INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
      VALUES ('second-article', 'Second article', 'second article desc', 'second article body', 'coffee,dragons', 1)`);
  }

  public async down(): Promise<void> {
    return;
  }
}
