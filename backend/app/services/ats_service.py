from typing import Dict, List
from app.services.ai_service import AIService
import json

class ATSService:
    def __init__(self):
        self.ai = AIService()

    async def analyze_compatibility(self, resume_text: str, job_description: str) -> Dict:
        prompt = f"""
        Act as a Senior Recruiter and ATS system. Compare the Resume with the Job Description.
        
        Resume: {resume_text[:4000]}
        JD: {job_description[:4000]}
        
        Return ONLY a JSON object with:
        1. match_score (0-100)
        2. missing_keywords (list)
        3. skill_gap_analysis (detailed string)
        4. optimization_tips (list of actionable strings)
        5. recruiter_summary (brief assessment)
        """
        
        response = await self.ai.generate_structured_output(prompt)
        return json.loads(response)

    def calculate_keyword_coverage(self, resume_text: str, target_keywords: List[str]) -> float:
        if not target_keywords:
            return 0.0
        found = [kw for kw in target_keywords if kw.lower() in resume_text.lower()]
        return len(found) / len(target_keywords) * 100