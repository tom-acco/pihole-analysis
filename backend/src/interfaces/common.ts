export interface SortItem {
    key: string;
    order: "asc" | "desc";
}

export interface PaginatedAttributes {
    [key: string]: any;
}

export interface PaginatedResult<T> {
    rows: T[];
    count: number;
}
