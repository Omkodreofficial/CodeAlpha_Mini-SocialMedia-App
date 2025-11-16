// client/src/pages/EditProfile.jsx
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth.js";
import { updateProfile, uploadAvatar } from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  function chooseFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  }

  async function save() {
    try {
      setSaving(true);

      // Upload avatar if chosen
      if (file) {
        const form = new FormData();
        form.append("avatar", file);
        const updated = await uploadAvatar(form);
        setUser(updated);
      }

      // Update name/bio
      const updated = await updateProfile({ name, bio });
      setUser(updated);

      navigate("/profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <div className="flex gap-4 items-center">
        <img
          src={
            avatarPreview ||
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"
          }
          className="w-24 h-24 rounded-full object-cover"
        />

        <input type="file" accept="image/*" onChange={chooseFile} />
      </div>

      <div className="mt-4">
        <label className="text-sm">Full Name</label>
        <input
          type="text"
          value={name}
          className="w-full p-2 border border-bordergray rounded mt-1"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm">Bio</label>
        <textarea
          value={bio}
          rows="4"
          className="w-full p-2 border border-bordergray rounded mt-1"
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-5 px-6 py-2 rounded-full bg-brand text-white"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
