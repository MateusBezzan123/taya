import { Proposal, User } from './entities/entities.entity';
import { Repository } from 'typeorm';
export declare class AppController {
    private readonly proposalRepository;
    private readonly userRepository;
    constructor(proposalRepository: Repository<Proposal>, userRepository: Repository<User>);
    getRefusedProposals(req: any): Promise<Proposal[]>;
    getProposalById(id: number, req: any): Promise<Proposal>;
    getPendingProposals(req: any): Promise<Proposal[]>;
    approveProposal(proposalId: string, req: any): Promise<Proposal>;
}
