"use client";

const KEY = "pjn:drafts:v1";

export type SavedDraft = {
  id: string;
  templateId: string;
  title: string;
  body: string;
  reviewed: boolean;
  updatedAt: string;
};

export function listDrafts(): SavedDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as SavedDraft[]) : [];
  } catch {
    return [];
  }
}

export function saveDraft(draft: Omit<SavedDraft, "updatedAt">): SavedDraft[] {
  const next: SavedDraft = { ...draft, updatedAt: new Date().toISOString() };
  const all = [next, ...listDrafts().filter((item) => item.id !== draft.id)];
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

export function deleteDraft(id: string): SavedDraft[] {
  const all = listDrafts().filter((item) => item.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}
