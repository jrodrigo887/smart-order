import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Company } from '../../domain/entities/company.entity';

export class InMemoryCompanyRepository extends InMemoryRepository<Company> {}
