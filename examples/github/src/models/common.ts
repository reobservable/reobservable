/**
 * common model
 * @author yoyoyohamapi
 * @ignore created 2018-08-12 23:54:27
 */

export enum Order {
  Desc = 'desc',
  Asc = 'asc'
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
}
