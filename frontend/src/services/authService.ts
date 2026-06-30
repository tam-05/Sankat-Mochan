import axios from "axios";
import type { LoginData, RegisterData } from "../types/auth";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

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