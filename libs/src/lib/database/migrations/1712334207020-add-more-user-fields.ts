import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreUserFields1712334207020 implements MigrationInterface {
  name = 'AddMoreUserFields1712334207020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`mobile\` varchar(255) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_29fd51e9cf9241d022c5a4e02e\` (\`mobile\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`username\` varchar(255) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_16299c189fd85d0f88bf56b463\` ON \`user\` (\`email\`, \`mobile\`, \`username\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_16299c189fd85d0f88bf56b463\` ON \`user\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`username\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_29fd51e9cf9241d022c5a4e02e\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`mobile\``);
  }
}
