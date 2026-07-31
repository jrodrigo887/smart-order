import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LinkUserDto } from '../dto/link-user.dto';
import { RegisterCollaboratorDto } from '../dto/register-collaborator.dto';
import { CollaboratorsService } from './collaborators.service';

@Controller()
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post('collaborators')
  register(@Body() dto: RegisterCollaboratorDto) {
    return this.collaboratorsService.register(dto);
  }

  @Get('collaborators/:id')
  findOne(@Param('id') id: string) {
    return this.collaboratorsService.findById(id);
  }

  @Patch('collaborators/:id/link-user')
  linkUser(@Param('id') id: string, @Body() dto: LinkUserDto) {
    return this.collaboratorsService.linkUser(id, dto.userId);
  }

  @Get('establishments/:establishmentId/collaborators')
  listByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.collaboratorsService.listByEstablishment(establishmentId);
  }
}
