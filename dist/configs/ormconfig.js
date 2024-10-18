"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const dotenv = require("dotenv");
const typeorm_1 = require("typeorm");
dotenv.config();
exports.dataSourceOptions = {
    type: 'sqlite',
    database: 'database.sqlite3',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrationsTableName: 'migrations',
    migrations: ['dist/migrations/*.js'],
    synchronize: true,
};
exports.default = new typeorm_1.DataSource(exports.dataSourceOptions);
//# sourceMappingURL=ormconfig.js.map