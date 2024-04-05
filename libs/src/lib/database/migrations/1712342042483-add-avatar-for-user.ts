import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarForUser1712342042483 implements MigrationInterface {
  name = 'AddAvatarForUser1712342042483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatarId\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_58f5c71eaab331645112cf8cfa\` (\`avatarId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_e0479c7972553f7b6e78361e931\``,
    );
    await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`taskId\` \`taskId\` varchar(255) NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_58f5c71eaab331645112cf8cfa\` ON \`user\` (\`avatarId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD CONSTRAINT \`FK_e0479c7972553f7b6e78361e931\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_58f5c71eaab331645112cf8cfa5\` FOREIGN KEY (\`avatarId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_58f5c71eaab331645112cf8cfa5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_e0479c7972553f7b6e78361e931\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_58f5c71eaab331645112cf8cfa\` ON \`user\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` CHANGE \`taskId\` \`taskId\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD CONSTRAINT \`FK_e0479c7972553f7b6e78361e931\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_58f5c71eaab331645112cf8cfa\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatarId\``);
  }
}
