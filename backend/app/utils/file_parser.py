import io
from pathlib import Path

from docx import Document
from pdfminer.high_level import extract_text as extract_pdf_text


def parse_pdf(file_path: Path) -> str:
    return extract_pdf_text(str(file_path))


def parse_docx(file_path: Path) -> str:
    document = Document(str(file_path))
    paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
    return "\n".join(paragraphs)


def extract_resume_text(filename: str, content: bytes) -> str:
    extension = Path(filename).suffix.lower()
    temp_path = Path("./tmp")
    temp_path.mkdir(parents=True, exist_ok=True)
    file_path = temp_path / filename
    file_path.write_bytes(content)

    if extension == ".pdf":
        text = parse_pdf(file_path)
    elif extension in {".docx", ".doc"}:
        text = parse_docx(file_path)
    else:
        raise ValueError("Unsupported resume file type. Only PDF/DOCX are allowed.")

    file_path.unlink(missing_ok=True)
    return text
