"""多智能体旅行规划系统"""

import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import json
import re
import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from hello_agents import SimpleAgent

from ..models.schemas import (
    Attraction,
    Budget,
    DayPlan,
    Hotel,
    Location,
    Meal,
    TripPlan,
    TripRequest,
    WeatherInfo,
)
from ..services.amap_service import get_amap_service
from ..services.llm_service import get_llm
from ..utils.logger import log
from .amap_rest_tools import AmapTextSearchTool, AmapWeatherTool

ATTRACTION_AGENT_PROMPT = """你是景点搜索专家。你必须使用工具搜索景点，不要编造。

工具格式:
`[TOOL_CALL:amap_maps_text_search:keywords=景点关键词,city=城市名]`
"""

WEATHER_AGENT_PROMPT = """你是天气查询专家。你必须使用工具查询天气，不要编造。

工具格式:
`[TOOL_CALL:amap_maps_weather:city=城市名]`
"""

HOTEL_AGENT_PROMPT = """你是酒店推荐专家。你必须使用工具搜索酒店，不要编造。

工具格式:
`[TOOL_CALL:amap_maps_text_search:keywords=酒店,city=城市名]`
"""

PLANNER_AGENT_PROMPT = """你是行程规划专家。根据提供的高德检索结果生成详细旅行计划。

## 核心规则(必须遵守)

1. **必须使用真实数据**: 景点、酒店、餐厅的名称、地址、坐标必须来自检索结果，严禁编造或使用占位符
2. **餐饮推荐要具体**: 从餐厅检索结果里选真实店名
3. **酒店必须来自检索结果**: 没有酒店则 hotel 设为 null
4. **天气如实填写**: 使用提供的天气数据
5. **直接输出纯JSON**: 不要解释、不要 markdown 代码块，只输出可被 json.loads() 解析的对象

## JSON结构

{
  "city": "实际城市名",
  "start_date": "实际开始日期",
  "end_date": "实际结束日期",
  "days": [
    {
      "date": "实际日期",
      "day_index": 0,
      "description": "当天行程概述",
      "transportation": "实际交通方式",
      "accommodation": "实际住宿类型",
      "hotel": {
        "name": "真实酒店名",
        "address": "酒店真实地址",
        "location": {"longitude": 0.0, "latitude": 0.0},
        "price_range": "价格区间",
        "rating": "评分",
        "distance": "距景点距离",
        "type": "酒店类型",
        "estimated_cost": 400
      },
      "attractions": [
        {
          "name": "真实景点名",
          "address": "真实地址",
          "location": {"longitude": 0.0, "latitude": 0.0},
          "visit_duration": 120,
          "description": "基于真实信息的描述",
          "category": "实际类别",
          "ticket_price": 0
        }
      ],
      "meals": [
        {"type": "breakfast", "name": "真实餐厅名", "description": "具体描述", "estimated_cost": 30},
        {"type": "lunch", "name": "真实餐厅名", "description": "具体描述", "estimated_cost": 50},
        {"type": "dinner", "name": "真实餐厅名", "description": "具体描述", "estimated_cost": 80}
      ]
    }
  ],
  "weather_info": [
    {
      "date": "实际日期",
      "day_weather": "实际白天天气",
      "night_weather": "实际夜间天气",
      "day_temp": 25,
      "night_temp": 15,
      "wind_direction": "实际风向",
      "wind_power": "实际风力"
    }
  ],
  "overall_suggestions": "基于真实情况的旅行建议",
  "budget": {
    "total_attractions": 0,
    "total_hotels": 0,
    "total_meals": 0,
    "total_transportation": 0,
    "total": 0
  }
}

## 数据规格
1. weather_info 必须覆盖每一天，温度是纯数字
2. 每天安排2-3个景点，尽量就近
3. 每天必须包含早中晚三餐
4. 费用字段必须是整数
5. 坐标必须来自检索结果
"""


class MultiAgentTripPlanner:
    """多智能体旅行规划系统：高德工具检索 + 规划 Agent 编排。"""

    def __init__(self):
        _l = log()
        _l.info("🔄 开始初始化多智能体旅行规划系统...")

        try:
            self.llm = get_llm()
            search_tool = AmapTextSearchTool()
            weather_tool = AmapWeatherTool()

            _l.info("  - 创建景点搜索Agent...")
            self.attraction_agent = SimpleAgent(
                name="景点搜索专家",
                llm=self.llm,
                system_prompt=ATTRACTION_AGENT_PROMPT
            )
            self.attraction_agent.add_tool(search_tool)

            _l.info("  - 创建天气查询Agent...")
            self.weather_agent = SimpleAgent(
                name="天气查询专家",
                llm=self.llm,
                system_prompt=WEATHER_AGENT_PROMPT
            )
            self.weather_agent.add_tool(weather_tool)

            _l.info("  - 创建酒店推荐Agent...")
            self.hotel_agent = SimpleAgent(
                name="酒店推荐专家",
                llm=self.llm,
                system_prompt=HOTEL_AGENT_PROMPT
            )
            self.hotel_agent.add_tool(search_tool)

            _l.info("  - 创建行程规划Agent...")
            self.planner_agent = SimpleAgent(
                name="行程规划专家",
                llm=self.llm,
                system_prompt=PLANNER_AGENT_PROMPT
            )

            _l.info("✅ 多智能体系统初始化成功")
            _l.info("   景点搜索Agent: %d 个工具", len(self.attraction_agent.list_tools()))
            _l.info("   天气查询Agent: %d 个工具", len(self.weather_agent.list_tools()))
            _l.info("   酒店推荐Agent: %d 个工具", len(self.hotel_agent.list_tools()))

        except Exception as e:
            _l.error("❌ 多智能体系统初始化失败: %s", str(e))
            import traceback
            traceback.print_exc()
            raise

    def plan_trip(self, request: TripRequest) -> TripPlan:
        _l = log()
        planner_response = ""
        facts: Dict[str, Any] = {}
        try:
            _l.info("=" * 50)
            _l.info("🚀 开始多智能体协作规划旅行")
            _l.info("   目的地: %s | 日期: %s ~ %s | 天数: %d",
                     request.city, request.start_date, request.end_date, request.travel_days)
            _l.info("   偏好: %s", ', '.join(request.preferences) if request.preferences else '无')
            _l.info("   交通: %s | 住宿: %s", request.transportation, request.accommodation)
            _l.info("=" * 50)

            t0 = time.time()
            _l.info("📍 [步骤1/4] 高德检索景点 / 酒店 / 餐饮...")
            facts = self._collect_amap_facts(request)
            _l.info(
                "   耗时: %.1fs | 景点 %d | 酒店 %d | 餐饮 %d | 天气 %d 天",
                time.time() - t0,
                len(facts["attractions"]),
                len(facts["hotels"]),
                len(facts["restaurants"]),
                len(facts["weather"]),
            )

            t0 = time.time()
            _l.info("🌤️  [步骤2/4] 天气与候选地点已就绪，交给规划专家")
            planner_query = self._build_planner_query_from_facts(request, facts)
            _l.info("📋 [步骤3/4] 调用行程规划专家 (Agent: %s)...", self.planner_agent.name)
            planner_response = self.planner_agent.run(planner_query)
            _l.info("   耗时: %.1fs | 响应长度: %d 字符", time.time() - t0, len(planner_response))
            _l.debug("   响应内容:\n%s", planner_response[:500])

            trip_plan = self._parse_response(planner_response, request)
            if not self._plan_has_attractions(trip_plan) and facts["attractions"]:
                _l.warning("⚠️  规划专家未产出可用景点，改用高德检索结果组装行程")
                trip_plan = self._assemble_from_facts(request, facts)

            _l.info("=" * 50)
            _l.info("✅ 旅行计划生成完成! 共 %d 天行程", len(trip_plan.days))
            if trip_plan.days and trip_plan.days[0].attractions:
                names = [a.name for a in trip_plan.days[0].attractions]
                _l.info("   Day1 景点: %s", ', '.join(names))
            _l.info("=" * 50)
            return trip_plan

        except Exception as e:
            _l.error("❌ 生成旅行计划失败: %s", str(e))
            import traceback
            traceback.print_exc()
            if facts.get("attractions"):
                _l.warning("⚠️  规划专家失败，改用高德检索结果组装行程")
                return self._assemble_from_facts(request, facts)
            return self._create_fallback_plan(request, planner_response)

    def _collect_amap_facts(self, request: TripRequest) -> Dict[str, Any]:
        amap = get_amap_service()
        keywords = [k.strip() for k in (request.preferences or []) if k.strip()] or ["风景名胜"]
        attractions: List[Dict[str, Any]] = []
        seen = set()

        for name in self._basket_names(request.free_text_input):
            for poi in amap.search_poi(name, request.city)[:2]:
                item = self._poi_dict(poi)
                if item["name"] not in seen:
                    seen.add(item["name"])
                    attractions.append(item)

        for kw in keywords[:3]:
            for poi in amap.search_poi(kw, request.city):
                item = self._poi_dict(poi)
                if item["name"] not in seen:
                    seen.add(item["name"])
                    attractions.append(item)
            if len(attractions) >= 12:
                break

        if len(attractions) < 4:
            for poi in amap.search_poi("景点", request.city):
                item = self._poi_dict(poi)
                if item["name"] not in seen:
                    seen.add(item["name"])
                    attractions.append(item)

        hotel_kw = request.accommodation if request.accommodation else "酒店"
        hotels = [self._poi_dict(p) for p in amap.search_poi(hotel_kw, request.city)[:10]]
        if not hotels and hotel_kw != "酒店":
            hotels = [self._poi_dict(p) for p in amap.search_poi("酒店", request.city)[:10]]

        restaurants = [self._poi_dict(p) for p in amap.search_poi("特色美食", request.city)[:10]]
        if not restaurants:
            restaurants = [self._poi_dict(p) for p in amap.search_poi("餐厅", request.city)[:10]]

        weather = [w.model_dump() for w in amap.get_weather(request.city)]
        return {
            "attractions": attractions[:15],
            "hotels": hotels,
            "restaurants": restaurants,
            "weather": weather,
        }

    def _basket_names(self, free_text: Optional[str]) -> List[str]:
        if not free_text or "行程篮已选" not in free_text:
            return []
        part = free_text.split("行程篮已选", 1)[-1]
        part = part.replace("：", "").replace(":", "")
        return [n.strip() for n in re.split(r"[、，,；;]", part) if n.strip()]

    def _poi_dict(self, poi) -> Dict[str, Any]:
        return {
            "name": poi.name,
            "address": poi.address,
            "type": poi.type,
            "location": {
                "longitude": poi.location.longitude,
                "latitude": poi.location.latitude,
            },
        }

    def _build_planner_query_from_facts(self, request: TripRequest, facts: Dict[str, Any]) -> str:
        query = f"""请根据以下高德检索结果，生成{request.city}的{request.travel_days}天旅行计划。

**基本信息:**
- 城市: {request.city}
- 日期: {request.start_date} 至 {request.end_date}
- 天数: {request.travel_days}天
- 交通方式: {request.transportation}
- 住宿: {request.accommodation}
- 偏好: {', '.join(request.preferences) if request.preferences else '无'}

**景点检索结果:**
{json.dumps(facts['attractions'], ensure_ascii=False, indent=2)}

**天气信息:**
{json.dumps(facts['weather'], ensure_ascii=False, indent=2)}

**酒店检索结果:**
{json.dumps(facts['hotels'], ensure_ascii=False, indent=2)}

**餐饮检索结果:**
{json.dumps(facts['restaurants'], ensure_ascii=False, indent=2)}

**要求:**
1. 每天安排2-3个景点，名称和坐标必须来自检索结果
2. 每天必须包含早中晚三餐，店名来自餐饮检索结果
3. 每天推荐一个具体酒店（从酒店结果中选）
4. 只返回完整 JSON
"""
        if request.free_text_input:
            query += f"\n**额外要求:** {request.free_text_input}"
        return query

    def _plan_has_attractions(self, plan: TripPlan) -> bool:
        return any(day.attractions for day in (plan.days or []))

    def _assemble_from_facts(self, request: TripRequest, facts: Dict[str, Any]) -> TripPlan:
        start_date = datetime.strptime(request.start_date, "%Y-%m-%d")
        attractions = facts.get("attractions") or []
        hotels = facts.get("hotels") or []
        restaurants = facts.get("restaurants") or []
        weather_rows = facts.get("weather") or []
        per_day = max(2, min(3, (len(attractions) + request.travel_days - 1) // request.travel_days or 2))

        days = []
        for i in range(request.travel_days):
            current = start_date + timedelta(days=i)
            day_attractions = []
            for j in range(per_day):
                idx = i * per_day + j
                if idx >= len(attractions):
                    break
                item = attractions[idx]
                loc = item.get("location") or {}
                day_attractions.append(Attraction(
                    name=item["name"],
                    address=item.get("address") or f"{request.city}",
                    location=Location(
                        longitude=float(loc.get("longitude") or 0),
                        latitude=float(loc.get("latitude") or 0),
                    ),
                    visit_duration=120,
                    description=f"{item['name']}是{request.city}的热门地点",
                    category=item.get("type") or "景点",
                ))

            hotel = None
            if hotels:
                h = hotels[i % len(hotels)]
                loc = h.get("location") or {}
                hotel = Hotel(
                    name=h["name"],
                    address=h.get("address") or f"{request.city}",
                    location=Location(
                        longitude=float(loc.get("longitude") or 0),
                        latitude=float(loc.get("latitude") or 0),
                    ),
                    type=request.accommodation,
                    estimated_cost=300,
                )

            meals = []
            meal_types = [("breakfast", 30), ("lunch", 50), ("dinner", 80)]
            for j, (mtype, cost) in enumerate(meal_types):
                if restaurants:
                    r = restaurants[(i * 3 + j) % len(restaurants)]
                    meals.append(Meal(
                        type=mtype,
                        name=r["name"],
                        description=r.get("address") or f"{request.city}美食",
                        estimated_cost=cost,
                    ))
                else:
                    meals.append(Meal(type=mtype, name=f"当地{mtype}", description="请参考当地美食", estimated_cost=cost))

            days.append(DayPlan(
                date=current.strftime("%Y-%m-%d"),
                day_index=i,
                description=f"第{i + 1}天：参观" + "、".join(a.name for a in day_attractions[:2]),
                transportation=request.transportation,
                accommodation=request.accommodation,
                hotel=hotel,
                attractions=day_attractions,
                meals=meals,
            ))

        weather_info = []
        for j in range(request.travel_days):
            d = start_date + timedelta(days=j)
            row = weather_rows[j] if j < len(weather_rows) else {}
            weather_info.append(WeatherInfo(
                date=d.strftime("%Y-%m-%d"),
                day_weather=str(row.get("day_weather") or ""),
                night_weather=str(row.get("night_weather") or ""),
                day_temp=row.get("day_temp") or 0,
                night_temp=row.get("night_temp") or 0,
                wind_direction=str(row.get("wind_direction") or ""),
                wind_power=str(row.get("wind_power") or ""),
            ))

        hotel_total = 300 * request.travel_days if hotels else 0
        meal_total = 160 * request.travel_days
        return TripPlan(
            city=request.city,
            start_date=request.start_date,
            end_date=request.end_date,
            days=days,
            weather_info=weather_info,
            overall_suggestions=f"行程地点来自高德检索，建议出行前确认开放时间与门票。",
            budget=Budget(
                total_attractions=0,
                total_hotels=hotel_total,
                total_meals=meal_total,
                total_transportation=80 * request.travel_days,
                total=hotel_total + meal_total + 80 * request.travel_days,
            ),
        )

    def _parse_response(self, response: str, request: TripRequest) -> TripPlan:
        json_str = None

        if "```json" in response:
            json_start = response.find("```json") + 7
            json_end = response.find("```", json_start)
            if json_end > json_start:
                json_str = response[json_start:json_end].strip()

        if not json_str and "```" in response:
            json_start = response.find("```") + 3
            json_end = response.find("```", json_start)
            if json_end > json_start:
                json_str = response[json_start:json_end].strip()

        if not json_str and "{" in response and "}" in response:
            json_start = response.find("{")
            depth = 0
            json_end = json_start
            for i, ch in enumerate(response[json_start:], json_start):
                if ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        json_end = i + 1
                        break
            if json_end > json_start:
                json_str = response[json_start:json_end]

        if not json_str:
            _l = log()
            _l.warning("⚠️  响应中未找到JSON数据,尝试从原始响应提取...")
            return self._create_fallback_plan(request, response)

        data = self._try_parse_json(json_str)

        if data:
            try:
                return TripPlan(**data)
            except Exception as e:
                _l = log()
                _l.warning("⚠️  TripPlan构造失败: %s, 使用部分数据做fallback", e)
                return self._create_fallback_plan(request, response, partial_data=data)

        _l = log()
        _l.warning("⚠️  JSON解析完全失败,使用备用方案")
        return self._create_fallback_plan(request, response)

    def _try_parse_json(self, json_str: str):
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass

        fixed = re.sub(r',\s*}', '}', json_str)
        fixed = re.sub(r',\s*]', ']', fixed)
        try:
            return json.loads(fixed)
        except json.JSONDecodeError:
            pass

        lines = json_str.split("\n")
        cleaned = []
        for line in lines:
            s = line.strip()
            if not s or s.startswith("//") or s.startswith("#"):
                continue
            if not any(c in s for c in ['{', '}', '[', ']', ':', '"']):
                continue
            cleaned.append(line)
        try:
            return json.loads("\n".join(cleaned))
        except json.JSONDecodeError:
            pass

        return self._extract_largest_valid_json(json_str)

    def _extract_largest_valid_json(self, text: str):
        candidates = []
        for m in re.finditer(r'\{', text):
            depth = 0
            start = m.start()
            for i, ch in enumerate(text[start:], start):
                if ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        try:
                            obj = json.loads(text[start:end])
                            candidates.append((len(text[start:end]), obj))
                        except json.JSONDecodeError:
                            pass
                        break
        if candidates:
            candidates.sort(key=lambda x: x[0], reverse=True)
            return candidates[0][1]
        return None

    def _create_fallback_plan(self, request: TripRequest, raw_response: str = "", partial_data: dict = None) -> TripPlan:
        start_date = datetime.strptime(request.start_date, "%Y-%m-%d")

        extracted_attractions = []
        extracted_meals = []
        extracted_weather = []
        extracted_suggestions = ""
        extracted_hotels = []

        source_text = ""
        if partial_data:
            source_text = json.dumps(partial_data, ensure_ascii=False)
        elif raw_response:
            source_text = raw_response

        if source_text:
            placeholder_words = {
                '景点名称', '酒店名称', '早餐推荐', '午餐推荐', '晚餐推荐',
                '景点描述', '详细地址', '酒店地址', '城市名称', '早餐描述', '午餐描述', '晚餐描述',
                '当地特色早餐', '交通方式', '住宿类型', '景点类别',
                '总体建议', '实际', '具体'
            }
            food_kw = ['餐', '饭', '面', '菜', '馆', '餐厅', '小吃', '火锅', '烤', '汤', '饼', '包', '粥', '粉']

            all_names = re.findall(r'"name"\s*:\s*"([^"]{2,30})"', source_text)
            for name in all_names:
                if name in placeholder_words:
                    continue
                if re.match(r'.+景点\d+$', name):
                    continue
                if re.match(r'第\d+天(早餐|午餐|晚餐|行程)', name):
                    continue
                if any(kw in name for kw in food_kw):
                    if name not in extracted_meals:
                        extracted_meals.append(name)
                else:
                    if name not in extracted_attractions:
                        extracted_attractions.append(name)

            dw_list = re.findall(r'"day_weather"\s*:\s*"([^"]+)"', source_text)
            nw_list = re.findall(r'"night_weather"\s*:\s*"([^"]+)"', source_text)
            dt_list = re.findall(r'"day_temp"\s*:\s*(\d+)', source_text)
            nt_list = re.findall(r'"night_temp"\s*:\s*(\d+)', source_text)
            for j in range(min(len(dw_list), request.travel_days)):
                extracted_weather.append({
                    "day_weather": dw_list[j], "night_weather": nw_list[j] if j < len(nw_list) else "",
                    "day_temp": int(dt_list[j]) if j < len(dt_list) else 0,
                    "night_temp": int(nt_list[j]) if j < len(nt_list) else 0
                })

            sug_match = re.search(r'"overall_suggestions"\s*:\s*"([^"]{5,200})"', source_text)
            if sug_match and sug_match.group(1) not in placeholder_words:
                extracted_suggestions = sug_match.group(1)

        days = []
        for i in range(request.travel_days):
            current_date = start_date + timedelta(days=i)
            attractions = []
            idx = i * 2
            if extracted_attractions:
                for j in range(2):
                    name = extracted_attractions[(idx + j) % len(extracted_attractions)]
                    attractions.append(Attraction(
                        name=name,
                        address=f"{request.city}市",
                        location=Location(longitude=116.4 + i * 0.01 + j * 0.005, latitude=39.9 + i * 0.01 + j * 0.005),
                        visit_duration=120,
                        description=f"{name}是{request.city}的热门景点",
                        category="景点"
                    ))

            meals = []
            meal_types = ["breakfast", "lunch", "dinner"]
            m_idx = i * 3
            for j, mtype in enumerate(meal_types):
                if extracted_meals and m_idx + j < len(extracted_meals):
                    name = extracted_meals[m_idx + j]
                    meals.append(Meal(type=mtype, name=name, description=f"{name}推荐"))
                elif extracted_meals:
                    name = extracted_meals[(m_idx + j) % len(extracted_meals)]
                    meals.append(Meal(type=mtype, name=name, description=f"{name}推荐"))
                else:
                    meals.append(Meal(type=mtype, name=f"第{i+1}天{mtype}", description="请参考当地美食指南"))

            hotel = None
            if extracted_hotels:
                h_name = extracted_hotels[i % len(extracted_hotels)]
                hotel = Hotel(name=h_name, address=f"{request.city}市", type=request.accommodation)

            days.append(DayPlan(
                date=current_date.strftime("%Y-%m-%d"),
                day_index=i,
                description=f"第{i+1}天行程",
                transportation=request.transportation,
                accommodation=request.accommodation,
                hotel=hotel,
                attractions=attractions,
                meals=meals
            ))

        weather_info = []
        for j, w in enumerate(extracted_weather[:request.travel_days]):
            d = start_date + timedelta(days=j)
            weather_info.append(WeatherInfo(
                date=d.strftime("%Y-%m-%d"),
                day_weather=w.get("day_weather", ""),
                night_weather=w.get("night_weather", ""),
                day_temp=w.get("day_temp", 0),
                night_temp=w.get("night_temp", 0)
            ))

        suggestion = extracted_suggestions or f"这是为您规划的{request.city}{request.travel_days}日游行程,建议提前查看各景点的开放时间。"

        return TripPlan(
            city=request.city,
            start_date=request.start_date,
            end_date=request.end_date,
            days=days,
            weather_info=weather_info,
            overall_suggestions=suggestion
        )


_multi_agent_planner = None


def get_trip_planner_agent() -> MultiAgentTripPlanner:
    global _multi_agent_planner
    if _multi_agent_planner is None:
        _multi_agent_planner = MultiAgentTripPlanner()
    return _multi_agent_planner
