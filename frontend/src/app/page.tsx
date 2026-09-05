import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        <h1 className="mb-3 break-keep text-3xl font-bold sm:text-4xl">젤리 길드</h1>
        <p className="mb-3 break-keep text-base font-semibold text-accent sm:text-lg">
          세븐나이츠 젤리 길드 커뮤니티
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          길드원들이 길드전 공략과 게임 정보를 공유할 수 있는 공간입니다.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/guides/guild-war/attack" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">길드전 공략 가기</Button>
          </Link>
          <Link href="/board/free" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              자유게시판 가기
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="flex flex-col rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-2 font-semibold text-accent">길드전 공략</h2>
          <p className="mb-6 flex-1 text-sm text-muted">
            길드전 공격팀과 공략 정보를 확인하고 공유할 수 있습니다.
          </p>
          <Link href="/guides/guild-war/attack" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">길드전 공략 가기</Button>
          </Link>
        </article>
        <article className="flex flex-col rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-2 font-semibold text-accent">자유게시판</h2>
          <p className="mb-6 flex-1 text-sm text-muted">
            길드원들과 자유롭게 이야기를 나눌 수 있습니다.
          </p>
          <Link href="/board/free" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              자유게시판 가기
            </Button>
          </Link>
        </article>
        {/* 아직 페이지·API가 없어 이동하지 않고, 추가 예정 기능으로만 보여 준다. */}
        <article className="flex flex-col rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-2 font-semibold text-accent">길드전 방어팀 추천</h2>
          <p className="mb-6 flex-1 text-sm text-muted">
            길드전 상대 방어팀을 확인하고 공격에 적합한 팀을 추천받을 수 있습니다.
          </p>
          <div>
            <Button
              variant="secondary"
              disabled
              title="준비 중"
              className="w-full cursor-not-allowed sm:w-auto"
            >
              방어팀 추천
            </Button>
            <p className="mt-2 text-xs text-muted">준비 중</p>
          </div>
        </article>
      </div>
    </section>
  );
}
