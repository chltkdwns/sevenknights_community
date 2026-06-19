"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { PostForm } from "@/components/board/PostForm";
import { apiRequest, ApiRequestError } from "@/lib/api";
import type { PostDetail } from "@/types";

export default function AdminEditNoticePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest<PostDetail>(`/api/posts/${id}`);
        if (data.boardType !== "NOTICE") {
          setError("공지 게시글이 아닙니다.");
          return;
        }
        setPost(data);
      } catch {
        setError("공지를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: { title: string; content: string; images: File[] }) => {
    try {
      await apiRequest<PostDetail>(`/api/posts/${id}`, {
        method: "PUT",
        body: { title: data.title, content: data.content },
        auth: true,
      });
      router.push("/admin/community/notices");
    } catch (err) {
      throw new ApiRequestError(
        err instanceof ApiRequestError ? err.status : 500,
        err instanceof ApiRequestError ? err.message : "공지 수정에 실패했습니다."
      );
    }
  };

  if (loading) {
    return <p className="text-muted">불러오는 중...</p>;
  }

  if (error || !post) {
    return (
      <>
        <Link
          href="/admin/community/notices"
          className="mb-4 inline-block text-sm text-muted hover:text-foreground"
        >
          ← 공지 관리
        </Link>
        <AdminPanel>
          <p className="text-danger">{error || "공지를 찾을 수 없습니다."}</p>
        </AdminPanel>
      </>
    );
  }

  return (
    <>
      <Link
        href="/admin/community/notices"
        className="mb-4 inline-block text-sm text-muted hover:text-foreground"
      >
        ← 공지 관리
      </Link>
      <AdminPanel title="공지 수정">
        <PostForm
          initialTitle={post.title}
          initialContent={post.content}
          initialImages={post.images}
          submitLabel="저장"
          onSubmit={handleSubmit}
        />
      </AdminPanel>
    </>
  );
}
