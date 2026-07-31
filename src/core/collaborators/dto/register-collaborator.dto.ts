import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  CollaboratorRole,
  CollaboratorRoleType,
} from '../domain/enums/collaborator-role.enum';

export class RegisterCollaboratorDto {
  @IsString()
  name: string;

  @IsUUID()
  establishmentId: string;

  @IsIn(Object.values(CollaboratorRole))
  role: CollaboratorRoleType;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
