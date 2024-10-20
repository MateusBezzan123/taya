import { Controller, Get, Param, Req, NotFoundException, Post, BadRequestException, Query } from '@nestjs/common';
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

  @Get('/admin/profit-by-status')
  async getProfitByStatus(): Promise<any> {

    const results = await this.proposalRepository
      .createQueryBuilder('proposal')
      .select('proposal.status', 'status')
      .addSelect('proposal.userCreator', 'userCreator')
      .addSelect('SUM(proposal.profit)', 'totalProfit')
      .innerJoin('proposal.userCreator', 'user')
      .groupBy('proposal.status')
      .addGroupBy('proposal.userCreator')
      .getRawMany();

    const groupedResults = results.map(result => ({
      status: result.status,
      userId: result.userCreator,
      totalProfit: parseFloat(result.totalProfit)
    }));

    return groupedResults;
  }


  @Get('/admin/best-users')
  async getBestUsers(
    @Query('start') start: string,
    @Query('end') end: string
  ): Promise<any> {
    if (!start || !end) {
      throw new BadRequestException('Os parâmetros "start" e "end" são obrigatórios.');
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Datas inválidas.');
    }

    const results = await this.proposalRepository
      .createQueryBuilder('proposal')
      .select('proposal.userCreator', 'userId')
      .addSelect('SUM(proposal.profit)', 'totalProfit')
      .where('proposal.status = :status', { status: ProposalStatus.SUCCESSFUL })
      .andWhere('proposal.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy('proposal.userCreator')
      .orderBy('SUM(proposal.profit)', 'DESC')
      .getRawMany();

    const bestUsers = results.map(result => ({
      userId: result.userId,
      totalProfit: parseFloat(result.totalProfit),
    }));

    return bestUsers;
  }
}
