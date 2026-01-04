import type { DataTableSortItem } from "vuetify";

interface Client {
  id: number;
  alias: string;
  ipaddress: string;
  comment: string | null;
  Domains: Domain[];
  Lookups: Lookup[];
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
  hidden: boolean;
  Clients: Client[];
  Lookups: Lookup[];
  createdAt: string;
  updatedAt: string;
}

interface ClientDomainLink {
  ClientId: number;
  DomainId: number;
  createdAt: string;
  updatedAt: string;
}

interface Lookup {
  id: number;
  count: number;
  ClientId: number;
  DomainId: number;
  createdAt: string;
  updatedAt: string;
}

interface DataTableParams {
  page: number;
  itemsPerPage: number;
  search: String | undefined;
  sortBy: DataTableSortItem[];
}

export type { Client, Domain, ClientDomainLink, Lookup, DataTableParams };
