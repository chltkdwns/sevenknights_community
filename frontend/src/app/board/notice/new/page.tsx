"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { PostForm } from "@/components/board/PostForm";
import type { PostDetail } from "@/types";

export default function NewNoticePage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "ADMIN") {
      router.replace("/board/notice");
    }
  }, [router]);

  const handleSubmit = async (data: { title: string; content: string; images: File[] }) => {
    try {
      const formData = new FormData();
      formData.append(
        "request",
        new Blob(
          [
            JSON.stringify({
              title: data.title,
              content: data.content,
              boardType: "NOTICE",
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
      router.push(`/board/notice/${post.id}`);
    } catch (err) {
      throw new ApiRequestError(
        err instanceof ApiRequestError ? err.status : 500,
        err instanceof ApiRequestError ? err.message : "Failed to create notice."
      );
    }
  };

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Write Notice</h1>
      <PostForm submitLabel="Create" allowImageUpload onSubmit={handleSubmit} />
    </section>
  );
}
