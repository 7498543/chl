import { useCallback, useRef, useState } from "react";

/** 分页参数 */
interface PaginationParams {
  page: number;
  pageSize: number;
  [key: string]: unknown;
}

/** 分页响应 */
interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 分页状态 */
interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
}

/** usePagination 返回值 */
interface UsePaginationReturn<T> {
  /** 列表数据 */
  data: T[];
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  total: number;
  /** 是否加载中 */
  loading: boolean;
  /** 是否有更多数据 */
  hasMore: boolean;
  /** 切换页码 */
  setPage: (page: number) => void;
  /** 切换每页条数 */
  setPageSize: (pageSize: number) => void;
  /** 刷新当前页 */
  refresh: () => Promise<void>;
  /** 搜索（重置到第一页） */
  search: (params?: Record<string, unknown>) => Promise<void>;
  /** 加载更多（用于滚动加载） */
  loadMore: () => Promise<void>;
}

/**
 * 分页 Hook
 * @param service 分页请求函数，接收 { page, pageSize, ...params }
 * @param defaultPageSize 默认每页条数
 * @example
 * ```ts
 * const { data, loading, page, total, setPage, search } = usePagination(
 *   (params) => api.getArticles(params)
 * );
 * ```
 */
export function usePagination<T = unknown>(
  service: (params: PaginationParams) => Promise<PaginationResult<T>>,
  defaultPageSize = 10,
): UsePaginationReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [state, setState] = useState<PaginationState>({
    page: 1,
    pageSize: defaultPageSize,
    total: 0,
    loading: false,
  });

  const searchParamsRef = useRef<Record<string, unknown>>({});
  const serviceRef = useRef(service);
  serviceRef.current = service;

  const fetchData = useCallback(async (page: number, pageSize: number, append = false) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const result = await serviceRef.current({
        page,
        pageSize,
        ...searchParamsRef.current,
      });
      setData((prev) => (append ? [...prev, ...result.data] : result.data));
      setState({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        loading: false,
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const setPage = useCallback(
    (page: number) => {
      fetchData(page, state.pageSize);
    },
    [fetchData, state.pageSize],
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      fetchData(1, pageSize);
    },
    [fetchData],
  );

  const refresh = useCallback(() => {
    fetchData(state.page, state.pageSize);
  }, [fetchData, state.page, state.pageSize]);

  const search = useCallback(
    async (params?: Record<string, unknown>) => {
      searchParamsRef.current = params ?? {};
      await fetchData(1, state.pageSize);
    },
    [fetchData, state.pageSize],
  );

  const loadMore = useCallback(() => {
    const { page, pageSize, total } = state;
    if (data.length >= total) return;
    fetchData(page + 1, pageSize, true);
  }, [fetchData, state, data.length]);

  return {
    data,
    page: state.page,
    pageSize: state.pageSize,
    total: state.total,
    loading: state.loading,
    hasMore: data.length < state.total,
    setPage,
    setPageSize,
    refresh,
    search,
    loadMore,
  };
}
