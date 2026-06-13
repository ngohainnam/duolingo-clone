# Vision Agent

Voice-only AI language teacher powered by Gemini Realtime and Stream Edge.

The service loads `STREAM_API_KEY`, `STREAM_API_SECRET`, and `GEMINI_API_KEY`
from the parent repo's `.env`.

The Expo API routes proxy session start and stop requests to this service using
the server-only `VISION_AGENT_URL` environment variable. It defaults to
`http://127.0.0.1:8000` for local development.

## Setup

Add your Gemini key to the parent `.env`:

```env
GEMINI_API_KEY=
```

Install dependencies:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Run

From the repository root, start the HTTP server:

```powershell
.\vision-agent\.venv\Scripts\python.exe .\vision-agent\main.py serve --host 127.0.0.1 --port 8000 --no-splash
```

Or change into the Vision Agent directory first:

```powershell
Set-Location .\vision-agent
.\.venv\Scripts\python.exe main.py serve --host 127.0.0.1 --port 8000 --no-splash
```

From the `vision-agent` directory, start one local call session:

```powershell
.\.venv\Scripts\python.exe main.py run --no-splash
```
