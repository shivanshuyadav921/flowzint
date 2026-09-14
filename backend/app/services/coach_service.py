from typing import List, Dict
from sqlalchemy.orm import Session
from app.services.rag_service import SemanticMemory
from app.services.ai_service import create_embeddings, generate_structured_output
import json

class CoachService:
    """Handles long-term candidate progress and adaptive questioning."""
    
    def __init__(self, db: Session):
        self.db = db
        self.memory = SemanticMemory() # ChromaDB wrapper

    async def get_weak_topics(self, user_id: int) -> List[str]:
        """Queries vector store for recurring negative feedback."""
        query_text = "What technical or soft skills is the user struggling with?"
        results = self.memory.query(query_text, n_results=5, filter={"user_id": str(user_id)})
        
        if not results['documents']:
            return []
            
        # Use LLM to synthesize vector results into topics
        prompt = f"Based on these session notes, list the top 3 weak topics for this user: {results['documents']}"
        response = await generate_structured_output(prompt)
        return json.loads(response).get("weak_topics", [])

    async def record_feedback_to_memory(self, user_id: int, feedback_text: str):
        """Stores session feedback into ChromaDB for future context."""
        embedding = await create_embeddings([feedback_text])
        self.memory.add_documents(
            docs=[feedback_text],
            metadatas=[{"user_id": str(user_id), "type": "feedback"}],
            embeddings=embedding
        )

    def get_practice_plan(self, weak_topics: List[str]) -> Dict:
        """Generates a daily practice plan based on weaknesses."""
        return {
            "plan": [f"Focus on {topic}" for topic in weak_topics],
            "suggested_role": "Software Engineer"
        }