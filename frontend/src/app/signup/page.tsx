"use client";

import Link from "next/link";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { GuestOnly } from "@/components/auth/GuestOnly";
import SignupContainer from "./_containers/SignupContainer";

export default function SignupPage() {
  return (
    <GuestOnly>
      <AuthFormCard
        title="회원가입"
        description="커뮤니티 계정을 생성합니다. 가입 후 관리자 승인이 있어야 길드전 공략을 볼 수 있습니다."
        footer={
          <p className="text-center text-sm text-muted">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              로그인
            </Link>
          </p>
        }
      >
        <SignupContainer />
      </AuthFormCard>
    </GuestOnly>
  );
}
