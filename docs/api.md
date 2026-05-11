# API Documentation

## Authentication

### `POST /api/auth/signup`
- Request body: `{ email, password, full_name }`
- Response: created user

### `POST /api/auth/login`
- Request body (form): `username`, `password`
- Response: `{ access_token, token_type, expires_at }`

## Resume

### `POST /api/resume/upload`
- Multipart form upload with file field `file`
- Protected route
- Parses PDF / DOCX resume and stores metadata

### `GET /api/resume/mine`
- Returns all resumes for the current user
- Protected route

## Interview

### `POST /api/interview/generate`
- Request body: `{ role, difficulty, categories, resume_id? }`
- Protected route
- Generates AI interview questions

### `POST /api/interview/evaluate`
- Request body: `{ session_id, answer_text, question_index }`
- Evaluates the answer and stores feedback

### `GET /api/interview/history`
- Returns interview session history for the user

## Chat

### `POST /api/chat/message`
- Request body: `{ session_id, role, content }`
- Protected route
- Persists conversation and returns assistant reply

### `GET /api/chat/session/{session_id}`
- Query chat session messages

## Analytics

### `GET /api/analytics/summary`
- Returns recent analytics records for the user
