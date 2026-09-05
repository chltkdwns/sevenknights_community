import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 이미지에서 node_modules 전체를 복사하지 않도록 standalone 산출물을 사용한다.
  // 로컬 `next dev` / `next start` 동작에는 영향 없다.
  output: "standalone",
};

export default nextConfig;
