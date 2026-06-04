"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { PostForm } from "@/components/board/PostForm";
import type { PostDetail } from "@/types";

export default function EditFreePostPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    if (!id || Number.isNaN(id)) return;
    (async () => {
      try {
        const data = await apiRequest<PostDetail>(`/api/posts/${id}`);
        setPost(data);
      } catch {
        router.replace("/board/free");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    images: File[];
  }) => {
    try {
      await apiRequest<PostDetail>(`/api/posts/${id}`, {
        method: "PUT",
        body: { title: data.title, content: data.content },
        auth: true,
      });
      router.push(`/board/free/${id}`);
    } catch (err) {
      throw new ApiRequestError(
        err instanceof ApiRequestError ? err.status : 500,
        err instanceof ApiRequestError ? err.message : "수정에 실패했습니다."
      );
    }
  };

  if (loading) {
    return <p className="text-muted">불러오는 중...</p>;
  }

  if (!post) return null;

  return (
    <section className="mx-auto max-w-2xl">
      <Link
        href={`/board/free/${id}`}
        className="mb-4 inline-block text-sm text-muted hover:text-foreground"
      >
        ← 글 보기
      </Link>
      <h1 className="mb-6 text-2xl font-bold">글 수정</h1>
      <PostForm
        initialTitle={post.title}
        initialContent={post.content}
        initialImages={post.images}
        submitLabel="저장"
        onSubmit={handleSubmit}
      />
    </section>
  );
}
