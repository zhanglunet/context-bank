---
{
  "schema_version": 1,
  "id": "model-evidence-expiry",
  "type": "note",
  "title": "模型能否免费可用：为证据设置有效期",
  "summary": "把来源、适用条件、核验时间与过期时间一起记录，过期后回到待复核状态。",
  "scenarios": [
    "研发"
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
维护模型目录、免费额度说明或内部工具清单，避免把曾经免费当成一直免费。

## 输入
服务商当前官方说明、适用地区与条件、核验日期、额度口径和受控探测结果。

## 步骤
1. 区分目录登记、服务商条款与真实可用性，不用一次成功调用证明长期免费。
2. 记录证据URL、额度类型、单位、重置周期、地区、付款条件、核验与过期时间。
3. 证据缺失、无效或过期时标为待复核；从“已核验免费”候选中移除。
4. 将限流、额度耗尽、鉴权失败等原因分开记录，按明确重置时间恢复候选。
5. 仅保存运行所需的分类与数字；密钥、提示词和响应正文不进入公开台账。

## 合成示例
合成例：模型A证据过期后仍可出现在目录中，但不再进入“已核验免费”自动路由候选；重新核验条款后再恢复。

## 提示词
根据我提供的公开来源，生成模型条件证据表：来源URL、核验日期、过期时间、地区、付款条件、额度与状态。缺少证据标待复核，不猜测价格或保证可用。不要读取或输出密钥。

## 限制
原仓库README的可见性说明与当前公开状态存在时间差，使用前按实时状态核对。免费政策和API状态会变，不能保证持续可用。本稿仅整理证据治理方法，不执行安装、探测、配置同步或真实模型调用。
个人上下文由本人管理。合成示例不是实际运行证据。

## 来源与许可
依据[open-free-router公开README](https://github.com/zhanglunet/open-free-router/blob/2e652a9a16e1f7b224005470a538361c1cd9e37b/README.md)整理，保留MIT许可。原作与完整依赖见固定版本来源；本条为整理稿，未执行来源脚本。

### 原始许可证全文

MIT License

Copyright (c) 2026 open-free-router contributors

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
