export type ValidRowModel = {
  [key: string]: unknown;
};

export type RowEntry<T> = { rowData: T; rowIndex: number };
