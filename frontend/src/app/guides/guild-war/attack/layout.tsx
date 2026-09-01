"use client";

import { useParams } from "next/navigation";
import { GuildWarAttackProvider } from "@/components/guild-war/GuildWarAttackProvider";
import { GuildWarEnemyTeamSidebar } from "@/components/guild-war/GuildWarEnemyTeamSidebar";

export default function GuildWarAttackLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuildWarAttackProvider>
      <GuildWarAttackShell>{children}</GuildWarAttackShell>
    </GuildWarAttackProvider>
  );
}

function GuildWarAttackShell({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const selectedTeamId = Number(params.id);

  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      <div className="min-w-0 flex-1">{children}</div>
      <GuildWarEnemyTeamSidebar
        selectedTeamId={Number.isNaN(selectedTeamId) ? undefined : selectedTeamId}
      />
    </div>
  );
}
