"""LLM服务模块"""

import os

import httpx
from hello_agents import HelloAgentsLLM
from openai import OpenAI

from ..utils.net import clear_proxy_env


_llm_instance = None

# DeepSeek 已下线 preview 等旧模型名，启动时自动映射
_MODEL_ALIASES = {
    "deepseek-v4-preview": "deepseek-v4-flash",
    "deepseek-v3": "deepseek-chat",
}


def _resolve_model() -> str:
    model = os.getenv("LLM_MODEL_ID") or "deepseek-v4-flash"
    mapped = _MODEL_ALIASES.get(model, model)
    if mapped != model:
        print(f"⚠️  模型 {model} 已不可用，改用 {mapped}")
    return mapped


def get_llm() -> HelloAgentsLLM:
    """获取LLM实例(单例模式)。httpx 不读系统代理，避免 SOCKS 报错。"""
    global _llm_instance

    if _llm_instance is None:
        clear_proxy_env()
        timeout = int(os.getenv("LLM_TIMEOUT", "180"))

        _llm_instance = HelloAgentsLLM(model=_resolve_model(), timeout=timeout)
        _llm_instance._client = OpenAI(
            api_key=_llm_instance.api_key,
            base_url=_llm_instance.base_url,
            timeout=_llm_instance.timeout,
            http_client=httpx.Client(
                trust_env=False,
                timeout=_llm_instance.timeout,
                follow_redirects=True,
            ),
        )

        print("✅ LLM服务初始化成功")
        print(f"   提供商: {_llm_instance.provider}")
        print(f"   模型: {_llm_instance.model}")

    return _llm_instance


def reset_llm():
    """重置LLM实例(用于测试或重新配置)"""
    global _llm_instance
    _llm_instance = None
