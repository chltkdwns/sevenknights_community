import { apiRequest, ApiRequestError } from "@/lib/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

export function validateImageFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return "jpg, jpeg, png, webp 이미지만 업로드할 수 있습니다.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "이미지 1장당 최대 5MB까지 업로드할 수 있습니다.";
  }
  return null;
}

export async function uploadAdminImage(file: File): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new ApiRequestError(400, validationError);
  }

  const formData = new FormData();
  formData.append("image", file);

  const result = await apiRequest<{ url: string }>("/api/admin/uploads/images", {
    method: "POST",
    body: formData,
    auth: true,
  });

  return result.url;
}
