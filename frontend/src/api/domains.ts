import axios from "axios";

import type { DataTableParams } from "@/interfaces";
import { handleApiError } from "./utils";

const getDomains = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/domains", { params });
    return {
      total: res.data.count,
      items: res.data.rows
    };
  } catch (err) {
    handleApiError(err);
  }
};

const getNew = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/domains/new", { params });
    return {
      total: res.data.count,
      items: res.data.rows
    };
  } catch (err) {
    handleApiError(err);
  }
};

const getFlagged = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/domains/flagged", { params });
    return {
      total: res.data.count,
      items: res.data.rows
    };
  } catch (err) {
    handleApiError(err);
  }
};

const getIgnored = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/domains/ignored", { params });
    return {
      total: res.data.count,
      items: res.data.rows
    };
  } catch (err) {
    handleApiError(err);
  }
};

const getDomain = async (id: string) => {
  try {
    const res = await axios.get("/api/domain", { params: { id: id } });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

const interrogate = async (domain: string) => {
  try {
    const res = await axios.post("/api/domain/interrogate", { domain: domain });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

const setAcknowledge = async (domains: string[], value: boolean) => {
  try {
    const res = await axios.post("/api/domain/acknowledge", { domains: domains, value: value });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

const setFlag = async (domains: string[], value: boolean) => {
  try {
    const res = await axios.post("/api/domain/flag", { domains: domains, value: value });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

const setIgnore = async (domains: string[], value: boolean) => {
  try {
    const res = await axios.post("/api/domain/ignore", { domains: domains, value: value });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export default {
  getDomains,
  getNew,
  getFlagged,
  getIgnored,
  getDomain,
  interrogate,
  setAcknowledge,
  setFlag,
  setIgnore
};
