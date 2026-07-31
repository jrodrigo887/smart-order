import { Inject, Injectable } from '@nestjs/common';
import { Collaborator } from '../domain/entities/collaborator.entity';
import {
  COLLABORATOR_REPOSITORY,
  CollaboratorRepositoryContract,
} from '../domain/repositories/collaborator.repository.contract';
import { CollaboratorRoleType } from '../domain/enums/collaborator-role.enum';

export type RegisterCollaboratorInput = {
  name: string;
  establishmentId: string;
  role: CollaboratorRoleType;
  userId?: string;
};

@Injectable()
export class CollaboratorsService {
  constructor(
    @Inject(COLLABORATOR_REPOSITORY)
    private readonly repository: CollaboratorRepositoryContract,
  ) {}

  async register(input: RegisterCollaboratorInput): Promise<Collaborator> {
    const collaborator = Collaborator.create(input);
    return this.repository.create(collaborator);
  }

  async findById(id: string): Promise<Collaborator> {
    return this.repository.findById(id);
  }

  async linkUser(
    collaboratorId: string,
    userId: string,
  ): Promise<Collaborator> {
    const collaborator = await this.repository.findById(collaboratorId);
    collaborator.linkUser(userId);
    return this.repository.update(collaboratorId, collaborator);
  }

  async listByEstablishment(establishmentId: string): Promise<Collaborator[]> {
    return this.repository.findByEstablishmentId(establishmentId);
  }
}
