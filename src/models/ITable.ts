export type CellFormatter<T> = (value: any, row: T) => React.ReactNode;

export interface ITableColumn<T> {
  key: string;
  label: string;
  formatter?: CellFormatter<T>;
  getValue?: (row: T) => any;
  width?: string | number;
  isHidden?: boolean;
}
