"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { PostForm } from "@/components/board/PostForm";
import { apiRequest, ApiRequestError } from "@/lib/api";
import type { PostDetail } from "@/types";

export default function AdminNewNoticePage() {
  const router = useRouter();

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

      await apiRequest<PostDetail>("/api/posts", {
        method: "POST",
        body: formData,
        auth: true,
      });
      router.push("/admin/community/notices");
    } catch (err) {
      throw new ApiRequestError(
        err instanceof ApiRequestError ? err.status : 500,
        err instanceof ApiRequestError ? err.message : "공지 등록에 실패했습니다."
      );
    }
  };

  return (
    <>
      <Link
        href="/admin/community/notices"
        className="mb-4 inline-block text-sm text-muted hover:text-foreground"
      >
        ← 공지 관리
      </Link>
      <AdminPanel title="공지 작성">
        <PostForm submitLabel="등록" allowImageUpload onSubmit={handleSubmit} />
      </AdminPanel>
    </>
  );
}
