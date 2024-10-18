import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { User } from './entities/entities.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['user_id'];

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: Number(userId) } });
      
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      (req as any).user = user; // Attach user to request
    } else {
      console.error('User ID header missing');
      throw new UnauthorizedException('Cabeçalho user_id é obrigatório');
    }

    next();
  }
}
