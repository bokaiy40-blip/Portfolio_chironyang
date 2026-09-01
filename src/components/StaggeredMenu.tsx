import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import './StaggeredMenu.css'

export type StaggeredMenuItem = {
  label: string
  english: string
  ariaLabel: string
  link: string
}

export type StaggeredMenuSocialItem = {
  label: string
  link: string
}

type StaggeredMenuProps = {
  position?: 'left' | 'right'
  colors?: string[]
  items?: StaggeredMenuItem[]
  socialItems?: StaggeredMenuSocialItem[]
  displaySocials?: boolean
  displayItemNumbering?: boolean
  className?: string
  menuButtonColor?: string
  openMenuButtonColor?: string
  accentColor?: string
  changeMenuColorOnOpen?: boolean
  isFixed?: boolean
  closeOnClickAway?: boolean
  showLogo?: boolean
  onMenuOpen?: () => void
  onMenuClose?: () => void
}

const StaggeredMenu = ({
  position = 'right',
  colors = ['#C7FF00', '#F7F7EF', '#303A2D'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  menuButtonColor = '#050505',
  openMenuButtonColor = '#F7F7EF',
  accentColor = '#C7FF00',
  changeMenuColorOnOpen = false,
  isFixed = true,
  closeOnClickAway = true,
  showLogo = false,
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const panelRef = useRef<HTMLElement | null>(null)
  const preLayersRef = useRef<HTMLDivElement | null>(null)
  const preLayerElsRef = useRef<HTMLElement[]>([])
  const plusHRef = useRef<HTMLSpanElement | null>(null)
  const plusVRef = useRef<HTMLSpanElement | null>(null)
  const iconRef = useRef<HTMLSpanElement | null>(null)
  const textInnerRef = useRef<HTMLSpanElement | null>(null)
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null)
  const openTlRef = useRef<gsap.core.Timeline | null>(null)
  const closeTweenRef = useRef<gsap.core.Tween | null>(null)
  const spinTweenRef = useRef<gsap.core.Tween | null>(null)
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null)
  const colorTweenRef = useRef<gsap.core.Tween | null>(null)
  const busyRef = useRef(false)
  const itemEntranceTweenRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null)
  const [textLines, setTextLines] = useState(['Menu', 'Close'])

  useLayoutEffect(() => {
    const panel = panelRef.current
    const preContainer = preLayersRef.current
    const plusH = plusHRef.current
    const plusV = plusVRef.current
    const icon = iconRef.current
    const textInner = textInnerRef.current
    if (!panel || !plusH || !plusV || !icon || !textInner) return

    const ctx = gsap.context(() => {
      const preLayers = preContainer ? [...preContainer.querySelectorAll<HTMLElement>('.sm-prelayer')] : []
      preLayerElsRef.current = preLayers
      const offscreen = position === 'left' ? -100 : 100
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 })
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 })
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 })
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 })
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(textInner, { yPercent: 0 })
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor })
    })

    return () => ctx.revert()
  }, [menuButtonColor, position])

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return null

    openTlRef.current?.kill()
    closeTweenRef.current?.kill()
    closeTweenRef.current = null
    itemEntranceTweenRef.current?.kill()

    const itemEls = [...panel.querySelectorAll<HTMLElement>('.sm-panel-itemLabel')]
    const numberEls = [...panel.querySelectorAll<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item')]
    const socialTitle = panel.querySelector<HTMLElement>('.sm-socials-title')
    const socialLinks = [...panel.querySelectorAll<HTMLElement>('.sm-socials-link')]
    const offscreen = position === 'left' ? -100 : 100
    const panelStart = offscreen

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })

    const timeline = gsap.timeline({ paused: true })
    layers.forEach((layer, index) => {
      timeline.fromTo(layer, { xPercent: offscreen }, { xPercent: 0, duration: .5, ease: 'power4.out' }, index * .07)
    })
    const lastTime = layers.length ? (layers.length - 1) * .07 : 0
    const panelInsertTime = lastTime + (layers.length ? .08 : 0)
    const panelDuration = .65
    timeline.fromTo(panel, { xPercent: panelStart }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime)

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * .15
      itemEntranceTweenRef.current = timeline.to(itemEls, {
        yPercent: 0,
        rotate: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: { each: .1, from: 'start' },
      }, itemsStart)
      if (numberEls.length) {
        timeline.to(numberEls, {
          duration: .6,
          ease: 'power2.out',
          '--sm-num-opacity': 1,
          stagger: { each: .08, from: 'start' },
        }, itemsStart + .1)
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * .4
      if (socialTitle) timeline.to(socialTitle, { opacity: 1, duration: .5, ease: 'power2.out' }, socialsStart)
      if (socialLinks.length) {
        timeline.to(socialLinks, {
          y: 0,
          opacity: 1,
          duration: .55,
          ease: 'power3.out',
          stagger: { each: .08, from: 'start' },
          onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
        }, socialsStart + .04)
      }
    }

    openTlRef.current = timeline
    return timeline
  }, [position])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const timeline = buildOpenTimeline()
    if (!timeline) {
      busyRef.current = false
      return
    }
    timeline.eventCallback('onComplete', () => { busyRef.current = false })
    timeline.play(0)
  }, [buildOpenTimeline])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    openTlRef.current = null
    itemEntranceTweenRef.current?.kill()
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return

    closeTweenRef.current?.kill()
    const offscreen = position === 'left' ? -100 : 100
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen,
      duration: .32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = [...panel.querySelectorAll<HTMLElement>('.sm-panel-itemLabel')]
        const numberEls = [...panel.querySelectorAll<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item')]
        const socialTitle = panel.querySelector<HTMLElement>('.sm-socials-title')
        const socialLinks = [...panel.querySelectorAll<HTMLElement>('.sm-socials-link')]
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })
        busyRef.current = false
      },
    })
  }, [position])

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current
    if (!icon) return
    spinTweenRef.current?.kill()
    spinTweenRef.current = gsap.to(icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? .8 : .35,
      ease: opening ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto',
    })
  }, [])

  const animateColor = useCallback((opening: boolean) => {
    const button = toggleBtnRef.current
    if (!button) return
    colorTweenRef.current?.kill()
    if (!changeMenuColorOnOpen) {
      gsap.set(button, { color: menuButtonColor })
      return
    }
    colorTweenRef.current = gsap.to(button, {
      color: opening ? openMenuButtonColor : menuButtonColor,
      delay: .18,
      duration: .3,
      ease: 'power2.out',
    })
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor])

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current
    if (!inner) return
    textCycleAnimRef.current?.kill()
    const currentLabel = opening ? 'Menu' : 'Close'
    const targetLabel = opening ? 'Close' : 'Menu'
    const sequence = [currentLabel]
    let last = currentLabel
    for (let index = 0; index < 3; index += 1) {
      last = last === 'Menu' ? 'Close' : 'Menu'
      sequence.push(last)
    }
    if (last !== targetLabel) sequence.push(targetLabel)
    sequence.push(targetLabel)
    setTextLines(sequence)
    gsap.set(inner, { yPercent: 0 })
    const finalShift = ((sequence.length - 1) / sequence.length) * 100
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: .5 + sequence.length * .07,
      ease: 'power4.out',
    })
  }, [])

  const closeMenu = useCallback(() => {
    if (!openRef.current) return
    openRef.current = false
    setOpen(false)
    onMenuClose?.()
    playClose()
    animateIcon(false)
    animateColor(false)
    animateText(false)
  }, [animateColor, animateIcon, animateText, onMenuClose, playClose])

  const toggleMenu = useCallback(() => {
    const nextOpen = !openRef.current
    openRef.current = nextOpen
    setOpen(nextOpen)
    if (nextOpen) {
      onMenuOpen?.()
      playOpen()
    } else {
      onMenuClose?.()
      playClose()
    }
    animateIcon(nextOpen)
    animateColor(nextOpen)
    animateText(nextOpen)
  }, [animateColor, animateIcon, animateText, onMenuClose, onMenuOpen, playClose, playOpen])

  useEffect(() => {
    if (!closeOnClickAway || !open) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (panelRef.current && !panelRef.current.contains(target) && toggleBtnRef.current && !toggleBtnRef.current.contains(target)) closeMenu()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenu, closeOnClickAway, open])

  useEffect(() => () => {
    openTlRef.current?.kill()
    closeTweenRef.current?.kill()
    spinTweenRef.current?.kill()
    textCycleAnimRef.current?.kill()
    colorTweenRef.current?.kill()
  }, [])

  const wrapperClassName = `${className ? `${className} ` : ''}staggered-menu-wrapper${isFixed ? ' fixed-wrapper' : ''}`

  return (
    <div
      className={wrapperClassName}
      style={{ '--sm-accent': accentColor } as CSSProperties}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(colors.length ? colors.slice(0, 4) : ['#C7FF00', '#F7F7EF', '#303A2D']).map((color, index) => (
          <div key={`${color}-${index}`} className="sm-prelayer" style={{ background: color }} />
        ))}
      </div>
      <header className="staggered-menu-header" aria-label="主导航菜单">
        {showLogo && <div className="sm-logo" aria-label="Logo"><span>CHIRON</span></div>}
        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((line, index) => <span className="sm-toggle-line" key={`${line}-${index}`}>{line}</span>)}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items.map((item, index) => (
              <li className="sm-panel-itemWrap" key={`${item.label}-${index}`}>
                <a className={`sm-panel-item nav-link${index === 0 ? ' is-active' : ''}`} href={item.link} aria-label={item.ariaLabel} data-index={index + 1} onClick={closeMenu}>
                  <span className="sm-panel-itemLabel">
                    <span className="sm-panel-item-cn">{item.label}</span>
                    <span className="sm-panel-item-en">{item.english}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="社交链接">
              <h3 className="sm-socials-title">SOCIALS</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((social, index) => (
                  <li key={`${social.label}-${index}`} className="sm-socials-item">
                    <a href={social.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      <span className="span-mother">{[...social.label].map((character, characterIndex) => <span key={`${character}-${characterIndex}`}>{character}</span>)}</span>
                      <span className="span-mother2" aria-hidden="true">{[...social.label].map((character, characterIndex) => <span key={`${character}-${characterIndex}`}>{character}</span>)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default StaggeredMenu

