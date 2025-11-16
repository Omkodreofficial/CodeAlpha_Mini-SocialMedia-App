// client/src/components/CommentModal.jsx
import { useState, useEffect } from "react";
import { getComments, createComment } from "../api/api.js";
import useAuth from "../hooks/useAuth.js";

export default function CommentModal({ post, close, onComment }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  async function load() {
    const data = await getComments(post.id);
    setComments(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function add() {
    if (!text.trim()) return;

    await createComment(post.id, text.trim());
    setText("");
    await load();
    onComment();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 w-[500px] rounded-2xl shadow-xl">
        <h2 className="text-lg font-semibold">Comments</h2>

        <div className="mt-4 max-h-[300px] overflow-y-auto space-y-4 pr-2">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <img
                src={
                  c.avatar ||
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"
                }
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-gray-600 text-sm">@{c.username}</div>
                <p className="mt-1">{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 border border-bordergray rounded"
            placeholder="Add a comment..."
          />
          <button
            onClick={add}
            className="bg-brand text-white px-4 py-2 rounded-xl"
          >
            Post
          </button>
        </div>

        <button
          onClick={close}
          className="w-full mt-4 text-sm text-gray-600 hover:text-red-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}
