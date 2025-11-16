// client/src/components/CreatePost.jsx
import { useState } from "react";
import { createPostFD } from "../api/api.js";
import useAuth from "../hooks/useAuth.js";
import Button from "./Button.jsx";
import { Image } from "phosphor-react";

export default function CreatePost({ onPosted }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  function chooseImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImg(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit() {
    if (!text.trim() && !img) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("content", text.trim());
    if (img) fd.append("image", img);

    try {
      await createPostFD(fd);
      setText("");
      setImg(null);
      setPreview(null);
      if (onPosted) await onPosted();
    } catch (e) {
      console.error("Create post failed", e);
      alert("Post failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="flex gap-3">
        <img
          src={
            user?.avatar ||
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"
          }
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <textarea
          placeholder="What's happening?"
          className="flex-1 resize-none p-3 input"
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-3 rounded-xl max-h-80 object-cover w-full border border-bordergray"
        />
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-brand">
            <Image size={18} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={chooseImage}
            />
          </label>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setText("");
              setImg(null);
              setPreview(null);
            }}
          >
            Clear
          </Button>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={submit}
          disabled={loading || (!text.trim() && !img)}
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
