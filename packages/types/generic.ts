export type ApiPaginatedResponse<T> = {
  items: T[];
  // totalPages: number;
  // totalItems: number;
  currentPage: number;
  pageSize: number;
};
