from __future__ import annotations

import base64
from pathlib import Path

import streamlit as st
from dotenv import load_dotenv

from src.config import APP_NAME, APP_VERSION
from src.document_loader import extract_document
from src.llm_client import generate_answer, is_llm_configured
from src.network_tools import (
    calculate_subnet,
    explain_cisco_config,
    get_common_port,
    validate_ipv4,
)
from src.rag_pipeline import RAGPipeline


load_dotenv()

# Developer profile image is bundled with the project.
PROFILE_IMAGE_PATH = Path(__file__).parent / "assets" / "hammal-profile.png"

def get_profile_image_data() -> str:
    if not PROFILE_IMAGE_PATH.exists():
        return ""
    return base64.b64encode(PROFILE_IMAGE_PATH.read_bytes()).decode("utf-8")


st.set_page_config(
    page_title=f"{APP_NAME} · AI Assistant",
    page_icon="🌐",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------- Visual system ----------
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

    :root {
      --ink: #26324a;
      --muted: #66758f;
      --line: rgba(255,255,255,.78);
      --glass: rgba(255,255,255,.58);
      --glass-strong: rgba(255,255,255,.78);
      --blue: #648cff;
      --violet: #9b82e8;
      --teal: #62c9d5;
    }
    html, body, [class*="css"] { font-family:'DM Sans',sans-serif; color:var(--ink); }
    .stApp {
      color:var(--ink);
      background:
        radial-gradient(circle at 8% 8%, rgba(163,190,255,.58), transparent 30%),
        radial-gradient(circle at 92% 10%, rgba(222,198,255,.62), transparent 32%),
        radial-gradient(circle at 65% 92%, rgba(176,229,235,.58), transparent 34%),
        linear-gradient(135deg,#f5f8ff 0%,#edf2fb 48%,#f8f5ff 100%);
      background-attachment:fixed;
    }
    h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif !important; letter-spacing:-.035em; color:#26324a; }
    p, li, label, .stMarkdown { color:#34425b; }
    [data-testid="stHeader"], [data-testid="stToolbar"] { background:transparent !important; }
    [data-testid="stAppViewContainer"], [data-testid="stMain"] { background:transparent; }
    [data-testid="stBottom"] { background:rgba(255,255,255,.58) !important; backdrop-filter:blur(28px); border-top:1px solid rgba(255,255,255,.85); }
    [data-testid="stBottom"] > div { background:transparent !important; }
    [data-testid="stChatInput"] {
      background:rgba(255,255,255,.78) !important; border:1px solid rgba(255,255,255,.95) !important;
      border-radius:20px !important; backdrop-filter:blur(28px);
      box-shadow:0 12px 38px rgba(91,112,158,.13), inset 0 1px 0 #fff;
    }
    [data-testid="stChatInput"] textarea { color:#26324a !important; caret-color:#648cff !important; }
    [data-testid="stChatInput"] textarea::placeholder { color:#8793a8 !important; opacity:1; }

    /* Light frosted-glass navigation */
    [data-testid="stSidebar"] {
      background:rgba(255,255,255,.55) !important;
      border-right:1px solid rgba(255,255,255,.88);
      backdrop-filter:blur(30px) saturate(160%);
      box-shadow:8px 0 35px rgba(91,112,158,.07);
    }
    [data-testid="stSidebar"] > div { background:transparent !important; padding-top:1.2rem; }
    [data-testid="stSidebar"] * { color:#34425b; }
    [data-testid="stSidebar"] [data-testid="stMarkdownContainer"] p,
    [data-testid="stSidebar"] label,
    [data-testid="stSidebar"] .stCaption { color:#687791 !important; }
    [data-testid="stSidebar"] [role="radiogroup"] label {
      background:rgba(255,255,255,.48); border:1px solid rgba(255,255,255,.85);
      border-radius:13px; padding:9px 12px; margin:5px 0; transition:all .2s ease;
      box-shadow:0 4px 14px rgba(90,110,150,.04);
    }
    [data-testid="stSidebar"] [role="radiogroup"] label:hover {
      background:rgba(255,255,255,.88); border-color:rgba(100,140,255,.34);
      transform:translateX(2px);
    }
    .brand { display:flex; align-items:center; gap:11px; padding:5px 2px 18px; }
    .brand-mark {
      width:44px;height:44px;display:grid;place-items:center;border-radius:15px;
      color:#fff;font-size:22px;font-weight:800;
      background:linear-gradient(135deg,#78a4ff,#a58be9 58%,#79cbd5);
      box-shadow:0 9px 24px rgba(112,139,220,.25);
    }
    .brand-name { font-family:'Space Grotesk';font-size:18px;font-weight:700;color:#293650;line-height:1.15; }
    .brand-sub { color:#7b88a0;font-size:11px;margin-top:3px;letter-spacing:.08em;text-transform:uppercase; }
    .eyebrow { color:#6685d7;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase; }
    .page-title { font-family:'Space Grotesk';color:#26324a;font-size:clamp(30px,4vw,43px);font-weight:700;letter-spacing:-.055em;line-height:1.08;margin:5px 0 9px; }
    .page-subtitle { color:#687791;font-size:14px;line-height:1.65;max-width:760px; }

    /* Bright translucent glass surfaces */
    .top-panel {
      position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.92);border-radius:26px;
      padding:29px 31px;margin:4px 0 20px;
      background:linear-gradient(120deg,rgba(255,255,255,.78),rgba(255,255,255,.43) 55%,rgba(232,239,255,.60));
      backdrop-filter:blur(30px) saturate(165%);
      box-shadow:0 20px 55px rgba(94,115,160,.13),inset 0 1px 0 rgba(255,255,255,.98);
    }
    .top-panel:after { content:"";position:absolute;width:230px;height:230px;right:-75px;top:-120px;background:rgba(161,145,239,.18);filter:blur(48px);border-radius:50%;pointer-events:none; }
    .stat,.welcome-card,.prompt-card,[data-testid="stChatMessage"],[data-testid="stExpander"] {
      border:1px solid rgba(255,255,255,.92) !important;
      background:linear-gradient(145deg,rgba(255,255,255,.82),rgba(255,255,255,.48)) !important;
      backdrop-filter:blur(26px) saturate(155%);
      box-shadow:0 12px 34px rgba(91,112,158,.10),inset 0 1px 0 rgba(255,255,255,.98);
    }
    .stat { border-radius:19px;padding:16px 18px;min-height:86px; }
    .stat-label { color:#78869e;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase; }
    .stat-value { font-family:'Space Grotesk';color:#2d3b56;font-size:23px;font-weight:700;margin-top:4px; }
    .section-label { color:#2d3b56;font-family:'Space Grotesk';font-size:18px;font-weight:600;margin:8px 0 4px; }
    .muted { color:#78869e;font-size:12px; }

    .developer-card {
      border:1px solid rgba(255,255,255,.94);border-radius:24px;padding:24px;
      background:linear-gradient(135deg,rgba(255,255,255,.86),rgba(255,255,255,.52));
      backdrop-filter:blur(28px) saturate(160%);
      box-shadow:0 16px 42px rgba(91,112,158,.11),inset 0 1px 0 #fff;
      margin:14px 0 18px;
    }
    .developer-photo {
      width:112px;height:112px;object-fit:cover;border-radius:28px;flex-shrink:0;
      border:4px solid rgba(255,255,255,.94);
      box-shadow:0 12px 30px rgba(91,112,158,.18);
    }
    .developer-avatar {
      width:76px;height:76px;border-radius:24px;display:grid;place-items:center;
      background:linear-gradient(135deg,#7299f5,#9b83df 58%,#79cbd5);
      color:#fff;font-family:'Space Grotesk';font-size:25px;font-weight:700;
      box-shadow:0 10px 25px rgba(112,139,220,.22);flex-shrink:0;
    }
    .developer-name {font-family:'Space Grotesk';font-size:25px;font-weight:700;color:#293650;letter-spacing:-.04em;}
    .developer-role {color:#71809a;font-size:13px;margin-top:3px;}
    .social-link {
      display:flex;align-items:center;gap:10px;text-decoration:none !important;
      color:#40506b !important;background:rgba(255,255,255,.68);
      border:1px solid rgba(255,255,255,.96);border-radius:14px;padding:12px 14px;
      box-shadow:0 7px 20px rgba(91,112,158,.07);font-weight:600;transition:all .2s ease;
    }
    .social-link:hover {transform:translateY(-2px);border-color:rgba(100,140,255,.42);background:rgba(255,255,255,.94);color:#5275ca !important;}
    .social-icon {width:30px;height:30px;display:grid;place-items:center;border-radius:10px;background:rgba(115,150,235,.13);font-size:16px;}
    .skill-chip {display:inline-block;padding:7px 11px;margin:4px 5px 3px 0;border-radius:999px;background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.95);color:#52617a;font-size:12px;font-weight:600;}
    .welcome-card { border-radius:23px;padding:27px;margin:18px 0 15px; }
    .welcome-icon { font-size:26px;width:52px;height:52px;display:grid;place-items:center;border-radius:16px;color:#fff;background:linear-gradient(135deg,#7ca4ff,#a58be9);border:1px solid rgba(255,255,255,.9);box-shadow:0 8px 20px rgba(112,139,220,.18); }
    .prompt-card { border-radius:17px;padding:14px 15px;min-height:82px; }
    [data-testid="stChatMessage"] { border-radius:19px;padding:14px 16px;margin-bottom:12px; }
    [data-testid="stChatMessage"] p,[data-testid="stChatMessage"] li { color:#34425b; }
    .stTextInput input,.stTextArea textarea,.stNumberInput input {
      background:rgba(255,255,255,.76) !important;color:#26324a !important;
      border:1px solid rgba(255,255,255,.95) !important;border-radius:13px !important;
      box-shadow:inset 0 1px 3px rgba(85,105,145,.04);
    }
    .stTextInput input::placeholder,.stTextArea textarea::placeholder { color:#8793a8 !important; }
    div.stButton > button {
      border-radius:13px;border:1px solid rgba(255,255,255,.95);
      background:rgba(255,255,255,.68);color:#40506b;font-weight:600;
      backdrop-filter:blur(16px);box-shadow:0 7px 20px rgba(91,112,158,.08);transition:all .2s ease;
    }
    div.stButton > button:hover { border-color:rgba(100,140,255,.45);color:#5275ca;background:rgba(255,255,255,.92);transform:translateY(-1px); }
    div.stButton > button[kind="primary"] {
      background:linear-gradient(110deg,#7299f5,#9b83df);color:#fff;border:1px solid rgba(255,255,255,.85);
      box-shadow:0 9px 24px rgba(112,139,220,.22);
    }
    [data-testid="stFileUploader"] section { background:rgba(255,255,255,.58);border:1px dashed rgba(125,145,190,.42);border-radius:16px; }
    [data-testid="stFileUploader"] * { color:#52617a !important; }
    [data-testid="stAlert"] { border-radius:15px;backdrop-filter:blur(18px); }
    [data-baseweb="tab-list"] { gap:8px; }
    [data-baseweb="tab"] { color:#687791; }
    [data-baseweb="select"] > div { background:rgba(255,255,255,.75);border-color:rgba(255,255,255,.95); }
    hr { border-color:rgba(123,143,180,.20); }
    footer { visibility:hidden; }
    </style>
    """,
    unsafe_allow_html=True,
)


@st.cache_resource
def get_pipeline() -> RAGPipeline:
    return RAGPipeline()


pipeline = get_pipeline()
if "messages" not in st.session_state:
    st.session_state.messages = []
if "indexed_files" not in st.session_state:
    st.session_state.indexed_files = set()
if "active_page" not in st.session_state:
    st.session_state.active_page = "AI Assistant"

# ---------- Sidebar ----------
with st.sidebar:
    st.markdown(
        '<div class="brand"><div class="brand-mark" aria-label="NetworkLab AI logo">⌁</div><div><div class="brand-name">NetworkLab AI</div><div class="brand-sub">Intelligent workspace</div></div></div>',
        unsafe_allow_html=True,
    )
    st.markdown('<div class="eyebrow">Workspace</div>', unsafe_allow_html=True)
    page = st.radio(
        "Navigation",
        ["AI Assistant", "Knowledge Base", "Network Toolkit", "Project Overview"],
        label_visibility="collapsed",
        key="active_page",
    )
    st.divider()
    st.markdown("**AI STATUS**")
    if is_llm_configured():
        st.success("Groq API key detected", icon="⚡")
    else:
        st.warning("Groq API key not detected", icon="🔑")
        st.caption("Add GROQ_API_KEY to your root .env file and restart the app.")
    st.markdown("**KNOWLEDGE BASE**")
    st.caption(f"{len(st.session_state.indexed_files)} document(s) · {pipeline.chunk_count} chunks")
    with st.expander("＋ Add documents", expanded=(page == "Knowledge Base")):
        uploads = st.file_uploader(
            "Upload networking notes",
            type=["pdf", "txt"],
            accept_multiple_files=True,
            label_visibility="collapsed",
            help="PDFs must contain selectable text. Scanned PDF OCR is not included.",
        )
        if st.button("Index uploaded files", type="primary", use_container_width=True, disabled=not uploads):
            total = 0
            errors = []
            bar = st.progress(0)
            for idx, uploaded in enumerate(uploads):
                identity = f"{uploaded.name}:{uploaded.size}"
                if identity in st.session_state.indexed_files:
                    bar.progress((idx + 1) / len(uploads))
                    continue
                try:
                    pages = extract_document(uploaded)
                    total += pipeline.add_document(uploaded.name, pages)
                    st.session_state.indexed_files.add(identity)
                except Exception as exc:
                    errors.append(f"{uploaded.name}: {exc}")
                bar.progress((idx + 1) / len(uploads))
            st.success(f"Indexed {total} text chunk(s).")
            for error in errors:
                st.error(error)
    if st.button("Clear indexed documents", use_container_width=True):
        pipeline.clear()
        st.session_state.indexed_files.clear()
        st.session_state.messages = []
        st.rerun()
    st.divider()
    st.caption(f"NetworkLab AI · v{APP_VERSION}")
    st.caption("Documents are indexed in memory for this running app session.")

# ---------- Shared helpers ----------
def render_sources(sources: list[dict]) -> None:
    if not sources:
        return
    with st.expander(f"📚 Sources used · {len(sources)} passage(s)"):
        for source in sources:
            st.markdown(
                f"**{source['source']}** · Page {source['page']} · Chunk {source['chunk_id']} · Similarity {source['score']:.2f}"
            )
            st.caption(source["excerpt"])


def make_answer(question: str) -> tuple[str, list[dict]]:
    matches = pipeline.search(question, top_k=5)
    context = ""
    if matches:
        context = "\n\n".join(
            f"[Source: {item['source']} | Page: {item['page']} | Chunk: {item['chunk_id']}]\n{item['text']}"
            for item in matches
        )

    if not is_llm_configured():
        raise RuntimeError("Groq is not configured. Add GROQ_API_KEY to your .env file and restart Streamlit.")

    recent_history = st.session_state.messages[:-1][-8:]  # exclude the current question; it is sent separately
    answer = generate_answer(question, context, history=recent_history)
    sources = [
        {
            "source": item["source"],
            "page": item["page"],
            "chunk_id": item["chunk_id"],
            "score": item["score"],
            "excerpt": item["text"][:700] + ("…" if len(item["text"]) > 700 else ""),
        }
        for item in matches
    ]
    return answer, sources


# ---------- AI Assistant ----------
if page == "AI Assistant":
    st.markdown('<div class="top-panel"><div class="eyebrow">Your networking copilot</div><div class="page-title">Ask. Understand. Build.</div><div class="page-subtitle">A focused AI assistant for computer networking. Ask technical questions, learn concepts step by step, or get answers grounded in your own lab manuals and notes.</div></div>', unsafe_allow_html=True)

    a, b, c = st.columns(3)
    for col, label, value in [
        (a, "AI ENGINE", "Groq" if is_llm_configured() else "Not configured"),
        (b, "KNOWLEDGE FILES", str(len(st.session_state.indexed_files))),
        (c, "SEARCHABLE CHUNKS", str(pipeline.chunk_count)),
    ]:
        with col:
            st.markdown(f'<div class="stat"><div class="stat-label">{label}</div><div class="stat-value">{value}</div></div>', unsafe_allow_html=True)

    title_col, action_col = st.columns([5, 1])
    with title_col:
        st.markdown('<div class="section-label">Conversation</div><div class="muted">Ask anything about networking, or ask questions about your indexed documents.</div>', unsafe_allow_html=True)
    with action_col:
        if st.button("＋ New chat", use_container_width=True):
            st.session_state.messages = []
            st.rerun()

    if not st.session_state.messages:
        st.markdown(
            '<div class="welcome-card"><div class="welcome-icon">✦</div><h3 style="margin:14px 0 6px;color:#2d3b56">Welcome to your AI networking assistant</h3><p style="color:#71809a;margin:0;line-height:1.7">Start with a suggested question below, or type your own in the message box. When documents are indexed, relevant passages are supplied to the AI and shown as sources.</p></div>',
            unsafe_allow_html=True,
        )
        st.markdown("**TRY A PROMPT**")
        prompt_columns = st.columns(2)
        suggestions = [
            ("🔁 TCP vs UDP", "Explain the differences between TCP and UDP with practical examples."),
            ("📡 DHCP process", "Explain the DHCP DORA process step by step."),
            ("🧮 Subnetting", "Teach me how to calculate a /27 IPv4 subnet with an example."),
            ("🛡️ NAT and PAT", "Explain NAT and PAT and compare how they work."),
        ]
        for index, (label, prompt) in enumerate(suggestions):
            with prompt_columns[index % 2]:
                if st.button(label, key=f"suggestion_{index}", use_container_width=True):
                    st.session_state.pending_prompt = prompt
                    st.rerun()

    for message in st.session_state.messages:
        with st.chat_message(message["role"], avatar="🧑‍💻" if message["role"] == "user" else "🌐"):
            st.markdown(message["content"])
            render_sources(message.get("sources", []))

    pending = st.session_state.pop("pending_prompt", None)
    question = st.chat_input("Message NetworkLab AI…")
    if pending and not question:
        question = pending

    if question:
        st.session_state.messages.append({"role": "user", "content": question})
        with st.chat_message("user", avatar="🧑‍💻"):
            st.markdown(question)
        with st.chat_message("assistant", avatar="🌐"):
            with st.spinner("NetworkLab AI is thinking…"):
                try:
                    answer, sources = make_answer(question)
                    st.markdown(answer)
                    render_sources(sources)
                    st.session_state.messages.append(
                        {"role": "assistant", "content": answer, "sources": sources}
                    )
                except Exception as exc:
                    st.error(f"The assistant could not complete this request: {exc}")
                    st.caption("Check your Groq API key, model name, internet connection, and API quota.")
                    st.session_state.messages.append(
                        {"role": "assistant", "content": f"I couldn't complete that request: {exc}", "sources": []}
                    )

# ---------- Knowledge Base ----------
elif page == "Knowledge Base":
    st.markdown('<div class="eyebrow">Your private study library</div><div class="page-title">Knowledge Base</div><div class="page-subtitle">Upload PDF or TXT files to make your networking notes searchable by the AI assistant.</div>', unsafe_allow_html=True)
    k1, k2 = st.columns(2)
    with k1:
        st.markdown(f'<div class="stat"><div class="stat-label">INDEXED DOCUMENTS</div><div class="stat-value">{len(st.session_state.indexed_files)}</div></div>', unsafe_allow_html=True)
    with k2:
        st.markdown(f'<div class="stat"><div class="stat-label">SEARCHABLE CHUNKS</div><div class="stat-value">{pipeline.chunk_count}</div></div>', unsafe_allow_html=True)
    st.write("")
    st.info("Use **Add documents** in the left sidebar to upload and index your networking notes.")
    if st.session_state.indexed_files:
        st.markdown("**Indexed files in this session**")
        for identity in sorted(st.session_state.indexed_files):
            filename, size = identity.rsplit(":", 1)
            st.markdown(f"📄 **{filename}** · {int(size):,} bytes")
    else:
        st.markdown('<div class="welcome-card"><h3 style="color:#2d3b56">Your library is ready</h3><p style="color:#71809a">Add lab manuals, lecture notes, or networking reference PDFs. The assistant will retrieve relevant passages and show page-level source references.</p></div>', unsafe_allow_html=True)

# ---------- Network Toolkit ----------
elif page == "Network Toolkit":
    st.markdown('<div class="eyebrow">Practical networking utilities</div><div class="page-title">Network Toolkit</div><div class="page-subtitle">Quick local tools for IPv4 planning, port lookup, and Cisco IOS command learning.</div>', unsafe_allow_html=True)
    tool_choice = st.selectbox("Choose a tool", ["IPv4 subnet planner", "IPv4 address validation", "Port reference", "Cisco IOS command explainer"])
    if tool_choice == "IPv4 subnet planner":
        left, right = st.columns([2, 1])
        with left:
            ip_input = st.text_input("IPv4 address", "192.168.10.25")
        with right:
            prefix = st.number_input("CIDR prefix", 0, 32, 24)
        if st.button("Calculate subnet", type="primary"):
            try:
                results = calculate_subnet(ip_input, int(prefix))
                columns = st.columns(3)
                for index, (label, value) in enumerate(results.items()):
                    with columns[index % 3]:
                        st.markdown(f'<div class="stat"><div class="stat-label">{label}</div><div class="stat-value" style="font-size:17px">{value}</div></div>', unsafe_allow_html=True)
            except ValueError as exc:
                st.error(str(exc))
    elif tool_choice == "IPv4 address validation":
        address = st.text_input("IPv4 address", "192.168.1.1")
        if st.button("Validate", type="primary"):
            valid, message = validate_ipv4(address)
            (st.success if valid else st.error)(message)
    elif tool_choice == "Port reference":
        port = st.number_input("Port number", 0, 65535, 443)
        if st.button("Look up port", type="primary"):
            st.info(get_common_port(int(port)))
    else:
        config = st.text_area("Cisco IOS configuration", "enable\nconfigure terminal\ninterface g0/0\nip address 192.168.1.1 255.255.255.0\nno shutdown", height=190)
        if st.button("Explain commands", type="primary"):
            explanations = explain_cisco_config(config)
            if explanations:
                for explanation in explanations:
                    st.markdown(f"- {explanation}")
            else:
                st.info("Enter one or more commands.")

# ---------- Project Overview ----------
else:
    st.markdown('<div class="eyebrow">About this project</div><div class="page-title">NetworkLab AI</div><div class="page-subtitle">An educational AI engineering project combining retrieval-augmented generation with practical networking utilities.</div>', unsafe_allow_html=True)
    st.markdown("""
    ### How it works
    1. Upload PDF or TXT study material.
    2. Extract text and preserve PDF page numbers.
    3. Split content into overlapping chunks.
    4. Retrieve relevant passages using the configured embedding method.
    5. Send the question and retrieved context to Groq for a grounded response.
    6. Display source passages so answers can be checked against the original material.

    ### Current capabilities
    - Groq-powered conversational assistant
    - Document-grounded retrieval and source references
    - Optional Sentence Transformers embeddings
    - IPv4 subnet planner and address validation
    - Common port reference and Cisco IOS command explanations

    ### Important limitations
    - The vector index is in memory and is cleared when the app process restarts.
    - Scanned PDFs require OCR before upload.
    - The default TF-IDF retriever is keyword-oriented; Sentence Transformers is an optional semantic mode.
    - Verify generated technical advice before applying changes to real network devices.
    """)

    st.markdown("---")
    st.markdown('<div class="eyebrow">The person behind the project</div><div class="page-title">About the Developer</div><div class="page-subtitle">A little about the developer building NetworkLab AI and other technology projects.</div>', unsafe_allow_html=True)
    profile_image_data = get_profile_image_data()
    st.markdown(
        f"""
        <div class="developer-card">
          <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
            <img class="developer-photo" src="data:image/png;base64,{profile_image_data}" alt="Hammal Baloch profile photo">
            <div>
              <div class="developer-name">Hammal Baloch</div>
              <div class="developer-role">BS Artificial Intelligence · AI &amp; Python Developer</div>
              <p style="color:#687791;line-height:1.75;margin:12px 0 0;max-width:760px">
                I am an Artificial Intelligence student interested in building practical software and AI-powered solutions.
                NetworkLab AI brings together generative AI, document-based question answering, and hands-on computer networking tools
                to make technical learning more accessible and interactive.
              </p>
            </div>
          </div>
          <div style="margin-top:19px">
            <span class="skill-chip">Python</span><span class="skill-chip">Artificial Intelligence</span>
            <span class="skill-chip">Machine Learning</span><span class="skill-chip">Generative AI</span>
            <span class="skill-chip">RAG</span><span class="skill-chip">Streamlit</span>
            <span class="skill-chip">SQL</span><span class="skill-chip">Software Development</span>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    social_cols = st.columns(3)
    social_links = [
        ("🌐", "Portfolio", "hammal-portfolio.vercel.app", "https://hammal-portfolio.vercel.app/"),
        ("💻", "GitHub", "github.com/Hammal04", "https://github.com/Hammal04"),
        ("in", "LinkedIn", "linkedin.com/in/hammal04", "https://www.linkedin.com/in/hammal04"),
    ]
    for column, (icon, label, display_url, target_url) in zip(social_cols, social_links):
        with column:
            st.markdown(
                f'<a class="social-link" href="{target_url}" target="_blank" rel="noopener noreferrer">'
                f'<span class="social-icon">{icon}</span><span><span style="display:block;font-size:13px">{label}</span>'
                f'<span style="display:block;font-size:10px;color:#8290a7;font-weight:400">{display_url}</span></span></a>',
                unsafe_allow_html=True,
            )
    st.caption("Connect with the developer, explore other projects, or view the source code on GitHub.")

