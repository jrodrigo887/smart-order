import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { EstablishmentAccess } from '../../domain/entities/establishment-access.entity';

export class InMemoryEstablishmentAccessRepository extends InMemoryRepository<EstablishmentAccess> {}
