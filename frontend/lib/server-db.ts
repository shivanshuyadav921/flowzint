import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface DBUser {
  id: number;
  email: string;
  full_name: string;
  password_hash: string;
  salt: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

export interface DBInterviewSession {
  id: number;
  owner_id: number;
  title: string;
  role: string;
  difficulty: string;
  category: string;
  questions: string;
  answers?: string;
  feedback?: string;
  score?: number;
  created_at: string;
}

export interface DBResume {
  id: number;
  owner_id: number;
  filename: string;
  raw_text: string;
  summary: string;
  skills: string;
  ats_score: number;
  uploaded_at: string;
}

export interface DBAnalytics {
  id: number;
  owner_id: number;
  metric_name: string;
  metric_value: number;
  recorded_at: string;
}

interface DBData {
  users: DBUser[];
  interviews: DBInterviewSession[];
  resumes: DBResume[];
  analytics: DBAnalytics[];
}

// In-memory cache + persistent file in /tmp or local storage
const DB_FILE = process.env.DATABASE_STORAGE_PATH || path.join(process.cwd(), ".flowzint_data.json");

// Salt and hash passwords using Node's built-in crypto
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return testHash === hash;
}

// JWT simulation with HMAC SHA256
const JWT_SECRET = process.env.SECRET_KEY || "flowzint-secret-production-key-2026";

export function signToken(payload: { sub: number; email: string; name: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { sub: number; email: string; name: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// Global data store singleton
let memoryData: DBData | null = null;

function getInitialData(): DBData {
  const demoSalt = "4a8e99b2c3d4e5f6";
  const demoHash = crypto.pbkdf2Sync("DemoPass123!", demoSalt, 1000, 64, "sha512").toString("hex");

  return {
    users: [
      {
        id: 1,
        email: "demo@flowzint.com",
        full_name: "Flowzint Demo Candidate",
        password_hash: demoHash,
        salt: demoSalt,
        role: "candidate",
        avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=flowzint-demo",
        created_at: new Date().toISOString(),
      },
    ],
    interviews: [
      {
        id: 1,
        owner_id: 1,
        title: "Full Stack Engineer Mock Interview",
        role: "Full Stack / Frontend",
        difficulty: "Senior",
        category: "System Design, React, Performance",
        questions: "1. Tell me about a challenging frontend performance issue.\n2. Design scalable UI component library.",
        answers: "Q1: Diagnosed re-rendering bottlenecks using React DevTools profiler.\nQ2: Used atomic design principles and Tailwind CSS tokens.",
        feedback: "Score: 92/100. Excellent technical clarity and concrete metrics.",
        score: 92,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        owner_id: 1,
        title: "Backend & System Design Practice",
        role: "Backend & System Design",
        difficulty: "Mid-Senior",
        category: "Distributed Systems, Caching, Databases",
        questions: "1. How would you design a distributed rate limiter?",
        answers: "Implemented sliding window counter algorithm using Redis and Lua script.",
        feedback: "Score: 88/100. Strong understanding of distributed state.",
        score: 88,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    resumes: [
      {
        id: 1,
        owner_id: 1,
        filename: "senior-software-engineer-resume.pdf",
        raw_text: "Experienced Full Stack Engineer with 5+ years in TypeScript, Next.js, FastAPI, PostgreSQL, and AWS.",
        summary: "Full Stack Engineer skilled in React, Next.js, Node.js, Python, and scalable cloud systems.",
        skills: "React, Next.js, TypeScript, Python, FastAPI, Docker, Tailwind CSS, PostgreSQL, GraphQL, REST APIs",
        ats_score: 88,
        uploaded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    analytics: [
      { id: 1, owner_id: 1, metric_name: "Average Score", metric_value: 90, recorded_at: new Date().toISOString() },
      { id: 2, owner_id: 1, metric_name: "Readiness Rate", metric_value: 92, recorded_at: new Date().toISOString() },
      { id: 3, owner_id: 1, metric_name: "Completed Sessions", metric_value: 2, recorded_at: new Date().toISOString() },
    ],
  };
}

export function loadDB(): DBData {
  if (memoryData) return memoryData;

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      memoryData = JSON.parse(content);
      return memoryData!;
    }
  } catch {
    // If filesystem is read-only (like Vercel serverless without /tmp), fallback to memory
  }

  memoryData = getInitialData();
  saveDB();
  return memoryData;
}

export function saveDB(): void {
  if (!memoryData) return;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryData, null, 2), "utf-8");
  } catch {
    // Non-fatal if filesystem is serverless read-only
  }
}
