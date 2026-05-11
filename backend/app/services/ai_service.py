import os
from typing import Any, Dict, List, Optional
import json
import httpx

from app.core.config import settings


class AIProviderError(Exception):
    pass


async def call_openai(prompt: str, max_tokens: int = 400, temperature: float = 0.2) -> str:
    if not settings.OPENAI_API_KEY:
        raise AIProviderError("OpenAI API key is not configured.")

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
        )
    response.raise_for_status()
    payload = response.json()
    return payload["choices"][0]["message"]["content"].strip()

async def generate_structured_output(prompt: str, model: str = "gpt-4o-mini") -> str:
    """Uses JSON mode to ensure the LLM returns a valid JSON object."""
    if not settings.OPENAI_API_KEY:
        raise AIProviderError("OpenAI API key is not configured.")

    async with httpx.AsyncClient(timeout=45) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": [{"role": "system", "content": "You are a helpful assistant designed to output JSON."}, {"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
            },
        )
    response.raise_for_status()
    payload = response.json()
    return payload["choices"][0]["message"]["content"].strip()

async def create_embeddings(texts: list[str]) -> list[list[float]]:
    if not settings.OPENAI_API_KEY:
        raise AIProviderError("OpenAI API key is not configured.")
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.openai.com/v1/embeddings",
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={"model": "text-embedding-3-small", "input": texts},
        )
    response.raise_for_status()
    payload = response.json()
    return [item["embedding"] for item in payload["data"]]


async def generate_interview_questions(
    role: str, 
    difficulty: str, 
    categories: list[str], 
    resume_summary: str | None = None,
    memory_context: str | None = None
) -> str:
    prompt = (
        f"You are an interview coach. Generate 8 interview questions for a {role} role at {difficulty} level. "
        f"Separate categories as {', '.join(categories)}. "
    )
    if resume_summary:
        prompt += f"Use resume details: {resume_summary}. "
    if memory_context:
        prompt += f"Consider the candidate's historical weaknesses: {memory_context}. "
    prompt += "Output questions grouped by category with clear headings."
    return await call_openai(prompt)


async def evaluate_answer(question: str, answer_text: str) -> str:
    prompt = (
        "Evaluate the following interview answer. Provide a score from 1 to 10, feedback for correctness, clarity, confidence, "
        "communication, and one improvement suggestion.\n\nQuestion:\n" + question + "\n\nAnswer:\n" + answer_text
    )
    return await call_openai(prompt)


async def generate_chat_response(history: list[dict[str, str]]) -> str:
    if not settings.OPENAI_API_KEY:
        raise AIProviderError("OpenAI API key is not configured.")
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-3.5-turbo",
                "messages": history,
                "temperature": 0.3,
                "max_tokens": 220,
            },
        )
    response.raise_for_status()
    payload = response.json()
    return payload["choices"][0]["message"]["content"].strip()

async def analyze_communication_metrics(transcript: str, duration_seconds: float) -> Dict:
    """
    Analyzes speaking speed, filler words, and clarity.
    """
    filler_words = ["um", "uh", "like", "actually", "basically", "you know"]
    words = transcript.lower().split()
    
    found_fillers = [w for w in words if w in filler_words]
    filler_count = len(found_fillers)
    wpm = (len(words) / duration_seconds) * 60 if duration_seconds > 0 else 0
    
    prompt = f"""
    Analyze this interview transcript for 'Confidence' and 'Clarity'. 
    Transcript: {transcript}
    
    Return a JSON with:
    - confidence_score (0-100)
    - clarity_score (0-100)
    - feedback (short string)
    """
    
    ai_analysis = await generate_structured_output(prompt)
    analysis = json.loads(ai_analysis)
    
    return {
        "wpm": round(wpm, 2),
        "filler_count": filler_count,
        **analysis
    }
