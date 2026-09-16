import io
import pdfplumber
from docx import Document


class ParserService:

  @staticmethod
  def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from a PDF file using pdfplumber."""
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
      for page in pdf.pages:
        extracted = page.extract_text()
        if extracted:
          text += extracted + "\n"
    return text.strip()

  @staticmethod
  def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text from a Word document (.docx) using python-docx."""
    doc = Document(io.BytesIO(file_bytes))
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text.strip()

  @classmethod
  def extract_text(cls, file_bytes: bytes, filename: str) -> str:
    """Determines file type and routes to the correct extractor."""
    filename_lower = filename.lower()
    if filename_lower.endswith(".pdf"):
      return cls.extract_text_from_pdf(file_bytes)
    elif filename_lower.endswith(".docx"):
      return cls.extract_text_from_docx(file_bytes)
    else:
      raise ValueError(
          "Unsupported file format. Please upload a PDF or DOCX file."
      )