"""托管 uni-app H5 构建产物，用于无需备案的网页预览。"""
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


def get_h5_dir() -> Path:
    return Path(__file__).resolve().parents[2] / "static" / "h5"


def mount_h5_preview(app: FastAPI) -> None:
    h5_dir = get_h5_dir()
    if not h5_dir.is_dir() or not (h5_dir / "index.html").is_file():
        print("ℹ️  未找到 H5 预览包 (backend/static/h5)，仅提供 API")
        print("   在 travel 目录执行: npm run preview:pack")
        return

    app.mount("/", StaticFiles(directory=str(h5_dir), html=True), name="h5-preview")
    print(f"🌐 H5 网页预览已启用: {h5_dir}")
