# 网站维护说明

本项目属于上层学习工作台，遵循 ../../AGENTS.md 与 ../AGENTS.md。主要维护者为学习内容整理与发布助手。

- Quartz 5.0.0，当前基线提交 97a2d05f80c4c50534959b1d0d41cc4b3895625e。保留 MIT 许可证及上游来源。依赖使用 package-lock.json 固定。
- quartz.config.yaml 使用官方 npm 插件；由 npm ci 安装并复用锁定的插件包，不使用 Git 插件缓存进行构建。
- 用户确认现有结构，要求风格更二次元：采用淡樱粉和浅紫配色、轻量手账细节，保持 Markdown 正文和侧栏结构。关系图谱已按要求移除，不自行恢复。
- 当前内容栏目仅保留“笔记”，另有首页与关于页；研究、阅读、实践暂不导出，不自行恢复独立栏目。
- quartz.config.yaml 维护原生导航、搜索、阅读模式、目录和反向链接的位置。quartz.ts 为原生布局追加文章列表和标签入口，替换默认 PageTypeDispatcher；升级后检查此扩展入口。
- quartz/components/StudyDesk.tsx 维护文章列表及标签导航，quartz/styles/custom.scss 维护本地字体、淡樱粉浅紫主题和手机适配。主页正文在 ../content/index.md；标签规则见 ../tags.md。
- content/ 为生成目录，不直接编辑。源材料位于 ../content/，通过 ../export-manifest.json 白名单导出。原始学习笔记将另行选择并引用。
- 在工作台执行 python3 publishing/scripts/site.py build 可依次导出、构建和检查；preview 命令还会启动预览。
- 本仓库仅包含网站与选中的公开稿件，勿将整个工作台复制入仓库。
- origin 指向 dangzhy/dangzhy.github.io，发布分支 main；upstream 仅为 Quartz 官方源码。不要向 upstream 推送。发布范围以 ../policy.md 为准。
- 构建成功不等于发布成功；必须分别验证上传、远端工作流与线上访问。
