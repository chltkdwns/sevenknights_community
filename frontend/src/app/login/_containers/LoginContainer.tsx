"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import type { TokenResponse } from "@/types";
import LoginForm from "../_components/LoginForm";

export default function LoginContainer() {
  const router = useRouter();
  // 폼 입력값/로딩 상태/에러 메시지를 컨테이너에서 관리한다.
  const [form, setForm] = useState({ username: "", password: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onChange = (name: "username" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      // 로그인 API 성공 시 토큰 저장 후 게시판으로 이동
      const data = await apiRequest<TokenResponse>("/api/auth/login", {
        method: "POST",
        body: { username: form.username.trim(), password: form.password },
      });
      saveAuth(data.accessToken, data.user);
      // 로그인 성공 후 메인으로 이동(요구사항)
      router.push("/");
      router.refresh();
    } catch (err) {
      // 서버 메시지를 그대로 노출해 사용자가 원인 파악 가능
      setError(err instanceof ApiRequestError ? err.message : "로그인에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  return <LoginForm form={form} pending={pending} error={error} onChange={onChange} onSubmit={onSubmit} />;
}
