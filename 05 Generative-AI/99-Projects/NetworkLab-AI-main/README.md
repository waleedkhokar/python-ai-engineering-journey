# NetworkLab AI — Intelligent Networking Workspace

**Version:** 2.0.0  
**Category:** Generative AI / Retrieval-Augmented Generation  
**Language:** Python  
**Interface:** Streamlit

NetworkLab AI is an educational application for students learning computer networking. It combines document-grounded question answering with practical IPv4 and Cisco IOS learning utilities.

## Product capabilities

- Upload PDF and TXT networking notes.
- Extract text while retaining PDF page numbers.
- Split documents into overlapping chunks.
- Retrieve relevant passages using local vector similarity.
- Optionally generate grounded explanations with Groq.
- Display source filenames, page numbers, and chunk identifiers.
- Use Groq for general networking questions even when no documents are indexed.
- Keep recent conversation turns as context for follow-up questions.
- Calculate IPv4 subnet details.
- Validate IPv4 addresses.
- Look up commonly used TCP/UDP ports.
- Explain a selected set of Cisco IOS commands.

## Architecture

```text
PDF / TXT
   |
   v
Document Loader ---> Page-aware text
   |
   v
Text Chunking
   |
   v
Embedding Model
   |
   v
In-memory Vector Store
   |
User Question ---> Similarity Search
                       |
                       v
                 Retrieved Context
                       |
                 Optional Groq LLM
                       |
                       v
             Answer + Source References
```

## Retrieval options

### Default: TF-IDF

The default implementation uses a lightweight TF-IDF-style vectorizer and cosine similarity. It is fast to install and runs locally without downloading a model. It is lexical retrieval, not transformer semantic search.

### Optional: Sentence Transformers

Install the optional dependencies:

```powershell
python -m pip install -r requirements-semantic.txt
```

Set the mode before starting the app:

```powershell
$env:NETWORKLAB_EMBEDDING_MODE="sentence-transformers"
streamlit run app.py
```

The first run downloads `sentence-transformers/all-MiniLM-L6-v2`. A network connection is required for the initial model download. You can override the model using `NETWORKLAB_SENTENCE_MODEL`.

## Installation on Windows

Use Python 3.10 or newer.

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If PowerShell or Windows Application Control blocks the `pip.exe` launcher, use `python -m pip` as shown above. If Python package installation itself is blocked by organizational policy, contact the device administrator rather than attempting to bypass the policy.

## Run the application

```powershell
python -m streamlit run app.py
```

## Enable Groq-generated answers (optional)

1. Create an API key in your Groq account.
2. Copy `.env.example` to `.env`.
3. Add your key and preferred supported model:

```env
GROQ_API_KEY=your_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

Never commit `.env` or share your API key. Without a key, the application still retrieves and displays relevant document passages.

## Run tests

```powershell
python -m pip install pytest
python -m pytest -q
```

## Project structure

```text
NetworkLab-AI/
├── app.py
├── requirements.txt
├── requirements-semantic.txt
├── .env.example
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── src/
│   ├── config.py
│   ├── document_loader.py
│   ├── chunking.py
│   ├── embeddings.py
│   ├── vector_store.py
│   ├── rag_pipeline.py
│   ├── llm_client.py
│   └── network_tools.py
├── tests/
│   ├── test_chunking.py
│   ├── test_network_tools.py
│   └── test_rag_pipeline.py
├── data/
│   └── sample_networking_notes.txt
└── docs/
    └── architecture.md
```

## Security and privacy

- API keys belong in `.env`, never in source code.
- Uploaded document contents are held in application memory and are not persisted by this starter project.
- If Groq is enabled, retrieved text is sent to the configured Groq API to generate an answer. Do not submit confidential documents unless you are authorized to do so.
- This application does not connect to, scan, or modify routers or switches.

## Limitations

- Scanned PDFs need OCR; OCR is not included.
- The vector store is in memory and is rebuilt after restart.
- Default TF-IDF retrieval is keyword-oriented. Sentence Transformers provides a semantic option.
- Cisco command explanations cover a small educational subset.
- AI-generated content may be inaccurate. Verify network configurations before applying them to real infrastructure.

## Open-source contribution

This project is packaged as a standalone contribution proposal. Before adding it to another repository, review that repository's contribution guidelines, naming conventions, and existing projects. Ask the maintainer whether the proposed project is accepted, then open a focused Pull Request.


## Interface theme

The interface uses a glassmorphism-inspired dark theme with translucent panels, backdrop blur, subtle cyan/violet highlights, and high-contrast typography. Streamlit's dark theme defaults are configured in `.streamlit/config.toml`.


## Developer

**Hammal Baloch** — BS Artificial Intelligence student and AI/Python developer.

NetworkLab AI is an educational project exploring generative AI, retrieval-augmented generation, and practical networking utilities.

- **Portfolio:** https://hammal-portfolio.vercel.app/
- **GitHub:** https://github.com/Hammal04
- **LinkedIn:** https://www.linkedin.com/in/hammal04


### Developer profile
The About the Developer section includes the project owner's bundled profile photo and links to their portfolio, GitHub, and LinkedIn. The NetworkLab AI brand mark is positioned at the top-left of the sidebar.
