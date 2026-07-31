import { Establishment } from '@/core/establishments/domain/entities/establishment.entity';

export const ESTABLISHMENT_LOOKUP = Symbol('ESTABLISHMENT_LOOKUP');

export interface EstablishmentLookup {
  findById(id: string): Promise<Establishment>;
}
