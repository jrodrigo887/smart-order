import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { CompanyRole } from '../../domain/entities/company-role.entity';
import { CompanyRoleRepositoryContract } from '../../domain/repositories/company-role.repository.contract';

export class InMemoryCompanyRoleRepository
  extends InMemoryRepository<CompanyRole>
  implements CompanyRoleRepositoryContract
{
  async findByUserAndCompany(
    userId: string,
    companyId: string,
  ): Promise<CompanyRole | null> {
    const all = await this.findAll();
    return (
      all.find(
        (companyRole) =>
          companyRole.userId === userId && companyRole.companyId === companyId,
      ) ?? null
    );
  }
}
