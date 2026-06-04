import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          Community MVP
        </p>
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
          세븐나이츠 커뮤니티에 오신 것을 환영합니다
        </h1>
        <p className="max-w-2xl text-muted leading-relaxed">
          공략·자유 게시판을 중심으로 성장할 커뮤니티입니다. 지금은 회원가입,
          로그인, 자유게시판 CRUD를 먼저 사용할 수 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/board/free">
            <Button>자유게시판 바로가기</Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary">회원가입</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/board/free"
          className="group block cursor-pointer rounded-xl border border-border bg-surface p-6 transition hover:bg-surface-hover hover:border-accent/40"
        >
          <article className="pointer-events-none">
            <h2 className="mb-2 font-semibold text-accent">자유게시판</h2>
            <p className="text-sm text-muted">
              자유롭게 이야기를 나누는 공간입니다. 회원만 글 작성이 가능합니다.
            </p>
          </article>
        </Link>
        <article className="rounded-xl border border-dashed border-border bg-surface/50 p-6 opacity-70">
          <h2 className="mb-2 font-semibold">공략 게시판</h2>
          <p className="text-sm text-muted">다음 단계에서 추가 예정입니다.</p>
        </article>
      </div>
    </section>
  );
}
