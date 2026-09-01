import { resolveImageUrl } from "@/lib/image";

type GuideImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  label?: string;
};

export function GuideImage({ src, alt, className = "", label = "이미지" }: GuideImageProps) {
  const imageUrl = resolveImageUrl(src);

  if (!imageUrl) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-border bg-background text-[10px] text-muted ${className}`}
        aria-label={`${alt} ${label} 없음`}
      >
        {label}
      </div>
    );
  }

  return <img src={imageUrl} alt={alt} className={`object-cover ${className}`} />;
}
