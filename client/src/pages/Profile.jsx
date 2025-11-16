// client/src/pages/Profile.jsx
import React, { useState } from "react";
import useAuth from "../hooks/useAuth.js";
import Button from "../components/Button.jsx";
import { updateProfile, uploadAvatar, getUserProfile } from "../api/api.js";
import { useToast } from "../context/ToastProvider.jsx";

export default function Profile() {
  const { user, refresh } = useAuth() || {};
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="card">Loading...</div>;

  async function saveProfile() {
    setLoading(true);
    try {
      await updateProfile({ name: form.name, bio: form.bio });
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        await uploadAvatar(fd);
      }
      toast.add("Profile updated", { type: "success" });
      setEditing(false);
      if (refresh) await refresh(); // ask auth provider to reload profile
    } catch (e) {
      toast.add("Update failed", { type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card relative overflow-hidden p-0">
        <div
          style={{
            height: 160,
            background: "linear-gradient(90deg,#0db8a6,#086b66)",
          }}
        />
        <div style={{ position: "absolute", bottom: -40, left: 24 }}>
          <img
            src={
              user.avatar ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"
            }
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-white dark:border-[#1e1e1e] object-cover"
          />
        </div>

        <div style={{ paddingTop: 56, paddingLeft: 170 }} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                {user.bio || "No bio yet."}
              </div>
            </div>

            <div>
              <Button variant="secondary" onClick={() => setEditing(true)}>
                Edit profile
              </Button>
            </div>
          </div>

          <div className="mt-4 flex gap-6">
            <div>
              <div className="font-semibold">108</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
            <div>
              <div className="font-semibold">1,204</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-6 border-b border-bordergray pb-3">
          <button className="h-title">Posts</button>
          <button className="text-sm text-gray-500">Replies</button>
          <button className="text-sm text-gray-500">Likes</button>
        </div>

        <div className="py-6 text-center text-gray-500">
          User posts will appear here.
        </div>
      </div>

      {editing && (
        <div className="card">
          <h3 className="h-title mb-3">Edit profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm block mb-1">Full name</label>
              <input
                className="input w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Bio</label>
              <textarea
                className="input w-full"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0])}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" loading={loading} onClick={saveProfile}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
