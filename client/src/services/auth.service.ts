import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "PARENT";
}

export interface GoogleAuthData {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    name: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "PARENT";
    picture?: string;
    phoneNumber?: string;
    provider?: string;
    emailVerified?: Date;
  };
  userNotFound?: boolean;
  accountInactive?: boolean;
  serverError?: boolean;
  invalidPassword?: boolean;
}

interface ErrorResponse {
  message?: string;
  success?: boolean;
  userNotFound?: boolean;
  accountInactive?: boolean;
  serverError?: boolean;
  invalidPassword?: boolean;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      console.error("Login service error:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      
      return {
        success: false,
        message: axiosError.response?.data?.message || "Login gagal",
        userNotFound: axiosError.response?.data?.userNotFound,
        accountInactive: axiosError.response?.data?.accountInactive,
        invalidPassword: axiosError.response?.data?.invalidPassword,
        serverError: !axiosError.response
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      return response.data;
    } catch (error) {
      console.error("Register service error:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      
      return {
        success: false,
        message: axiosError.response?.data?.message || "Registrasi gagal",
        serverError: !axiosError.response
      };
    }
  },

  async googleAuth(data: GoogleAuthData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, data);
      return response.data;
    } catch (error) {
      console.error("Google auth service error:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      
      return {
        success: false,
        message: axiosError.response?.data?.message || "Google authentication gagal",
        userNotFound: axiosError.response?.data?.userNotFound,
        accountInactive: axiosError.response?.data?.accountInactive,
        serverError: !axiosError.response
      };
    }
  },

  async verifyGoogleToken(token: string): Promise<GoogleAuthData & { sub: string }> {
    try {
      const response = await axios.post(`${API_URL}/auth/google/verify`, { token });
      return response.data;
    } catch (error) {
      console.error("Google token verification error:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || "Token verification gagal");
    }
  },

  async logout(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Logout service error:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || "Logout gagal");
    }
  },

  async getProfile(token: string): Promise<AuthResponse["user"]> {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Get profile service error:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || "Gagal mengambil profil");
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { email });
      return response.data;
    } catch (error) {
      console.error("Reset password service error:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || "Reset password gagal");
    }
  }
};

export default authService;