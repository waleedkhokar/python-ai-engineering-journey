# HisaabAI — Smart Business Hisaab

HisaabAI is an AI-powered sales, profit, expense, and pending-payment tracker designed for small Pakistani shopkeepers, optical shops, resellers, and home businesses.

## Live App

**Live URL:** Add your Vercel URL here after deployment: `https://hisaabaii.netlify.app/                                                                                                                                                                                             
## Screenshots
<img width="1920" height="1080" alt="Screenshot (55)" src="https://github.com/user-attachments/assets/7f79917b-f9d5-4e9d-b396-4864ad86bb58" />
<img width="1920" height="1080" alt="Screenshot (54)" src="https://github.com/user-attachments/assets/6a746aab-a0b7-44c3-a5ac-69d34c2f1eff" />
<img width="1920" height="1080" alt="Screenshot (53)" src="https://github.com/user-attachments/assets/a8179e1b-8a80-45a5-81c2-cca044c2edcc" />

## The Real Problem

Many small businesses still record sales in notebooks or scattered WhatsApp messages. HisaabAI keeps records in one simple interface and turns the numbers into practical Roman Urdu business advice.

## Features

- Complete sales entries with customer, product, cost, sale, received amount, and notes
- Automatic cost, pending-payment, profit, and margin calculations
- Dashboard and seven-day profit chart
- Paid, partial, and pending labels
- Search, filters, deletion, and CSV export
- Responsive mobile and desktop design
- Browser localStorage persistence
- Gemini-powered Roman Urdu business analysis
- Smart local fallback analysis when no API key is configured

## AI Feature

The AI coach reports performance, best products, low-margin risks, pending-payment warnings, three next actions, and a weekly target.

### System Prompt

```text
You are HisaabAI, a practical business assistant for small Pakistani shop owners and home businesses.
Analyse only supplied transaction data. Never invent figures.
Respond in easy Roman Urdu with clear headings.
Include performance, totals, profitable products, risks, three actions, and a weekly target.
```

## Tools and Services

HTML5, CSS3, JavaScript, localStorage, Google Gemini 2.5 Flash, Vercel Serverless Functions, GitHub, and Vercel.

## Screenshots

## Run Locally

```bash
git clone https://github.com/YOUR-USERNAME/hisaabai.git
cd hisaabai
npm start
```

Open `http://localhost:3000`.

## Configure AI

Create a Gemini API key, then add `GEMINI_API_KEY` in Vercel Project Settings → Environment Variables. Never commit the key.

## Deploy

1. Create a public GitHub repository named `hisaabai`.
2. Upload all files from this project.
3. Import the repository into Vercel.
4. Add `GEMINI_API_KEY` as an environment variable.
5. Deploy and replace the Live URL above.
6. Test the repository and live URL in an incognito window.

## Security

API keys stay server-side in `api/analyze.js`; `.env` files are ignored by Git.

## Originality

The app is designed for the real workflow of small Pakistani businesses, with Roman Urdu AI coaching and a lightweight pending-payment system.

## License

MIT.
