import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateShortUrl1753908680529 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'short_urls',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'originalUrl',
            type: 'varchar',
            length: '2048',
          },
          {
            name: 'shortCode',
            type: 'varchar',
            length: '6',
            isUnique: true,
          },
          {
            name: 'clickCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'short_urls',
      new TableIndex({
        name: 'IDX_SHORT_URLS_USER_ID',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'short_urls',
      new TableIndex({
        name: 'IDX_SHORT_URLS_SHORT_CODE',
        columnNames: ['shortCode'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('short_urls', 'IDX_SHORT_URLS_USER_ID');
    await queryRunner.dropIndex('short_urls', 'IDX_SHORT_URLS_SHORT_CODE');
    await queryRunner.dropTable('short_urls');
  }
}
