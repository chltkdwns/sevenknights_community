import Link from "next/link";

/** 로그인·회원가입 하단 보조 링크 — 아이디/비밀번호 찾기는 추후 API 연동 예정 */
export function AuthSubLinks() {
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted"
      aria-label="계정 관련 링크"
    >
      <Link href="/signup" className="font-medium text-accent hover:underline">
        회원가입
      </Link>
      <span aria-hidden className="text-border">
        |
      </span>
      <button
        type="button"
        disabled
        title="준비 중입니다"
        className="cursor-not-allowed opacity-50"
      >
        아이디 찾기
      </button>
      <span aria-hidden className="text-border">
        |
      </span>
      <button
        type="button"
        disabled
        title="준비 중입니다"
        className="cursor-not-allowed opacity-50"
      >
        비밀번호 찾기
      </button>
    </nav>
  );
}
