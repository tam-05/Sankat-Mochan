import { API } from "./api";

export const getReminderStatus = async () => {
  const response = await API.get("/reminder/status");
  return response.data;
};