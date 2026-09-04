"""旅行规划API路由"""

import asyncio

from fastapi import APIRouter, HTTPException

from ...agents.trip_planner_agent import get_trip_planner_agent
from ...models.schemas import TripPlanResponse, TripRequest
from ...utils.logger import log

router = APIRouter(prefix="/trip", tags=["旅行规划"])


@router.post(
    "/plan",
    response_model=TripPlanResponse,
    summary="生成旅行计划",
    description="根据用户输入的旅行需求,生成详细的旅行计划"
)
async def plan_trip(request: TripRequest):
    """生成旅行计划。同步 Agent 放到线程里，避免占住 FastAPI 事件循环。"""
    _l = log()
    try:
        _l.info("=" * 50)
        _l.info("📥 收到旅行规划请求: 城市=%s | 日期=%s~%s | 天数=%d",
                 request.city, request.start_date, request.end_date, request.travel_days)
        _l.info("=" * 50)

        _l.info("🔄 获取多智能体系统实例...")
        agent = get_trip_planner_agent()

        _l.info("🚀 开始生成旅行计划...")
        trip_plan = await asyncio.to_thread(agent.plan_trip, request)

        _l.info("✅ 旅行计划生成成功,准备返回响应")

        return TripPlanResponse(
            success=True,
            message="旅行计划生成成功",
            data=trip_plan
        )

    except Exception as e:
        _l.error("❌ 生成旅行计划失败: %s", str(e))
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"生成旅行计划失败: {str(e)}"
        )


@router.get(
    "/health",
    summary="健康检查",
    description="检查旅行规划服务是否正常"
)
async def health_check():
    """健康检查"""
    try:
        agent = get_trip_planner_agent()
        return {
            "status": "healthy",
            "service": "trip-planner",
            "agent_name": agent.planner_agent.name,
            "tools_count": len(agent.attraction_agent.list_tools())
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"服务不可用: {str(e)}"
        )
