"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import type { PageResponse, PostSummary, User } from "@/types";

type AdminMenu = "notice" | "users" | "posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR");
}

export default function AdminPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<AdminMenu>("notice");
  const [users, setUsers] = useState<User[]>([]);
  const [noticePosts, setNoticePosts] = useState<PostSummary[]>([]);
  const [allPosts, setAllPosts] = useState<PostSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [userData, noticeData, postData] = await Promise.all([
        apiRequest<User[]>("/api/admin/users", { auth: true }),
        apiRequest<PageResponse<PostSummary>>("/api/posts?boardType=NOTICE&page=0&size=20"),
        apiRequest<PageResponse<PostSummary>>("/api/admin/posts?page=0&size=20", { auth: true }),
      ]);
      setUsers(userData);
      setNoticePosts(noticeData.content);
      setAllPosts(postData.content);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "관리자 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "ADMIN") {
      router.replace("/");
      return;
    }
    loadAll();
  }, [router]);

  const deleteNotice = async (id: number) => {
    if (!confirm("이 공지를 삭제할까요?")) return;
    await apiRequest<void>(`/api/posts/${id}`, { method: "DELETE", auth: true });
    await loadAll();
  };

  const deletePost = async (id: number) => {
    if (!confirm("이 게시글을 삭제할까요?")) return;
    await apiRequest<void>(`/api/admin/posts/${id}`, { method: "DELETE", auth: true });
    await loadAll();
  };

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-muted">관리자 메뉴</h2>
        <div className="flex flex-col gap-2">
          <Button variant={menu === "notice" ? "primary" : "secondary"} onClick={() => setMenu("notice")}>
            공지 관리
          </Button>
          <Button variant={menu === "users" ? "primary" : "secondary"} onClick={() => setMenu("users")}>
            회원 관리
          </Button>
          <Button variant={menu === "posts" ? "primary" : "secondary"} onClick={() => setMenu("posts")}>
            게시글 관리
          </Button>
        </div>
      </aside>

      <main className="rounded-xl border border-border bg-surface p-6">
        {loading ? <p className="text-muted">불러오는 중...</p> : null}
        {error ? <p className="text-danger">{error}</p> : null}

        {!loading && menu === "notice" ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-bold">공지 관리</h1>
              <Link href="/board/notice/new">
                <Button>공지 작성</Button>
              </Link>
            </div>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {noticePosts.map((post) => (
                <li key={post.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted">{formatDate(post.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/board/notice/${post.id}/edit`}>
                      <Button variant="secondary">수정</Button>
                    </Link>
                    <Button variant="danger" onClick={() => deleteNotice(post.id)}>
                      삭제
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!loading && menu === "users" ? (
          <div>
            <h1 className="mb-4 text-xl font-bold">회원 관리</h1>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {users.map((user) => (
                <li key={user.id} className="p-4 text-sm">
                  <span className="font-medium">{user.username}</span>
                  <span className="ml-3 text-muted">{user.email}</span>
                  <span className="ml-3 text-accent">{user.role}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!loading && menu === "posts" ? (
          <div>
            <h1 className="mb-4 text-xl font-bold">게시글 관리</h1>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {allPosts.map((post) => (
                <li key={post.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">[{post.boardType}] {post.title}</p>
                    <p className="text-xs text-muted">{post.authorNickname} · {formatDate(post.createdAt)}</p>
                  </div>
                  <Button variant="danger" onClick={() => deletePost(post.id)}>
                    삭제
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </main>
    </section>
  );
}
