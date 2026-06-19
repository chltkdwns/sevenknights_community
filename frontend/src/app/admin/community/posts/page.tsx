"use client";

import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/Button";
import { apiRequest, ApiRequestError } from "@/lib/api";
import type { PageResponse, PostSummary } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR");
}

export default function AdminPostsPage() {
  const [allPosts, setAllPosts] = useState<PostSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const postData = await apiRequest<PageResponse<PostSummary>>(
        "/api/admin/posts?page=0&size=20",
        { auth: true }
      );
      setAllPosts(postData.content);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "게시글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const deletePost = async (id: number) => {
    if (!confirm("이 게시글을 삭제할까요?")) return;
    await apiRequest<void>(`/api/admin/posts/${id}`, { method: "DELETE", auth: true });
    await loadPosts();
  };

  const toggleVisibility = async (post: PostSummary) => {
    const nextHidden = !post.hidden;
    const message = nextHidden
      ? "이 게시글을 숨길까요? 사용자에게는 보이지 않습니다."
      : "이 게시글을 다시 노출할까요?";

    if (!confirm(message)) return;

    setUpdatingId(post.id);
    try {
      await apiRequest<PostSummary>(`/api/admin/posts/${post.id}/visibility`, {
        method: "PUT",
        body: { hidden: nextHidden },
        auth: true,
      });
      await loadPosts();
    } catch (err) {
      alert(err instanceof ApiRequestError ? err.message : "상태 변경에 실패했습니다.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminPanel title="게시글 관리">
      {loading ? <p className="text-muted">불러오는 중...</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}

      {!loading && !error ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {allPosts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  [{post.boardType}] {post.title}
                  {post.hidden ? (
                    <span className="ml-2 rounded bg-muted/20 px-2 py-0.5 text-xs font-medium text-muted">
                      숨김
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-muted">
                  {post.authorNickname} · {formatDate(post.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={updatingId === post.id}
                  onClick={() => toggleVisibility(post)}
                >
                  {updatingId === post.id
                    ? "처리 중..."
                    : post.hidden
                      ? "노출"
                      : "숨김"}
                </Button>
                <Button variant="danger" onClick={() => deletePost(post.id)}>
                  삭제
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </AdminPanel>
  );
}
