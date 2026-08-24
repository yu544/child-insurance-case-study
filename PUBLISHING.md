# 发布到 GitHub

本仓库已经是一个零历史的独立 git 仓库，可以作为作品集 case study 推到 GitHub。

## 推荐发布方式

先创建 private 仓库，确认 README、截图和脱敏内容无误后，再决定是否公开。

```bash
cd "<your-local-path>/child-insurance-case-study"
gh auth login -h github.com
gh repo create child-insurance-case-study --private --source=. --remote=origin --push
```

## 公开前检查

```bash
npm test
```

另外用你本地维护的敏感词清单做一次全仓库搜索。清单应包含真实生产域名、服务器 IP、小程序 AppID、第三方平台名称、真实儿童姓名、真实手机号、真实保单号、客户联系人和客户经理姓名。检查清单不要提交进本仓库。

## 暂不建议公开的内容

- 真实报价单截图
- 真实客户名称、联系人或客户经理姓名
- 真实服务器、域名、小程序 AppID、数据库地址
- 第三方保险平台真实接口字段和签名细节
- 渗透测试的具体攻击路径
