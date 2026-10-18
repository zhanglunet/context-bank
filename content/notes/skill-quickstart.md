---
{
  "schema_version": 1,
  "id": "skill-quickstart",
  "type": "note",
  "title": "让 Agent 看懂你的 Skill：口语触发词与30秒速览",
  "summary": "把工具说明改成容易找到、容易开始、知道何时停止的技能说明。",
  "scenarios": [
    "研发"
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
已有命令行工具，需要为同事或 Agent 编写使用说明。

## 输入
工具用途、真实参数说明、一个获准运行的最小样例、失败条件。

## 步骤
1. 把用户会说的话写进 description，例如“帮我检查表格字段”。
2. 在顶部写准备条件、最小操作、预期结果，控制在30秒可读完。
3. 正文补充错误处理和边界；不能调用的情况也写清楚。
4. 请一个未读过实现的人或 Agent 仅凭说明选择技能，记录选错和缺失参数。

## 合成示例
虚构工具 table-inspect：输入一份合成 CSV，输出字段名与空值统计；缺少文件时先询问路径。

## 提示词
为这个工具写 SKILL.md：先核对真实参数，再写口语触发词、30秒速览、输入输出、失败处理和不适用条件。不要编造命令。

## 限制
30秒指阅读入口的目标，不是工具执行时长保证；此整理稿未做 Agent 调用成功率测试。
本条为方法整理，未做逐平台实测，不代表来源项目的效果背书。个人上下文与真实业务材料由使用者自行管理。

## 来源与整理说明
依据[公开趋势工作流 Skill](https://github.com/zhanglunet/trend-workflow/blob/1bd65fa15470099e05afd0c289036c8dcd067fed/SKILL.md)中的流程与 PLAYBOOK 摘要重新编写，来源代码与技能许可为 MIT。原作：zhanglunet，Copyright (c) 2026。未复制第三方实现或原站效果数字。新增操作说明与合成示例采用 CC BY 4.0。公开背景：[趋势看板工作流介绍](https://trend.zhanglu.net/workflow)。
