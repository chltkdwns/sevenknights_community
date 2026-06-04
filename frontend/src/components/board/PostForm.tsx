"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { PostImage } from "@/types";

interface PostFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialImages?: PostImage[];
  allowImageUpload?: boolean;
  submitLabel: string;
  onSubmit: (data: { title: string; content: string; images: File[] }) => Promise<void>;
}

const MAX_IMAGE_COUNT = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

type PreviewImage = {
  file: File;
  url: string;
};

export function PostForm({
  initialTitle = "",
  initialContent = "",
  initialImages = [],
  allowImageUpload = false,
  submitLabel,
  onSubmit,
}: PostFormProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const imagesRef = useRef<PreviewImage[]>([]);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    setImageError("");
    const selectedFiles = Array.from(files);
    const nextValidFiles: PreviewImage[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        errors.push(`${file.name}: jpg, jpeg, png, webp만 업로드 가능합니다.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: 5MB를 초과했습니다.`);
        continue;
      }

      nextValidFiles.push({ file, url: URL.createObjectURL(file) });
    }

    if (images.length + nextValidFiles.length > MAX_IMAGE_COUNT) {
      nextValidFiles.forEach((item) => URL.revokeObjectURL(item.url));
      setImageError("이미지는 최대 10장까지 업로드할 수 있습니다.");
      return;
    }

    if (errors.length > 0) {
      setImageError(errors.slice(0, 2).join(" "));
    }

    setImages((prev) => {
      const updated = [...prev, ...nextValidFiles];
      imagesRef.current = updated;
      return updated;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      const updated = prev.filter((_, i) => i !== index);
      imagesRef.current = updated;
      return updated;
    });
  };

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({ title, content, images: images.map((item) => item.file) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6"
    >
      <Input
        label="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={200}
      />
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-muted">내용</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          className="resize-y rounded-lg border border-border bg-background px-3 py-2.5 outline-none transition focus:border-accent"
        />
      </label>
      {allowImageUpload ? (
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-muted">이미지 첨부 (여러 장 가능)</span>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => handleImageChange(e.target.files)}
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
          />
          <span className="text-xs text-muted">최대 10장, 이미지당 5MB, jpg/jpeg/png/webp</span>
        </label>
      ) : null}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <div key={image.url} className="relative">
              <img
                src={image.url}
                alt="업로드 미리보기"
                className="h-28 w-full rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded bg-background/80 px-1.5 py-0.5 text-xs text-danger border border-danger/40"
                aria-label="이미지 제거"
              >
                X
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {!allowImageUpload && initialImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {initialImages.map((image) => (
            <img
              key={image.id}
              src={`${apiBase}${image.url}`}
              alt={image.originalFileName}
              className="h-28 w-full rounded-lg border border-border object-cover"
            />
          ))}
        </div>
      ) : null}
      {imageError ? <p className="text-sm text-danger">{imageError}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "저장 중..." : submitLabel}
      </Button>
    </form>
  );
}
