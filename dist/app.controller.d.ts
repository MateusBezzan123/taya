import { Proposal } from './entities/entities.entity';
import { Repository } from 'typeorm';
export declare class AppController {
    private readonly proposalRepository;
    constructor(proposalRepository: Repository<Proposal>);
    getRefusedProposals(req: any): Promise<Proposal[]>;
    getProposalById(id: number, req: any): Promise<Proposal>;
    getPendingProposals(req: any): Promise<Proposal[]>;
}
