import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from './entities/entities.entity';
import { Repository } from 'typeorm';
export declare class UserMiddleware implements NestMiddleware {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
