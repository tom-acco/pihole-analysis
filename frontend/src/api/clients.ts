import axios, { AxiosError } from "axios";

import type { DataTableParams } from "@/interfaces";

const getClients = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/clients", { params });
    return {
      total: res.data.count,
      items: res.data.rows
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err.response?.data?.message || err.message;
    } else if (err instanceof Error) {
      throw err.message;
    } else {
      throw String(err);
    }
  }
};

const getClient = async (id: String) => {
  try {
    const res = await axios.get("/api/client", { params: { id: id } });
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err.response?.data?.message || err.message;
    } else if (err instanceof Error) {
      throw err.message;
    } else {
      throw String(err);
    }
  }
};

export default {
  getClients: getClients,
  getClient: getClient
};
