import { Controller, Get, Param, Req, NotFoundException, Post, BadRequestException } from '@nestjs/common';
import { Proposal, ProposalStatus, User } from './entities/entities.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  @Get('/proposals/refused')
  async getRefusedProposals(@Req() req: any): Promise<Proposal[]> {
    const refusedProposals = await this.proposalRepository.find({
      where: { userCreator: { id: req.user.id }, status: ProposalStatus.REFUSED },
      relations: ['userCreator'], 
    });

    return refusedProposals;
  }
  @Get('/proposals/:id')
  async getProposalById(
    @Param('id') id: number,
    @Req() req: any
  ): Promise<Proposal> {  
    const proposal = await this.proposalRepository.findOne({
      where: { id },
      relations: ['userCreator'],
    });

    if (!proposal || proposal.userCreator.id !== req.user.id) {
      throw new NotFoundException('Proposta não encontrada ou você não tem permissão para visualizá-la.');
    }

    return proposal;
  }

  @Get('/proposals')
  async getPendingProposals(@Req() req: any): Promise<Proposal[]> {
    const pendingProposals = await this.proposalRepository.find({
      where: { userCreator: { id: req.user.id }, status: ProposalStatus.PENDING },
      relations: ['userCreator'],
    });

    return pendingProposals;
  }

  @Post('/proposals/:proposal_id/approve')
  async approveProposal(
    @Param('proposal_id') proposalId: string,
    @Req() req: any
  ): Promise<Proposal> {
    const proposalIdNumber = parseInt(proposalId, 10);
    if (isNaN(proposalIdNumber)) {
      throw new BadRequestException('ID da proposta inválido');
    }

    const proposal = await this.proposalRepository.findOne({
      where: { id: proposalIdNumber },
      relations: ['userCreator'],
    });

    if (!proposal) {
      throw new NotFoundException('Proposta não encontrada.');
    }

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new BadRequestException('Somente propostas com status PENDING podem ser aprovadas.');
    }

    proposal.status = ProposalStatus.SUCCESSFUL;

    req.user.balance += proposal.profit;

    await this.proposalRepository.save(proposal);
    await this.userRepository.save(req.user);

    return proposal;
  }
}
