import fetch from "node-fetch";

import { Result, err, ok, wrapThrows } from "@formbricks/errors";
import { NetworkError, ApiResponse } from "../types/index";

export async function makeRequest<T = any, E = any>(
  apiHost: string,
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: any
): Promise<Result<T, E | NetworkError | Error>> {
  const url = new URL(endpoint, apiHost);
  const body = JSON.stringify(data);

  const res = wrapThrows(fetch)(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  if (res.ok === false) return err(res.error);

  const response = await res.data;
  const { data: innerData } = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    return err({
      code: "network_error",
      message: response.statusText,
      status: response.status,
      url,
    });
  }

  return ok(innerData as T);
}