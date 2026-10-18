---
{
  "schema_version": 1,
  "id": "progressive-table-summary",
  "type": "note",
  "title": "大表先给摘要，需要时再看明细",
  "summary": "用字段、统计和异常摘要帮助 AI 定位问题，保留回到原表的入口。",
  "scenarios": [
    "表格分析"
  ],
  "author": "zhanglunet",
  "license": "CC-BY-4.0",
  "compatibility": [
    {
      "tool": "支持文本输入的AI；具体工具集成需自行验证",
      "verification": "unverified"
    }
  ],
  "updated_at": "2026-10-18"
}
---

## 适用任务
表格很大，直接输入模型成本高且容易遗漏重点。

## 输入
获准分析的表格、字段说明、分析问题与可用查询工具。

## 步骤
1. 先在允许的环境中提取字段类型、行数和缺失情况。
2. 根据问题计算基础统计，说明统计口径和过滤条件。
3. 列出少量异常候选并保留行号或稳定记录ID。
4. 明确“完整数据在原表”，需要核实时按ID查询明细，允许回退全量核查。

## 合成示例
合成表1000行：摘要给出订单金额分位数与5条异常候选；候选不直接认定为错误。

## 提示词
先根据提供的统计摘要提出待核对问题，说明还需要哪些行或字段；没有明细证据时不要判断异常原因。

## 限制
摘要可能丢失长尾信息；不保证固定比例的 Token 降幅、准确率或响应时间。
本条为方法整理，未做逐平台实测，不代表来源项目的效果背书。个人上下文与真实业务材料由使用者自行管理。

## 来源与整理说明
依据[公开趋势工作流 Skill](https://github.com/zhanglunet/trend-workflow/blob/1bd65fa15470099e05afd0c289036c8dcd067fed/SKILL.md)中的流程与 PLAYBOOK 摘要重新编写，来源代码与技能许可为 MIT。原作：zhanglunet，Copyright (c) 2026。未复制第三方实现或原站效果数字。新增操作说明与合成示例采用 CC BY 4.0。公开背景：[趋势看板工作流介绍](https://trend.zhanglu.net/workflow)。
