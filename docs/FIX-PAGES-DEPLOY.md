# 修复：GitHub Pages 部署被环境保护规则拒绝

- 日期：2026-10-24
- 仓库：`znbsys/znbsys.github.io`
- 失败运行：`40046438063`（分支 `release`，commit `c62ff00`）
- 状态：已修复，部署成功

## 1. 问题现象

Actions 运行页面报错（2 errors + 1 notice）：

```text
deploy
Branch "release" is not allowed to deploy to github-pages due to environment protection rules.
deploy
The deployment was rejected or didn't satisfy other protection rules.
```

`build` job 成功，`deploy` job 直接被拒绝；线上站点未更新。

## 2. 根因分析

`.github/workflows/pages.yml` 的 `deploy` job 声明了环境：

```yaml
environment:
  name: github-pages
```

而仓库的 `github-pages` 环境开启了「Selected branches and tags」自定义部署分支策略，且白名单里**只有 `main`**，不包含实际触发部署的 `release`：

```json
{
  "deployment_branch_policy": { "protected_branches": false, "custom_branch_policies": true },
  "branch_policies": [ { "name": "main" } ]
}
```

因此 `release` 分支的部署被环境保护规则拦截（属于期望的保护行为，只是白名单配置与工作流分支不一致）。

附带发现的第二个隐患：

```json
GET /repos/znbsys/znbsys.github.io/pages
{ "build_type": "legacy", "source": { "branch": "main", "path": "/" } }
```

Pages 源仍为「Deploy from a branch (main)」，即 `legacy` 模式，而本工作流按「GitHub Actions」模式部署（工作流注释也要求此项）。即使绕过环境保护，`actions/deploy-pages` 在 legacy 模式下也无法正确接管站点。

## 3. 诊断命令

```bash
# 查看环境与保护规则
gh api repos/znbsys/znbsys.github.io/environments/github-pages
# 查看环境允许部署的分支白名单
gh api repos/znbsys/znbsys.github.io/environments/github-pages/deployment-branch-policies
# 查看 Pages 构建模式
gh api repos/znbsys/znbsys.github.io/pages
# 查看失败运行与注解
gh run view 40046438063
```

## 4. 修复步骤

### 4.1 将 `release` 加入 `github-pages` 环境白名单

```bash
gh api -X POST \
  "repos/znbsys/znbsys.github.io/environments/github-pages/deployment-branch-policies" \
  -f name="release"
```

修复后白名单：`main`、`release`。

（等价的 UI 操作：Settings → Environments → github-pages → Deployment branches and tags → Selected branches → 添加 `release`。）

### 4.2 将 Pages 源切换为 GitHub Actions

```bash
gh api -X PUT "repos/znbsys/znbsys.github.io/pages" -f build_type="workflow"
```

等价 UI 操作：Settings → Pages → Build and deployment → Source → **GitHub Actions**。

### 4.3 重新运行失败的 job

```bash
gh run rerun 40046438063 --failed
```

## 5. 验证结果

```text
run 40046438063 → conclusion: success
  build  → success
  deploy → success
deployment ref=release, state=success, environment_url=https://znbsys.github.io/
$ curl -o /dev/null -w "%{http_code}" https://znbsys.github.io/  → 200
```

## 6. 遗留说明（1 条 notice）

```text
[notice] The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026.
```

这是 GitHub 官方 runner 镜像迁移提示，不影响本次部署。如需消除，可在工作流中显式使用 `ubuntu-24.04`，或等待官方迁移完成。

## 7. 防复发建议

1. 工作流中 `on.push.branches` 与环境 `deployment-branch-policies` 白名单保持一致（当前两者均包含 `release`）。
2. Pages Source 固定为 **GitHub Actions**，避免被改回 Deploy from a branch。
3. 新增部署分支时，同步执行第 4.1 步的 `gh api` 命令或在 UI 中补充白名单。
