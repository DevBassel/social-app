import { SelectQueryBuilder } from 'typeorm';

export async function pagination<T>(
  Q: SelectQueryBuilder<T>,
  page: number,
  limit: number,
) {
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
