// Column definition
type DataTableColumn<T> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string | number;
};

// Row selection
export type DataTableSelectionMode = 'none' | 'single' | 'multiple';

// Expandable row
export type DataTableExpandable<T> = {
  expandedContent: (row: T) => React.ReactNode;
};

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  selectionMode?: DataTableSelectionMode;
  selectedRows?: string[] | number[];
  onSelectionChange?: (selected: (string | number)[]) => void;
  expandableRows?: DataTableExpandable<T>;
  onRowExpand?: (row: T, expanded: boolean) => void;
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
  responsiveBreakpoint?: number;
}
