import axios from "axios";

interface ApiError {
  error: string;
  code?: number;
  success: false;
}

interface ApiSuccess<T> {
  data: T;
  success: true;
}

export type ApiResponse<T = void> = ApiError | ApiSuccess<T>;

export default axios.create({
  baseURL: "/api",
  validateStatus: () => true,
});
