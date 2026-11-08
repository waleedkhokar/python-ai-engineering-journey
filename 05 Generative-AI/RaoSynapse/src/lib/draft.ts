const CHAT_DRAFT_KEY = 'raosynapse.chat-draft.v1';

export function saveChatDraft(value: string) {
  try { sessionStorage.setItem(CHAT_DRAFT_KEY, value); } catch { /* Storage may be unavailable in hardened browsers. */ }
}

export function peekChatDraft() {
  try { return sessionStorage.getItem(CHAT_DRAFT_KEY) || ''; } catch { return ''; }
}

export function clearChatDraft() {
  try { sessionStorage.removeItem(CHAT_DRAFT_KEY); } catch { /* Nothing else is required. */ }
}
