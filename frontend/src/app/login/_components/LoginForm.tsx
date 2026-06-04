"use client";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface LoginFormProps {
  form: { username: string; password: string };
  pending: boolean;
  error?: string;
  onChange: (name: "username" | "password", value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  form,
  pending,
  error,
  onChange,
  onSubmit,
}: LoginFormProps) {
  // 아이디/비밀번호 둘 다 입력되어야 제출 버튼 활성화
  const canSubmit = form.username.trim().length > 0 && form.password.length > 0;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="아이디"
        value={form.username}
        onChange={(e) => onChange("username", e.target.value)}
        autoComplete="username"
        required
      />
      <PasswordInput
        label="비밀번호"
        value={form.password}
        onChange={(e) => onChange("password", e.target.value)}
        autoComplete="current-password"
        required
      />
      <FormMessage messages={error} />
      <Button type="submit" fullWidth disabled={pending || !canSubmit}>
        {pending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
