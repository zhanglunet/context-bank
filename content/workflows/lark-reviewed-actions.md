---
{
  "schema_version": 1,
  "id": "lark-reviewed-actions",
  "type": "workflow",
  "title": "群消息先审核，再执行并回报",
  "summary": "把文件、任务和提示词变成可追踪动作，逐条确认后执行，按群保留上下文。",
  "scenarios": [
    "工作管理"
  ],
  "author": "zhanglunet",
  "license": "MIT",
  "compatibility": [
    {
      "tool": "文本AI；实际执行需来源仓库工具链",
      "verification": "unverified"
    }
  ],
  "updated_at": "2026-10-18"
}
---

## 适用任务
为已获授权的项目群建立人审工作流，减少一句话误触发。

## 输入
允许扫描的群、审核人、明确的动作清单、应用权限与本地目录。

## 步骤
1. 仅扫描已获授权的消息范围，识别文件、任务与提示词，来源不足时先确认。
2. 用action_id去重；提示词拆成单条run，记录关联文件和拟执行动作。
3. 把执行范围和目标交给审核人确认；拒绝或未确认的动作不执行。
4. 批准后按run执行并记录结果，按群分目录保存；重复执行前检查状态。
5. 将真实成功、失败和未配置执行器的状态回报；向群发送消息需在授权范围内。

## 合成示例
合成例：项目群提出“根据这份示例表生成摘要”，先确认文件与收件群，批准后执行；执行失败时回报失败，不把打包文件称作已完成分析。

## 提示词
根据这些已授权的合成消息生成待审核动作清单：来源、action_id、run_id、关联文件、拟执行动作、目标和待确认项。只产出计划，未批准不下载、创建任务、执行提示词或发送消息。

## 限制
实际运行依赖Python、lark-cli、应用权限和本地执行器。目录分隔不能替代身份鉴权；dry-run可能仍读取信息，应按来源文档核对副作用。本稿未连接真实群或发送消息。
个人上下文由本人管理。合成示例不是实际运行证据。

## 来源与许可
依据[lark-cli-review-workflow公开README](https://github.com/zhanglunet/lark-cli-review-workflow/blob/385e35e6e5ef704da323bb099fd2845717627046/README.md)整理，保留MIT许可。原作与完整依赖见固定版本来源；本条为整理稿，未执行来源脚本。

### 原始许可证全文

MIT License

Copyright (c) 2026 zhanglunet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
