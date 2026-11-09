from typing import Any, Dict, List, Optional
import os

from app.core.config import settings

try:
    import chromadb
    HAS_CHROMADB = True
except ImportError:
    HAS_CHROMADB = False


class QueryResult(list):
    """List subclass that also supports dict-style access for backwards compatibility."""
    def __init__(self, items: List[Dict[str, Any]], documents: Optional[List[str]] = None):
        super().__init__(items)
        self.documents = documents if documents is not None else [item.get("text", "") for item in items]

    def __getitem__(self, key: Any) -> Any:
        if isinstance(key, str):
            if key == "documents":
                return self.documents
            raise KeyError(key)
        return super().__getitem__(key)

    def get(self, key: str, default: Any = None) -> Any:
        if key == "documents":
            return self.documents
        return default


class SemanticMemory:
    def __init__(self) -> None:
        self.in_memory_docs: List[Dict[str, Any]] = []
        if HAS_CHROMADB:
            try:
                os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
                self.client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
                self.collection = self.client.get_or_create_collection("flowzint_knowledge")
            except Exception:
                self.client = None
                self.collection = None
        else:
            self.client = None
            self.collection = None

    def add_documents(
        self, docs: list[str], metadatas: list[dict[str, str]], embeddings: list[list[float]] | None = None
    ) -> None:
        if getattr(self, "collection", None):
            try:
                ids = [f"doc_{len(self.in_memory_docs) + i}" for i in range(len(docs))]
                self.collection.add(
                    documents=docs,
                    metadatas=metadatas,
                    embeddings=embeddings,
                    ids=ids,
                )
            except Exception:
                pass
        for doc, meta in zip(docs, metadatas):
            self.in_memory_docs.append({"text": doc, **(meta or {})})

    def query(
        self,
        query_text: str,
        n_results: int = 3,
        filter: dict[str, Any] | None = None,
        where: dict[str, Any] | None = None,
    ) -> QueryResult:
        query_filter = where or filter
        if getattr(self, "collection", None):
            try:
                kwargs: Dict[str, Any] = {"query_texts": [query_text], "n_results": n_results}
                if query_filter:
                    kwargs["where"] = query_filter
                results = self.collection.query(**kwargs)
                documents = results.get("documents", [[]])[0]
                metadatas = results.get("metadatas", [[]])[0]
                items = [
                    {"text": text, **(metadata or {})}
                    for text, metadata in zip(documents, metadatas)
                    if text
                ]
                return QueryResult(items, documents=documents)
            except Exception:
                pass

        # Fallback in-memory search
        filtered = self.in_memory_docs
        if query_filter:
            for k, v in query_filter.items():
                filtered = [d for d in filtered if str(d.get(k)) == str(v)]

        items = filtered[:n_results]
        return QueryResult(items, documents=[d.get("text", "") for d in items])
