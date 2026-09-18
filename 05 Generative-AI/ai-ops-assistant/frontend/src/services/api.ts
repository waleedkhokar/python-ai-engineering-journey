const API_BASE_URL = "http://127.0.0.1:8000";

export interface ChatResponse {
  reply: string;
  agent_type: string;
  escalated: boolean;
}

export async function sendSupportMessage(message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/support/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with Support Agent");
  }

  return response.json();
}

export async function sendAnalyticsQuery(message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/analytics/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with Analytics Agent");
  }

  return response.json();
}