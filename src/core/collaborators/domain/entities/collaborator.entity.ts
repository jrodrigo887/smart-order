import { EntityBase } from '@/shared/entities/entity-base';
import { UuidUnique } from '@shared/vo/uuid-unique.vo';
import { CollaboratorRoleType } from '../enums/collaborator-role.enum';

export type CollaboratorProps = {
  name: string;
  establishmentId: string;
  role: CollaboratorRoleType;
  userId?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Collaborator extends EntityBase {
  private constructor(public readonly props: CollaboratorProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: CollaboratorProps): Collaborator {
    return new Collaborator(props);
  }

  public get name(): string {
    return this.props.name;
  }

  public get establishmentId(): string {
    return this.props.establishmentId;
  }

  public get role(): CollaboratorRoleType {
    return this.props.role;
  }

  public get userId(): string | undefined {
    return this.props.userId;
  }

  public linkUser(userId: string): void {
    const validId = UuidUnique.create(userId);
    this.props.userId = validId.getValue();
    this.props.updatedAt = new Date();
  }
}
