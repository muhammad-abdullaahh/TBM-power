import sys
import os
import traceback

# Ensure candidate directories are in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
for p in [parent_dir, os.path.join(parent_dir, "backend"), os.getcwd()]:
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
        return PlainTextResponse(f"BACKEND IMPORT ERROR:\n\n{import_error}", status_code=500)

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    async def catch_all_error(path: str = ""):
        return PlainTextResponse(f"BACKEND IMPORT ERROR:\n\n{import_error}", status_code=500)
else:
    app = main_app
