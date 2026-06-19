"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/Button";
import { apiRequest, ApiRequestError } from "@/lib/api";
import type { PageResponse, PostSummary } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR");
}

export default function AdminNoticesPage() {
  const [noticePosts, setNoticePosts] = useState<PostSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadNotices = async () => {
    setLoading(true);
    setError("");
    try {
      const noticeData = await apiRequest<PageResponse<PostSummary>>(
        "/api/posts?boardType=NOTICE&page=0&size=20"
      );
      setNoticePosts(noticeData.content);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "공지 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const deleteNotice = async (id: number) => {
    if (!confirm("이 공지를 삭제할까요?")) return;
    await apiRequest<void>(`/api/posts/${id}`, { method: "DELETE", auth: true });
    await loadNotices();
  };

  return (
    <AdminPanel
      title="공지 관리"
      action={
        <Link href="/admin/community/notices/new">
          <Button>공지 작성</Button>
        </Link>
      }
    >
      {loading ? <p className="text-muted">불러오는 중...</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}

      {!loading && !error ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {noticePosts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-xs text-muted">{formatDate(post.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/community/notices/${post.id}/edit`}>
                  <Button variant="secondary">수정</Button>
                </Link>
                <Button variant="danger" onClick={() => deleteNotice(post.id)}>
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
