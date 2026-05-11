from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List
import json
import asyncio
from app.services.ai_service import AIService
from app.api.deps import get_current_user_ws

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async steeple_connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/interview/{session_id}")
async def interview_websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
):
    # Custom dependency for WS auth
    user = await get_current_user_ws(websocket)
    if not user:
        return

    await manager.steeple_connect(websocket)
    ai_service = AIService()
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "user_voice_start":
                # Interruption handling: stop current AI TTS playback if user starts speaking
                await manager.send_personal_message({"type": "stop_audio"}, websocket)

            if message["type"] == "telemetry_sync":
                # Combined Voice + Video Telemetry
                payload = message["payload"]
                
                # 1. Voice Analysis
                if "audio_chunk" in payload:
                    # In a real prod environment, this pipes to Deepgram/Whisper
                    transcript_data = await ai_service.analyze_communication_metrics(
                        payload["transcript"], 
                        payload["duration"]
                    )
                    await manager.send_personal_message({
                        "type": "voice_metrics",
                        "data": transcript_data
                    }, websocket)

                # 2. Video Analysis (Eye contact, Posture)
                if "video_metrics" in payload:
                    # Metrics calculated client-side (Mediapipe) and synced here
                    await ai_service.log_performance_metrics(
                        session_id, 
                        payload["video_metrics"]
                    )
                    await manager.send_personal_message({
                        "type": "video_feedback",
                        "status": "recorded",
                        "engagement": payload["video_metrics"].get("engagement_score")
                    }, websocket)

                
            elif message["type"] == "video_telemetry":
                # Handle Eye Contact, Posture, and Confidence
                metrics = message["payload"]
                # Log to AnalyticsRecord for Recharts rendering
                await ai_service.log_performance_metrics(session_id, metrics)

    except WebSocketDisconnect:
        manager.disconnect(websocket)