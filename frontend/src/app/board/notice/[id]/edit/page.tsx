import { redirect } from "next/navigation";

type LegacyEditNoticePageProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyEditNoticePage({ params }: LegacyEditNoticePageProps) {
  const { id } = await params;
  redirect(`/admin/community/notices/${id}/edit`);
}
