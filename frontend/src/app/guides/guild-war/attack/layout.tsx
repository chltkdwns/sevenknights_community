"use client";

import { useParams } from "next/navigation";
import { GuildWarAttackProvider } from "@/components/guild-war/GuildWarAttackProvider";
import { GuildWarEnemyTeamSidebar } from "@/components/guild-war/GuildWarEnemyTeamSidebar";
import { GuildWarGuideGuard } from "@/components/guild-war/GuildWarGuideGuard";

export default function GuildWarAttackLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuildWarGuideGuard>
      <GuildWarAttackProvider>
        <GuildWarAttackShell>{children}</GuildWarAttackShell>
      </GuildWarAttackProvider>
    </GuildWarGuideGuard>
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
