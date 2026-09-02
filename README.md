# Yang Bokai Pepper Portfolio

这是当前网站的完整源码，基于 React、TypeScript、Vite、GSAP 和 Three.js。

## 一键构建

1. 安装 Node.js 20 或更高版本。
2. 双击项目根目录中的 `build.bat`。
3. 首次运行会自动安装依赖，构建结果会生成在 `dist` 文件夹。

如果电脑已安装 pnpm，脚本会优先使用 `pnpm-lock.yaml` 安装；否则会使用 npm 安装依赖。

## 本地预览

在项目根目录打开终端并执行：

```bash
npm run dev
```

## 目录说明

- `src`：页面、组件、样式和交互逻辑
- `public`：图片、视频、字体、图标和其他静态资源
- `build.bat`：Windows 一键安装依赖并构建
- `package.json`：项目依赖和构建命令
- `pnpm-lock.yaml`：依赖版本锁定文件

压缩包不包含 `node_modules` 和 `dist`，下载后通过 `build.bat` 自动生成，避免文件过大并确保依赖按当前环境安装。
