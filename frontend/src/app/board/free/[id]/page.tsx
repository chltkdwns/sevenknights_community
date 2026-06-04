"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { getStoredUser, isLoggedIn } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import type { PostDetail, User } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR");
}

export default function FreePostDetailPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    (async () => {
      setLoading(true);
      try {
        const data = await apiRequest<PostDetail>(`/api/posts/${id}`);
        setPost(data);
      } catch {
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const canEdit =
    post &&
    user &&
    (user.id === post.authorId || user.role === "ADMIN");

  const handleDelete = async () => {
    if (!post || !confirm("이 게시글을 삭제할까요?")) return;
    setDeleting(true);
    try {
      await apiRequest<void>(`/api/posts/${post.id}`, {
        method: "DELETE",
        auth: true,
      });
      router.push("/board/free");
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "삭제에 실패했습니다.";
      alert(message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-muted">불러오는 중...</p>;
  }

  if (error || !post) {
    return (
      <div>
        <p className="text-danger">{error || "게시글을 찾을 수 없습니다."}</p>
        <Link href="/board/free" className="mt-4 inline-block text-accent">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/board/free"
        className="mb-4 inline-block text-sm text-muted hover:text-foreground"
      >
        ← 목록
      </Link>
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h1 className="mb-4 text-2xl font-bold">{post.title}</h1>
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted">
          <span>{post.authorNickname}</span>
          <span>조회 {post.viewCount}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>
        {post.images.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {post.images.map((image) => (
              <img
                key={image.id}
                src={`${apiBase}${image.url}`}
                alt={image.originalFileName}
                className="h-32 w-full rounded-lg border border-border object-cover"
              />
            ))}
          </div>
        ) : null}
      </div>

      {canEdit ? (
        <div className="mt-4 flex gap-2">
          <Link href={`/board/free/${post.id}/edit`}>
            <Button variant="secondary">수정</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      ) : null}

      {!isLoggedIn() ? (
        <p className="mt-6 text-sm text-muted">
          글을 작성하려면{" "}
          <Link href="/login" className="text-accent hover:underline">
            로그인
          </Link>
          이 필요합니다.
        </p>
      ) : null}
    </article>
  );
}
