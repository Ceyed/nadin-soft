import { NadinController, NadinModulesEnum, RouteTypeEnum } from 'libs/src';
import { UsersService } from './users.service';

@NadinController(NadinModulesEnum.User, 'users', RouteTypeEnum.NORMAL)
export class UsersNormalController {
  constructor(private readonly _usersService: UsersService) {}

  // @PutInfo(':id', ['id'], UpdateTaskDto, false, {
  //   summary: 'update task',
  //   description: 'this route upload a task that belongs to active user',
  //   outputType: UpdateResultModel,
  // })
  // update(
  //   @Param('id', ParseUUIDPipe) id: uuid,
  //   @User() user: UserAuthModel,
  //   @Body() updateTaskDto: UpdateTaskDto,
  // ): Promise<UpdateResultModel> {
  //   return this._taskService.update(id, user, updateTaskDto);
  // }
}
