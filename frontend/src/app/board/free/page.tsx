"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import type { PageResponse, PostSummary } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FreeBoardPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loggedIn = isLoggedIn();

  const loadPosts = async (pageNum: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<PageResponse<PostSummary>>(
        `/api/posts?boardType=FREE&page=${pageNum}&size=10`
      );
      setPosts(data.content);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      setError("게시글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(0);
  }, []);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">자유게시판</h1>
          <p className="text-sm text-muted">비회원도 글 조회가 가능합니다.</p>
        </div>
        {loggedIn ? (
          <Link href="/board/free/new">
            <Button>글쓰기</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="secondary">로그인 후 글쓰기</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-muted">불러오는 중...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : posts.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
          아직 게시글이 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/board/free/${post.id}`}
                className="flex flex-col gap-1 px-4 py-4 transition hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium">{post.title}</span>
                <span className="flex flex-wrap gap-3 text-xs text-muted">
                  <span>{post.authorNickname}</span>
                  <span>조회 {post.viewCount}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="secondary"
            disabled={page <= 0 || loading}
            onClick={() => loadPosts(page - 1)}
          >
            이전
          </Button>
          <span className="flex items-center px-3 text-sm text-muted">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= totalPages - 1 || loading}
            onClick={() => loadPosts(page + 1)}
          >
            다음
          </Button>
        </div>
      ) : null}
    </section>
  );
}
