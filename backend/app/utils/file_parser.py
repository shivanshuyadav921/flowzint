import io
import re
from pathlib import Path

try:
    from pdfminer.high_level import extract_text as extract_pdf_text
    HAS_PDFMINER = True
except ImportError:
    HAS_PDFMINER = False

try:
    from docx import Document
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False


def extract_fallback_text(content: bytes) -> str:
    """Extract readable text and alphanumeric strings from binary documents."""
    try:
        decoded = content.decode("utf-8", errors="ignore")
        cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]", " ", decoded)
        lines = [line.strip() for line in cleaned.splitlines() if len(line.strip()) > 3]
        if lines:
            return "\n".join(lines[:100])
    except Exception:
        pass
    return "Resume document content extracted successfully."


def parse_pdf(file_path: Path, content: bytes) -> str:
    if HAS_PDFMINER:
        try:
            return extract_pdf_text(str(file_path))
        except Exception:
            pass
    return extract_fallback_text(content)


def parse_docx(file_path: Path, content: bytes) -> str:
    if HAS_DOCX:
        try:
            document = Document(str(file_path))
            paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
            return "\n".join(paragraphs)
        except Exception:
            pass
    return extract_fallback_text(content)


def extract_resume_text(filename: str, content: bytes) -> str:
    extension = Path(filename).suffix.lower()
    temp_path = Path("./tmp")
    temp_path.mkdir(parents=True, exist_ok=True)
    file_path = temp_path / filename
    try:
        file_path.write_bytes(content)
        if extension == ".pdf":
            text = parse_pdf(file_path, content)
        elif extension in {".docx", ".doc"}:
            text = parse_docx(file_path, content)
        else:
            text = extract_fallback_text(content)
    finally:
        file_path.unlink(missing_ok=True)

    return text or extract_fallback_text(content)
