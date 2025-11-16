// client/src/components/RightCol.jsx
import { useEffect, useState } from "react";
import { getSuggestions, followUser, unfollowUser } from "../api/api.js";
import Loader from "./Loader.jsx";
import Button from "./Button.jsx";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastProvider.jsx";

function SuggestionRow({ user, onUpdated }) {
  const toast = useToast();
  const [following, setFollowing] = useState(!!user.is_following);
  const [busy, setBusy] = useState(false);

  async function toggleFollow() {
    setBusy(true);
    try {
      if (following) {
        await unfollowUser(user.id);
        setFollowing(false);
        toast.add(`Unfollowed ${user.username}`, { type: "info" });
      } else {
        await followUser(user.id);
        setFollowing(true);
        toast.add(`Following ${user.username}`, { type: "success" });
      }
      if (onUpdated) onUpdated();
    } catch (e) {
      toast.add("Action failed", { type: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <Link to={`/user/${user.username}`} className="flex items-center gap-3">
        <img
          src={
            user.avatar ||
            "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold dark:text-gray-100">{user.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
          </div>
        </div>
      </Link>
      <Button
        variant={following ? "ghost" : "secondary"}
        size="sm"
        onClick={toggleFollow}
        disabled={busy}
      >
        {following ? "Following" : "Follow"}
      </Button>
    </div>
  );
}

export default function RightCol() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const s = await getSuggestions();
      setUsers(s || []);
    } catch (e) {
      console.error("suggestions error", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <aside className="card sticky top-4 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="h-title">Who to Follow</h3>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="text-sm text-gray-500">You're all caught up!</div>
          ) : (
            users.map((u) => (
              <SuggestionRow key={u.id} user={u} onUpdated={load} />
            ))
          )}
        </div>
      )}
    </aside>
  );
}
