import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Collaborator } from '../../domain/entities/collaborator.entity';

export class InMemoryCollaboratorRepository extends InMemoryRepository<Collaborator> {}
