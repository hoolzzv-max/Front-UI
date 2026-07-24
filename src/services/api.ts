export interface ApiResponse<T> {
  success: boolean;

  data?: T;

  error?: string;
}

export class ApiService {
  private baseUrl = "";

  configure(
    baseUrl: string,
  ) {
    this.baseUrl =
      baseUrl.replace(/\/$/, "");
  }

  async get<T>(
    endpoint: string,
  ): Promise<ApiResponse<T>> {
    try {
      const response =
        await fetch(
          `${this.baseUrl}${endpoint}`,
        );

      const data =
        await response.json();

      return {
        success: response.ok,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Request failed",
      };
    }
  }

  async post<T>(
    endpoint: string,
    body: unknown,
  ): Promise<ApiResponse<T>> {
    try {
      const response =
        await fetch(
          `${this.baseUrl}${endpoint}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              body,
            ),
          },
        );

      const data =
        await response.json();

      return {
        success: response.ok,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Request failed",
      };
    }
  }
}

export const apiService =
  new ApiService();
