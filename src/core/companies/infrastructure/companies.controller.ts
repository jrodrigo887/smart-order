import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterCompanyDto } from '../dto/register-company.dto';
import { CompaniesService } from './companies.service';

@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('companies')
  register(@Body() dto: RegisterCompanyDto) {
    return this.companiesService.register(dto);
  }

  @Get('companies/:id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }
}
