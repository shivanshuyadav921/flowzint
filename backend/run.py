import os
import sys
import subprocess

def main():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    venv_uvicorn = os.path.join(backend_dir, "venv", "Scripts", "uvicorn.exe")
    
    if os.path.exists(venv_uvicorn):
        cmd = [venv_uvicorn, "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
    elif os.path.exists(venv_python):
        cmd = [venv_python, "-m", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
    else:
        cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
    
    print("Starting Flowzint FastAPI Backend on http://localhost:8000 ...")
    print("API Documentation available at http://localhost:8000/docs")
    
    try:
        subprocess.run(cmd, cwd=backend_dir)
    except KeyboardInterrupt:
        print("\nBackend server stopped.")

if __name__ == "__main__":
    main()
