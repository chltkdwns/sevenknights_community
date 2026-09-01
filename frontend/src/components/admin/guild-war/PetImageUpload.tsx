"use client";
"use no memo";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { resolveImageUrl } from "@/lib/image";
import { uploadAdminImage, validateImageFile } from "@/lib/upload-image";

type PetImageUploadProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
};

export function PetImageUpload({
  label = "펫 이미지 (선택)",
  value,
  onChange,
}: PetImageUploadProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const localPreviewRef = useRef<string | null>(null);

  const savedPreview = resolveImageUrl(value);
  const displayUrl = localPreview ?? savedPreview;

  useEffect(() => {
    return () => {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
      }
    };
  }, []);

  const clearLocalPreview = () => {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current);
      localPreviewRef.current = null;
    }
    setLocalPreview(null);
  };

  const handleFileChange = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setError("");
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    clearLocalPreview();
    const objectUrl = URL.createObjectURL(file);
    localPreviewRef.current = objectUrl;
    setLocalPreview(objectUrl);

    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      clearLocalPreview();
      onChange(url);
    } catch (err) {
      clearLocalPreview();
      setError(err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    clearLocalPreview();
    onChange("");
    setError("");
  };

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-muted">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              void handleFileChange(event.target.files);
              event.target.value = "";
            }}
          />
          <span className="inline-flex items-center rounded-lg border border-border bg-background px-3 py-2 text-sm transition hover:bg-surface-hover">
            {uploading ? "업로드 중..." : "이미지 선택"}
          </span>
        </label>
        {value || localPreview ? (
          <Button type="button" variant="ghost" onClick={handleRemove} disabled={uploading}>
            이미지 제거
          </Button>
        ) : null}
      </div>
      <span className="text-xs text-muted">jpg, jpeg, png, webp · 최대 5MB</span>

      {displayUrl ? (
        <div className="relative mt-1 w-fit">
          <img
            src={displayUrl}
            alt="펫 이미지 미리보기"
            className={`h-24 w-24 rounded-lg border border-border object-cover ${
              uploading ? "opacity-60" : ""
            }`}
          />
        </div>
      ) : null}

      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
