import axios from "axios";

import type { DataTableParams } from "@/interfaces";
import { handleApiError } from "./utils";

const getClients = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/clients", { params });
    return {
      total: res.data.count,
      items: res.data.rows
    };
  } catch (err) {
    handleApiError(err);
  }
};

const getClient = async (id: string) => {
  try {
    const res = await axios.get("/api/client", { params: { id: id } });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

const setAlias = async (id: string, alias: string) => {
  try {
    const res = await axios.put("/api/client/alias", { id: id, alias: alias });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export default {
  getClients,
  getClient,
  setAlias
};
