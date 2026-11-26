from __future__ import annotations

import os


def is_llm_configured() -> bool:
    """Return True when a Groq API key is present in the environment."""
    return bool(os.getenv("GROQ_API_KEY", "").strip())


def generate_answer(
    question: str,
    context: str = "",
    history: list[dict] | None = None,
) -> str:
    """Generate a networking answer, optionally grounded in retrieved documents."""
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is missing. Add it to your local .env file.")

    try:
        from groq import Groq
    except ImportError as exc:
        raise RuntimeError("Groq SDK is missing. Install dependencies from requirements.txt.") from exc

    model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b").strip()
    client = Groq(api_key=api_key)

    system_prompt = (
        "You are NetworkLab AI, a professional and patient computer networking tutor. "
        "Answer clearly and accurately at an intermediate student level. Use headings, "
        "short paragraphs, numbered steps, and code blocks when they improve clarity. "
        "Explain technical terms and acronyms on first use. Never claim to have accessed, "
        "changed, or inspected a real network device."
    )
    if context.strip():
        system_prompt += (
            " The user has uploaded study documents. Treat the retrieved context as the "
            "primary source for claims about those documents. Cite relevant evidence using "
            "the exact source markers supplied in context, such as [Source: filename, Page: 2]. "
            "If the context does not contain the answer, clearly say that the uploaded material "
            "does not establish it, then label any additional explanation as general networking knowledge."
        )
    else:
        system_prompt += (
            " No relevant uploaded-document passages were retrieved for this question. "
            "Answer using general networking knowledge and do not invent document citations."
        )

    messages = [{"role": "system", "content": system_prompt}]
    for item in (history or [])[-8:]:
        role = item.get("role")
        content = item.get("content")
        if role in {"user", "assistant"} and isinstance(content, str) and content.strip():
            messages.append({"role": role, "content": content})

    user_content = f"Question:\n{question}"
    if context.strip():
        user_content += f"\n\nRetrieved study material:\n{context}"
    messages.append({"role": "user", "content": user_content})

    completion = client.chat.completions.create(
        model=model_name,
        temperature=0.2,
        messages=messages,
    )
    answer = completion.choices[0].message.content
    return answer.strip() if answer else "The AI model returned an empty response. Please try again."
