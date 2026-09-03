import z from "zod";

/** 分页参数 */
export const PaginationDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type PaginationDtoType = z.infer<typeof PaginationDto>;
