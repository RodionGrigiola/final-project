import { Model, Document } from "mongoose";

interface PaginationResult<T> {
  page: number;
  pageSize: number;
  items: T[];
}

export async function paginate<T extends Document>(
  model: Model<T>,
  page: number,
  pageSize: number,
): Promise<PaginationResult<T>> {
  const skip = (page - 1) * pageSize;

  const items = await model.find().skip(skip).limit(pageSize);

  return {
    page,
    pageSize,
    items,
  };
}
