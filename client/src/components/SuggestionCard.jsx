// client/src/components/SuggestionCard.jsx
import { useState } from "react";
import { followUser, unfollowUser } from "../api/api.js";
import { Link } from "react-router-dom";

export default function SuggestionCard({ user }) {
  const [following, setFollowing] = useState(user.following);

  async function toggle() {
    if (following) {
      await unfollowUser(user.id);
      setFollowing(false);
    } else {
      await followUser(user.id);
      setFollowing(true);
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
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-gray-500 text-sm">@{user.username}</div>
        </div>
      </Link>

      <button
        onClick={toggle}
        className={`px-3 py-1 rounded-full text-sm border
          ${following ? "bg-brand text-white border-brand" : "text-black"}
          hover:bg-brand hover:text-white transition`}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
