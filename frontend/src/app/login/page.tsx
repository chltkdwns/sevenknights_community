"use client";

import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthSubLinks } from "@/components/auth/AuthSubLinks";
import { GuestOnly } from "@/components/auth/GuestOnly";
import LoginContainer from "./_containers/LoginContainer";

export default function LoginPage() {
  return (
    <GuestOnly>
      <AuthFormCard
        title="로그인"
        description="세븐나이츠 커뮤니티 계정으로 로그인합니다."
        footer={<AuthSubLinks />}
      >
        <LoginContainer />
      </AuthFormCard>
    </GuestOnly>
  );
}
