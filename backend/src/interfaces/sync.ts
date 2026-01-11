export interface PiHoleItem {
    id: number;
    client: string;
    domain: string;
    timestamp: number;
}

export interface SyncLogInput {
    startTime: Date;
    endTime: Date | null;
    status: number;
    clients: number;
    domains: number;
    queries: number;
}