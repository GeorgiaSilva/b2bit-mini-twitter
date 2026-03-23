import axios, { isAxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("API_URL is not defined in environment variables");
}
const authService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type ApiErrorPayload = {
  message?: string;
  error?: string;
};

const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const login = async (email: string, password: string) => {
  try {
    const response = await authService.post("/auth/login", {
      email,
      password,
    });
    saveToken(response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw new Error("Credenciais inválidas.", { cause: error });
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await authService.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorPayload>(error)) {
      throw new Error( error.response?.data?.message || "Falha no cadastro.", {
        cause: error,
      });
    }
    throw new Error("Falha no cadastro.", { cause: error });
  }
};

export const logout = async () => {
  const token = getToken();
  if (token) {
    try {
      await authService.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
