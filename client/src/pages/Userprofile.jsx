// client/src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, followUser, unfollowUser } from "../api/api.js";
import useAuth from "../hooks/useAuth.js";

export default function UserProfile() {
  const { username } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [following, setFollowing] = useState(false);

  async function load() {
    const data = await getUserProfile(username);
    setProfile(data);
  }

  useEffect(() => {
    load();
  }, [username]);

  if (!profile) return <div className="text-center py-10">Loading...</div>;

  const isMe = user.username === username;

  async function toggleFollow() {
    if (following) {
      await unfollowUser(profile.id);
      setFollowing(false);
    } else {
      await followUser(profile.id);
      setFollowing(true);
    }
  }

  return (
    <div>
      <div className="h-40 bg-brand rounded-xl mb-4"></div>

      <div className="flex items-center gap-4 -mt-16 px-2">
        <img
          src={
            profile.avatar ||
            "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80"
          }
          className="w-28 h-28 rounded-full border-4 border-white object-cover"
        />
        <div>
          <div className="text-xl font-semibold">{profile.name}</div>
          <div className="text-gray-500">@{profile.username}</div>
        </div>
      </div>

      <div className="px-2 mt-3">
        <p className="text-gray-700">{profile.bio || "No bio yet."}</p>

        {!isMe && (
          <button
            onClick={toggleFollow}
            className={`mt-4 px-4 py-2 rounded-full text-sm ${
              following ? "bg-brand text-white" : "border"
            }`}
          >
            {following ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
}
