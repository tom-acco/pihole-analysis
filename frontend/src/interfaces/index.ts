import type { DataTableSortItem } from "vuetify";

interface Client {
  id: number;
  alias: string;
  ipaddress: string;
  comment: string | null;
  Domains: Domain[];
  Queries: Query[];
  createdAt: string;
  updatedAt: string;
}

interface Domain {
  id: number;
  domain: string;
  owner: string;
  category: string;
  risk: number;
  comment: string;
  acknowledged: boolean;
  flagged: boolean;
  ignored: boolean;
  Clients: Client[];
  Queries: Query[];
  createdAt: string;
  updatedAt: string;
}

interface ClientDomainLink {
  ClientId: number;
  DomainId: number;
  createdAt: string;
  updatedAt: string;
}

interface Query {
  id: number;
  piHoleId: number;
  timestamp: string;
  ClientId: number;
  DomainId: number;
  createdAt: string;
  updatedAt: string;
}

interface DataTableParams {
  page: number;
  itemsPerPage: number;
  search: string | undefined;
  sortBy: DataTableSortItem[];
}

interface Sync {
  id: number;
  startTime: string;
  endTime: string;
  status: number;
  clients: number;
  domains: number;
  queries: number;
  createdAt: string;
  updatedAt: string;
}

export type { Client, Domain, ClientDomainLink, Query, DataTableParams, Sync };
