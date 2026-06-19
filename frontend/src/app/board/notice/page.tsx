"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import type { PageResponse, PostSummary, User } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NoticeBoardPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const loadPosts = async (pageNum: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<PageResponse<PostSummary>>(
        `/api/posts?boardType=NOTICE&page=${pageNum}&size=10`
      );
      setPosts(data.content);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      setError("Failed to load notice posts.");
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
          <h1 className="text-2xl font-bold">Notice Board</h1>
          <p className="text-sm text-muted">Guests and users can read notices.</p>
        </div>
        {user?.role === "ADMIN" ? (
          <Link href="/admin/community/notices/new">
            <Button>Write Notice</Button>
          </Link>
        ) : null}
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : posts.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
          No notices yet.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/board/notice/${post.id}`}
                className="flex flex-col gap-1 px-4 py-4 transition hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium">[NOTICE] {post.title}</span>
                <span className="flex flex-wrap gap-3 text-xs text-muted">
                  <span>{post.authorNickname}</span>
                  <span>Views {post.viewCount}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="secondary" disabled={page <= 0 || loading} onClick={() => loadPosts(page - 1)}>
            Prev
          </Button>
          <span className="flex items-center px-3 text-sm text-muted">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= totalPages - 1 || loading}
            onClick={() => loadPosts(page + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </section>
  );
}
