import sys
import os
import traceback

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")

for p in [backend_dir, root_dir, os.getcwd()]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

import_error = None
try:
    from app.main import app as main_app
except Exception:
    import_error = traceback.format_exc()

if import_error:
    from fastapi import FastAPI
    from fastapi.responses import PlainTextResponse

    app = FastAPI(title="Error Diagnostic")

    @app.get("/")
    async def root_error():
        return PlainTextResponse(f"BACKEND INITIALIZATION ERROR:\n\n{import_error}", status_code=500)

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    async def catch_all_error(path: str = ""):
        return PlainTextResponse(f"BACKEND INITIALIZATION ERROR:\n\n{import_error}", status_code=500)
else:
    app = main_app
