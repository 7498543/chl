import { cn, useTheme } from "@/lib";
import type { ColDef, GridApi, GridOptions, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef } from "react";
import { mergeAgGridConfig } from "./config";

export interface AgGridProps<TData = unknown> {
  /** 列定义 */
  columnDefs: ColDef<TData>[];
  /** 行数据 */
  rowData: TData[] | null;
  /** 加载状态 */
  loading?: boolean;
  /** 是否分页 */
  pagination?: boolean;
  /** 默认每页条数 */
  paginationPageSize?: number;
  /** 默认排序 */
  defaultColDef?: ColDef<TData>;
  /** 行高度 */
  rowHeight?: number;
  /** 表头高度 */
  headerHeight?: number;
  /** 是否多选 */
  rowSelection?: "single" | "multiple";
  /** 选中行变化回调 */
  onSelectionChanged?: (api: GridApi<TData>) => void;
  /** 双击行回调 */
  onRowDoubleClicked?: (params: ICellRendererParams<TData>) => void;
  /** 额外类名 */
  className?: string;
  /** 额外网格选项 */
  gridOptions?: Partial<GridOptions<TData>>;
  /** 网格初始化回调 */
  onGridReady?: (api: GridApi<TData>) => void;
}

/**
 * AG Grid React 封装组件
 * 自动集成项目 Tailwind CSS 主题
 *
 * @example
 * ```tsx
 * const columnDefs = [
 *   { field: 'name', headerName: '名称', sortable: true },
 *   { field: 'age', headerName: '年龄', width: 100 },
 * ];
 *
 * <AgGrid
 *   columnDefs={columnDefs}
 *   rowData={data}
 *   pagination
 *   paginationPageSize={10}
 * />
 * ```
 */
export function AgGrid<TData = unknown>({
  columnDefs,
  rowData,
  loading = false,
  pagination = false,
  paginationPageSize = 10,
  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  },
  rowHeight = 42,
  headerHeight = 48,
  rowSelection = "single",
  onSelectionChanged,
  onRowDoubleClicked,
  className,
  gridOptions,
  onGridReady,
}: AgGridProps<TData>) {
  const gridRef = useRef<AgGridReact<TData>>(null);
  const { adapter } = useTheme();

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [rowData]);

  const handleSelectionChanged = () => {
    if (onSelectionChanged && gridRef.current?.api) {
      onSelectionChanged(gridRef.current.api);
    }
  };

  const handleRowDoubleClicked = (params: ICellRendererParams<TData>) => {
    if (onRowDoubleClicked) {
      onRowDoubleClicked(params);
    }
  };

  const handleGridReady = (params: { api: GridApi<TData> }) => {
    onGridReady?.(params.api);
    params.api.sizeColumnsToFit();
  };

  // 合并全局配置和当前配置
  const mergedGridOptions = mergeAgGridConfig(gridOptions);

  return (
    <div
      className={cn(
        "w-full h-full",
        "bg-background text-foreground border border-border rounded-radius",
        className,
      )}
    >
      <AgGridReact<TData>
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={rowData ?? []}
        defaultColDef={defaultColDef}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        rowSelection={rowSelection}
        loading={loading}
        onSelectionChanged={handleSelectionChanged}
        onRowDoubleClicked={handleRowDoubleClicked}
        onGridReady={handleGridReady}
        theme={adapter.agGrid}
        {...mergedGridOptions}
      />
    </div>
  );
}

export type { ColDef, GridApi, GridOptions, ICellRendererParams };
export default AgGrid;
