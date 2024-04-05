import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'libs/src/lib/database/entities';
import { UsersNormalController } from './users.controller.normal';
import { UsersPublicController } from './users.controller.public';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersPublicController, UsersNormalController],
  providers: [UsersService],
})
export class UsersModule {}
