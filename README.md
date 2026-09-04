---
title: 行迹 Voyager
emoji: 🗺️
colorFrom: yellow
colorTo: pink
sdk: docker
app_port: 7860
pinned: false
---

# 行迹 / Voyager

AI 驱动的旅行导览小程序。输入城市、日期和偏好后，会检索景点、天气和住宿，并生成可浏览的多日行程。

仓库：[Wyuzij/Voyager](https://github.com/Wyuzij/Voyager)

## 功能

- 景点浏览、搜索、收藏，以及行程篮
- 多智能体行程规划：高德检索地点，规划 Agent 编排日程
- 登录、订单、优惠券、浏览历史（本地演示数据）

## 结构

- `travel/`：uni-app Vue 3 小程序与 H5
- `backend/`：FastAPI 接口与 HelloAgents 规划服务

## 本地运行

后端需要 Python 3.11。在 `backend` 把 `.env.example` 复制为 `.env` 并填写密钥后：

```bash
py -3.11 -m pip install -r requirements.txt
py -3.11 run.py
```

前端在 `travel` 目录：

```bash
npm install
npm run dev:h5
```

浏览器打开 `http://localhost:5173`，接口默认代理到 `http://127.0.0.1:8000`。
