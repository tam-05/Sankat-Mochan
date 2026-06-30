import { API } from "./api";
import type { LoginData, RegisterData } from "../types/auth";

export const loginUser = async (data: LoginData) => {
  const response = await API.post("/auth/login", data);

  return response.data;
};

export const registerUser = async (data: RegisterData) => {
  const response = await API.post("/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return response.data;
};