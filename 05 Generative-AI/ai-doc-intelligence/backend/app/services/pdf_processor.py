import fitz  # PyMuPDF
from langchain_text_splitters import RecursiveCharacterTextSplitter

def extract_pdf_chunks(file_path: str, chunk_size: int = 1200, overlap: int = 200):
    """
    Extracts text and tables page-by-page from a PDF, formats tables into Markdown,
    and splits content cleanly with RecursiveCharacterTextSplitter.
    """
    doc = fitz.open(file_path)
    all_chunks = []

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        separators=["\n\n", "\n", " ", ""]
    )

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        
        # 1. Extract tabular data first (if available) into Markdown format
        extracted_content = ""
        tables = page.find_tables()
        
        if tables.tables:
            # If tables exist on the page, extract them cleanly
            for table in tables:
                df = table.to_pandas()
                extracted_content += df.to_markdown(index=False) + "\n\n"
        
        # 2. Append standard text layout
        page_text = page.get_text("text").strip()
        if page_text:
            extracted_content += page_text

        if not extracted_content.strip():
            continue

        # 3. Split extracted page content into chunks
        page_splits = text_splitter.split_text(extracted_content)

        for chunk_text in page_splits:
            all_chunks.append({
                "text": chunk_text,
                "metadata": {
                    "page_number": page_idx + 1
                }
            })

    return all_chunks