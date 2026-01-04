import axios, { AxiosError } from "axios";

const getLog = async () => {
  try {
    const res = await axios.get("/api/sync");
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

const syncNow = async () => {
  try {
    const res = await axios.post("/api/sync");
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
  getLog: getLog,
  syncNow: syncNow,
};
