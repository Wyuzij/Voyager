"""网络辅助：避开本机失效代理，避免 httpx SOCKS 报错。"""

from __future__ import annotations

import os
from typing import Optional

import httpx

_PROXY_KEYS = (
    "HTTP_PROXY",
    "HTTPS_PROXY",
    "ALL_PROXY",
    "http_proxy",
    "https_proxy",
    "all_proxy",
    "SOCKS_PROXY",
    "socks_proxy",
    "HTTPX_PROXY",
    "httpx_proxy",
)


def clear_proxy_env() -> None:
    for key in _PROXY_KEYS:
        os.environ.pop(key, None)
    os.environ.setdefault("NO_PROXY", "*")
    os.environ.setdefault("no_proxy", "*")


def httpx_client(timeout: float = 12.0) -> httpx.Client:
    return httpx.Client(timeout=timeout, trust_env=False, follow_redirects=True)


def rest_get_json(url: str, params: Optional[dict] = None, timeout: float = 12.0) -> dict:
    with httpx_client(timeout=timeout) as client:
        response = client.get(url, params=params)
        response.raise_for_status()
        return response.json()
