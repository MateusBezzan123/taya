import { Controller, Get, Param, Post, Query, Req, NotFoundException } from '@nestjs/common';
import { ProposalStatus, Proposal, User } from './entities/entities.entity';
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

  @Get('/proposals/:id')
  async getProposalById(
    @Param('id') id: number,
    @Req() req: any
  ): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne({ where: { id }, relations: ['userCreator'] });
    if (!proposal || proposal.userCreator.id !== req.user.id) {
      throw new NotFoundException('Proposta não encontrada ou você não tem permissão para visualizá-la.');
    }
    return proposal;
  }

  @Get('/proposals')
  async getPendingProposals(@Req() req: any): Promise<Proposal[]> {
    return this.proposalRepository.find({
      where: { userCreator: req.user, status: ProposalStatus.PENDING },
    });
  }

  @Get('/proposals/refused')
  async getRefusedProposals(@Req() req: any): Promise<Proposal[]> {
    const proposals = await this.proposalRepository.find({
      where: { userCreator: req.user, status: ProposalStatus.REFUSED },
    });
  
    console.log('Refused Proposals:', proposals);
  
    return proposals;
  }
  
  @Post('/proposals/:proposal_id/approve')
  async approveProposal(
    @Param('proposal_id') proposalId: number,
    @Req() req: any
  ): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne({
      where: { id: proposalId, status: ProposalStatus.PENDING },
    });

    if (!proposal) {
      throw new NotFoundException('Proposta não encontrada ou já foi aprovada.');
    }

    // Aprovar a proposta
    proposal.status = ProposalStatus.SUCCESSFUL;
    await this.proposalRepository.save(proposal);

    // Atualizar o saldo do usuário
    const user = req.user as User;
    user.balance += proposal.profit;
    await this.userRepository.save(user);

    return proposal;
  }

  @Get('/admin/profit-by-status')
  async getProfitByStatus() {
    const result = await this.proposalRepository
      .createQueryBuilder('proposal')
      .select('proposal.status, SUM(proposal.profit) as totalProfit')
      .groupBy('proposal.status')
      .getRawMany();

    return result;
  }

  @Get('/admin/best-users')
  async getBestUsers(
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    const result = await this.proposalRepository
      .createQueryBuilder('proposal')
      .leftJoinAndSelect('proposal.userCreator', 'user')
      .select('user.id, user.name, SUM(proposal.profit) as totalProfit')
      .where('proposal.status = :status', { status: ProposalStatus.SUCCESSFUL })
      .andWhere('proposal.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('user.id')
      .orderBy('totalProfit', 'DESC')
      .getRawMany();

    return result.map(user => ({
      id: user.id,
      fullName: user.name,
      totalProposal: parseFloat(user.totalProfit),
    }));
  }
}
