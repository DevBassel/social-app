import { BadRequestException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

export async function pagination<T>(
  Q: SelectQueryBuilder<T>,
  page: number,
  limit: number,
) {
  page = page < 1 ? 1 : page;

  if (limit > 30) throw new BadRequestException('max limit is 30');

  const [data, total] = await Q.skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
  };
}
