// src/app.controller.ts

import { Controller, Get, Param, Req, NotFoundException } from '@nestjs/common';
import { Proposal, ProposalStatus } from './entities/entities.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>
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
}
