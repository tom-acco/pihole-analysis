export interface SortItem {
    key: "ipaddress" | "alias";
    order: "asc" | "desc";
}

export interface PaginatedAttributes {
    [key: string]: any;
}

export interface PaginatedResult<T> {
    rows: T[];
    count: number;
}
