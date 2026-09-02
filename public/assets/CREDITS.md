# Assets and licenses

## 当前版本

页面视觉、流动等高线背景、反相镜头与翻转交互均为本地实现。摄影区域使用用户提供的照片，以 React Bits Stack 交互照片墙呈现；旅游区域保留自然比例的编辑式横向画布。

### 图片

| 文件 | 用途 | 来源 | 许可 |
| --- | --- | --- | --- |
| `public/profile.png` | 个人简介翻转面头像 | 用户提供的《杨博开简历.docx》内嵌照片 | 用户自有素材 |
| `public/about-background.jpg` | “关于我”页面滚动展开背景图 | 用户本次提供的图片二 | 用户自有素材 |
| `public/competitions/ai-robotics.jpg` | 中国机器人及人工智能大赛 | 用户本次提供的竞赛图片 1 | 用户自有素材 |
| `public/competitions/iot-design.jpg` | 全国大学生物联网设计竞赛 | 用户本次提供的竞赛图片 2 | 用户自有素材 |
| `public/competitions/3d-design.jpg` | 全国三维数字化创新设计大赛 | 用户本次提供的竞赛图片 3 | 用户自有素材 |
| `public/competitions/embedded.jpg` | 全国大学生嵌入式芯片与系统设计竞赛 | 用户本次提供的竞赛图片 4 | 用户自有素材 |
| `public/hobbies/photography/*.jpg` | 摄影与旅游区域的照片素材 | 用户本次提供的摄影照片 | 用户自有素材 |
| `public/hobbies/photography/photo-wall/*` | 摄影照片墙新增卡片素材 | 用户本次提供的摄影照片 | 用户自有素材 |
| `public/hobbies/yo-yo/*` | 悠悠球爱好区域的图片与循环视频 | 用户本次提供的悠悠球图片与视频 | 用户自有素材 |
| `public/lanyard-card.jpg` | 联系我按钮展开的交互工牌正面 | 用户本次提供的证件卡照片 | 用户自有素材 |
| `public/skills/skill-01.svg` — `skill-04.svg` | 能力系统 TiltedCard 的本地抽象视觉 | 本地制作的 SVG 图形 | 本项目原创 |

### 字体

| 文件 | 用途 | 来源 | 许可 |
| --- | --- | --- | --- |
| `public/fonts/Brier-Bold.woff2` | 左上角 `CHIRON / YANG` 字标，YANG 使用加粗字重 | 用户授权使用的 Norris 字体资源；官方下载地址：<https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67b6113a220f85ad6497495a_Brier-Bold.woff2> | 用户已确认拥有使用权 |

### 依赖

| 依赖 | 用途 | 来源 | 许可 |
| --- | --- | --- | --- |
| `gsap` | 顶部 PillNav 与既有页面动效 | <https://gsap.com/> | GreenSock Standard License |
| `ogl` | Topography WebGL 流动等高线背景 | <https://github.com/oframe/ogl> | MIT License |
| `TiltedCard.jsx` / `TiltedCard.css` | 能力系统倾斜卡片组件 | React Bits（按用户请求接入） | 以 React Bits 发布条款为准 |
| `Stack.jsx` / `Stack.css` | 摄影区域交互照片墙组件 | React Bits（按用户请求接入） | 以 React Bits 发布条款为准 |
| `Lanyard.jsx` / `card.glb` / `lanyard.png` | 联系我按钮展开的 3D 工牌组件与模型 | React Bits（按用户请求接入） | 以 React Bits 发布条款为准 |
| `motion` | Stack 卡片拖拽、弹簧与层叠动画 | <https://motion.dev/> | MIT License |
