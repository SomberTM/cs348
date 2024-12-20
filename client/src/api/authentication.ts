import apiClient, { ApiResponse } from "./apiClient";

interface User {
  id: string;
  user_name: string;
}

export async function getUser(): Promise<User> {
  const result = await apiClient.get("/me");
  const response: ApiResponse<User> = result.data;

  if (response.success) return response.data;
  else throw Error(response.error);
}

export async function createUser(
  username: string,
  password: string
): Promise<void> {
  const parameters = btoa(`${username}:${password}`);
  const result = await apiClient.post("/users/", undefined, {
    headers: {
      Authorization: `Basic ${parameters}`,
    },
  });
  const response: ApiResponse = result.data;

  if (!response.success) throw Error(response.error);
}

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  const parameters = btoa(`${username}:${password}`);
  const result = await apiClient.post("/auth/login", undefined, {
    headers: {
      Authorization: `Basic ${parameters}`,
    },
  });
  const response: ApiResponse = result.data;

  if (response.success) return true;
  // no user
  if (response.code === 0) {
    await createUser(username, password);
    return await login(username, password);
  } else throw Error(response.error);
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
