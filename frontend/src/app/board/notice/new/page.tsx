import { redirect } from "next/navigation";

export default function LegacyNewNoticePage() {
  redirect("/admin/community/notices/new");
}
