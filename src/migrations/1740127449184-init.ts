import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1740127449184 implements MigrationInterface {
    name = 'Init1740127449184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(500) NOT NULL, \`username\` varchar(500) NOT NULL, \`type\` varchar(500) NOT NULL, \`password\` varchar(500) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brands\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`userName\` varchar(500) NOT NULL, \`name\` varchar(500) NOT NULL, \`image\` varchar(500) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`userName\` varchar(500) NOT NULL, \`name\` varchar(500) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`name\` varchar(500) NOT NULL, \`slug\` varchar(500) NOT NULL, \`gender\` varchar(500) NOT NULL, \`size\` varchar(500) NOT NULL, \`price\` float NOT NULL, \`image\` varchar(500) NOT NULL, \`mainNote\` varchar(500) NOT NULL, \`description\` text NOT NULL, \`available\` tinyint NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`brandId\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`selectionsItem\` (\`id\` int NOT NULL AUTO_INCREMENT, \`selectionId\` int NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`selections\` (\`id\` int NOT NULL AUTO_INCREMENT, \`position\` int NOT NULL, \`userId\` int NOT NULL, \`userName\` varchar(500) NOT NULL, \`name\` varchar(500) NOT NULL, \`description\` varchar(500) NOT NULL, \`slug\` varchar(500) NOT NULL, \`visible\` tinyint NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clients\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(500) NOT NULL, \`lastName\` varchar(500) NOT NULL, \`phoneNumber\` varchar(20) NOT NULL, \`email\` varchar(500) NOT NULL, \`password\` varchar(500) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`communes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(500) NOT NULL, \`deliveryFees\` float NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phoneNumber\` varchar(500) NOT NULL, \`email\` varchar(500) NOT NULL, \`address\` varchar(500) NOT NULL, \`reference\` varchar(500) NOT NULL, \`total\` float NOT NULL, \`deliveryFees\` float NOT NULL, \`serviceFees\` float NOT NULL, \`comment\` varchar(500) NULL, \`invoice\` varchar(500) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`status\` varchar(500) NOT NULL, \`clientId\` int NULL, \`communeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ordersItem\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(500) NOT NULL, \`image\` varchar(500) NOT NULL, \`price\` float NOT NULL, \`quantity\` float NOT NULL, \`total\` float NOT NULL, \`size\` varchar(500) NOT NULL, \`orderId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carousels\` (\`id\` int NOT NULL AUTO_INCREMENT, \`position\` int NOT NULL, \`userId\` int NOT NULL, \`userName\` varchar(500) NOT NULL, \`image\` varchar(500) NOT NULL, \`name\` varchar(500) NOT NULL, \`description\` varchar(500) NOT NULL, \`slug\` varchar(500) NOT NULL, \`visible\` tinyint NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carouselsItem\` (\`id\` int NOT NULL AUTO_INCREMENT, \`carouselId\` int NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ea86d0c514c4ecbb5694cbf57df\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`selectionsItem\` ADD CONSTRAINT \`FK_80b6e5f999d911b11903af6c1bf\` FOREIGN KEY (\`selectionId\`) REFERENCES \`selections\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`selectionsItem\` ADD CONSTRAINT \`FK_8246123cff32e869c00be705270\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1457f286d91f271313fded23e53\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_ce29e44ce6db2e7c1b1b4c6de89\` FOREIGN KEY (\`communeId\`) REFERENCES \`communes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ordersItem\` ADD CONSTRAINT \`FK_4c5a9f79a28601a5698bee66455\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carouselsItem\` ADD CONSTRAINT \`FK_f012fab3410210355e73fd943c9\` FOREIGN KEY (\`carouselId\`) REFERENCES \`carousels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carouselsItem\` ADD CONSTRAINT \`FK_fe4809e4d2f2b58e63fd4e50fec\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`carouselsItem\` DROP FOREIGN KEY \`FK_fe4809e4d2f2b58e63fd4e50fec\``);
        await queryRunner.query(`ALTER TABLE \`carouselsItem\` DROP FOREIGN KEY \`FK_f012fab3410210355e73fd943c9\``);
        await queryRunner.query(`ALTER TABLE \`ordersItem\` DROP FOREIGN KEY \`FK_4c5a9f79a28601a5698bee66455\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_ce29e44ce6db2e7c1b1b4c6de89\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1457f286d91f271313fded23e53\``);
        await queryRunner.query(`ALTER TABLE \`selectionsItem\` DROP FOREIGN KEY \`FK_8246123cff32e869c00be705270\``);
        await queryRunner.query(`ALTER TABLE \`selectionsItem\` DROP FOREIGN KEY \`FK_80b6e5f999d911b11903af6c1bf\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ea86d0c514c4ecbb5694cbf57df\``);
        await queryRunner.query(`DROP TABLE \`carouselsItem\``);
        await queryRunner.query(`DROP TABLE \`carousels\``);
        await queryRunner.query(`DROP TABLE \`ordersItem\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`communes\``);
        await queryRunner.query(`DROP TABLE \`clients\``);
        await queryRunner.query(`DROP TABLE \`selections\``);
        await queryRunner.query(`DROP TABLE \`selectionsItem\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`brands\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
