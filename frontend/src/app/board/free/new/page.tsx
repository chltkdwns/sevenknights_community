"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { PostForm } from "@/components/board/PostForm";
import type { PostDetail } from "@/types";

export default function NewFreePostPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    images: File[];
  }) => {
    try {
      const formData = new FormData();
      formData.append(
        "request",
        new Blob(
          [
            JSON.stringify({
              title: data.title,
              content: data.content,
              boardType: "FREE",
            }),
          ],
          { type: "application/json" }
        )
      );
      data.images.forEach((image) => formData.append("images", image));

      const post = await apiRequest<PostDetail>("/api/posts", {
        method: "POST",
        body: formData,
        auth: true,
      });
      router.push(`/board/free/${post.id}`);
    } catch (err) {
      throw new ApiRequestError(
        err instanceof ApiRequestError ? err.status : 500,
        err instanceof ApiRequestError ? err.message : "글 작성에 실패했습니다."
      );
    }
  };

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">글쓰기 — 자유게시판</h1>
      <PostForm submitLabel="등록" allowImageUpload onSubmit={handleSubmit} />
    </section>
  );
}
