import { Proposal, User } from './entities/entities.entity';
import { Repository } from 'typeorm';
export declare class AppController {
    private readonly proposalRepository;
    private readonly userRepository;
    constructor(proposalRepository: Repository<Proposal>, userRepository: Repository<User>);
    getProposalById(id: number, req: any): Promise<Proposal>;
    getPendingProposals(req: any): Promise<Proposal[]>;
    getRefusedProposals(req: any): Promise<Proposal[]>;
    approveProposal(proposalId: number, req: any): Promise<Proposal>;
    getProfitByStatus(): Promise<any[]>;
    getBestUsers(start: string, end: string): Promise<{
        id: any;
        fullName: any;
        totalProposal: number;
    }[]>;
}
