"""给 HelloAgents 用的高德 REST 工具，名称与原 MCP 展开名一致。"""

from __future__ import annotations

import json
from typing import Any, Dict, List

from hello_agents.tools.base import Tool, ToolParameter

from ..services.amap_service import get_amap_service


def _pois_to_text(pois) -> str:
    rows = []
    for poi in pois[:15]:
        loc = poi.location
        rows.append({
            "name": poi.name,
            "address": poi.address,
            "type": poi.type,
            "location": {"longitude": loc.longitude, "latitude": loc.latitude},
            "tel": poi.tel,
        })
    return json.dumps(rows, ensure_ascii=False, indent=2)


class AmapTextSearchTool(Tool):
    def __init__(self):
        super().__init__(
            name="amap_maps_text_search",
            description="用高德地图搜索城市内的景点、酒店或美食。参数: keywords, city",
        )

    def get_parameters(self) -> List[ToolParameter]:
        return [
            ToolParameter(name="keywords", type="string", description="搜索关键词", required=True),
            ToolParameter(name="city", type="string", description="城市名", required=True),
        ]

    def run(self, parameters: Dict[str, Any]) -> str:
        keywords = str(parameters.get("keywords") or parameters.get("input") or "景点").strip()
        city = str(parameters.get("city") or "").strip()
        if not city:
            return "错误：必须提供 city"
        pois = get_amap_service().search_poi(keywords, city)
        if not pois:
            return f"未搜索到与「{keywords}」相关的{city}地点"
        return _pois_to_text(pois)


class AmapWeatherTool(Tool):
    def __init__(self):
        super().__init__(
            name="amap_maps_weather",
            description="查询城市天气预报。参数: city",
        )

    def get_parameters(self) -> List[ToolParameter]:
        return [
            ToolParameter(name="city", type="string", description="城市名", required=True),
        ]

    def run(self, parameters: Dict[str, Any]) -> str:
        city = str(parameters.get("city") or parameters.get("input") or "").strip()
        if not city:
            return "错误：必须提供 city"
        weather = get_amap_service().get_weather(city)
        if not weather:
            return f"未查询到{city}的天气"
        rows = [item.model_dump() for item in weather]
        return json.dumps(rows, ensure_ascii=False, indent=2)
