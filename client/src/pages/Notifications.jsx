// client/src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../api/api.js";
import { useToast } from "../context/ToastProvider.jsx";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const data = await getNotifications();
      setList(data || []);
    } catch (e) {
      toast.add("Failed to load notifications", { type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  async function markRead(n) {
    try {
      await markNotificationRead(n.id);
      setList((s) => s.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    } catch (e) {
      toast.add("Failed to mark read", { type: "error" });
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="h-title">Notifications</h2>
      {loading && <div className="text-gray-500">Loading...</div>}
      {!loading && list.length === 0 && (
        <div className="text-gray-500">No notifications</div>
      )}
      <div className="space-y-2">
        {list.map((n) => (
          <div key={n.id} className={`card p-3 ${n.read ? "opacity-80" : ""}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-gray-500">{n.body}</div>
              </div>
              {!n.read && (
                <button
                  className="text-sm text-brand"
                  onClick={() => markRead(n)}
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
