"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proposal = exports.Customer = exports.User = exports.ProposalStatus = void 0;
const typeorm_1 = require("typeorm");
var ProposalStatus;
(function (ProposalStatus) {
    ProposalStatus["SUCCESSFUL"] = "SUCCESSFUL";
    ProposalStatus["REFUSED"] = "REFUSED";
    ProposalStatus["ERROR"] = "ERROR";
    ProposalStatus["PENDING"] = "PENDING";
})(ProposalStatus || (exports.ProposalStatus = ProposalStatus = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Customer, (customer) => customer.userCreator),
    __metadata("design:type", Array)
], User.prototype, "createdCustomers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Proposal, (proposal) => proposal.userCreator),
    __metadata("design:type", Array)
], User.prototype, "proposals", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'decimal', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], User);
let Customer = class Customer {
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, (user) => user.proposals),
    __metadata("design:type", User)
], Customer.prototype, "userCreator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Proposal, (proposal) => proposal.customer),
    __metadata("design:type", Array)
], Customer.prototype, "proposals", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Customer.prototype, "cpf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Customer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Customer.prototype, "updatedAt", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)({ name: 'customers' })
], Customer);
let Proposal = class Proposal {
};
exports.Proposal = Proposal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Proposal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, (user) => user.proposals),
    __metadata("design:type", User)
], Proposal.prototype, "userCreator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer, (customer) => customer.proposals),
    __metadata("design:type", Customer)
], Proposal.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'decimal', default: 0 }),
    __metadata("design:type", Number)
], Proposal.prototype, "profit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: 'varchar',
        default: ProposalStatus.PENDING,
    }),
    __metadata("design:type", String)
], Proposal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Proposal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Proposal.prototype, "updatedAt", void 0);
exports.Proposal = Proposal = __decorate([
    (0, typeorm_1.Entity)({ name: 'proposals' })
], Proposal);
//# sourceMappingURL=entities.entity.js.map