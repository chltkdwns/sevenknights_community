import { clearAuth, getToken } from "@/lib/auth";
import type { ApiError, JsonData } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiRequestError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown | FormData;
  auth?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = false } = options;
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = isFormData
    ? {}
    : {
        "Content-Type": "application/json",
      };

  let sentToken: string | null = null;
  if (auth) {
    const token = getToken();
    if (!token) {
      throw new ApiRequestError(401, "로그인이 필요합니다.");
    }
    sentToken = token;
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: !body ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 401 && sentToken) {
      // 토큰이 있었는데 거부된 경우에만 세션을 정리한다.
      clearAuth();
    }
    let message = "요청 처리 중 오류가 발생했습니다.";
    let fieldErrors: Record<string, string[]> | undefined;
    try {
      const error = (await response.json()) as ApiError;
      // 백엔드의 JSONError(messages)를 문자열/필드맵 모두 처리
      if (typeof error.messages === "string") {
        message = error.messages;
      } else if (Array.isArray(error.messages)) {
        message = error.messages.join(" ");
      } else if (error.messages && typeof error.messages === "object") {
        fieldErrors = error.messages as Record<string, string[]>;
        const flattened = Object.values(fieldErrors).flat();
        if (flattened.length > 0) {
          message = flattened.join(" ");
        }
      }
    } catch {
      // ignore parse error
    }
    throw new ApiRequestError(response.status, message, fieldErrors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as T | JsonData<T>;
  // 백엔드 공통 응답(JSONData) 형식이면 data만 꺼내서 반환
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    "status" in payload
  ) {
    return (payload as JsonData<T>).data;
  }
  return payload as T;
}
