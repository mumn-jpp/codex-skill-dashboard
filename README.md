# Codex Skill Dashboard

一个用于发现、理解、标注和安全管理本机 Codex Skills 的跨平台工具。

Codex 的 Skills 可能来自用户安装目录、系统内置目录和插件缓存。安装数量增加后，用户很难记住每个 Skill 的用途、触发方式和来源。Codex Skill Dashboard 会扫描这些目录，将分散的 Skills 整理成一个可搜索、可标注的本地页面。

> 当前项目处于早期开发阶段。源码和本地网页已经可运行；Windows、Linux、macOS 免依赖安装包仍需等待 GitHub Actions 构建验证。

[English introduction](README.en.md)

## 主要功能

- 自动扫描用户安装、系统内置和插件提供的 Skills。
- 显示名称、来源、原始说明、图标和检测状态。
- 按名称、说明、分类、场景和个人备注搜索。
- 为每个 Skill 添加中文作用、分类、使用场景、触发语和备注。
- 将 `$skill-name` 一键复制到剪贴板，便于在 Codex 对话中调用。
- 标记常用 Skill，并通过来源和常用状态筛选。
- 打开 Skill 所在目录。
- 将用户安装的 Skill 移至操作系统回收站。
- 重新扫描后保留已有标注。

## 安全边界

“删除 Skill”固定表示“移至系统回收站”，不是永久删除。

| Skill 来源 | 删除行为 |
|---|---|
| 用户安装 | 确认后移至系统回收站 |
| 系统内置 | 禁止删除 |
| 插件提供 | 禁止单独删除，应卸载对应插件 |
| 外部扫描目录 | 只读 |
| 未检测到 | 不执行文件操作 |

服务端会重新验证真实路径。回收站不可用时，删除操作直接失败，不会降级为 `rm`、`Remove-Item` 或其他永久删除命令。

## 隐私与运行方式

- 服务只监听 `127.0.0.1`，不会暴露到局域网或互联网。
- 不执行 `SKILL.md` 中的代码或命令。
- 不修改 Skill 内容。
- 不收集遥测，不上传 Skill 或个人标注。
- 不注册开机启动项。
- 不安装 Windows Service、systemd 服务或 macOS LaunchAgent。
- 只有用户手动打开应用时才启动。
- 全部页面关闭约 60 秒后，本地进程自动退出。
- 重复打开应用时复用已有实例。

## 普通用户安装

计划提供以下发布物：

- Windows：`Codex-Skill-Dashboard-Setup.exe`
- Linux：AppImage 和 `.deb`
- macOS：`.app` 和 `.dmg`

原生发布物会内置 Node.js 和运行依赖，普通用户不需要安装 Node.js、npm、pnpm 或 Git。

当前安装包尚未完成三平台验证，请暂时使用源码方式运行。

## 源码运行

要求：Node.js 22 或更高版本。

```bash
git clone https://github.com/mumn-jpp/codex-skill-dashboard.git
cd codex-skill-dashboard
pnpm install
pnpm start
```

也可以在发布 npm 包后运行：

```bash
npx codex-skill-dashboard
```

常用参数：

```text
--codex-home <path>  指定 Codex 主目录
--scan-dir <path>    增加额外只读扫描目录
--data-dir <path>    指定个人标注数据目录
--port <number>      指定本地端口
--no-open            不自动打开浏览器
--no-idle-exit       禁用空闲自动退出
--help               显示帮助
--version            显示版本
```

## 默认扫描位置

优先读取环境变量 `CODEX_HOME`。未设置时使用 `~/.codex`。

```text
<CODEX_HOME>/skills
<CODEX_HOME>/plugins/cache
```

个人标注保存在各操作系统的应用数据目录，不写入 Skill 安装目录或 Git 仓库。

## 开发与测试

```bash
pnpm install
pnpm test
pnpm run build:bundle
```

项目采用单套跨平台代码：Node.js 本地服务、原生 HTML/CSS/JavaScript 前端，以及面向 Windows、Linux 和 macOS 的原生打包配置。

## 项目状态

- 本地自动化测试：18 项
- 本地嵌入式 bundle：已验证
- Windows/Linux/macOS 打包配置：已提交
- 三平台原生安装包：等待 GitHub Actions 账号锁定解除后验证

## 许可证

[MIT License](LICENSE)
