import axios, { AxiosError } from "axios";

import type { DataTableParams } from "@/interfaces";

const getDomains = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/domains", { params });
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

const getNew = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/domains/new", { params });
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

const getFlagged = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/domains/flagged", { params });
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

const getHidden = async (params: DataTableParams) => {
  try {
    const res = await axios.get("/api/domains/hidden", { params });
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

const getDomain = async (id: String) => {
  try {
    const res = await axios.get("/api/domain", { params: { id: id } });
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

const interrogate = async (domain: string) => {
  try {
    const res = await axios.post("/api/domain/interrogate", { domain: domain });
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

const acknowledge = async (domain: string) => {
  try {
    const res = await axios.post("/api/domain/acknowledge", { domain: domain });
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

const flag = async (domain: string) => {
  try {
    const res = await axios.post("/api/domain/flag", { domain: domain });
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

const hide = async (domain: string) => {
  try {
    const res = await axios.post("/api/domain/hide", { domain: domain });
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
  getDomains: getDomains,
  getNew: getNew,
  getFlagged: getFlagged,
  getHidden: getHidden,
  getDomain: getDomain,
  interrogate: interrogate,
  acknowledge: acknowledge,
  flag: flag,
  hide: hide
};
