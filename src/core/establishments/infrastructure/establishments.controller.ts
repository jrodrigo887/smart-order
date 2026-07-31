import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterEstablishmentDto } from '../dto/register-establishment.dto';
import { EstablishmentsService } from './establishments.service';

@Controller()
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Post('establishments')
  register(@Body() dto: RegisterEstablishmentDto) {
    return this.establishmentsService.register(dto);
  }

  @Get('establishments/:id')
  findOne(@Param('id') id: string) {
    return this.establishmentsService.findById(id);
  }

  @Get('companies/:companyId/establishments')
  listByCompany(@Param('companyId') companyId: string) {
    return this.establishmentsService.listByCompany(companyId);
  }
}
