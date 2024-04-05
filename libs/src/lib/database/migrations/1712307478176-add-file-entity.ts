import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileEntity1712307478176 implements MigrationInterface {
  name = 'AddFileEntity1712307478176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`file\` (\`id\` varchar(36) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`modifiedName\` varchar(255) NOT NULL, \`link\` varchar(255) NOT NULL, \`Path\` varchar(255) NOT NULL, \`taskId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD CONSTRAINT \`FK_e0479c7972553f7b6e78361e931\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_e0479c7972553f7b6e78361e931\``,
    );
    await queryRunner.query(`DROP TABLE \`file\``);
  }
}
