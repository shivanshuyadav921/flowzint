import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("=== Testing FastAPI Endpoints ===")
    
    # 1. Root & Health
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("PASS: /health")

    # 2. Demo Auth
    res = client.post("/api/auth/demo")
    assert res.status_code == 200, f"Demo login failed: {res.text}"
    data = res.json()
    token = data["access_token"]
    assert token, "Token missing from demo login"
    print("PASS: /api/auth/demo")

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Get Current User (/api/auth/me)
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200, f"Get user profile failed: {res.text}"
    user = res.json()
    assert user["email"] == "demo@flowzint.com"
    print("PASS: /api/auth/me")

    # 4. Generate Interview
    res = client.post(
        "/api/interview/generate",
        headers=headers,
        json={
            "role": "Full Stack / Frontend",
            "difficulty": "Senior",
            "categories": ["System Design", "React"],
        },
    )
    assert res.status_code == 200, f"Generate interview failed: {res.text}"
    interview = res.json()
    session_id = interview["id"]
    print(f"PASS: /api/interview/generate (Session ID: {session_id})")

    # 5. Evaluate Interview Answer
    res = client.post(
        "/api/interview/evaluate",
        headers=headers,
        json={
            "session_id": session_id,
            "answer_text": "We utilized server-side rendering with Next.js and Redis caching to reduce latency by 40% under peak load.",
            "question_index": 0,
        },
    )
    assert res.status_code == 200, f"Evaluate answer failed: {res.text}"
    print("PASS: /api/interview/evaluate")

    # 6. Interview History
    res = client.get("/api/interview/history", headers=headers)
    assert res.status_code == 200, f"Get history failed: {res.text}"
    history = res.json()
    assert len(history) >= 1
    print(f"PASS: /api/interview/history ({len(history)} sessions found)")

    # 7. Upload Resume
    test_resume_content = b"Candidate: Shivanshu. Skills: React, Next.js, TypeScript, Python, FastAPI, Docker, Tailwind CSS."
    res = client.post(
        "/api/resume/upload",
        headers=headers,
        files={"file": ("test_resume.pdf", test_resume_content, "application/pdf")},
    )
    assert res.status_code == 200, f"Upload resume failed: {res.text}"
    print("PASS: /api/resume/upload")

    # 8. List My Resumes
    res = client.get("/api/resume/mine", headers=headers)
    assert res.status_code == 200, f"List resumes failed: {res.text}"
    resumes = res.json()
    assert len(resumes) >= 1
    print(f"PASS: /api/resume/mine ({len(resumes)} resumes found)")

    # 9. Analytics Summary
    res = client.get("/api/analytics/summary", headers=headers)
    assert res.status_code == 200, f"Get analytics failed: {res.text}"
    print("PASS: /api/analytics/summary")

    print("\nALL FASTAPI BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()

