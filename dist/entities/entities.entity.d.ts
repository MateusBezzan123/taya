export declare enum ProposalStatus {
    SUCCESSFUL = "SUCCESSFUL",
    REFUSED = "REFUSED",
    ERROR = "ERROR",
    PENDING = "PENDING"
}
export declare class User {
    id: number;
    createdCustomers: Customer[];
    proposals: Proposal[];
    name: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Customer {
    id: number;
    userCreator: User;
    proposals: Proposal[];
    name: string;
    cpf: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Proposal {
    id: number;
    userCreator: User;
    customer: Customer;
    profit: number;
    status: ProposalStatus;
    createdAt: Date;
    updatedAt: Date;
}
