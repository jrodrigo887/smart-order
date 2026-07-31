import { Injectable } from '@nestjs/common';
import { EstablishmentsService } from '@/core/establishments/infrastructure/establishments.service';
import { Establishment } from '@/core/establishments/domain/entities/establishment.entity';
import { EstablishmentLookup } from '../../domain/ports/establishment-lookup';

@Injectable()
export class EstablishmentsServiceGateway implements EstablishmentLookup {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  async findById(id: string): Promise<Establishment> {
    return this.establishmentsService.findById(id);
  }
}
