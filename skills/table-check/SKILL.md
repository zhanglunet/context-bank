---
{
  "schema_version": 1,
  "id": "table-check",
  "type": "skill",
  "title": "表格分析前，先把口径对齐",
  "summary": "让Agent先核对列名、单位和空值，再开始计算。",
  "scenarios": [
    "表格分析"
  ],
  "author": "zhanglunet",
  "license": "MIT",
  "compatibility": [
    {
      "tool": "需支持Skill与文件读取的工具",
      "verification": "unverified"
    }
  ],
  "updated_at": "2026-10-18",
  "name": "table-check",
  "description": "让Agent先核对列名、单位和空值，再开始计算。",
  "skill_path": "skills/table-check/SKILL.md"
}
---

# 表格分析前，先把口径对齐

当用户提出表格分析任务时，先确认材料权限、输入范围与预期产物。

## 输入
获准处理的表格、指标定义与预期输出。

## 步骤
1. 枚举工作表、字段、数据类型与单位。
2. 标出空值、重复记录和口径歧义。
3. 向用户确认统计口径后再计算，输出可复核的公式。

## 输出
给出可追溯的检查清单与未决事项。没有材料时请求最小必要输入，不编造数据。

## 边界
只读用户明确授权的材料。不得发布、发送或上传个人资料。对结果保留人工核对步骤。此技能为起步版本，尚未经过逐工具实测。
