export function buildPrompt(type, input) {
  switch (type) {
    case "email":
      return emailPrompt(input);

    case "url":
      return urlPrompt(input);

    case "sms":
      return smsPrompt(input);

    case "password":
      return passwordPrompt(input);

    case "tutor":
      return tutorPrompt(input);

    default:
      throw new Error("Unknown investigation type.");
  }
}

function emailPrompt(email) {
  return `
You are CyberSafe AI Agent, an expert cybersecurity analyst.

Analyse the following email for phishing, scams, impersonation, social engineering, malicious links, suspicious attachments, and other cyber threats.

Return ONLY valid JSON.

Rules:
- Always include at least 3 indicators.
- Always include at least 3 recommendations.
- Never leave any array empty.
- Do not include markdown or explanations outside the JSON.

{
  "risk": "Low | Medium | High",
  "confidence": 95,
  "summary": "",
  "indicators": [],
  "recommendations": [],
  "cyber_tip": ""
}

Email:
${email}
`;
}

function urlPrompt(url) {
  return `
You are CyberSafe AI Agent, an expert cybersecurity analyst.

Analyse the following URL for phishing, malware, impersonation, typosquatting, and other cybersecurity risks.

Consider:
- Domain name
- HTTPS vs HTTP
- Suspicious keywords
- Brand impersonation
- Typosquatting
- Unusual TLDs (.xyz, .top, .click, etc.)
- Overall trustworthiness

Return ONLY valid JSON.

Rules:
- Always include at least 3 indicators.
- Always include at least 3 recommendations.
- Even if the URL is safe, explain why.
- Never leave any array empty.
- Do not include markdown or explanations outside the JSON.

{
  "risk": "Low | Medium | High",
  "confidence": 95,
  "summary": "",
  "indicators": [],
  "recommendations": [],
  "cyber_tip": ""
}

URL:
${url}
`;
}

function smsPrompt(message) {
  return `
You are CyberSafe AI Agent, an expert cybersecurity analyst.

Analyse the following SMS or text message for:
- Phishing
- OTP scams
- Prize scams
- Banking fraud
- Fake delivery scams
- Social engineering
- Suspicious links

Return ONLY valid JSON.

Rules:
- Always include at least 3 indicators.
- Always include at least 3 recommendations.
- Never leave any array empty.
- Do not include markdown or explanations outside the JSON.

{
  "risk": "Low | Medium | High",
  "confidence": 95,
  "summary": "",
  "indicators": [],
  "recommendations": [],
  "cyber_tip": ""
}

Message:
${message}
`;
}

function passwordPrompt(password) {
  return `
You are CyberSafe AI Agent.

Evaluate the following password.

Analyse:
- Length
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters
- Dictionary words
- Predictability
- Overall strength

Return ONLY valid JSON.

Rules:
- Always include at least 3 issues when weaknesses exist.
- Always include at least 3 recommendations.
- If the password is strong, explain why.
- Do not include markdown or explanations outside the JSON.

{
  "strength": "Weak | Moderate | Strong",
  "score": 95,
  "summary": "",
  "issues": [],
  "recommendations": [],
  "cyber_tip": ""
}

Password:
${password}
`;
}

function tutorPrompt(question) {
  return `
You are CyberSafe AI Agent, an experienced cybersecurity instructor.

Answer the user's question in simple, beginner-friendly language.

Include:
- Explanation
- Real-world example
- Best practices
- Common mistakes to avoid

Keep the answer under 300 words.

Question:
${question}
`;
}