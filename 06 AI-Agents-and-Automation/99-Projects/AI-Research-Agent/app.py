"""
AI Research Agent
------------------
A beginner-friendly single-agent research assistant.

How it works (3 simple steps):
1. You type a research topic.
2. The agent searches the web for free using DuckDuckGo (via the `ddgs` library).
3. The agent sends the search results to a Groq LLM (openai/gpt-oss-120b),
   which reads them and writes a structured report.

Built with: Streamlit + Groq + ddgs (DuckDuckGo Search)
"""

import streamlit as st
from groq import Groq
from ddgs import DDGS

# ----------------------------------------------------------------------
# 1. PAGE SETUP
# ----------------------------------------------------------------------
st.set_page_config(
    page_title="AI Research Agent",
    page_icon="🔎",
    layout="centered",
)

st.title("🔎 AI Research Agent")
st.caption("Enter a topic, and the agent will search the web and write a report for you.")

# The exact Groq model we are using for this project.
MODEL_NAME = "openai/gpt-oss-120b"

# ----------------------------------------------------------------------
# 2. API KEY - LOADED ONLY FROM STREAMLIT SECRETS
# ----------------------------------------------------------------------
# Beginner note: never hardcode API keys in your code. This app reads the
# key from Streamlit's built-in secrets manager instead of asking the user
# to type it in. Locally this comes from .streamlit/secrets.toml; on
# Streamlit Cloud it comes from your app's Settings -> Secrets. See README.
groq_api_key = st.secrets.get("GROQ_API_KEY", "")

# ----------------------------------------------------------------------
# 3. SIDEBAR - OPTIONS
# ----------------------------------------------------------------------
with st.sidebar:
    st.header("⚙️ Settings")

    num_results = st.slider(
        "How many web results to use?",
        min_value=3,
        max_value=10,
        value=5,
        help="More results = more context for the report, but slower.",
    )

    st.markdown("---")
    st.markdown(
        "**Model:** `openai/gpt-oss-120b` (via Groq)\n\n"
        "**Search:** DuckDuckGo (free, no API key needed)"
    )

# ----------------------------------------------------------------------
# 4. MAIN INPUT - RESEARCH TOPIC
# ----------------------------------------------------------------------
topic = st.text_input(
    "What topic do you want a report on?",
    placeholder="e.g. The impact of AI agents on the job market",
)

generate_clicked = st.button("Generate Report 🚀", type="primary")


# ----------------------------------------------------------------------
# 5. HELPER FUNCTION - WEB SEARCH (FREE, VIA DUCKDUCKGO)
# ----------------------------------------------------------------------
def search_web(query: str, max_results: int = 5) -> list[dict]:
    """
    Searches DuckDuckGo for the given query and returns a list of
    dictionaries, each with 'title', 'href' (URL), and 'body' (snippet).
    """
    results = []
    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=max_results):
            results.append(
                {
                    "title": r.get("title", ""),
                    "href": r.get("href", ""),
                    "body": r.get("body", ""),
                }
            )
    return results


def format_sources_for_prompt(results: list[dict]) -> str:
    """
    Turns the search results into a numbered block of text that we can
    paste into the prompt we send to the LLM.
    """
    blocks = []
    for i, r in enumerate(results, start=1):
        blocks.append(
            f"[Source {i}] {r['title']}\n"
            f"URL: {r['href']}\n"
            f"Snippet: {r['body']}\n"
        )
    return "\n".join(blocks)


# ----------------------------------------------------------------------
# 6. HELPER FUNCTION - CALL THE GROQ LLM
# ----------------------------------------------------------------------
def generate_report(client: Groq, topic: str, sources_text: str) -> str:
    """
    Sends the topic + search results to the Groq LLM and asks it to
    write a structured research report, citing sources as [Source N].
    """
    system_prompt = (
        "You are a careful research assistant. You will be given a topic "
        "and a list of web search results (title, URL, snippet). "
        "Write a clear, well-structured report on the topic using ONLY the "
        "information in the provided sources. "
        "Structure your report with: a short introduction, 2-4 body "
        "sections with headings, and a conclusion. "
        "Whenever you use a fact from a source, cite it inline like "
        "[Source 1], [Source 2], etc. "
        "At the end, add a 'References' section listing each source's "
        "title and URL. "
        "If the sources don't fully cover the topic, say so honestly "
        "instead of making things up."
    )

    user_prompt = (
        f"Research topic: {topic}\n\n"
        f"Here are the web search results to use:\n\n"
        f"{sources_text}\n\n"
        f"Now write the report."
    )

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
    )
    return response.choices[0].message.content


# ----------------------------------------------------------------------
# 7. MAIN LOGIC - RUN WHEN THE BUTTON IS CLICKED
# ----------------------------------------------------------------------
if generate_clicked:
    if not groq_api_key:
        st.error(
            "No Groq API key found. Add one under your Streamlit Cloud "
            "app's **Settings → Secrets** as:\n\n"
            "```toml\nGROQ_API_KEY = \"your-key-here\"\n```"
        )
    elif not topic.strip():
        st.error("Please enter a research topic.")
    else:
        try:
            with st.spinner("Searching the web..."):
                search_results = search_web(topic, max_results=num_results)

            if not search_results:
                st.warning(
                    "No search results were found. Try a different or "
                    "more specific topic."
                )
            else:
                with st.expander("🔗 Sources found", expanded=False):
                    for i, r in enumerate(search_results, start=1):
                        st.markdown(f"**{i}. [{r['title']}]({r['href']})**")
                        st.caption(r["body"])

                sources_text = format_sources_for_prompt(search_results)

                with st.spinner("Writing the report with Groq..."):
                    client = Groq(api_key=groq_api_key)
                    report = generate_report(client, topic, sources_text)

                st.markdown("---")
                st.subheader("📄 Research Report")
                st.markdown(report)

                st.download_button(
                    label="⬇️ Download report as .md",
                    data=report,
                    file_name="research_report.md",
                    mime="text/markdown",
                )

        except Exception as e:
            st.error(f"Something went wrong: {e}")

else:
    st.info("Enter a topic above and click **Generate Report** to get started.")
