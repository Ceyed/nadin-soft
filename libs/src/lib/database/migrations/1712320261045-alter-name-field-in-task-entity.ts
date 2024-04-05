import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterNameFieldInTaskEntity1712320261045 implements MigrationInterface {
  name = 'AlterNameFieldInTaskEntity1712320261045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file\` CHANGE \`modifiedName\` \`originalName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`Path\` \`path\` varchar(255) NOT NULL`);
    // await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`originalName\``);
    // await queryRunner.query(`ALTER TABLE \`file\` ADD \`originalName\` varchar(255) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`originalName\``);
    // await queryRunner.query(`ALTER TABLE \`file\` ADD \`originalName\` varchar(255) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`file\` CHANGE \`originalName\` \`modifiedName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`path\` \`Path\` varchar(255) NOT NULL`);
  }
}
