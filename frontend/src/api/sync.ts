import axios from "axios";

import { handleApiError } from "./utils";

const getLog = async () => {
  try {
    const res = await axios.get("/api/sync");
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

const syncNow = async () => {
  try {
    const res = await axios.post("/api/sync");
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export default {
  getLog,
  syncNow
};
