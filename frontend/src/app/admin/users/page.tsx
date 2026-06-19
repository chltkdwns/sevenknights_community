"use client";

import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { apiRequest, ApiRequestError } from "@/lib/api";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <AdminPanel title="회원 관리">
      {loading ? <p className="text-muted">불러오는 중...</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}

      {!loading && !error ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {users.map((user) => (
            <li key={user.id} className="p-4 text-sm">
              <span className="font-medium">{user.username}</span>
              <span className="ml-3 text-muted">{user.email}</span>
              <span className="ml-3 text-accent">{user.role}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </AdminPanel>
  );
}
