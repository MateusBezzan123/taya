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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const entities_entity_1 = require("./entities/entities.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AppController = class AppController {
    constructor(proposalRepository, userRepository) {
        this.proposalRepository = proposalRepository;
        this.userRepository = userRepository;
    }
    async getRefusedProposals(req) {
        const refusedProposals = await this.proposalRepository.find({
            where: { userCreator: { id: req.user.id }, status: entities_entity_1.ProposalStatus.REFUSED },
            relations: ['userCreator'],
        });
        return refusedProposals;
    }
    async getProposalById(id, req) {
        const proposal = await this.proposalRepository.findOne({
            where: { id },
            relations: ['userCreator'],
        });
        if (!proposal || proposal.userCreator.id !== req.user.id) {
            throw new common_1.NotFoundException('Proposta não encontrada ou você não tem permissão para visualizá-la.');
        }
        return proposal;
    }
    async getPendingProposals(req) {
        const pendingProposals = await this.proposalRepository.find({
            where: { userCreator: { id: req.user.id }, status: entities_entity_1.ProposalStatus.PENDING },
            relations: ['userCreator'],
        });
        return pendingProposals;
    }
    async approveProposal(proposalId, req) {
        const proposalIdNumber = parseInt(proposalId, 10);
        if (isNaN(proposalIdNumber)) {
            throw new common_1.BadRequestException('ID da proposta inválido');
        }
        const proposal = await this.proposalRepository.findOne({
            where: { id: proposalIdNumber },
            relations: ['userCreator'],
        });
        if (!proposal) {
            throw new common_1.NotFoundException('Proposta não encontrada.');
        }
        if (proposal.status !== entities_entity_1.ProposalStatus.PENDING) {
            throw new common_1.BadRequestException('Somente propostas com status PENDING podem ser aprovadas.');
        }
        proposal.status = entities_entity_1.ProposalStatus.SUCCESSFUL;
        req.user.balance += proposal.profit;
        await this.proposalRepository.save(proposal);
        await this.userRepository.save(req.user);
        return proposal;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('/proposals/refused'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getRefusedProposals", null);
__decorate([
    (0, common_1.Get)('/proposals/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getProposalById", null);
__decorate([
    (0, common_1.Get)('/proposals'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPendingProposals", null);
__decorate([
    (0, common_1.Post)('/proposals/:proposal_id/approve'),
    __param(0, (0, common_1.Param)('proposal_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "approveProposal", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_entity_1.Proposal)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AppController);
//# sourceMappingURL=app.controller.js.map