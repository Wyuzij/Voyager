"""高德地图服务：REST 优先，不依赖 MCP / uvx。"""

from __future__ import annotations

import json
import re
from typing import Any, Dict, List, Optional

from ..config import get_settings
from ..models.schemas import Location, POIInfo, RouteInfo, WeatherInfo
from ..utils.net import rest_get_json

AMAP_REST = "https://restapi.amap.com/v3"


def _extract_json(payload: Any) -> Any:
    if payload is None:
        return None
    if isinstance(payload, (dict, list)):
        return payload
    text = str(payload).strip()
    if not text:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = re.search(r"(\{.*\}|\[.*\])", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError:
        return None


def _parse_location(value: Any) -> Optional[Location]:
    if isinstance(value, Location):
        return value
    if isinstance(value, dict):
        lng = value.get("longitude") or value.get("lng")
        lat = value.get("latitude") or value.get("lat")
        if lng is not None and lat is not None:
            return Location(longitude=float(lng), latitude=float(lat))
        value = value.get("location")
    if isinstance(value, (list, tuple)) and len(value) >= 2:
        return Location(longitude=float(value[0]), latitude=float(value[1]))
    if isinstance(value, str) and "," in value:
        lng, lat = value.split(",", 1)
        try:
            return Location(longitude=float(lng), latitude=float(lat))
        except ValueError:
            return None
    return None


def _as_list(data: Any, *keys: str) -> List[Any]:
    if isinstance(data, list):
        return data
    if not isinstance(data, dict):
        return []
    for key in keys:
        value = data.get(key)
        if isinstance(value, list):
            return value
        if isinstance(value, dict):
            nested = _as_list(value, *keys)
            if nested:
                return nested
    return []


def _rest_get(path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    settings = get_settings()
    if not settings.amap_api_key:
        return {}
    query = {"key": settings.amap_api_key, **params}
    try:
        data = rest_get_json(f"{AMAP_REST}{path}", params=query, timeout=12.0)
        if str(data.get("status")) != "1":
            print(f"⚠️  高德REST失败 {path}: {data.get('info')}")
            return {}
        return data
    except Exception as exc:
        print(f"❌ 高德REST请求失败 {path}: {exc}")
        return {}


class AmapService:
    """高德地图 REST 封装。"""

    def search_poi(self, keywords: str, city: str, citylimit: bool = True) -> List[POIInfo]:
        rest = _rest_get("/place/text", {
            "keywords": keywords,
            "city": city,
            "citylimit": "true" if citylimit else "false",
            "offset": 20,
            "page": 1,
            "extensions": "all",
        })
        return self._pois_from_payload(rest)

    def get_weather(self, city: str) -> List[WeatherInfo]:
        weather = self._weather_from_payload(_rest_get("/weather/weatherInfo", {
            "city": city,
            "extensions": "all",
        }))
        if weather:
            return weather

        adcode = self._city_adcode(city)
        if adcode and adcode != city:
            weather = self._weather_from_payload(_rest_get("/weather/weatherInfo", {
                "city": adcode,
                "extensions": "all",
            }))
        return weather

    def _city_adcode(self, city: str) -> str:
        rest = _rest_get("/geocode/geo", {"address": city, "city": city})
        geocodes = rest.get("geocodes") or []
        if geocodes and isinstance(geocodes[0], dict):
            return str(geocodes[0].get("adcode") or city)
        return city

    def plan_route(
        self,
        origin_address: str,
        destination_address: str,
        origin_city: Optional[str] = None,
        destination_city: Optional[str] = None,
        route_type: str = "walking",
    ) -> Optional[RouteInfo]:
        origin = self.geocode(origin_address, origin_city)
        dest = self.geocode(destination_address, destination_city)
        if not origin or not dest:
            return None

        path = {
            "walking": "/direction/walking",
            "driving": "/direction/driving",
            "transit": "/direction/transit/integrated",
        }.get(route_type, "/direction/walking")
        params = {
            "origin": f"{origin.longitude},{origin.latitude}",
            "destination": f"{dest.longitude},{dest.latitude}",
        }
        if route_type == "transit":
            params["city"] = origin_city or destination_city or ""
            if destination_city:
                params["cityd"] = destination_city
        rest = _rest_get(path, params)
        return self._route_from_payload(rest, route_type)

    def geocode(self, address: str, city: Optional[str] = None) -> Optional[Location]:
        rest = _rest_get("/geocode/geo", {
            "address": address,
            **({"city": city} if city else {}),
        })
        return self._geo_from_payload(rest)

    def regeo(self, longitude: float, latitude: float) -> Dict[str, Any]:
        rest = _rest_get("/geocode/regeo", {
            "location": f"{longitude},{latitude}",
            "extensions": "base",
        })
        info = rest.get("regeocode") or {}
        addr = info.get("addressComponent") or {}
        return {
            "formatted": info.get("formatted_address") or "",
            "province": addr.get("province") or "",
            "city": addr.get("city") or addr.get("province") or "",
            "district": addr.get("district") or "",
            "township": addr.get("township") or "",
        }

    def get_poi_detail(self, poi_id: str) -> Dict[str, Any]:
        rest = _rest_get("/place/detail", {"id": poi_id})
        parsed = _extract_json(rest)
        return parsed if isinstance(parsed, dict) else {"raw": rest}

    def _pois_from_payload(self, data: Any) -> List[POIInfo]:
        rows = _as_list(data, "pois", "data", "results")
        pois: List[POIInfo] = []
        seen = set()
        for row in rows:
            if not isinstance(row, dict):
                continue
            location = _parse_location(row.get("location") or row)
            if not location:
                continue
            name = row.get("name") or row.get("title")
            if not name or name in seen:
                continue
            seen.add(name)
            pois.append(POIInfo(
                id=str(row.get("id") or row.get("poi_id") or name),
                name=name,
                type=str(row.get("type") or row.get("typecode") or "景点"),
                address=str(row.get("address") or row.get("adname") or ""),
                location=location,
                tel=row.get("tel") or row.get("phone") or None,
            ))
        return pois

    def _weather_from_payload(self, data: Any) -> List[WeatherInfo]:
        if not data:
            return []
        casts: List[Any] = []
        if isinstance(data, dict):
            forecasts = data.get("forecasts") or []
            if forecasts and isinstance(forecasts[0], dict):
                casts = forecasts[0].get("casts") or []
            if not casts:
                casts = _as_list(data, "casts", "lives", "data")
        if isinstance(data, list):
            casts = data

        weather: List[WeatherInfo] = []
        for row in casts:
            if not isinstance(row, dict):
                continue
            weather.append(WeatherInfo(
                date=str(row.get("date") or row.get("reporttime") or "")[:10],
                day_weather=str(row.get("dayweather") or row.get("day_weather") or row.get("weather") or ""),
                night_weather=str(row.get("nightweather") or row.get("night_weather") or ""),
                day_temp=row.get("daytemp") or row.get("day_temp") or row.get("temperature") or 0,
                night_temp=row.get("nighttemp") or row.get("night_temp") or 0,
                wind_direction=str(row.get("daywind") or row.get("wind_direction") or row.get("winddirection") or ""),
                wind_power=str(row.get("daypower") or row.get("wind_power") or row.get("windpower") or ""),
            ))
        return weather

    def _route_from_payload(self, data: Any, route_type: str) -> Optional[RouteInfo]:
        if not data:
            return None
        path = None
        if isinstance(data, dict):
            route = data.get("route") or data
            paths = route.get("paths") if isinstance(route, dict) else None
            if isinstance(paths, list) and paths:
                path = paths[0]
            transits = route.get("transits") if isinstance(route, dict) else None
            if not path and isinstance(transits, list) and transits:
                path = transits[0]
            if not path and ("distance" in data or "duration" in data):
                path = data
        if not isinstance(path, dict):
            return None
        try:
            distance = float(path.get("distance") or 0)
            duration = int(float(path.get("duration") or 0))
        except (TypeError, ValueError):
            return None
        steps = path.get("steps") or []
        names = []
        for step in steps[:4]:
            if isinstance(step, dict) and step.get("instruction"):
                names.append(str(step["instruction"]))
        description = "；".join(names) or f"{route_type} 约 {int(distance)} 米 / {duration} 秒"
        return RouteInfo(
            distance=distance,
            duration=duration,
            route_type=route_type,
            description=description,
        )

    def _geo_from_payload(self, data: Any) -> Optional[Location]:
        if not data:
            return None
        if isinstance(data, dict):
            direct = _parse_location(data)
            if direct:
                return direct
            geocodes = data.get("geocodes") or data.get("data") or []
            if isinstance(geocodes, list) and geocodes:
                return _parse_location(geocodes[0])
        return _parse_location(data)


_amap_service = None


def get_amap_service() -> AmapService:
    global _amap_service
    if _amap_service is None:
        _amap_service = AmapService()
    return _amap_service
