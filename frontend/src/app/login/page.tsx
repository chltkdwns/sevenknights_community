"use client";

import Link from "next/link";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import LoginContainer from "./_containers/LoginContainer";

export default function LoginPage() {
  return (
    <AuthFormCard
      title="로그인"
      description="JWT 기반 인증으로 로그인합니다."
      footer={
        <p className="text-center text-sm text-muted">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-accent hover:underline">
            회원가입
          </Link>
        </p>
      }
    >
      <LoginContainer />
    </AuthFormCard>
  );
}
