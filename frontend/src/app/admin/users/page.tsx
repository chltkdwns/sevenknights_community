"use client";

import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/Button";
import { apiRequest, ApiRequestError } from "@/lib/api";
import type { Role, User } from "@/types";

function roleLabel(role: Role) {
  if (role === "ADMIN") return "관리자";
  if (role === "MEMBER") return "길드원";
  return "미승인";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const userData = await apiRequest<User[]>("/api/admin/users", { auth: true });
        setUsers(userData);
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : "회원 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateRole = async (userId: number, role: Extract<Role, "USER" | "MEMBER">) => {
    setUpdatingId(userId);
    setError("");
    try {
      const updated = await apiRequest<User>(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        auth: true,
        body: { role },
      });
      setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "권한을 변경하지 못했습니다.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminPanel title="회원 관리">
      {loading ? <p className="text-muted">불러오는 중...</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}

      {!loading && !error ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {users.map((user) => (
            <li key={user.id} className="flex flex-col gap-3 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-medium">{user.username}</span>
                <span className="ml-3 text-muted">{user.nickname}</span>
                <span className="ml-3 text-accent">{roleLabel(user.role)}</span>
              </div>
              {user.role === "USER" ? (
                <Button
                  type="button"
                  disabled={updatingId === user.id}
                  onClick={() => updateRole(user.id, "MEMBER")}
                >
                  {updatingId === user.id ? "처리 중..." : "길드원 승인"}
                </Button>
              ) : null}
              {user.role === "MEMBER" ? (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={updatingId === user.id}
                  onClick={() => updateRole(user.id, "USER")}
                >
                  {updatingId === user.id ? "처리 중..." : "승인 취소"}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </AdminPanel>
  );
}
