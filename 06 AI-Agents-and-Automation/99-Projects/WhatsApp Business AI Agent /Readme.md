
<div align="center">

# 🤖 WhatsApp Business AI Agent

A free, self-hosted AI customer-support agent that connects WhatsApp to a local AI model — answers from your knowledge base, looks up order data, and hands off to a human when unsure.

</div>

---

## 🚀 About This Agent

**WhatsApp Business AI Agent** is a production-ready automation workflow that turns WhatsApp into an intelligent customer-support channel.

Customers message your WhatsApp number. The agent understands what they need, searches your knowledge base for answers, checks real order data in your database, and replies instantly. If it is not confident, it hands the conversation to a human staff member.

The agent remembers each customer, protects against duplicate messages, logs every conversation, and follows WhatsApp's official rules for business messaging.

**How it works:**

```
Customer message → WhatsApp Cloud API webhook → n8n
   → classify intent → [FAQ via RAG | order lookup in DB | escalate]
   → reply via WhatsApp API → log everything in PostgreSQL
```

---

## 💡 Why It's Helpful

- 💬 **Always-on support** — answers customers 24/7 without hiring a support team
- 📚 **Answers from your own data** — uses RAG over your docs, not generic AI guesses
- 📦 **Real order updates** — checks PostgreSQL to give accurate order status
- 🙋 **Smart handoff** — knows when to escalate to a human instead of guessing
- 🛡️ **Safe and reliable** — duplicate-message protection, retry handling, and full audit logs
- 💸 **Free to run** — self-hosted n8n, free Gemini API tier, open-source stack
- 🔧 **Customizable** — swap the LLM, add tools, connect any database

---

## 🛠 Tech Stack

<div align="center">

![n8n](https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp_Cloud_API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B6B?style=for-the-badge&logo=databricks&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

</div>

## 📸 Screenshots

| AI Agent N8N | Web Page View|
| :---: | :---: |
| ![Screenshot 1](secreenshots/1.png) | ![Screenshot 2](secreenshots/2.png) |

---


| Layer | Tool |
|---|---|
| Orchestration | n8n (self-hosted) |
| LLM | Google Gemini (`gemini-3.8-flash`) |
| Messaging | WhatsApp Business Cloud API |
| Database | PostgreSQL |
| Vector store | ChromaDB / pgvector |
| Runtime | Node.js 20.19+ |

---

## 👨‍💻 Developer

**Waleed Khokhar** — *Full-Stack AI Engineer*

Full-Stack Developer with 1+ year of experience building scalable **web applications** and **mobile apps (Android & iOS)** with AI-powered features. Specializing in intelligent AI solutions using **Generative AI, LLMs, Agentic AI, RAG, and LangChain automation**, alongside strong proficiency in **React Native, Next.js, Python & FastAPI, and the MERN stack** for building modern, production-ready mobile & web apps.

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://waledkhokar.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/waleedkhokhar)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/waleedkhokhar)


⭐ **If you liked this project, drop a ⭐ on the repo and share it with others!**