export enum SyncStatus {
    PENDING = 0,
    RUNNING = 1,
    SUCCESS = 2,
    FAILED = 3
}

export interface PiHoleItem {
    id: number;
    client: string;
    domain: string;
    timestamp: number;
}

export interface SyncLogInput {
    startTime: Date;
    endTime: Date | null;
    status: number | null;
    clients: number | null;
    domains: number | null;
    queries: number | null;
}
