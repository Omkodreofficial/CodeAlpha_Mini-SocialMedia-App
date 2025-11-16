// client/src/api/api.js
import axios from "axios";
import { getItem, saveItem, removeItem } from "../utils/storage.js";

const API_BASE = "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queued = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original?._retry) {
      if (refreshing) {
        return new Promise((resolve) => {
          queued.push(() => resolve(api(original)));
        });
      }
      original._retry = true;
      refreshing = true;
      try {
        const res = await axios.post(`${API_BASE}/auth/refresh`, {
          refresh: getItem("refresh"),
        });
        const newToken = res.data.token;
        saveItem("token", newToken);
        refreshing = false;
        queued.forEach((cb) => cb());
        queued = [];
        return api(original);
      } catch (e) {
        refreshing = false;
        queued = [];
        removeItem("token");
        removeItem("refresh");
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

// AUTH
export function registerUser(data) {
  return api.post("/auth/register", data).then((r) => r.data);
}
export function loginUser(data) {
  return api.post("/auth/login", data).then((r) => r.data);
}
export function refreshToken(refresh) {
  return api.post("/auth/refresh", { refresh }).then((r) => r.data);
}

// USERS
export function getMyProfile() {
  return api.get("/users/me").then((r) => r.data);
}
export function getUserProfile(username) {
  return api.get(`/users/${username}`).then((r) => r.data);
}
export function updateProfile(data) {
  return api.patch("/users/me", data).then((r) => r.data);
}
export function uploadAvatar(formData) {
  return api.patch("/users/me/avatar", formData).then((r) => r.data);
}
export function getSuggestions() {
  return api.get("/users").then((r) => r.data);
}

// POSTS
export function createPostFD(formData) {
  return api.post("/posts", formData).then((r) => r.data);
}
export function getFeed(params = {}) {
  return api.get("/posts/feed", { params }).then((r) => r.data);
}
export function likePost(id) {
  return api.post(`/posts/${id}/like`).then((r) => r.data);
}
export function unlikePost(id) {
  return api.post(`/posts/${id}/unlike`).then((r) => r.data);
}
export function editPost(id, data) {
  return api.patch(`/posts/${id}`, data).then((r) => r.data);
}
export function deletePost(id) {
  return api.delete(`/posts/${id}`).then((r) => r.data);
}
export function getUserPosts(username) {
  return api.get(`/posts/user/${username}`).then((r) => r.data);
}

// COMMENTS
export function getComments(postId) {
  return api.get(`/comments/${postId}`).then((r) => r.data);
}
export function createComment(postId, content) {
  return api.post(`/comments/${postId}`, { content }).then((r) => r.data);
}

// FOLLOWS
export function followUser(id) {
  return api.post(`/follows/${id}/follow`).then((r) => r.data);
}
export function unfollowUser(id) {
  return api.post(`/follows/${id}/unfollow`).then((r) => r.data);
}

// NOTIFICATIONS
export function getNotifications() {
  return api.get("/notifications").then((r) => r.data);
}
export function markNotificationRead(id) {
  return api.post(`/notifications/${id}/read`).then((r) => r.data);
}

export default api;
