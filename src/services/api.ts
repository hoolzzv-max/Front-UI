import {
  apiClient,
  type ApiResponse,
} from "../core/api/ApiClient";

export class ApiService {
  configure(baseUrl: string) {
    apiClient.configure({
      baseUrl,
    });
  }

  setAuthToken(token: string) {
    apiClient.setAuthToken(token);
  }

  clearAuthToken() {
    apiClient.clearAuthToken();
  }

  async get<T>(
    endpoint: string,
    query?: Record<
      string,
      string | number | boolean
    >,
  ) {
    const response =
      await apiClient.get<T>(
        endpoint,
        {
          query,
        },
      );

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
  ) {
    const response =
      await apiClient.post<T>(
        endpoint,
        body,
      );

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
  ) {
    const response =
      await apiClient.put<T>(
        endpoint,
        body,
      );

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
  ) {
    const response =
      await apiClient.patch<T>(
        endpoint,
        body,
      );

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  }

  async delete<T>(
    endpoint: string,
  ) {
    const response =
      await apiClient.delete<T>(
        endpoint,
      );

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  }
}

export const apiService =
  new ApiService();

export type { ApiResponse };
