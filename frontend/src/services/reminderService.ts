import { API } from "./api";

export const getReminderStatus = async () => {
  const response = await API.get("/reminder/status", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};