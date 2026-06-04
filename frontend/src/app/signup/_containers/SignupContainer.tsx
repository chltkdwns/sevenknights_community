"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { passwordsMatch, validatePassword } from "@/lib/password";
import type { User } from "@/types";
import SignupForm from "../_components/SignupForm";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupFormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
};

type TouchedState = {
  username: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  nickname: boolean;
};

export default function SignupContainer() {
  const router = useRouter();
  // 회원가입 폼 원본 입력 상태
  const [form, setForm] = useState<SignupFormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  // 각 필드 blur 여부(실시간 검증 메시지 노출 타이밍 제어)
  const [touched, setTouched] = useState<TouchedState>({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    nickname: false,
  });
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignupFormState, string>>>({});

  const errors = useMemo(() => {
    // 프론트 검증 + 서버 필드 에러를 합쳐 최종 에러 상태 생성
    const next: Partial<Record<keyof SignupFormState, string>> = { ...fieldErrors };
    if (!form.username && touched.username) next.username = "아이디를 입력해 주세요.";
    else if (form.username && form.username.length < 4) next.username = "아이디는 4자 이상이어야 합니다.";

    if (!form.email && touched.email) next.email = "이메일을 입력해 주세요.";
    else if (form.email && !EMAIL_PATTERN.test(form.email)) next.email = "올바른 이메일 형식이 아닙니다.";

    if (!form.nickname && touched.nickname) next.nickname = "닉네임을 입력해 주세요.";
    else if (form.nickname && form.nickname.length < 2) next.nickname = "닉네임은 2자 이상이어야 합니다.";

    if (!form.password && touched.password) next.password = "비밀번호를 입력해 주세요.";
    else if (form.password) {
      const message = validatePassword(form.password);
      if (message) next.password = message;
    }

    if (!form.confirmPassword && touched.confirmPassword) next.confirmPassword = "비밀번호 확인을 입력해 주세요.";
    else if (form.confirmPassword && !passwordsMatch(form.password, form.confirmPassword)) {
      next.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    return next;
  }, [form, touched, fieldErrors]);

  const canSubmit = useMemo(() => {
    // errors 객체는 undefined 값의 키도 포함할 수 있으므로
    // 실제 에러 메시지가 있는 키만 카운트해야 한다.
    const hasError = Object.values(errors).some((v) => v !== undefined && v !== "");
    return (
      !hasError &&
      form.username.length >= 4 &&
      form.nickname.length >= 2 &&
      form.email.length > 0 &&
      form.password.length >= 8 &&
      passwordsMatch(form.password, form.confirmPassword)
    );
  }, [errors, form]);

  const passwordHint = useMemo(() => {
    if (!form.password && !touched.password) return "영문+숫자 조합, 8자 이상";
    if (errors.password) return undefined;
    return "사용 가능한 비밀번호입니다.";
  }, [form.password, touched.password, errors.password]);

  const onChange = (name: keyof SignupFormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onBlur = (name: keyof TouchedState) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      nickname: true,
    });
    if (!canSubmit) return;

    setPending(true);
    setSubmitError("");
    setFieldErrors({});
    try {
      await apiRequest<User>("/api/auth/signup", {
        method: "POST",
        body: {
          username: form.username,
          email: form.email,
          password: form.password,
          nickname: form.nickname,
        },
      });
      // 회원가입 성공 후 로그인 페이지로 이동(요구사항)
      router.push("/login");
      router.refresh();
    } catch (err) {
      // 서버에서 내려준 필드 에러를 각 입력창에 매핑
      if (err instanceof ApiRequestError && err.fieldErrors) {
        const mapped: Partial<Record<keyof SignupFormState, string>> = {};
        Object.entries(err.fieldErrors).forEach(([key, values]) => {
          if ((key as keyof SignupFormState) in form && values.length > 0) {
            mapped[key as keyof SignupFormState] = values[0];
          }
        });
        setFieldErrors(mapped);
      }
      setSubmitError(err instanceof ApiRequestError ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <SignupForm
      form={form}
      touched={touched}
      errors={errors}
      pending={pending}
      submitError={submitError}
      canSubmit={canSubmit}
      passwordHint={passwordHint}
      passwordHintStatus={errors.password ? "invalid" : form.password ? "valid" : "idle"}
      confirmHintStatus={errors.confirmPassword ? "invalid" : form.confirmPassword ? "valid" : "idle"}
      onChange={onChange}
      onBlur={onBlur}
      onSubmit={onSubmit}
    />
  );
}
