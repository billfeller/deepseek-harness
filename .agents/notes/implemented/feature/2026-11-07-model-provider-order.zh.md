# Agent Note: Reorder model providers

Status: implemented

[English](2026-11-07-model-provider-order.md) | 中文

## Problem

Models 页面按适配器目录顺序显示已配置的提供方，用户无法将常用提供方排在一起或置于首位。提供方顺序属于用户界面偏好，而不是适配器 profile 或模型请求的一部分。

## Decision

Host 注册 `ui-models` 设置 namespace，其中 `providerOrder` 字段是字符串数组。Models 客户端通过共享 settings scope 绑定该 namespace，并在其中持久化提供方路由 ID。偏好缺失或为空时保留目录原序；保存的 ID 优先排列匹配的行，未列出的行继续按目录顺序排列。提供方暂时不存在时不会从偏好中删除其 ID，因此之后重新出现时仍可保留原先位置。

已配置的提供方卡片支持原生拖放和带标签的上移／下移按钮。按钮支持键盘操作，并通过实时播报说明新位置。Host 写入失败时，列表会恢复为 settings mirror 接受的顺序并播报失败。远程浏览器遵循 settings scope 的内存模式，因此顺序只在当前进程有效。

共享 settings scope 也会观察外部设置更新并承载 revision 顺序。此实现沿用[网页偏好的 Host 持久化决策](../bug-fix/2026-08-06-host-backed-web-preferences.zh.md)，不再添加独立的浏览器存储来源。

## Alternatives considered

**将顺序保存在 `localStorage`。** 顺序属于用户偏好，应使用现有 Host 设置文档，以便在重载和不同来源之间跟随用户的 DSH 家目录。另设浏览器存储来源会使不同端口间的偏好分叉，也不会经过既有设置失效通知路径。

**按显示名称排序或始终使用目录顺序。** 两者都无法保留用户选择的顺序；适配器目录仍是默认和同级排序依据，设置偏好只记录用户主动做出的更改。

**只提供拖放，不提供移动按钮。** 原生拖放对指针用户方便，但不提供等效的键盘操作。带标签的移动按钮同时支持键盘操作和屏幕阅读器播报。

## Consequences

顺序设置独立于提供方 profile，不会改变模型路由或适配器注册。没有已保存位置的新提供方会排在已排序行之后，并保持目录中的相对顺序；已移除的路由 ID 会保留在偏好中。远程浏览器可在当前进程中调整顺序，但由于 settings API 仅限 loopback，无法跨重载保存该选择。

Host schema 覆盖默认顺序并拒绝非字符串 ID。Store 和组件测试覆盖目录回退、保存顺序、持久化、键盘控件及播报。Models Web 场景验证完整页面重载后仍保留新顺序，并以无密钥 ARIA 快照固定渲染列表。
