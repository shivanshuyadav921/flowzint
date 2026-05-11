import chromadb

from app.core.config import settings


class SemanticMemory:
    def __init__(self) -> None:
        self.client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
        self.collection = self.client.get_or_create_collection("flowzint_knowledge")

    def add_documents(self, docs: list[str], metadatas: list[dict[str, str]], embeddings: list[list[float]]) -> None:
        self.collection.add(
            documents=docs,
            metadatas=metadatas,
            embeddings=embeddings,
        )

    def query(self, query_text: str, n_results: int = 3) -> list[dict[str, str]]:
        results = self.collection.query(query_texts=[query_text], n_results=n_results)
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        return [
            {"text": text, **(metadata or {})}
            for text, metadata in zip(documents, metadatas)
            if text
        ]
