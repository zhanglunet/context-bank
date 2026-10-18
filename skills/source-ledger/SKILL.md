---
{
  "schema_version": 1,
  "id": "source-ledger",
  "type": "skill",
  "title": "资料变报告之前，先建事实清单",
  "summary": "把结论和来源对应起来，降低写作时混淆证据的概率。",
  "scenarios": [
    "写报告"
  ],
  "author": "zhanglunet",
  "license": "MIT",
  "compatibility": [
    {
      "tool": "需支持Skill与材料读取的工具",
      "verification": "unverified"
    }
  ],
  "updated_at": "2026-10-18",
  "name": "source-ledger",
  "description": "把结论和来源对应起来，降低写作时混淆证据的概率。",
  "skill_path": "skills/source-ledger/SKILL.md"
}
---

# 资料变报告之前，先建事实清单

当用户提出写报告任务时，先确认材料权限、输入范围与预期产物。

## 输入
用户选定且获准使用的材料。

## 步骤
1. 为材料分配来源编号。
2. 抽取事实、日期和不确定项。
3. 报告每条关键结论链接事实清单，再回看原文。

## 输出
给出可追溯的检查清单与未决事项。没有材料时请求最小必要输入，不编造数据。

## 边界
只读用户明确授权的材料。不得发布、发送或上传个人资料。对结果保留人工核对步骤。此技能为起步版本，尚未经过逐工具实测。
