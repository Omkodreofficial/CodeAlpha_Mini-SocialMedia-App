// client/src/components/PostCard.jsx
import React, { useState } from "react";
import {
  DotsThree,
  Heart,
  ChatCircle,
  ShareNetwork,
  Trash,
  Pencil,
} from "phosphor-react";
import Button from "./Button.jsx";
import { useAuth } from "../context/AuthProvider.jsx";
import api from "../api/api.js"; // default axios instance

export default function PostCard({ post, onDeleted, onUpdated }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = user && post.user_id === user.id;
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${post.id}`);
      onDeleted && onDeleted(post.id);
    } catch (e) {
      console.error("delete failed", e);
      alert("Failed to delete post");
    }
  }

  async function toggleLike() {
    try {
      if (liked) {
        const res = await api.post(`/posts/${post.id}/unlike`);
        setLiked(false);
        setLikesCount(res.likes_count ?? (likesCount > 0 ? likesCount - 1 : 0));
      } else {
        const res = await api.post(`/posts/${post.id}/like`);
        setLiked(true);
        setLikesCount(res.likes_count ?? likesCount + 1);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <img
            src={post.user_avatar || "/images/default-avatar.png"}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-sm">{post.user_name}</div>
            <div className="text-xs text-gray-500">
              @{post.user_username} ·{" "}
              <span className="text-xs">
                {new Date(post.created_at * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <DotsThree size={20} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-lg shadow-lg z-50">
              <div className="flex flex-col">
                {isOwner ? (
                  <>
                    <button
                      className="px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-2"
                      onClick={() => {
                        setMenuOpen(false); /* call edit flow */
                      }}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      className="px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-900 text-red-600 flex items-center gap-2"
                      onClick={handleDelete}
                    >
                      <Trash size={16} /> Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button className="px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-2">
                      Report
                    </button>
                    <button className="px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-2">
                      Unfollow @{post.user_username}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-900 dark:text-gray-100">
        {post.content}
      </div>

      {post.image_url && (
        <img
          src={post.image_url}
          alt="post"
          className="mt-3 w-full rounded-xl object-cover"
        />
      )}

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <button
          onClick={() => {
            /* open comments */
          }}
          className="flex items-center gap-1 hover:text-[#00A79D]"
        >
          <ChatCircle size={18} /> <span>{post.comments_count ?? 0}</span>
        </button>

        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 ${
            liked ? "text-[#E0245E]" : "hover:text-[#E0245E]"
          }`}
        >
          <Heart weight={liked ? "fill" : "regular"} size={18} />{" "}
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => {
            /* share */
          }}
          className="flex items-center gap-1 hover:text-[#00A79D]"
        >
          <ShareNetwork size={18} /> Share
        </button>
      </div>
    </div>
  );
}
