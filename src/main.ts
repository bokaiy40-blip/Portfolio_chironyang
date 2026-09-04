import './style.css'
import { inject } from '@vercel/analytics'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import StaggeredMenu, { type StaggeredMenuItem } from './components/StaggeredMenu'
import BlockTextReveal from './components/originkit/ui/BlockTextReveal'
import { createTopography } from './topography'

gsap.registerPlugin(ScrollTrigger)

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('App root is missing')

inject()

const skillCards = [
  { number: '01', title: '嵌入式控制', image: '/skills/skill-01.svg', body: '围绕 STM32 HAL 进行底层外设控制与 RTOS 应用开发，关注控制链路的稳定性与可调试性。', tags: ['STM32', 'FreeRTOS', 'GPIO / USART / SPI / I2C', 'ADC / PWM'] },
  { number: '02', title: '机器人视觉', image: '/skills/skill-02.svg', body: '从视觉感知、物体识别到机械臂抓取规划，持续探索 AI 感知与机器人系统的结合方式。', tags: ['ROS', 'MoveIt', 'IMU / SLAM', '机器视觉'] },
  { number: '03', title: '软硬件工具链', image: '/skills/skill-03.svg', body: '能够使用常见开发和仿真工具完成从代码、原理图到机械结构的协同设计。', tags: ['C / Python', 'Keil / CubeMX', 'Multisim', 'SolidWorks', 'Verilog HDL'] },
  { number: '04', title: '内容与表达', image: '/skills/skill-04.svg', body: '用视频把复杂的技术和团队活动讲得更容易被看见，也在持续训练对节奏、画面与信息层级的判断。', tags: ['PR', '剪映', '抖音运营', '56.6 万单视频播放'] },
]
const socialVideoItems = [
  { src: '/socials/social-01.mp4', webm: null, poster: '/socials/social-01-poster.webp', alt: '社交动态视频 01' },
  { src: '/socials/social-02.mp4', webm: null, poster: '/socials/social-02-poster.webp', alt: '社交动态视频 02' },
  { src: '/socials/social-03.mp4', webm: null, poster: '/socials/social-03-poster.webp', alt: '社交动态视频 03' },
  { src: '/socials/social-04.mp4', webm: null, poster: '/socials/social-04-poster.webp', alt: '社交动态视频 04' },
  { src: '/socials/social-05.mp4', webm: null, poster: '/socials/social-05-poster.webp', alt: '社交动态视频 05' },
]
const socialIconItems = [
  { src: '/socials/icons/social-icon-01.webp', alt: '网球拍图标' },
  { src: '/socials/icons/social-icon-02.webp', alt: '游戏手柄图标' },
  { src: '/socials/icons/social-icon-03.webp', alt: '相机图标' },
  { src: '/socials/icons/social-icon-04.webp', alt: '网球拍图标' },
]
const socialFollowItems = [
  { label: '抖音', href: 'https://www.douyin.com/user/MS4wLjABAAAAmwtctMoK-AY3bO01VHeSfO75N34v06kV4ygCd4y1O-Q?from_tab_name=main' },
  { label: '小红书', href: 'https://www.xiaohongshu.com/user/profile/5cbad7da000000001202aec9?xsec_token=ABcYNoPHBqtFhPpV3SLmoaDbes4wCqTf_CLkU9Xfcfj3g%3D&xsec_source=pc_search' },
  { label: 'BiliBili', href: 'https://space.bilibili.com/418365641?spm_id_from=333.337.0.0' },
  { label: 'Instagram', href: 'https://www.instagram.com/kky_chiron/' },
]
const menuItems: StaggeredMenuItem[] = [
  { label: '概览', english: 'OVERVIEW', ariaLabel: '查看概览', link: '#home' },
  { label: '背景', english: 'BACKGROUND', ariaLabel: '查看教育背景', link: '#background' },
  { label: '实践', english: 'PRACTICE', ariaLabel: '查看实践档案', link: '#practice' },
  { label: '能力', english: 'CAPABILITY', ariaLabel: '查看能力系统', link: '#skills' },
  { label: '爱好', english: 'HOBBIES', ariaLabel: '查看爱好', link: '#hobbies' },
  { label: '竞赛', english: 'COMPETITIONS', ariaLabel: '查看竞赛奖项', link: '#competitions' },
  { label: '动态', english: 'SOCIALS', ariaLabel: '查看社交动态', link: '#socials' },
]
const photoWallItems = [
  { src: '/hobbies/photography/photo-wall/11-seaside-triptych.webp', alt: '海湾与行走中的身影' },
  { src: '/hobbies/photography/photo-wall/12-mount-fuji.webp', alt: '富士山与城市天际线' },
  { src: '/hobbies/photography/photo-wall/13-tokyo-tower-visit.webp', alt: '东京塔前的合影' },
  { src: '/hobbies/photography/photo-wall/14-grass-and-footsteps.webp', alt: '草地上的脚步' },
  { src: '/hobbies/photography/photo-wall/15-ginkgo-autumn.webp', alt: '银杏树下的秋日长椅' },
  { src: '/hobbies/photography/photo-wall/16-air-show.webp', alt: '飞行表演与彩色烟迹' },
  { src: '/hobbies/photography/photo-wall/17-kyoto-backstreet.webp', alt: '京都街巷与电线' },
  { src: '/hobbies/photography/photo-wall/18-tea-and-light.webp', alt: '茶与灯光' },
  { src: '/hobbies/photography/10-大连夜景.webp', alt: '大连夜晚的城市道路与海湾' },
]
const yoyoHobbyMarkup = `
  <article class="hobby-editorial-yoyo">
    <p class="hobby-editorial-meta">HOBBIES / 03</p>
    <h2 class="hobby-editorial-title"><span class="hobby-editorial-cn">悠悠球</span><span class="hobby-editorial-en">YO-YO</span></h2>
    <p class="hobby-editorial-body">让旋转、节奏和手感在一条线上相遇，在重复练习里寻找动作的秩序。</p>
  </article>
  <figure class="hobby-editorial-yoyo-gallery">
    <figcaption>YO-YO, 2026</figcaption>
    <div class="hobby-yoyo-gallery-layout">
      <div class="hobby-yoyo-media hobby-yoyo-media--feature">
        <span class="hobby-yoyo-media-caption">3舍231, DUT</span>
        <img data-src="/hobbies/yo-yo/01-desk-yoyo.webp" alt="桌面上的悠悠球与学习空间" loading="lazy" decoding="async" draggable="false" />
      </div>
      <div class="hobby-yoyo-media hobby-yoyo-media--video-one">
        <span class="hobby-yoyo-media-caption">Baicheng, 2023</span>
        <video data-src="/hobbies/yo-yo/video-01.mp4" data-webm="/hobbies/yo-yo/video-01.webm" poster="/hobbies/yo-yo/video-01-poster.webp" autoplay muted loop playsinline preload="none" aria-label="悠悠球动作视频一"></video>
      </div>
      <div class="hobby-yoyo-media hobby-yoyo-media--meetup">
        <span class="hobby-yoyo-media-caption">With Kengo, Nir Tokyo</span>
        <img data-src="/hobbies/yo-yo/03-yoyo-meetup.webp" alt="悠悠球交流活动合影" loading="lazy" decoding="async" draggable="false" />
      </div>
      <div class="hobby-yoyo-media hobby-yoyo-media--video-two">
        <span class="hobby-yoyo-media-caption">Shot by Kengo, 2024</span>
        <video data-src="/hobbies/yo-yo/video-02.mp4" data-webm="/hobbies/yo-yo/video-02.webm" poster="/hobbies/yo-yo/video-02-poster.webp" autoplay muted loop playsinline preload="none" aria-label="悠悠球动作视频二"></video>
      </div>
    </div>
  </figure>
`
const socialFollowLabel = (label: string, className: string, ariaHidden = false) => `<span class="${className}"${ariaHidden ? ' aria-hidden="true"' : ''}>${[...label].map((character) => `<span>${character}</span>`).join('')}</span>`
const brandNikonUrl = new URL('./assets/brands/brand-nikon-transparent.webp', import.meta.url).href
const brandCetcUrl = new URL('./assets/brands/brand-cetc-transparent.webp', import.meta.url).href
const brandCorporateSymbolUrl = new URL('./assets/brands/brand-corporate-symbol-transparent.webp', import.meta.url).href
const brandBambuLabUrl = new URL('./assets/brands/brand-bambu-lab-transparent.webp', import.meta.url).href
const brandDjiUrl = new URL('./assets/brands/brand-dji-transparent.webp', import.meta.url).href
const brandYoyorecreationUrl = new URL('./assets/brands/brand-yoyorecreation-transparent.webp', import.meta.url).href
const brandYonexUrl = new URL('./assets/brands/brand-yonex-transparent.webp', import.meta.url).href
const logoWallItems = [
  { src: brandNikonUrl, alt: 'Nikon', className: 'logo-nikon' },
  { src: brandCetcUrl, alt: '中国电子科技集团 CETC', className: 'logo-cetc' },
  { src: brandCorporateSymbolUrl, alt: '中国电子科技集团标志', className: 'logo-corporate-symbol' },
  { src: brandBambuLabUrl, alt: '拓竹 Bambu Lab', className: 'logo-bambu' },
  { src: brandDjiUrl, alt: '大疆 DJI', className: 'logo-dji' },
  { src: brandYoyorecreationUrl, alt: 'yoyorecreation', className: 'logo-yoyo' },
  { src: brandYonexUrl, alt: 'Yonex', className: 'logo-yonex' },
]
const logoWallGroup = (hidden = false) => `<div class="logo-wall-group"${hidden ? ' aria-hidden="true"' : ''}>${logoWallItems.map((item) => `<span class="brand-logo ${item.className}"><img class="brand-logo-image" src="${item.src}" alt="${hidden ? '' : item.alt}"${hidden ? ' aria-hidden="true"' : ''} draggable="false" /></span>`).join('')}</div>`
const logoWallMarkup = `<div class="logo-wall reveal" data-logo-wall><div class="logo-marquee" data-logo-marquee aria-label="工具与品牌"><div class="logo-marquee-track" data-logo-track>${logoWallGroup()}${logoWallGroup(true)}</div></div></div>`
const skillsMarkup = skillCards.map((card) => `
  <article class="skill-card reveal">
    <div class="skill-card-tilt" data-skill-card="${card.number}"></div>
  </article>
`).join('')

app.innerHTML = `
    <header class="site-header">
    <a class="brand" href="#home" aria-label="CHIRON YANG，返回首页"><span class="brand-line"><span>C</span><span>H</span><span>I</span><span>R</span><span>O</span><span>N</span></span><span class="brand-line"><span>Y</span><span>A</span><span>N</span><span>G</span></span></a>
    <div id="staggered-menu-mount" class="staggered-menu-mount" aria-label="主导航菜单"></div>
    <div class="header-actions">
      <div class="tooltip-container contact-tooltip">
      <button class="contact-link-button" id="contact-badge-toggle" type="button" aria-label="联系我">
        <span class="contact-link-label"><span class="span-mother"><span>C</span><span>o</span><span>n</span><span>t</span><span>a</span><span>c</span><span>t</span></span><span class="span-mother2" aria-hidden="true"><span>C</span><span>o</span><span>n</span><span>t</span><span>a</span><span>c</span><span>t</span></span></span>
        <svg class="share-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .17 1L8.9 8.56A3 3 0 0 0 7 8a3 3 0 1 0 1.9 5.44l6.27 3.56A3 3 0 0 0 15 18a3 3 0 1 0 1.17-2.39L9.9 12.05a3 3 0 0 0 0-1.1l6.27-3.56A3 3 0 0 0 18 8Z" /></svg>
      </button>
      <div class="tooltip-content" id="contact-social-popover" role="group" aria-label="社交媒体">
        <div class="social-icons">
          <a class="social-icon bilibili" href="https://space.bilibili.com/418365641" target="_blank" rel="noreferrer" aria-label="哔哩哔哩">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7.5h10A3.5 3.5 0 0 1 20.5 11v5A3.5 3.5 0 0 1 17 19.5H7A3.5 3.5 0 0 1 3.5 16v-5A3.5 3.5 0 0 1 7 7.5Zm0 2A1.5 1.5 0 0 0 5.5 11v5A1.5 1.5 0 0 0 7 17.5h10a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 17 9.5H7ZM8 4.4 10.8 7H8.2L6.1 5.1 8 4.4Zm8 0 1.9.7L15.8 7h-2.6L16 4.4ZM8.5 12v2.5h2V12h-2Zm5 0v2.5h2V12h-2Z" /></svg>
          </a>
          <a class="social-icon douyin" href="https://www.douyin.com/user/MS4wLjABAAAAmwtctMoK-AY3bO01VHeSfO75N34v06kV4ygCd4y1O-Q?from_tab_name=main" target="_blank" rel="noreferrer" aria-label="抖音">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 3h2.5c.2 2 1.2 3.3 3.3 3.8v2.5a8.7 8.7 0 0 1-3.3-1V14a5.5 5.5 0 1 1-5.5-5.5c.4 0 .8 0 1.2.1v2.7a2.8 2.8 0 1 0 1.8 2.7V3Z" /></svg>
          </a>
          <a class="social-icon xiaohongshu" href="https://www.xiaohongshu.com/user/profile/5cbad7da000000001202aec9?xsec_token=ABg8udW1cgZn0UdyfUxcU-CW2-5fwaxsT1W7hJxEQLzZw%3D&xsec_source=pc_search" target="_blank" rel="noreferrer" aria-label="小红书">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="1.8" /><path d="M8 9h8M8 12h8M8 15h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="16.5" cy="15" r="1" /></svg>
          </a>
        </div>
      </div>
    </div>
  </header>
  <main>
    <section id="home" class="hero-frame" aria-label="个人介绍，点击查看关于我" role="button" tabindex="0" aria-pressed="false">
      <div class="flip-card" id="flip-card">
        <div class="face front-face" id="front-face"><div class="hero-content"><h1 class="hero-title english-title"><span class="title-base">HELLO, I'M</span><span class="title-signature english-signature">Chiron</span></h1><p class="hero-subtitle">EMBEDDED CONTROL / ROBOTICS VISION / AI SENSING</p></div><a class="resume-download-button" href="/yang-bokai-resume.docx" download="杨博开简历.docx" aria-label="下载简历"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path class="resume-download-base" d="M6 21h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path class="resume-download-arrow" d="M12 3v14m0 0 5-5m-5 5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg><span class="resume-download-label"><span class="resume-span-mother"><span>下</span><span>载</span><span>简</span><span>历</span></span><span class="resume-span-mother2" aria-hidden="true"><span>下</span><span>载</span><span>简</span><span>历</span></span></span></a><p class="explore-prompt">MOVE / CLICK</p>
          <div class="inverted-layer" id="inverted-layer" aria-hidden="true"><div class="hero-content"><p class="hero-title inverted-title"><span class="title-base">你好，</span><span class="title-middle">我是</span><span class="title-signature">杨博开</span></p><p class="hero-subtitle inverted-subtitle">嵌入式控制 / 机器人视觉 / AI 感知</p></div><p class="explore-prompt inverted-explore-prompt">MOVE / CLICK</p></div>
        </div>
        <div class="face about-face" id="about-face"><div class="about-expand-track" id="about-expand-track"><div class="about-expand-stage" id="about-expand-stage"><div class="about-expand-frame" id="about-expand-frame"><img class="about-expand-media" id="about-expand-media" data-src="/about-background.webp" data-defer-until-flip="true" alt="杨博开在城市夜景前的照片" decoding="async" draggable="false" /><div class="about-expand-scrim" id="about-expand-scrim"></div><div class="about-expand-overlay" id="about-expand-overlay"><div class="about-reference-head"><span class="about-reference-brand">CHIRON</span><button class="about-reference-menu" id="about-return-button" type="button" aria-label="返回首页"><span></span><span></span></button><div class="about-reference-side"><img class="profile-image" src="/profile.webp" alt="杨博开证件照" loading="lazy" decoding="async" /><button class="about-reference-contact" type="button" aria-label="联系我">联系我</button></div></div><div class="about-content-block"><div class="about-heading-row"><div><div class="eyebrow about-reveal-target" data-about-reveal="PROFILE / 01"></div><div class="about-title-reveal about-reveal-target" data-about-reveal="关于我"></div></div></div><div class="about-layout"><div class="about-copy"><div class="about-copy-reveal about-reveal-target" data-about-reveal="我是大连理工大学电子信息工程专业本科生，正在把嵌入式控制、机器人视觉和 AI 感知串成一条可以落地的技术路径。"></div><div class="about-copy-reveal about-reveal-target" data-about-reveal="我喜欢从真实的系统问题出发：让传感器看懂环境，让机械臂沿着规划路径准确移动，也让一块电路板和一段代码在现场可靠工作。"></div></div><div class="about-facts"><div><div class="about-fact-label about-reveal-target" data-about-reveal="所在地"></div><div class="about-fact-value about-reveal-target" data-about-reveal="大连 / 中国"></div></div><div><div class="about-fact-label about-reveal-target" data-about-reveal="方向"></div><div class="about-fact-value about-reveal-target" data-about-reveal="嵌入式 · 机器人"></div></div><div><div class="about-fact-label about-reveal-target" data-about-reveal="状态"></div><div class="about-fact-value about-reveal-target" data-about-reveal="2023—2027 在校"></div></div></div></div><div class="signature about-reveal-target" data-about-reveal="YANG/BOKAI · BUILDING SYSTEMS THAT MOVE"></div></div></div></div><div class="about-expand-title" id="about-expand-title">关于我</div><div class="about-expand-hint" id="about-expand-hint">SCROLL / EXPAND</div></div></div></div>
      </div>
    </section>

    <section id="skills" class="site-section white-section"><div class="section-inner"><div class="section-heading reveal"><div><p class="eyebrow">CAPABILITY / 02</p><h2>能力系统</h2></div><p class="section-note">把软硬件、感知与表达放在同一张工作台上。</p></div><div class="skill-grid">${skillsMarkup}</div></div></section>
    <section id="practice" class="site-section ink-section practice-wall-section" data-theme="dark"><div class="section-inner practice-wall-inner"><div class="practice-wall-heading reveal"><div><p class="eyebrow chapter-eyebrow">PRACTICE / 03</p><h2>实践档案</h2></div><p class="section-note">从实习、项目到专利，把每一次真实场景里的尝试，留下可以被看见的轨迹。</p></div><div class="practice-wall-list" data-practice-wall-list><article class="practice-wall-row" tabindex="0" data-practice-index="01" data-practice-image="/practice/research-institute.webp"><span class="practice-wall-number">01</span><div class="practice-wall-copy"><span class="practice-wall-kicker">INTERNSHIP / 2024.07—2024.09</span><h3>中国电子科技集团第十四研究所</h3><p>嵌入式机电控制实习生 · 南京</p></div><span class="practice-wall-arrow" aria-hidden="true">↗</span></article><article class="practice-wall-row" tabindex="0" data-practice-index="02" data-practice-image="/practice/robotics-project.webp"><span class="practice-wall-number">02</span><div class="practice-wall-copy"><span class="practice-wall-kicker">INDEPENDENT PROJECT / 2024.04—2025.04</span><h3>基于视觉的复合机器人操作技术</h3><p>校级大创项目 · 项目负责人</p></div><span class="practice-wall-arrow" aria-hidden="true">↗</span></article><article class="practice-wall-row" tabindex="0" data-practice-index="03" data-practice-image="/practice/patent-notice.webp"><span class="practice-wall-number">03</span><div class="practice-wall-copy"><span class="practice-wall-kicker">INVENTION PATENT / 2024.11</span><h3>近程防空雷达超低空试验航路优化</h3><p>发明专利 · 第二作者</p></div><span class="practice-wall-arrow" aria-hidden="true">↗</span></article><article class="practice-wall-row" tabindex="0" data-practice-index="04" data-practice-image="/practice/handwriting-recognition.webp"><span class="practice-wall-number">04</span><div class="practice-wall-copy"><span class="practice-wall-kicker">SUMMER SCHOOL / 2025.08</span><h3>手写数字识别系统</h3><p>香港中文大学内地高校暑期学校</p></div><span class="practice-wall-arrow" aria-hidden="true">↗</span></article></div><div class="practice-wall-preview" data-practice-preview aria-hidden="true"><div class="practice-wall-preview-label">VIEW / <span>01</span></div><img alt="" decoding="async" draggable="false" /></div></div></section>
    <section id="background" class="site-section white-section"><div class="section-inner education-layout"><div class="education-intro section-heading reveal"><div><p class="eyebrow">BACKGROUND / 04</p><h2>教育背景</h2></div><p class="section-note">构建扎实的电子信息理论基础，<br />聚焦通信、嵌入式与智能技术方向<br />的学习与实践。</p><p class="education-intro-en">BUILDING A SOLID FOUNDATION IN ELECTRONIC<br />INFORMATION THEORY, FOCUSING ON COMMUNICATION,<br />EMBEDDED SYSTEMS, AND INTELLIGENT TECHNOLOGIES.</p></div><article class="education-panel reveal"><header class="education-brand-row"><div class="education-brand education-brand-dut"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" stroke-width="2.6" /><circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" stroke-width="2" /><path d="M22 33c6-7 14-7 20 0M25 39c4-4 10-4 14 0M32 17v24M21 28c7 3 15 3 22 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /><path d="M27 45h10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg><div><strong>大连理工大学</strong><span>DALIAN UNIVERSITY OF TECHNOLOGY</span></div></div><span class="education-brand-divider" aria-hidden="true"></span><div class="education-brand education-brand-school"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" stroke-width="2.6" /><path d="m32 14 16 9-16 9-16-9 16-9Zm-10 15v12l10 6 10-6V29M26 35h12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" /><path d="M18 48h28" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg><div><strong>信息与通信工程学院</strong><span>School of Information and<br />Communication Engineering</span></div></div></header><div class="education-panel-columns"><section class="education-academic"><div class="education-column-title"><strong>学术信息</strong><span>ACADEMIC INFORMATION</span></div><div class="education-facts"><div class="education-fact"><span class="education-fact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m3 9 9-5 9 5-9 5-9-5Zm4 2v5c3 2 7 2 10 0v-5" /></svg></span><span class="education-fact-label">学校</span><strong>大连理工大学（985）</strong></div><div class="education-fact"><span class="education-fact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="1" /><path d="M9 8h6M9 12h6M9 16h3" /></svg></span><span class="education-fact-label">专业</span><strong>电子信息工程（本科）</strong></div><div class="education-fact"><span class="education-fact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg></span><span class="education-fact-label">时间</span><strong>2023.09 — 2027.06</strong></div></div><div class="education-ranking"><div class="education-rank-main"><span>专业排名</span><strong>70<small>/ 207</small></strong><em>（33.82%）</em></div><div class="education-rank-side"><div><span>均分</span><strong>83.3<small> / 100</small></strong></div><div class="education-language-scores"><span><i>▣</i> CET-4<strong>554</strong></span><span><i>▣</i> CET-6<strong>477</strong></span></div></div></div><div class="education-courses"><span class="education-courses-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5.5C6.5 4 9.5 4.5 12 7v13c-2.5-2.5-5.5-3-8-1.5v-13ZM20 5.5C17.5 4 14.5 4.5 12 7v13c2.5-2.5 5.5-3 8-1.5v-13Z" /></svg></span><div><strong>主修课程</strong><p>信号与系统 / 数字信号处理 / 电磁场与电磁波 /<br />计算机原理 / 随机信号分析</p></div></div></section><section class="education-positions"><div class="education-column-title"><strong>任职经历</strong><span>POSITIONS</span></div><div class="education-role-list"><article class="education-role"><span class="education-role-dot" aria-hidden="true"></span><div><time>2023.09 — 2024.09</time><h3>机电2301班 宣传委员</h3></div><span class="education-role-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="14" cy="14" r="5" /><circle cx="27" cy="16" r="4" /><path d="M5 31c0-5 4-8 9-8s9 3 9 8M21 31c0-4 3-7 7-7 4 0 7 3 7 7" /></svg></span></article><article class="education-role"><span class="education-role-dot" aria-hidden="true"></span><div><time>2024.10 — 今</time><h3>未来技术学院格斗机器人公社<br />副社长</h3></div><span class="education-role-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="14" cy="14" r="5" /><circle cx="27" cy="16" r="4" /><path d="M5 31c0-5 4-8 9-8s9 3 9 8M21 31c0-4 3-7 7-7 4 0 7 3 7 7" /></svg></span></article><article class="education-role"><span class="education-role-dot" aria-hidden="true"></span><div><time>2025.04 — 今</time><h3>伯川书院“AI创”机器人社团<br />副社长</h3></div><span class="education-role-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="14" cy="14" r="5" /><circle cx="27" cy="16" r="4" /><path d="M5 31c0-5 4-8 9-8s9 3 9 8M21 31c0-4 3-7 7-7 4 0 7 3 7 7" /></svg></span></article></div></section></div></article></div></section>
    <section id="competitions" class="site-section white-section competition-section"><div class="section-inner"><div class="section-heading reveal"><div><p class="eyebrow">COMPETITIONS / 05</p><h2>竞赛奖项</h2></div><p class="section-note">四次站上赛场，把机器人、物联网、数字设计与嵌入式系统做成可以被看见的成果。</p></div><div class="competition-grid"><article class="competition-card reveal"><div class="competition-media"><img data-src="/competitions/ai-robotics.webp" alt="中国机器人及人工智能大赛团队合影" loading="lazy" decoding="async" /><span class="competition-index">01</span></div><div class="competition-info"><div class="card-topline"><span>ROBOTICS / AI</span><span>2024.08</span></div><h3>中国机器人及人工智能大赛</h3><strong class="competition-award">全国一等奖</strong><p>围绕机器人系统与人工智能应用完成竞赛项目，把感知、控制和协作落到真实场景。</p></div></article><article class="competition-card reveal"><div class="competition-media"><img data-src="/competitions/iot-design.webp" alt="全国大学生物联网设计竞赛现场" loading="lazy" decoding="async" /><span class="competition-index">02</span></div><div class="competition-info"><div class="card-topline"><span>INTERNET OF THINGS</span><span>2026.08</span></div><h3>全国大学生物联网设计竞赛</h3><strong class="competition-award">全国二等奖</strong><p>从硬件连接、数据采集到系统联调，持续练习把物联网方案做得稳定、清晰并可运行。</p></div></article><article class="competition-card reveal"><div class="competition-media"><img data-src="/competitions/3d-design.webp" alt="全国三维数字化创新设计大赛现场" loading="lazy" decoding="async" /><span class="competition-index">03</span></div><div class="competition-info"><div class="card-topline"><span>3D DIGITAL DESIGN</span><span>2025.10</span></div><h3>全国三维数字化创新设计大赛</h3><strong class="competition-award">全国三等奖</strong><p>用三维设计、数字化表达和现场展示，把结构想法转译成更直观的方案。</p></div></article><article class="competition-card reveal"><div class="competition-media"><img data-src="/competitions/embedded.webp" alt="全国大学生嵌入式芯片与系统设计竞赛现场" loading="lazy" decoding="async" /><span class="competition-index">04</span></div><div class="competition-info"><div class="card-topline"><span>EMBEDDED SYSTEMS</span><span>2026.08</span></div><h3>全国大学生嵌入式芯片与系统<br />设计竞赛</h3><strong class="competition-award">全国三等奖</strong><p>围绕芯片、系统与工程实现展开实践，在软硬件协同中不断靠近可靠运行。</p></div></article></div></div></section>
    <section id="hobbies" class="site-section ink-section hobby-section" data-theme="dark" aria-label="摄影与旅游"><div class="hobby-scroll-stage"><div class="hobby-scroll-track hobby-editorial-track"><div class="section-heading light reveal hobby-original-heading"><div><p class="eyebrow">HOBBIES / 06</p><h2>爱好</h2></div><p class="section-note">在技术之外，保留对画面、旅行、山野与运动的好奇。</p></div><article class="hobby-editorial-intro"><p class="hobby-editorial-meta">HOBBIES / 02</p><h2 class="hobby-editorial-title"><span class="hobby-editorial-cn">摄影</span><span class="hobby-editorial-en">PHOTOGRAPHY<br />&amp; FILM</span></h2><p class="hobby-editorial-body">用镜头记录光线、空间和一瞬间的秩序。把观察变成另一种表达方式。</p></article><figure class="hobby-editorial-photo hobby-editorial-photo--one hobby-editorial-stack-figure"><figcaption>DALIAN, 2025</figcaption><div id="photography-stack-mount" class="photography-stack-mount" role="group" aria-label="摄影照片墙"></div></figure><article class="hobby-editorial-travel"><p class="hobby-editorial-meta">ROUTES / 02</p><h2 class="hobby-editorial-title"><span class="hobby-editorial-cn">旅游</span><span class="hobby-editorial-en">EXPLORING<br />THE WORLD</span></h2><p class="hobby-editorial-body">把城市、街道和陌生的风景收进自己的行走路线，在移动中保持对世界的观察。</p></article><figure class="hobby-editorial-photo hobby-editorial-photo--two"><figcaption>HONG KONG, 2025</figcaption><img data-src="/hobbies/photography/09-香港.webp" alt="香港夏日海湾景色" loading="lazy" decoding="async" draggable="false" /></figure><figure class="hobby-editorial-photo hobby-editorial-photo--three"><figcaption>KYOTO, 2025</figcaption><img data-src="/hobbies/photography/03-街头.webp" alt="东京街头行人" loading="lazy" decoding="async" draggable="false" /></figure><figure class="hobby-editorial-photo hobby-editorial-photo--four"><figcaption>TOKYO, 2025</figcaption><img data-src="/hobbies/photography/02-东京塔.webp" alt="东京塔城市风景" loading="lazy" decoding="async" draggable="false" /></figure><figure class="hobby-editorial-photo hobby-editorial-photo--five"><figcaption>SUZHOU, 2025</figcaption><img data-src="/hobbies/photography/01-苏州.webp" alt="苏州春日街景" loading="lazy" decoding="async" draggable="false" /></figure><p class="hobby-editorial-footer">SCROLL / EXPLORE <span>02 / 02</span></p></div></div></section>
    <section id="contact" class="contact-section"><div class="contact-transition" aria-hidden="true"><span class="contact-transition-glow contact-transition-glow--edge-left"></span><span class="contact-transition-glow contact-transition-glow--center"></span><span class="contact-transition-glow contact-transition-glow--edge-right"></span></div><div class="contact-shell"><div class="contact-inner contact-card reveal"><p class="eyebrow">CONTACT / 07</p><h2>让我们一起完成<br /><span>每一个心中未遂的奇想</span></h2><div class="contact-row"><a href="mailto:ybk0109@qq.com">ybk0109@qq.com</a><a href="tel:13179065551">131 7906 5551</a><span>吉林省白城市 · 2005.01</span></div><div class="contact-stepper" id="contact-stepper" aria-label="联系信息填写步骤"><div class="contact-stepper-indicators" role="list"><button class="contact-step-indicator is-active" type="button" data-step="1" aria-label="第 1 步" aria-current="step"><span>01</span></button><span class="contact-step-connector" aria-hidden="true"><i></i></span><button class="contact-step-indicator" type="button" data-step="2" aria-label="第 2 步"><span>02</span></button><span class="contact-step-connector" aria-hidden="true"><i></i></span><button class="contact-step-indicator" type="button" data-step="3" aria-label="第 3 步"><span>03</span></button></div><div class="contact-stepper-content"><section class="contact-step is-active" data-step-panel="1"><p class="step-kicker">STEP 01 / CONTACT</p><h3>留下一个联系方式</h3><p class="step-description">邮箱或电话，选择一个就好。</p><div class="contact-methods" role="group" aria-label="联系方式类型"><button class="contact-method is-selected" type="button" data-method="email" aria-pressed="true">邮箱</button><button class="contact-method" type="button" data-method="phone" aria-pressed="false">电话</button></div><label class="contact-input-label" for="contact-value"><span id="contact-value-label">邮箱地址</span><input id="contact-value" type="email" placeholder="name@example.com" autocomplete="email" /></label><p class="contact-step-error" id="contact-step-error" role="alert"></p></section><section class="contact-step" data-step-panel="2"><p class="step-kicker">STEP 02 / FEEDBACK</p><h3>有什么对这个网站的建议吗？</h3><p class="step-description">欢迎告诉我你的第一印象，或者你希望看到的内容。</p><label class="contact-textarea-label" for="contact-suggestion"><span>你的建议</span><textarea id="contact-suggestion" rows="5" placeholder="写下你的想法……"></textarea></label></section><section class="contact-step" data-step-panel="3"><p class="step-kicker">STEP 03 / SENT</p><h3>稍等，我会联系您！</h3><p class="step-description">感谢你的建议。我会通过你留下的联系方式回复你。</p><div class="contact-complete-mark" aria-hidden="true">✓</div></section></div><div class="contact-stepper-footer"><button class="contact-step-back" type="button" disabled>返回</button><button class="contact-step-next" type="button">下一步</button></div></div><div class="contact-footer"><span>YANG/BOKAI</span><span>个人作品集 · 2026</span></div></div></div></section>
  </main>
`.replace('83.3<small> / 100</small>', '86.9<small> / 100</small>')

const staggeredMenuMount = app.querySelector<HTMLElement>('#staggered-menu-mount')
if (staggeredMenuMount) {
  const staggeredMenuRoot = createRoot(staggeredMenuMount)
  flushSync(() => staggeredMenuRoot.render(createElement(StaggeredMenu, {
    items: menuItems,
    socialItems: socialFollowItems.map((item) => ({ label: item.label, link: item.href })),
    displaySocials: true,
    displayItemNumbering: true,
    menuButtonColor: '#050505',
    openMenuButtonColor: '#F7F7EF',
    changeMenuColorOnOpen: true,
    colors: ['#C7FF00', '#F7F7EF', '#303A2D'],
    accentColor: '#C7FF00',
    isFixed: true,
    closeOnClickAway: true,
  })))
}

const topographyBackground = document.createElement('div')
topographyBackground.id = 'topography-background'
topographyBackground.className = 'topography-container'
topographyBackground.setAttribute('aria-hidden', 'true')
app.prepend(topographyBackground)
createTopography(topographyBackground)
app.querySelector<HTMLElement>('.about-reference-head .profile-image')?.remove()

const createAboutTextReveals = () => {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-about-reveal]')]
  targets.forEach((target) => {
    const text = target.dataset.aboutReveal
    if (!text) return
    const computed = getComputedStyle(target)
    const font = {
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: Number(computed.fontWeight) || 400,
      lineHeight: computed.lineHeight,
      letterSpacing: computed.letterSpacing,
    }
    createRoot(target).render(createElement(BlockTextReveal, {
      text,
      font,
      align: computed.textAlign === 'right' ? 'right' : computed.textAlign === 'center' ? 'center' : 'left',
      textColor: computed.color,
      blockColor: 'rgb(0 0 0 / 58%)',
      revealType: 'blocks',
      direction: 'left',
      speed: 60,
      rounded: 0,
      style: { width: '100%', minWidth: 0 },
    }))
  })
}

createAboutTextReveals()

const mainContent = app.querySelector('main')!
const skillsSection = document.querySelector<HTMLElement>('#skills')!
const practiceSection = document.querySelector<HTMLElement>('#practice')!
const backgroundSection = document.querySelector<HTMLElement>('#background')!
const competitionSection = document.querySelector<HTMLElement>('#competitions')!
const hobbiesSection = document.querySelector<HTMLElement>('#hobbies')!
const contactSection = document.querySelector<HTMLElement>('#contact')!
const photographyStackMount = hobbiesSection.querySelector<HTMLElement>('#photography-stack-mount')
let photographyStackModulePromise: Promise<any> | null = null
const loadPhotographyStackModule = () => {
  if (!photographyStackModulePromise) {
    // @ts-ignore The component is a JSX module without a local declaration.
    photographyStackModulePromise = import('./components/originkit/ui/Stack.jsx')
  }
  return photographyStackModulePromise
}
const loadPhotographyStack = async () => {
  if (!photographyStackMount) return
  if (photographyStackMount.childElementCount > 0) return
  const { default: Stack } = await loadPhotographyStackModule()
  createRoot(photographyStackMount).render(createElement(Stack, {
    randomRotation: true,
    sensitivity: 180,
    sendToBackOnClick: true,
    mobileClickOnly: true,
    cards: photoWallItems.map((item) => createElement('img', {
      key: item.src,
      src: item.src,
      alt: item.alt,
      className: 'photo-wall-card-image',
      loading: item.src.includes('10-大连夜景') ? 'eager' : 'lazy',
      decoding: 'async',
      fetchPriority: item.src.includes('10-大连夜景') ? 'high' : 'low',
      draggable: false,
    })),
  }))
  // The mount already reserves its final size with `aspect-ratio`. Refreshing
  // all ScrollTriggers immediately after React mounts the cards can move the
  // document while the user is entering this chapter, which is visible as a
  // downward jump. The existing trigger will refresh on resize/orientation
  // changes when its measurements genuinely need to change.
}
if (photographyStackMount) {
  const photographyObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return
    photographyObserver.disconnect()
    void loadPhotographyStackModule().then(() => {
      window.setTimeout(() => { void loadPhotographyStack() }, 120)
    })
  }, { rootMargin: '200px 0px' })
  photographyObserver.observe(photographyStackMount)
}
const hobbyTrack = hobbiesSection.querySelector<HTMLElement>('.hobby-editorial-track')
const hobbyFooter = hobbiesSection.querySelector<HTMLElement>('.hobby-editorial-footer')
hobbiesSection.setAttribute('aria-label', '摄影、旅游与悠悠球')
if (hobbyFooter) {
  hobbyFooter.insertAdjacentHTML('beforebegin', yoyoHobbyMarkup)
} else {
  hobbyTrack?.insertAdjacentHTML('beforeend', yoyoHobbyMarkup)
}
hobbyFooter?.remove()
const yoyoVideos = [...hobbiesSection.querySelectorAll<HTMLVideoElement>('.hobby-editorial-yoyo video')]
yoyoVideos.forEach((video) => {
  video.loop = true
  video.muted = true
  video.playsInline = true
  const resumePlayback = () => { video.play().catch(() => undefined) }
  video.addEventListener('canplay', resumePlayback, { once: true })
  resumePlayback()
})
mainContent.insertBefore(backgroundSection, skillsSection)
mainContent.insertBefore(practiceSection, skillsSection)
mainContent.insertBefore(competitionSection, practiceSection)
backgroundSection.insertAdjacentHTML('afterend', logoWallMarkup)

const socialsSection = document.createElement('section')
socialsSection.id = 'socials'
socialsSection.className = 'site-section white-section socials-section'
  socialsSection.innerHTML = `<div class="section-inner socials-inner"><div class="socials-heading"><span class="socials-symbol-rotator" data-socials-symbols aria-hidden="true">${socialIconItems.map((item, index) => `<img class="socials-symbol-icon${index === 0 ? ' is-active' : ''}" src="${item.src}" alt="" draggable="false" />`).join('')}</span><h2 aria-label="WHAT'S UP ON SOCIALS"><span>WHAT'S UP</span><em>ON SOCIALS</em></h2></div><div class="socials-gallery" data-socials-gallery aria-label="社交动态视频"><div class="socials-video-deck">${socialVideoItems.map((item, index) => `<button class="social-video-card${index === 2 ? ' is-selected' : ''}" type="button" data-social-video-index="${index}" aria-label="选择${item.alt}" aria-pressed="${index === 2 ? 'true' : 'false'}"><span class="social-video-card-media"><video data-src="${item.src}" data-webm="${item.webm || ''}" poster="${item.poster}" autoplay muted loop playsinline preload="none" aria-hidden="true"></video></span><span class="social-video-card-index">0${index + 1}</span></button>`).join('')}</div></div><div class="socials-follow" aria-labelledby="socials-follow-title"><h3 id="socials-follow-title">我的社交媒体</h3><p class="socials-follow-caption">Follow Chiron on social media</p><div class="socials-follow-actions" role="group" aria-label="我的社交媒体">${socialFollowItems.map(({ label, href }) => `<a class="social-follow-button" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${socialFollowLabel(label, 'social-follow-label')}${socialFollowLabel(label, 'social-follow-label-hover', true)}</a>`).join('')}</div></div><div class="socials-footer"><span>CLICK / TO FOCUS</span><span>01—05 / LOOPING VIDEO ARCHIVE</span></div></div>`
mainContent.insertBefore(socialsSection, contactSection)
socialsSection.querySelector<HTMLElement>('.socials-footer')?.remove()

const setupDeferredMedia = () => {
  const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-src]')]
  const socialVideos = videos.filter((video) => video.closest('.social-video-card'))
  const deferredVideos = videos.filter((video) => !video.closest('.social-video-card'))
  const loadVideo = (video: HTMLVideoElement, shouldPlay = true) => {
    if (video.dataset.mediaLoaded === 'true') {
      if (shouldPlay) video.play().catch(() => undefined)
      return
    }
    const source = video.dataset.src
    if (!source) return
    video.dataset.mediaLoaded = 'true'
    video.preload = 'auto'
    const webmSource = video.dataset.webm
    if (webmSource) {
      const sourceElement = document.createElement('source')
      sourceElement.src = webmSource
      sourceElement.type = 'video/webm'
      video.append(sourceElement)
    }
    const fallbackSource = document.createElement('source')
    fallbackSource.src = source
    fallbackSource.type = 'video/mp4'
    video.append(fallbackSource)
    if (shouldPlay) {
      video.addEventListener('canplay', () => { video.play().catch(() => undefined) }, { once: true })
    }
    video.load()
    if (shouldPlay) video.play().catch(() => undefined)
  }
  if (!videos.length) return
  const selectedSocialVideo = socialVideos.find((video) => video.closest('.social-video-card')?.classList.contains('is-selected')) || socialVideos[0]
  const activateSocialVideo = (video: HTMLVideoElement) => {
    socialVideos.forEach((otherVideo) => {
      if (otherVideo !== video) otherVideo.pause()
    })
    loadVideo(video)
  }
  socialVideos.forEach((video) => {
    video.closest<HTMLButtonElement>('.social-video-card')?.addEventListener('click', () => activateSocialVideo(video))
  })
  if (!('IntersectionObserver' in window)) {
    if (selectedSocialVideo) activateSocialVideo(selectedSocialVideo)
    deferredVideos.forEach((video) => loadVideo(video))
    return
  }
  const socialObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return
    if (selectedSocialVideo) activateSocialVideo(selectedSocialVideo)
    socialObserver.disconnect()
  }, { rootMargin: '160px 0px' })
  socialObserver.observe(socialsSection)
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const video = entry.target as HTMLVideoElement
      loadVideo(video)
      videoObserver.unobserve(video)
    })
  }, { rootMargin: '240px 0px' })
  deferredVideos.forEach((video) => videoObserver.observe(video))
}
setupDeferredMedia()

const setupDeferredImages = () => {
  const images = [...document.querySelectorAll<HTMLImageElement>('img[data-src]:not([data-defer-until-flip])')]
  const loadImage = (image: HTMLImageElement) => {
    if (image.dataset.mediaLoaded === 'true') return
    const source = image.dataset.src
    if (!source) return
    image.dataset.mediaLoaded = 'true'
    image.src = source
    image.removeAttribute('data-src')
  }
  if (!images.length) return
  if (!('IntersectionObserver' in window)) {
    images.forEach(loadImage)
    return
  }
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const image = entry.target as HTMLImageElement
      loadImage(image)
      imageObserver.unobserve(image)
    })
  }, { rootMargin: '240px 0px' })
  images.forEach((image) => imageObserver.observe(image))
}
setupDeferredImages()
const contactEyebrow = contactSection.querySelector<HTMLElement>('.eyebrow')
if (contactEyebrow) contactEyebrow.textContent = 'CONTACT / 08'

const setupCompetitionTimeline = () => {
  const inner = competitionSection.querySelector<HTMLElement>('.section-inner')
  const heading = inner?.querySelector<HTMLElement>('.section-heading')
  const grid = inner?.querySelector<HTMLElement>('.competition-grid')
  const cards = grid ? [...grid.querySelectorAll<HTMLElement>('.competition-card')] : []
  if (!inner || !heading || !grid || !cards.length) return

  const timeline = document.createElement('div')
  timeline.className = 'competition-timeline'
  timeline.dataset.competitionTimeline = 'true'

  const body = document.createElement('div')
  body.className = 'competition-timeline-body'
  body.dataset.competitionTimelineBody = 'true'
  body.innerHTML = `<svg class="competition-rail" data-competition-rail aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="competition-rail-main" data-competition-main pathLength="1" d="M 50 0 V 100"></path>${cards.map((_, index) => `<path class="competition-rail-branch competition-rail-branch-${index + 1}" data-competition-branch="${index + 1}" pathLength="1" d="M 50 0 C 50 0 50 0 50 0"></path>`).join('')}</svg><div class="competition-nodes" aria-hidden="true">${cards.map((_, index) => `<span class="competition-node competition-node-${index + 1}" data-competition-node="${index + 1}"><span class="competition-node-label">0${index + 1}</span><span class="competition-node-dot"></span></span>`).join('')}</div>`

  heading.classList.add('competition-timeline-intro')
  const competitionEyebrow = heading.querySelector<HTMLElement>('.eyebrow')
  if (competitionEyebrow) competitionEyebrow.textContent = 'CHIRON COMPETITIONS / 05'
  cards.forEach((card, index) => {
    const info = card.querySelector<HTMLElement>('.competition-info')
    if (info && !info.querySelector('.competition-more-button')) {
      info.insertAdjacentHTML('beforeend', `<button class="competition-more-button animated-button" type="button" aria-label="了解更多：竞赛项目 0${index + 1}"><span class="competition-more-text text">了解更多</span><svg class="competition-more-arrow arr-1" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11h13.2l-4.6-4.6L13 5l8 7-8 7-1.4-1.4 4.6-4.6H3Z" /></svg><svg class="competition-more-arrow arr-2" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11h13.2l-4.6-4.6L13 5l8 7-8 7-1.4-1.4 4.6-4.6H3Z" /></svg><span class="competition-more-circle circle" aria-hidden="true"></span></button>`)
    }
    card.dataset.timelineSide = index % 2 === 0 ? 'right' : 'left'
    card.dataset.timelineIndex = String(index + 1)
    card.classList.remove('reveal')
  })

  inner.insertBefore(timeline, heading)
  timeline.append(heading, body)
  body.appendChild(grid)
}

setupCompetitionTimeline()

const createInkSectionBlend = () => {
  const sections = [practiceSection, hobbiesSection]
  const from = { background: [252, 252, 251], text: [5, 5, 5], muted: [5, 5, 5], line: [5, 5, 5] }
  const to = { background: [48, 58, 45], text: [247, 247, 239], muted: [247, 247, 239], line: [247, 247, 239] }
  let frame = 0
  const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
  const color = (start: number[], end: number[], progress: number, alpha = 1) => {
    const values = start.map((value, index) => Math.round(value + (end[index] - value) * progress))
    return `rgb(${values.join(' ')} / ${alpha})`
  }
  const update = () => {
    frame = 0
    const viewportHeight = Math.max(window.innerHeight, 1)
    sections.forEach((section) => {
      if (section === hobbiesSection && section.classList.contains('hobby-scroll-managed')) return
      const top = section.getBoundingClientRect().top
      const progress = clamp((viewportHeight * .92 - top) / (viewportHeight * .7))
      const surfaceAlpha = .72 + progress * .08
      section.style.setProperty('--ink-bg', color(from.background, to.background, progress, surfaceAlpha))
      section.style.setProperty('--ink-text', color(from.text, to.text, progress))
      section.style.setProperty('--ink-muted', color(from.muted, to.muted, progress, .58))
      section.style.setProperty('--ink-line', color(from.line, to.line, progress, .24))
      section.style.setProperty('--ink-progress', progress.toFixed(4))
    })
  }
  const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update) }
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  update()
}

createInkSectionBlend()

const createHobbyScrollExperience = () => {
  const section = hobbiesSection
  const stage = section.querySelector<HTMLElement>('.hobby-scroll-stage')
  const track = section.querySelector<HTMLElement>('.hobby-scroll-track')
  if (!stage || !track) return

  const dark = { background: [48, 58, 45], text: [247, 247, 239], muted: [247, 247, 239], line: [247, 247, 239] }
  const light = { background: [252, 252, 251], text: [5, 5, 5], muted: [5, 5, 5], line: [5, 5, 5] }
  const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
  const color = (start: number[], end: number[], progress: number, alpha = 1) => {
    const values = start.map((value, index) => Math.round(value + (end[index] - value) * progress))
    return `rgb(${values.join(' ')} / ${alpha})`
  }
  const applyBlend = (value: number) => {
    const progress = clamp(value)
    if (Math.abs(progress - Number(section.dataset.hobbyBlendProgress || -1)) < 0.002) return
    section.dataset.hobbyBlendProgress = progress.toFixed(4)
    const surfaceAlpha = .84 + progress * (window.matchMedia('(max-width:900px)').matches ? .04 : .1)
    section.style.setProperty('--ink-bg', color(dark.background, light.background, progress, surfaceAlpha))
    section.style.setProperty('--ink-text', color(dark.text, light.text, progress))
    section.style.setProperty('--ink-muted', color(dark.muted, light.muted, progress, .58))
    section.style.setProperty('--ink-line', color(dark.line, light.line, progress, .24))
    section.style.setProperty('--ink-progress', progress.toFixed(4))
    document.documentElement.style.setProperty('--hobby-topography-opacity', (0.44 + progress * .50).toFixed(3))
    const brightness = (2.45 - progress * 1.25).toFixed(3)
    const contrast = (1.28 - progress * .2).toFixed(3)
    document.documentElement.style.setProperty('--hobby-topography-filter', `grayscale(1) brightness(${brightness}) contrast(${contrast})`)
  }
  const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth)
  const media = gsap.matchMedia()

  applyBlend(0)
  media.add({ desktop: '(min-width:901px)', mobile: '(max-width:900px)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (context) => {
    const { desktop, mobile, reduceMotion } = context.conditions as { desktop?: boolean; mobile?: boolean; reduceMotion?: boolean }
    if (desktop && !reduceMotion) {
      // Do not combine the browser's sticky positioning with ScrollTrigger's
      // pinning. Both systems try to take control at the chapter boundary and
      // can cause a one-frame vertical correction during the hand-off.
      section.classList.add('hobby-scroll-gsap')
      const horizontal = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(distance(), window.innerHeight * .75)}`,
          pin: stage,
          scrub: .55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            section.classList.add('hobby-scroll-managed')
            applyBlend(self.progress)
          },
          onRefresh: (self) => applyBlend(self.progress),
          onLeave: () => { section.classList.add('hobby-scroll-managed'); applyBlend(1) },
          onLeaveBack: () => { section.classList.remove('hobby-scroll-managed'); applyBlend(0) },
        },
      })
      return () => {
        horizontal.kill()
        section.classList.remove('hobby-scroll-gsap', 'hobby-scroll-managed')
      }
    }

    if (!mobile) return
    section.classList.add('hobby-scroll-managed')
    const sectionResizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => ScrollTrigger.refresh())
    sectionResizeObserver?.observe(section)
    const verticalBlend = gsap.to({}, {
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: .55,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyBlend(self.progress),
        onRefresh: (self) => applyBlend(self.progress),
        onLeave: () => applyBlend(1),
        onLeaveBack: () => applyBlend(0),
      },
    })
    return () => {
      verticalBlend.kill()
      sectionResizeObserver?.disconnect()
      section.classList.remove('hobby-scroll-managed')
    }
  })
}

createHobbyScrollExperience()

const createEducationCountups = () => {
  const targets = [
    { target: document.querySelector<HTMLElement>('#background .education-rank-main > strong'), value: 70, decimals: 0 },
    { target: document.querySelector<HTMLElement>('#background .education-rank-side > div:first-child strong'), value: 86.9, decimals: 1 },
    { target: document.querySelector<HTMLElement>('#background .education-language-scores span:nth-child(1) strong'), value: 554, decimals: 0 },
    { target: document.querySelector<HTMLElement>('#background .education-language-scores span:nth-child(2) strong'), value: 477, decimals: 0 },
  ]
  const values = targets.flatMap(({ target, value, decimals }) => {
    if (!target) return []
    const valueElement = document.createElement('span')
    valueElement.className = 'education-countup'
    valueElement.textContent = '0'
    const firstChild = target.firstChild
    if (firstChild?.nodeType === Node.TEXT_NODE) firstChild.replaceWith(valueElement)
    else target.prepend(valueElement)
    return [{ element: valueElement, value, decimals }]
  })
  if (!values.length) return

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return
    observer.disconnect()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    values.forEach(({ element, value, decimals }) => {
      if (reduceMotion) {
        element.textContent = value.toFixed(decimals)
        return
      }
      const state = { current: 0 }
      gsap.to(state, {
        current: value,
        duration: 1.35,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => { element.textContent = state.current.toFixed(decimals) },
      })
    })
  }, { threshold: 0.2, rootMargin: '0px 0px -12% 0px' })
  observer.observe(backgroundSection)
}

createEducationCountups()

const createLogoWallMotion = () => {
  const track = document.querySelector<HTMLElement>('[data-logo-track]')
  const group = track?.querySelector<HTMLElement>('.logo-wall-group')
  if (!track || !group) return

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reducedMotion = motionQuery.matches
  let groupDistance = 0
  let offset = 0
  let speed = 22
  let targetSpeed = 22
  let lastScrollY = window.scrollY
  let scrollTimer: number | undefined

  const measure = () => {
    groupDistance = group.getBoundingClientRect().width
    if (groupDistance > 0) offset %= groupDistance
  }
  const render = (_time: number, deltaTime: number) => {
    if (reducedMotion || groupDistance <= 0) return
    const seconds = Math.min(deltaTime / 1000, .05)
    speed += (targetSpeed - speed) * Math.min(seconds * 7, 1)
    offset = (offset + speed * seconds) % groupDistance
    track.style.transform = `translate3d(${-offset}px, 0, 0)`
  }
  const onScroll = () => {
    const nextScrollY = window.scrollY
    const delta = nextScrollY - lastScrollY
    lastScrollY = nextScrollY
    if (delta > 0) targetSpeed = 210
    else if (delta < 0) targetSpeed = -210
    else targetSpeed = 22
    window.clearTimeout(scrollTimer)
    scrollTimer = window.setTimeout(() => { targetSpeed = 22 }, 300)
  }
  const onMotionChange = (event: MediaQueryListEvent) => {
    reducedMotion = event.matches
    if (reducedMotion) {
      gsap.ticker.remove(render)
      track.style.transform = 'translate3d(0, 0, 0)'
    } else {
      measure()
      gsap.ticker.add(render)
    }
  }

  const resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(group)
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  motionQuery.addEventListener('change', onMotionChange)
  measure()
  if (!reducedMotion) gsap.ticker.add(render)
}

createLogoWallMotion()

const createSocialsGallery = () => {
  const gallery = document.querySelector<HTMLElement>('[data-socials-gallery]')
  const deck = gallery?.querySelector<HTMLElement>('.socials-video-deck')
  const cards = deck ? [...deck.querySelectorAll<HTMLButtonElement>('.social-video-card')] : []
  const videos = cards.map((card) => card.querySelector<HTMLVideoElement>('video')).filter((video): video is HTMLVideoElement => Boolean(video))
  if (!gallery || !deck || cards.length !== 5) return

  type Pose = {
    current: { x: number; y: number; rotation: number; scale: number }
    target: { x: number; y: number; rotation: number; scale: number }
    velocity: { x: number; y: number; rotation: number; scale: number }
    z: number
  }

  const poses: Pose[] = cards.map(() => ({
    current: { x: 0, y: 0, rotation: 0, scale: 1 },
    target: { x: 0, y: 0, rotation: 0, scale: 1 },
    velocity: { x: 0, y: 0, rotation: 0, scale: 0 },
    z: 1,
  }))
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reducedMotion = motionQuery.matches
  let selectedIndex = 2
  let measured = false
  let frame: number | null = null
  let lastTime = 0

  const applyPose = (card: HTMLButtonElement, pose: Pose) => {
    card.style.transform = `translate3d(calc(-50% + ${pose.current.x}px), ${pose.current.y}px, 0) rotate(${pose.current.rotation}deg) scale(${pose.current.scale})`
    card.style.zIndex = String(pose.z)
  }

  const measure = () => {
    const width = Math.max(deck.clientWidth, 320)
    const height = Math.max(gallery.clientHeight, 360)
    const xSlots = [-.26, -.13, 0, .13, .26].map((value) => value * width)
    const ySlots = [.12, .06, 0, .06, .12].map((value) => value * height)
    const rotations = [-12, -7, 0, 7, 12]
    const scales = [.76, .9, 1, .9, .76]

    poses.forEach((pose, index) => {
      const distance = Math.abs(index - selectedIndex)
      const side = Math.sign(index - selectedIndex)
      const push = index === selectedIndex ? 0 : side * Math.max(6, 18 - (distance - 1) * 4)
      pose.target.x = xSlots[index] + push
      pose.target.y = ySlots[index] + (index === selectedIndex ? -Math.min(26, height * .055) - 15 : -65)
      pose.target.rotation = rotations[index] + (index === selectedIndex ? 0 : side * Math.min(1.5, distance * .45))
      pose.target.scale = index === selectedIndex ? 1.06 : scales[index]
      pose.z = index === selectedIndex ? 30 : 20 - distance
      if (!measured) {
        pose.current = { ...pose.target }
        pose.velocity = { x: 0, y: 0, rotation: 0, scale: 0 }
      }
      applyPose(cards[index], pose)
    })
    measured = true
  }

  const tick = (time: number) => {
    const seconds = Math.min(Math.max((time - (lastTime || time)) / 1000, 1 / 120), .05)
    lastTime = time
    let moving = false
    const stiffness = 185
    const damping = 24
    poses.forEach((pose, index) => {
      ;(['x', 'y', 'rotation', 'scale'] as const).forEach((property) => {
        const acceleration = (pose.target[property] - pose.current[property]) * stiffness - pose.velocity[property] * damping
        pose.velocity[property] += acceleration * seconds
        pose.current[property] += pose.velocity[property] * seconds
        if (Math.abs(pose.target[property] - pose.current[property]) > .06 || Math.abs(pose.velocity[property]) > .06) moving = true
      })
      applyPose(cards[index], pose)
    })
    if (moving && !reducedMotion) frame = window.requestAnimationFrame(tick)
    else { frame = null; lastTime = 0 }
  }

  const wake = () => {
    if (reducedMotion) {
      poses.forEach((pose, index) => {
        pose.current = { ...pose.target }
        pose.velocity = { x: 0, y: 0, rotation: 0, scale: 0 }
        applyPose(cards[index], pose)
      })
      return
    }
    if (frame === null) {
      lastTime = 0
      frame = window.requestAnimationFrame(tick)
    }
  }

  const selectCard = (index: number) => {
    selectedIndex = index
    cards.forEach((card, cardIndex) => {
      const selected = cardIndex === selectedIndex
      card.classList.toggle('is-selected', selected)
      card.setAttribute('aria-pressed', String(selected))
    })
    measure()
    wake()
  }
  const handleResize = () => { measure(); wake() }
  const handleMotionChange = (event: MediaQueryListEvent) => {
    reducedMotion = event.matches
    if (reducedMotion && frame !== null) {
      window.cancelAnimationFrame(frame)
      frame = null
    }
    wake()
  }

  cards.forEach((card, index) => card.addEventListener('click', () => selectCard(index)))
  videos.forEach((video) => {
    video.muted = true
    video.loop = true
    video.playsInline = true
  })
  measure()
  window.addEventListener('resize', handleResize)
  motionQuery.addEventListener('change', handleMotionChange)
}

createSocialsGallery()

const createSocialsSymbolRotation = () => {
  const rotator = document.querySelector<HTMLElement>('[data-socials-symbols]')
  const icons = rotator ? [...rotator.querySelectorAll<HTMLImageElement>('.socials-symbol-icon')] : []
  if (!rotator || icons.length < 2) return

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let timeline: ReturnType<typeof gsap.timeline> | null = null

  const setup = () => {
    timeline?.kill()
    timeline = null
    gsap.set(icons, { autoAlpha: 0, scale: .84 })
    gsap.set(icons[0], { autoAlpha: 1, scale: 1 })
    if (motionQuery.matches) return

    timeline = gsap.timeline({ repeat: -1 })
    icons.forEach((icon, index) => {
      const nextIcon = icons[(index + 1) % icons.length]
      timeline!
        .to(icon, { autoAlpha: 0, scale: .84, duration: .28, ease: 'power2.inOut' }, '+=1.35')
        .to(nextIcon, { autoAlpha: 1, scale: 1, duration: .38, ease: 'power2.out' }, '<')
    })
  }

  setup()
  motionQuery.addEventListener('change', setup)
}

createSocialsSymbolRotation()

const createSocialsContactTransition = () => {
  const transition = contactSection.querySelector<HTMLElement>('.contact-transition')
  if (!transition) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  gsap.set(transition, { '--contact-flow': reduceMotion ? 1 : 0 })
  if (reduceMotion) return

  gsap.to(transition, {
    '--contact-flow': 1,
    ease: 'none',
    scrollTrigger: {
      trigger: contactSection,
      start: 'top bottom',
      end: () => `top ${Math.max(96, window.innerHeight * .14)}px`,
      scrub: .72,
      invalidateOnRefresh: true,
    },
  })
}

createSocialsContactTransition()

const createCompetitionPracticeTransition = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.set([competitionSection, practiceSection], { clearProps: 'transform,opacity' })
  const transition = gsap.timeline({
      scrollTrigger: {
        trigger: practiceSection,
        start: 'top bottom',
        end: 'top 12%',
        scrub: .55,
        invalidateOnRefresh: true,
      },
    })
  // Let the document's natural scroll provide the slide-in. Only fade the
  // incoming chapter so no transform can create a gap between adjacent pages.
  transition.fromTo(practiceSection, { opacity: .72 }, { opacity: 1, ease: 'none' }, 0)
  window.setTimeout(() => ScrollTrigger.refresh(), 0)
}

createCompetitionPracticeTransition()

const createPracticeWallHover = () => {
  const list = document.querySelector<HTMLElement>('[data-practice-wall-list]')
  const preview = document.querySelector<HTMLElement>('[data-practice-preview]')
  const previewImage = preview?.querySelector<HTMLImageElement>('img')
  const previewIndex = preview?.querySelector<HTMLElement>('span')
  const rows = list ? [...list.querySelectorAll<HTMLElement>('.practice-wall-row')] : []
  if (!list || !preview || !previewImage || !previewIndex || !rows.length) return

  // Keep the cursor preview in the viewport's coordinate system. The practice
  // chapter participates in page transitions, so leaving a fixed child inside
  // it can make its position relative to a transformed ancestor instead of
  // the actual pointer.
  if (preview.parentElement !== document.body) document.body.appendChild(preview)

  const media = gsap.matchMedia()
  media.add({ desktop: '(hover: hover) and (pointer: fine)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (context) => {
    const { desktop, reduceMotion } = context.conditions as { desktop?: boolean; reduceMotion?: boolean }
    if (!desktop) return

    let activeRow: HTMLElement | null = null
    let lastPointer: { x: number; y: number } | null = null
    let activePreviewSource = ''
    const moveX = gsap.quickTo(preview, 'x', { duration: reduceMotion ? 0 : .28, ease: 'power3.out' })
    const moveY = gsap.quickTo(preview, 'y', { duration: reduceMotion ? 0 : .28, ease: 'power3.out' })
    const previewImageCache = new Map<string, HTMLImageElement>()
    const getPreviewImage = (source: string) => {
      const cachedImage = previewImageCache.get(source)
      if (cachedImage) return cachedImage
      const image = new Image()
      image.decoding = 'async'
      image.loading = 'eager'
      image.src = source
      previewImageCache.set(source, image)
      return image
    }
    const resizePreviewToImage = () => {
      if (!previewImage.naturalWidth || !previewImage.naturalHeight) return
      const maxWidth = Math.min(window.innerWidth * .32, 360)
      const maxHeight = Math.min(window.innerHeight * .64, 540)
      const scale = Math.min(maxWidth / previewImage.naturalWidth, maxHeight / previewImage.naturalHeight)
      preview.style.width = `${Math.round(previewImage.naturalWidth * scale)}px`
      preview.style.height = `${Math.round(previewImage.naturalHeight * scale)}px`
    }
    const place = (clientX: number, clientY: number) => {
      const bounds = preview.getBoundingClientRect()
      const margin = 20
      const x = Math.min(Math.max(clientX + 26, margin), Math.max(margin, window.innerWidth - bounds.width - margin))
      const y = Math.min(Math.max(clientY - bounds.height * .56, margin), Math.max(margin, window.innerHeight - bounds.height - margin))
      moveX(x)
      moveY(y)
    }
    const show = (row: HTMLElement, clientX?: number, clientY?: number) => {
      activeRow = row
      rows.forEach((item) => item.classList.toggle('is-active', item === row))
      const source = row.dataset.practiceImage || ''
      const cachedImage = getPreviewImage(source)
      activePreviewSource = source
      preview.classList.toggle('is-image-loading', !(cachedImage?.complete && cachedImage.naturalWidth > 0))
      previewImage.src = source
      previewIndex.textContent = row.dataset.practiceIndex || ''
      if (cachedImage?.complete && cachedImage.naturalWidth > 0) resizePreviewToImage()
      if (clientX !== undefined && clientY !== undefined) place(clientX, clientY)
      else {
        const rowBounds = row.getBoundingClientRect()
        place(rowBounds.right, rowBounds.top + rowBounds.height * .5)
      }
      gsap.to(preview, { autoAlpha: 1, scale: 1, rotation: -2, duration: reduceMotion ? 0 : .32, ease: 'power3.out', overwrite: 'auto' })
    }
    const hide = () => {
      activeRow = null
      rows.forEach((item) => item.classList.remove('is-active'))
      gsap.to(preview, { autoAlpha: 0, scale: .94, duration: reduceMotion ? 0 : .22, ease: 'power2.out', overwrite: 'auto' })
    }
    const handlePointerMove = (event: PointerEvent) => {
      lastPointer = { x: event.clientX, y: event.clientY }
      const targetRow = event.target instanceof Element
        ? event.target.closest<HTMLElement>('.practice-wall-row')
        : null
      const hoveredRow = targetRow && list.contains(targetRow)
        ? targetRow
        : rows.find((row) => {
        const bounds = row.getBoundingClientRect()
        return event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
      })
      if (!hoveredRow) {
        if (activeRow) hide()
        return
      }
      if (hoveredRow !== activeRow) show(hoveredRow, event.clientX, event.clientY)
      place(event.clientX, event.clientY)
    }
    const handleFocus = (event: FocusEvent) => {
      const row = event.currentTarget as HTMLElement
      show(row)
    }
    const handleBlur = () => {
      window.setTimeout(() => { if (!list.contains(document.activeElement)) hide() }, 0)
    }
    const handlePreviewLoad = () => {
      const loadedSource = previewImage.currentSrc || previewImage.src
      const expectedSource = activePreviewSource ? new URL(activePreviewSource, window.location.href).href : ''
      if (expectedSource && loadedSource !== expectedSource) return
      preview.classList.remove('is-image-loading')
      resizePreviewToImage()
      if (lastPointer) place(lastPointer.x, lastPointer.y)
      else if (activeRow) {
        const rowBounds = activeRow.getBoundingClientRect()
        place(rowBounds.right, rowBounds.top + rowBounds.height * .5)
      }
    }
    const handleResize = () => {
      if (!activeRow) return
      resizePreviewToImage()
      if (lastPointer) place(lastPointer.x, lastPointer.y)
    }
    const rowHandlers = rows.map((row) => {
      const handleEnter = (event: PointerEvent) => show(row, event.clientX, event.clientY)
      row.addEventListener('pointerenter', handleEnter)
      row.addEventListener('focus', handleFocus)
      row.addEventListener('blur', handleBlur)
      return { row, handleEnter }
    })

    gsap.set(preview, { autoAlpha: 0, x: -500, y: -500, scale: .94, rotation: -2, transformOrigin: 'center center' })
    previewImage.addEventListener('load', handlePreviewLoad)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      previewImage.removeEventListener('load', handlePreviewLoad)
      rowHandlers.forEach(({ row, handleEnter }) => {
        row.removeEventListener('pointerenter', handleEnter)
        row.removeEventListener('focus', handleFocus)
        row.removeEventListener('blur', handleBlur)
        row.classList.remove('is-active')
      })
      gsap.killTweensOf(preview)
    }
  })
}

createPracticeWallHover()

const createCompetitionPreview = () => {
  const images = [...document.querySelectorAll<HTMLImageElement>('.competition-media img')]
  if (!images.length) return

  const preview = document.createElement('div')
  preview.className = 'competition-preview'
  preview.setAttribute('role', 'dialog')
  preview.setAttribute('aria-modal', 'true')
  preview.setAttribute('aria-hidden', 'true')
  preview.innerHTML = '<div class="competition-preview-backdrop" data-preview-close></div><div class="competition-preview-panel"><button class="competition-preview-close" type="button" aria-label="关闭图片预览"><span class="span-mother"><span>关</span><span>闭</span></span><span class="span-mother2" aria-hidden="true"><span>关</span><span>闭</span></span></button><img class="competition-preview-image" alt="" /><p class="competition-preview-caption"></p></div>'
  document.body.appendChild(preview)

  const previewImage = preview.querySelector<HTMLImageElement>('.competition-preview-image')!
  const caption = preview.querySelector<HTMLElement>('.competition-preview-caption')!
  const closeButton = preview.querySelector<HTMLButtonElement>('.competition-preview-close')!
  let lastTrigger: HTMLElement | null = null
  let isOpen = false

  const close = () => {
    if (!isOpen) return
    isOpen = false
    preview.classList.remove('is-open')
    preview.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('competition-preview-open')
    lastTrigger?.focus()
  }

  const open = (image: HTMLImageElement) => {
    lastTrigger = image.parentElement
    previewImage.src = image.currentSrc || image.src || image.dataset.src || ''
    previewImage.alt = image.alt
    caption.textContent = image.alt
    preview.classList.add('is-open')
    preview.setAttribute('aria-hidden', 'false')
    document.body.classList.add('competition-preview-open')
    isOpen = true
    closeButton.focus()
  }

  images.forEach((image) => {
    const trigger = image.parentElement
    if (!trigger) return
    trigger.setAttribute('role', 'button')
    trigger.setAttribute('tabindex', '0')
    trigger.setAttribute('aria-label', `点击查看大图：${image.alt}`)
    trigger.addEventListener('click', () => open(image))
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      open(image)
    })
  })

  closeButton.addEventListener('click', close)
  preview.querySelector<HTMLElement>('[data-preview-close]')?.addEventListener('click', close)
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close() })
}

createCompetitionPreview()

const createCompetitionMoreButtonMotion = () => {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('.competition-more-button')]
  if (!buttons.length) return

  buttons.forEach((button) => {
    const image = button.closest<HTMLElement>('.competition-card')?.querySelector<HTMLImageElement>('.competition-media img')
    button.addEventListener('click', () => image?.parentElement?.click())
  })
}

createCompetitionMoreButtonMotion()

// The competition chapter is intentionally static: its cards and branch lines
// are laid out once, without scroll-linked parallax or reveal motion.

const createCompetitionTimelineGeometry = () => {
  const body = document.querySelector<HTMLElement>('[data-competition-timeline-body]')
  const rail = body?.querySelector<SVGSVGElement>('[data-competition-rail]')
  const mainLine = body?.querySelector<SVGPathElement>('[data-competition-main]')
  const branches = body ? [...body.querySelectorAll<SVGPathElement>('[data-competition-branch]')] : []
  const nodes = body ? [...body.querySelectorAll<HTMLElement>('[data-competition-node]')] : []
  const cards = body ? [...body.querySelectorAll<HTMLElement>('.competition-card')] : []
  if (!body || !rail || !mainLine || !branches.length || !nodes.length || !cards.length) return
  const setGeometry = () => {
    const bodyRect = body.getBoundingClientRect()
    const height = Math.max(bodyRect.height, 1)
    rail.setAttribute('viewBox', `0 0 100 ${height}`)
    mainLine.setAttribute('d', `M 50 0 V ${height}`)

    const metrics = cards.map((card, index) => {
      const cardRect = card.getBoundingClientRect()
      const side = card.dataset.timelineSide === 'left' ? 'left' : 'right'
      const cardY = cardRect.top - bodyRect.top + cardRect.height * .5
      const y = Math.min(height - 4, Math.max(4, cardY))
      const rawX = side === 'right'
        ? cardRect.left - bodyRect.left - 10
        : cardRect.right - bodyRect.left + 10
      const x = Math.min(96, Math.max(4, rawX / Math.max(bodyRect.width, 1) * 100))
      return { card, index, side, y, x }
    })

    metrics.forEach(({ index, side, y, x }) => {
      const railX = 50
      const branch = branches[index]
      branch.setAttribute('d', `M ${railX.toFixed(2)} ${y.toFixed(2)} L ${x.toFixed(2)} ${y.toFixed(2)}`)
      nodes[index].style.left = `${railX.toFixed(2)}%`
      nodes[index].style.top = `${y}px`
      nodes[index].classList.toggle('is-right', side === 'right')
      nodes[index].classList.toggle('is-left', side === 'left')
    })
  }

  setGeometry()
  const resizeObserver = new ResizeObserver(setGeometry)
  resizeObserver.observe(body)
}

createCompetitionTimelineGeometry()

const createTiltedSkillCards = async () => {
  // @ts-ignore The component is a JSX module without a local declaration.
  const { default: TiltedCard } = await import('./components/originkit/ui/TiltedCard.jsx')
  const mounts = [...document.querySelectorAll<HTMLElement>('.skill-card-tilt')]
  mounts.forEach((mount, index) => {
    const card = skillCards[index]
    if (!card) return
    const overlayContent = createElement('div', { className: 'tilted-skill-overlay' },
      createElement('div', { className: 'tilted-skill-top' },
        createElement('span', { className: 'tilted-skill-index' }, card.number),
        createElement('span', { className: 'tilted-skill-label' }, 'CAPABILITY'),
      ),
      createElement('div', { className: 'tilted-skill-copy' },
        createElement('strong', { className: 'tilted-skill-title' }, card.title),
        createElement('p', { className: 'tilted-skill-body' }, card.body),
      ),
      createElement('div', { className: 'tilted-skill-tags' },
        ...card.tags.map((tag) => createElement('span', { key: tag }, tag)),
      ),
    )
    createRoot(mount).render(createElement(TiltedCard, {
      imageSrc: card.image,
      altText: `${card.title}能力卡片`,
      captionText: card.title,
      containerHeight: 'clamp(270px, 28vw, 350px)',
      containerWidth: '100%',
      imageHeight: '100%',
      imageWidth: '100%',
      rotateAmplitude: 9,
      scaleOnHover: 1.045,
      showMobileWarning: false,
      showTooltip: true,
      displayOverlayContent: true,
      overlayContent,
    }))
  })
}

if ('IntersectionObserver' in window) {
  const skillObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return
    skillObserver.disconnect()
    void createTiltedSkillCards()
  }, { rootMargin: '600px 0px' })
  skillObserver.observe(skillsSection)
} else {
  void createTiltedSkillCards()
}

const createContactBadge = () => {
  const toggle = document.querySelector<HTMLButtonElement>('#contact-badge-toggle')
  const popover = document.querySelector<HTMLElement>('#contact-badge-popover')
  const mount = document.querySelector<HTMLElement>('#contact-badge-canvas')
  if (!toggle || !popover || !mount) return
  let root: ReturnType<typeof createRoot> | null = null
  let isOpen = false
  let closeTimer: number | undefined
  let lanyardModulePromise: Promise<any> | null = null

  const loadLanyard = () => {
    if (!lanyardModulePromise) {
      // @ts-ignore The component is a JSX module without a local declaration.
      lanyardModulePromise = import('./components/lanyard/Lanyard.jsx')
    }
    return lanyardModulePromise
  }

  const setOpen = (next: boolean) => {
    isOpen = next
    toggle.classList.toggle('is-open', next)
    toggle.setAttribute('aria-expanded', String(next))
    popover.classList.toggle('is-open', next)
    popover.setAttribute('aria-hidden', String(!next))
    document.documentElement.classList.toggle('is-contact-badge-open', next)
  }

  toggle.addEventListener('click', () => {
    if (closeTimer !== undefined) window.clearTimeout(closeTimer)
    if (isOpen) {
      setOpen(false)
      closeTimer = window.setTimeout(() => {
        root?.unmount()
        root = null
        mount.replaceChildren()
      }, 460)
      return
    }
    if (!root) root = createRoot(mount)
    setOpen(true)
    void loadLanyard().then(({ default: Lanyard }) => {
      if (!isOpen) return
      root?.render(createElement(Lanyard, {
        position: [0, 0, 25],
        gravity: [0, -28, 0],
        frontImage: '/lanyard-card.webp',
        imageFit: 'contain',
        lanyardWidth: 1.05,
      }))
    })
  })
}

createContactBadge()

const createContactStepper = () => {
  const root = document.querySelector<HTMLElement>('#contact-stepper')!
  const content = root.querySelector<HTMLElement>('.contact-stepper-content')!
  const panels = [...root.querySelectorAll<HTMLElement>('[data-step-panel]')]
  const indicators = [...root.querySelectorAll<HTMLButtonElement>('.contact-step-indicator')]
  const connectors = [...root.querySelectorAll<HTMLElement>('.contact-step-connector')]
  const backButton = root.querySelector<HTMLButtonElement>('.contact-step-back')!
  const nextButton = root.querySelector<HTMLButtonElement>('.contact-step-next')!
  const methodButtons = [...root.querySelectorAll<HTMLButtonElement>('.contact-method')]
  const methodLabel = root.querySelector<HTMLElement>('#contact-value-label')!
  const valueInput = root.querySelector<HTMLInputElement>('#contact-value')!
  const error = root.querySelector<HTMLElement>('#contact-step-error')!
  const suggestionInput = root.querySelector<HTMLTextAreaElement>('#contact-suggestion')!
  const honeypotInput = document.createElement('input')
  honeypotInput.type = 'text'
  honeypotInput.id = 'contact-website'
  honeypotInput.name = 'website'
  honeypotInput.tabIndex = -1
  honeypotInput.autocomplete = 'off'
  honeypotInput.setAttribute('aria-hidden', 'true')
  honeypotInput.className = 'contact-honeypot'
  root.append(honeypotInput)
  const submitError = document.createElement('p')
  submitError.className = 'contact-step-error contact-submit-error'
  submitError.id = 'contact-submit-error'
  submitError.setAttribute('role', 'alert')
  submitError.setAttribute('aria-live', 'polite')
  panels[1]?.querySelector('.contact-textarea-label')?.insertAdjacentElement('afterend', submitError)
  let currentStep = 1
  let method: 'email' | 'phone' = 'email'

  const updateHeight = () => { const activePanel = panels[currentStep - 1]; if (activePanel) content.style.height = `${activePanel.offsetHeight}px` }
  const updateControls = () => { indicators.forEach((indicator, index) => { const step = index + 1; indicator.classList.toggle('is-active', step === currentStep); indicator.classList.toggle('is-complete', step < currentStep); if (step === currentStep) indicator.setAttribute('aria-current', 'step'); else indicator.removeAttribute('aria-current') }); connectors.forEach((connector, index) => connector.classList.toggle('is-complete', index < currentStep - 1)); backButton.disabled = currentStep === 1; backButton.textContent = currentStep === 3 ? '返回修改' : '返回'; nextButton.hidden = currentStep === 3; nextButton.textContent = currentStep === 2 ? '完成' : '下一步' }
  const setStep = (nextStep: number, direction: 1 | -1) => { if (nextStep < 1 || nextStep > panels.length || nextStep === currentStep) return; const previousPanel = panels[currentStep - 1]; const nextPanel = panels[nextStep - 1]; nextPanel.style.transform = `translateX(${direction > 0 ? '100%' : '-100%'})`; nextPanel.style.opacity = '0'; previousPanel.classList.remove('is-active'); previousPanel.style.transform = `translateX(${direction > 0 ? '-50%' : '50%'})`; previousPanel.style.opacity = '0'; currentStep = nextStep; nextPanel.classList.add('is-active'); requestAnimationFrame(() => { nextPanel.style.transform = 'translateX(0)'; nextPanel.style.opacity = '1'; updateHeight() }); window.setTimeout(() => { previousPanel.style.transform = ''; previousPanel.style.opacity = '' }, 460); updateControls() }
  const validateContact = () => { const value = valueInput.value.trim(); const valid = method === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : /^[\d+\-\s()]{6,}$/.test(value); if (!valid) { error.textContent = method === 'email' ? '请输入有效的邮箱地址。' : '请输入有效的电话号码。'; valueInput.focus(); return false } error.textContent = ''; return true }
  const saveContactSubmission = async () => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, value: valueInput.value.trim(), suggestion: suggestionInput.value.trim(), website: honeypotInput.value }),
    })
    if (!response.ok) {
      if (response.status === 409) throw new Error('duplicate')
      if (response.status === 429) throw new Error('rate-limit')
      throw new Error('failed')
    }
  }
  methodButtons.forEach((button) => button.addEventListener('click', () => { method = button.dataset.method === 'phone' ? 'phone' : 'email'; methodButtons.forEach((item) => { const selected = item === button; item.classList.toggle('is-selected', selected); item.setAttribute('aria-pressed', String(selected)) }); methodLabel.textContent = method === 'email' ? '邮箱地址' : '电话号码'; valueInput.type = method === 'email' ? 'email' : 'tel'; valueInput.placeholder = method === 'email' ? 'name@example.com' : '131 7906 5551'; valueInput.autocomplete = method === 'email' ? 'email' : 'tel'; valueInput.value = ''; error.textContent = '' }))
  valueInput.addEventListener('input', () => { error.textContent = '' })
  nextButton.addEventListener('click', async () => { if (nextButton.disabled) return; if (currentStep === 1 && !validateContact()) return; if (currentStep === 2) { submitError.textContent = ''; nextButton.disabled = true; try { await saveContactSubmission(); setStep(3, 1) } catch (submissionError) { submitError.textContent = submissionError instanceof Error && submissionError.message === 'duplicate' ? '这条信息最近已经提交过了。' : submissionError instanceof Error && submissionError.message === 'rate-limit' ? '提交次数过多，请稍后再试。' : '提交失败，请稍后再试。' } finally { nextButton.disabled = false } return } if (currentStep < panels.length) setStep(currentStep + 1, 1) })
  backButton.addEventListener('click', () => { if (currentStep > 1) setStep(currentStep - 1, -1) })
  indicators.forEach((indicator, index) => indicator.addEventListener('click', () => { const step = index + 1; if (step < currentStep) setStep(step, -1) }))
  updateControls(); updateHeight(); window.addEventListener('resize', updateHeight); if (document.fonts?.ready) document.fonts.ready.then(updateHeight).catch(() => {})
}

createContactStepper()

const disableResumeDownload = () => {
  const button = document.querySelector<HTMLElement>('.resume-download-button')
  if (!button) return
  if (button instanceof HTMLAnchorElement) {
    button.removeAttribute('href')
    button.removeAttribute('download')
    button.setAttribute('role', 'button')
  }
  button.addEventListener('click', (event) => event.preventDefault())
}

disableResumeDownload()

const maskPrivateEducationResults = () => {
  const ranking = document.querySelector<HTMLElement>('#background .education-ranking')
  if (!ranking) return
  ranking.classList.add('education-ranking-masked')
  ranking.setAttribute('role', 'img')
  ranking.setAttribute('aria-label', '成绩排名信息已隐藏')
}

maskPrivateEducationResults()

const heroFrame = document.querySelector<HTMLElement>('.hero-frame')!
const flipCard = document.querySelector<HTMLElement>('#flip-card')!
const frontFace = document.querySelector<HTMLElement>('#front-face')!
const invertedLayer = document.querySelector<HTMLElement>('#inverted-layer')!
const aboutFace = document.querySelector<HTMLElement>('#about-face')!
let isFlipped = false
const toggleCard = () => {
  isFlipped = !isFlipped
  flipCard.classList.toggle('is-flipped', isFlipped)
  document.documentElement.classList.toggle('is-card-flipped', isFlipped)
  heroFrame.setAttribute('aria-pressed', String(isFlipped))
  if (isFlipped) {
    const aboutMedia = document.querySelector<HTMLImageElement>('#about-expand-media')
    if (aboutMedia?.dataset.src) {
      aboutMedia.src = aboutMedia.dataset.src
      aboutMedia.removeAttribute('data-src')
    }
    aboutFace.scrollTop = 0
    aboutFace.dispatchEvent(new Event('scroll'))
  }
}
heroFrame.addEventListener('click', (event) => { if (!(event.target as HTMLElement).closest('a, button')) toggleCard() })
heroFrame.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleCard() } })
document.querySelector<HTMLButtonElement>('#about-return-button')?.addEventListener('click', toggleCard)
document.querySelector<HTMLButtonElement>('.about-reference-contact')?.addEventListener('click', () => { window.location.href = 'mailto:ybk0109@qq.com' })

const createAboutScrollExpand = () => {
  const root = aboutFace
  const track = document.querySelector<HTMLElement>('#about-expand-track')!
  const stage = document.querySelector<HTMLElement>('#about-expand-stage')!
  const frame = document.querySelector<HTMLElement>('#about-expand-frame')!
  const media = document.querySelector<HTMLElement>('#about-expand-media')!
  const scrim = document.querySelector<HTMLElement>('#about-expand-scrim')!
  const overlay = document.querySelector<HTMLElement>('#about-expand-overlay')!
  const title = document.querySelector<HTMLElement>('#about-expand-title')!
  const hint = document.querySelector<HTMLElement>('#about-expand-hint')!
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let stageHeight = 0
  let current = 0
  let target = 0
  let frameId = 0
  let running = false
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
  const smoothstep = (edge0: number, edge1: number, value: number) => { const t = clamp((value - edge0) / (edge1 - edge0 || 1e-6), 0, 1); return t * t * (3 - 2 * t) }
  const applyProgress = (progress: number) => { const ease = smoothstep(0, 1, progress); const width = 42 + (100 - 42) * ease; const height = 58 + (100 - 58) * ease; const insetX = Math.max(0, (100 - width) / 2); const insetY = Math.max(0, (100 - height) / 2); const radius = 24 * (1 - ease); frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`; media.style.transform = `scale(${1.35 - .35 * ease})`; scrim.style.opacity = `${.68 * ease}`; const titleOut = smoothstep(.4, .88, progress); title.style.opacity = `${1 - titleOut}`; title.style.transform = `translate3d(0, ${-28 * titleOut}px, 0) scale(${1 + .06 * titleOut})`; const hintGone = smoothstep(0, .12, progress); hint.style.opacity = `${1 - hintGone}`; hint.style.transform = `translate3d(0, ${8 * hintGone}px, 0)`; const overlayIn = smoothstep(.56, .92, progress); overlay.style.opacity = String(overlayIn); overlay.style.transform = `translate3d(0, ${18 * (1 - overlayIn)}px, 0)` }
  const readProgress = () => clamp(root.scrollTop / Math.max(stageHeight * 1.2, 1), 0, 1)
  const tick = () => { const easing = reducedMotion ? 1 : 1 - Math.exp(-1 / (60 * .1)); current += (target - current) * easing; if (Math.abs(target - current) < .0004) { current = target; running = false } applyProgress(current); frameId = running ? requestAnimationFrame(tick) : 0 }
  const kick = () => { if (running) return; running = true; if (!frameId) frameId = requestAnimationFrame(tick) }
  const onScroll = () => { target = readProgress(); if (reducedMotion) { current = target; applyProgress(current); return } kick() }
  const measure = () => { stageHeight = root.clientHeight; if (stageHeight <= 0) return; stage.style.height = `${stageHeight}px`; track.style.height = `${stageHeight * 2.55}px`; stage.style.setProperty('--about-title-size', `${clamp(root.clientWidth * .075, 34, 84)}px`); target = readProgress(); current = target; applyProgress(current) }
  const resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(root)
  root.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', measure); measure()
}

createAboutScrollExpand()

type Point = { x: number; y: number }
type TitleMotion = { x: number; y: number; rotateX: number; rotateY: number; rotateZ: number }
const zeroMotion: TitleMotion = { x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0 }
const targetPoint: Point = { x: -300, y: -300 }
const currentPoint: Point = { x: -300, y: -300 }
const targetMotion: TitleMotion = { ...zeroMotion }
const currentMotion: TitleMotion = { ...zeroMotion }
const resumeButton = document.querySelector<HTMLElement>('.resume-download-button')
const menuPill = document.querySelector<HTMLElement>('.sm-toggle')
let targetRadius = 0
let currentRadius = 0
let pointerInside = false
let animationFrame: number | null = null
let canFollowPointer = false
let reducedMotion = false
const radiusFor = (width: number, height: number) => Math.min(Math.min(135, Math.max(width * 0.09, 96)), width <= 768 ? width * 0.28 : Math.min(width / 2 - 10, height / 2 - 10))
let pointerBounds: DOMRect | null = null
const isLensOverElement = (element: HTMLElement, point: Point, radius: number) => {
  if (!pointerBounds) return false
  const elementBounds = element.getBoundingClientRect()
  const left = elementBounds.left - pointerBounds.left
  const top = elementBounds.top - pointerBounds.top
  const right = elementBounds.right - pointerBounds.left
  const bottom = elementBounds.bottom - pointerBounds.top
  const nearestX = Math.max(left, Math.min(point.x, right))
  const nearestY = Math.max(top, Math.min(point.y, bottom))
  return Math.hypot(point.x - nearestX, point.y - nearestY) <= radius
}
const syncLensContrast = (point: Point, radius: number) => {
  resumeButton?.classList.toggle('is-lens-active', resumeButton ? isLensOverElement(resumeButton, point, radius) : false)
  menuPill?.classList.toggle('is-lens-active', menuPill ? isLensOverElement(menuPill, point, radius) : false)
}
const drawMotion = () => {
  if (!canFollowPointer || reducedMotion) { frontFace.style.setProperty('--title-x', '0px'); frontFace.style.setProperty('--title-y', '0px'); invertedLayer.style.opacity = '0'; invertedLayer.style.setProperty('--lens-radius', '0px'); resumeButton?.classList.remove('is-lens-active'); menuPill?.classList.remove('is-lens-active'); animationFrame = null; return }
  currentPoint.x += (targetPoint.x - currentPoint.x) * 0.1; currentPoint.y += (targetPoint.y - currentPoint.y) * 0.1; currentRadius += ((pointerInside ? targetRadius : 0) - currentRadius) * 0.16
  currentMotion.x += (targetMotion.x - currentMotion.x) * 0.12; currentMotion.y += (targetMotion.y - currentMotion.y) * 0.12; currentMotion.rotateX += (targetMotion.rotateX - currentMotion.rotateX) * 0.12; currentMotion.rotateY += (targetMotion.rotateY - currentMotion.rotateY) * 0.12; currentMotion.rotateZ += (targetMotion.rotateZ - currentMotion.rotateZ) * 0.12
  frontFace.style.setProperty('--title-x', `${currentMotion.x}px`); frontFace.style.setProperty('--title-y', `${currentMotion.y}px`); frontFace.style.setProperty('--title-rotate-x', `${currentMotion.rotateX}deg`); frontFace.style.setProperty('--title-rotate-y', `${currentMotion.rotateY}deg`); frontFace.style.setProperty('--title-rotate-z', `${currentMotion.rotateZ}deg`); frontFace.style.setProperty('--title-middle-x', `${currentMotion.x * 0.08}px`); frontFace.style.setProperty('--title-middle-y', `${currentMotion.y * 0.08}px`); frontFace.style.setProperty('--title-signature-x', `${currentMotion.x * -0.18}px`); frontFace.style.setProperty('--title-signature-y', `${currentMotion.y * -0.18}px`)
  invertedLayer.style.setProperty('--lens-x', `${currentPoint.x}px`); invertedLayer.style.setProperty('--lens-y', `${currentPoint.y}px`); invertedLayer.style.setProperty('--lens-radius', `${Math.max(currentRadius, 0)}px`)
  syncLensContrast(currentPoint, currentRadius)
  animationFrame = Math.abs(targetPoint.x - currentPoint.x) > 0.2 || Math.abs(targetPoint.y - currentPoint.y) > 0.2 || Math.abs((pointerInside ? targetRadius : 0) - currentRadius) > 0.2 || Math.abs(targetMotion.x - currentMotion.x) > 0.02 ? requestAnimationFrame(drawMotion) : null
}
const updateMotionPreferences = () => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  canFollowPointer = hasFinePointer && !reducedMotion
  if (!canFollowPointer) {
    pointerInside = false
    targetMotion.x = 0
    targetMotion.y = 0
    invertedLayer.style.opacity = '0'
    if (animationFrame !== null) cancelAnimationFrame(animationFrame)
    animationFrame = requestAnimationFrame(drawMotion)
  }
}
const applyLensPosition = (clientX: number, clientY: number, animateTitle: boolean) => {
  if (!canFollowPointer || reducedMotion) return
  const bounds = heroFrame.getBoundingClientRect()
  pointerBounds = bounds
  const point = { x: clientX - bounds.left, y: clientY - bounds.top }
  targetRadius = radiusFor(bounds.width, bounds.height)
  const inset = targetRadius + 10
  targetPoint.x = Math.max(inset, Math.min(point.x, bounds.width - inset))
  targetPoint.y = Math.max(inset, Math.min(point.y, bounds.height - inset))
  if (animateTitle) {
    const normalizedX = Math.max(-1, Math.min(1, (point.x / bounds.width - 0.5) * 2))
    const normalizedY = Math.max(-1, Math.min(1, (point.y / bounds.height - 0.5) * 2))
    targetMotion.x = normalizedX * 10
    targetMotion.y = normalizedY * 8
    targetMotion.rotateX = normalizedY * 8
    targetMotion.rotateY = normalizedX * -11
    targetMotion.rotateZ = normalizedX * -4.2
  } else {
    targetMotion.x = 0
    targetMotion.y = 0
    targetMotion.rotateX = 0
    targetMotion.rotateY = 0
    targetMotion.rotateZ = 0
  }
  pointerInside = true
  invertedLayer.style.opacity = '1'
  if (animationFrame === null) animationFrame = requestAnimationFrame(drawMotion)
}
const endTouchLens = (event: PointerEvent) => {
  if (event.pointerType !== 'touch') return
  pointerInside = false
  pointerBounds = null
  targetMotion.x = 0
  targetMotion.y = 0
  targetMotion.rotateX = 0
  targetMotion.rotateY = 0
  targetMotion.rotateZ = 0
  resumeButton?.classList.remove('is-lens-active')
  menuPill?.classList.remove('is-lens-active')
  invertedLayer.style.opacity = '0'
  if (animationFrame === null) animationFrame = requestAnimationFrame(drawMotion)
}
heroFrame.addEventListener('pointermove', (event) => { if (event.pointerType !== 'touch') applyLensPosition(event.clientX, event.clientY, true) })
heroFrame.addEventListener('pointerup', endTouchLens)
heroFrame.addEventListener('pointercancel', endTouchLens)
heroFrame.addEventListener('pointerleave', () => { pointerInside = false; pointerBounds = null; targetMotion.x = 0; targetMotion.y = 0; targetMotion.rotateX = 0; targetMotion.rotateY = 0; targetMotion.rotateZ = 0; resumeButton?.classList.remove('is-lens-active'); menuPill?.classList.remove('is-lens-active'); invertedLayer.style.opacity = '0'; if (animationFrame === null) animationFrame = requestAnimationFrame(drawMotion) })
updateMotionPreferences(); window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', updateMotionPreferences); window.matchMedia('(hover: hover) and (pointer: fine)').addEventListener('change', updateMotionPreferences)

const revealObserver = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target) } }) }, { threshold: 0.14 })
document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => revealObserver.observe(element))
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.nav-link')]
const sectionObserver = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { const sectionId = (entry.target as HTMLElement).id; navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.section === sectionId)); document.documentElement.classList.toggle('is-on-dark-section', sectionId === 'practice' || sectionId === 'hobbies' || sectionId === 'contact'); document.documentElement.classList.toggle('is-after-home', sectionId !== 'home') } }) }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 })
document.querySelectorAll<HTMLElement>('main section[id]').forEach((section) => sectionObserver.observe(section))
