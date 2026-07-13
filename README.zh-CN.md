# Codex Skill Dashboard

用于发现、标注、复制和安全管理本机 Codex Skills 的跨平台本地工具。

## 启动

需要 Node.js 22 或更高版本。

```bash
npx codex-skill-dashboard
```

服务只监听 `127.0.0.1`。默认扫描 `$CODEX_HOME/skills` 与 `$CODEX_HOME/plugins/cache`；未设置 `CODEX_HOME` 时使用 `~/.codex`。个人标注保存在操作系统应用数据目录。

只有检测到的用户安装 Skill 可以移至系统回收站。系统内置、插件、外部目录和未检测到的 Skill 均为只读。工具绝不会降级为永久删除。

## 源码运行

```bash
npm install
npm test
npm start
```

采用 MIT 许可证。工具不会执行 Skill 文件、收集遥测或将服务暴露到网络。
