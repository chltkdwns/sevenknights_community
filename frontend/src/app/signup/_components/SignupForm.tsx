"use client";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ValidationHint } from "@/components/ui/ValidationHint";

type TouchedState = {
  username: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  nickname: boolean;
};

type SignupFormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
};

interface SignupFormProps {
  form: SignupFormState;
  touched: TouchedState;
  errors: Partial<Record<keyof SignupFormState, string>>;
  pending: boolean;
  submitError?: string;
  canSubmit: boolean;
  passwordHint?: string;
  passwordHintStatus: "idle" | "valid" | "invalid";
  confirmHintStatus: "idle" | "valid" | "invalid";
  onSubmit: (e: React.FormEvent) => void;
  onChange: (name: keyof SignupFormState, value: string) => void;
  onBlur: (name: keyof TouchedState) => void;
}

export default function SignupForm({
  form,
  touched,
  errors,
  pending,
  submitError,
  canSubmit,
  passwordHint,
  passwordHintStatus,
  confirmHintStatus,
  onSubmit,
  onChange,
  onBlur,
}: SignupFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="아이디"
        value={form.username}
        onChange={(e) => onChange("username", e.target.value)}
        onBlur={() => onBlur("username")}
        error={errors.username}
        autoComplete="username"
        required
      />
      {touched.username && !errors.username ? (
        <ValidationHint message="사용 가능한 아이디 형식입니다." status="valid" />
      ) : null}

      <Input
        label="이메일"
        value={form.email}
        onChange={(e) => onChange("email", e.target.value)}
        onBlur={() => onBlur("email")}
        error={errors.email}
        autoComplete="email"
        required
      />

      <div className="flex flex-col gap-1.5">
        <Input
          label="닉네임"
          value={form.nickname}
          onChange={(e) => onChange("nickname", e.target.value)}
          onBlur={() => onBlur("nickname")}
          error={errors.nickname}
          autoComplete="nickname"
          required
        />
        <p className="text-xs text-muted">게임 닉네임으로 가입하셔야 조회 가능합니다.</p>
      </div>
      <PasswordInput
        label="비밀번호"
        value={form.password}
        onChange={(e) => onChange("password", e.target.value)}
        onBlur={() => onBlur("password")}
        error={touched.password ? errors.password : undefined}
        hint={passwordHint}
        hintStatus={passwordHintStatus}
        showStrength
        autoComplete="new-password"
        required
      />
      <PasswordInput
        label="비밀번호 확인"
        value={form.confirmPassword}
        onChange={(e) => onChange("confirmPassword", e.target.value)}
        onBlur={() => onBlur("confirmPassword")}
        error={errors.confirmPassword}
        hint={
          form.confirmPassword && !errors.confirmPassword
            ? "비밀번호가 일치합니다."
            : "비밀번호를 다시 입력해 주세요."
        }
        hintStatus={confirmHintStatus}
        autoComplete="new-password"
        required
      />
      <FormMessage messages={submitError} />
      <Button type="submit" fullWidth disabled={pending || !canSubmit}>
        {pending ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}
