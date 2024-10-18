import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class BaseMigration1705466369823 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
