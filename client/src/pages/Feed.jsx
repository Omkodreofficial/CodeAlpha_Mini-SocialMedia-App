// client/src/pages/Feed.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { getFeed } from "../api/api.js";
import CreatePost from "../components/CreatePost.jsx";
import PostCard from "../components/PostCard.jsx";
import Loader from "../components/Loader.jsx";

const PAGE_SIZE = 6;

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  const loadFeedPage = useCallback(async (p = 0, replace = false) => {
    try {
      if (p === 0) setLoading(true);
      else setLoadingMore(true);

      setError(null);
      const res = await getFeed({ page: p, size: PAGE_SIZE });
      let newPosts = Array.isArray(res) ? res : res.posts || [];

      if (replace) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => {
          const map = new Map();
          prev.forEach((it) => map.set(it.id, it));
          newPosts.forEach((it) => map.set(it.id, it));
          return Array.from(map.values()).sort(
            (a, b) => b.created_at - a.created_at
          );
        });
      }

      setHasMore(newPosts.length >= PAGE_SIZE);
    } catch (e) {
      console.error("Feed load error", e);
      setError("Failed to load feed.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadFeedPage(0, true);
    setPage(0);
  }, [loadFeedPage]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && !loading) {
          const next = page + 1;
          loadFeedPage(next);
          setPage(next);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    const node = observerRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [page, hasMore, loadingMore, loading, loadFeedPage]);

  async function refreshFeed() {
    setPage(0);
    await loadFeedPage(0, true);
  }

  async function onPosted() {
    setPage(0);
    await loadFeedPage(0, true);
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="h-title">Home</h2>
          <div className="flex gap-2">
            <button
              onClick={refreshFeed}
              className="px-3 py-1 border rounded-full text-sm hover:bg-offwhite"
            >
              Refresh
            </button>
          </div>
        </div>

        <CreatePost onPosted={onPosted} />

        {loading && (
          <>
            <Loader />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-48 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && error && (
          <div className="text-center text-red-600 py-6">{error}</div>
        )}
        {!loading && posts.length === 0 && (
          <div className="text-center py-10 text-gray-600">No posts yet.</div>
        )}

        {!loading &&
          posts.map((p, idx) => (
            <div key={p.id}>
              <PostCard post={p} onAction={refreshFeed} />
              {idx === posts.length - 1 && <div ref={observerRef} />}
            </div>
          ))}

        {loadingMore && (
          <div className="py-4">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
