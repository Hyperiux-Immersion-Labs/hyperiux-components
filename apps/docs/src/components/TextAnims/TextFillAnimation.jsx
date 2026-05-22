'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

export default function TextFillAnimation({
  text = 'Go cashless, shop & sell virtually, access credit, insurance, and investment products seamlessly with Montra.',
  textColor = '#111111',
  primaryColor = '#ff6b00',
  dimColor = '#dddddd',
  backgroundColor = '#FBFBFB',
  className = '',
  id = 'section-break',
  textSize = '5vw',
  textWidth = '80%',
  containerClassName = '',
  mobileTextSize = '8vw',
  mobileTextWidth = '95%',
}) {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const styleId = `tfa-style-${id}`

    const style = document.createElement('style')
    style.id = styleId

    style.textContent = `
      @keyframes color-transition-${id} {
        0% { color: ${dimColor}; }
        30% { color: ${primaryColor}; }
        100% { color: ${textColor}; }
      }

      #${id} .split__wrapper .split-chars{
        transition: color .4s;
        color: ${dimColor};
      }

      #${id} .split__wrapper .split-chars.show{
        animation: color-transition-${id} .5s;
        color: ${textColor};
      }

      #${id} .tfa-text-wrapper{
        width: ${textWidth};
      }

      #${id} .tfa-heading{
        font-size: ${textSize};
      }

      @media(max-width:640px){
        #${id} .tfa-text-wrapper{
          width: ${mobileTextWidth};
        }

        #${id} .tfa-heading{
          font-size: ${mobileTextSize};
        }
      }
    `

    document.head.appendChild(style)

    const ctx = gsap.context(() => {
      const split = SplitText.create(textRef.current, {
        type: 'words chars',
        aria: false,
        tag: 'span',
        charsClass: 'split-chars',
      })

      // reveal after split completes
      gsap.set(textRef.current, {
        opacity: 1,
      })

      const chars = Array.from(
        textRef.current.querySelectorAll('.split-chars')
      )

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.25,
          // markers: true,
        },
      }).to(
        chars,
        {
          className: 'split-chars show',
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.inOut',
        },
        0
      )

      return () => split.revert()
    })

    return () => {
      ctx.revert()
      document.getElementById(styleId)?.remove()
    }
  }, [
    id,
    textColor,
    primaryColor,
    dimColor,
    textSize,
    textWidth,
    mobileTextSize,
    mobileTextWidth,
  ])

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative h-[250vh] w-full ${containerClassName}`}
      style={{ backgroundColor }}
    >
      <div className="sticky top-0 flex overflow-x-hidden h-screen items-center justify-center">

        {/* subtle ambient bg */}
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6b00]/5 blur-3xl" />

        {/* top left */}
        <div className="absolute left-[5vw] top-[5vh]">
          <p className="text-[11px] uppercase tracking-[0.35em] text-black/35">
            Design Philosophy
          </p>
        </div>

        {/* top right */}
        <div className="absolute right-[5vw] top-[5vh] text-right">
          <p className="text-[11px] uppercase tracking-[0.35em] text-black/35">
            Scroll ↓
          </p>
        </div>

        {/* bottom left */}
        <div className="absolute bottom-[6vh] left-[5vw] max-w-55">
          <p className="text-sm leading-relaxed text-black/35">
            Less friction.
            <br />
            More building.
          </p>
        </div>

        {/* bottom right */}
        <div className="absolute bottom-[6vh] right-[5vw] text-right">
          <div className="space-y-1">
            <p className="text-sm text-black/35">Systems</p>
            <p className="text-sm text-black/35">Motion</p>
            <p className="text-sm text-black/35">Clarity</p>
          </div>
        </div>

        {/* center */}
        <div className="split__wrapper tfa-text-wrapper relative z-10 mx-auto text-center">
          <h2
            ref={textRef}
            className={`tfa-heading opacity-0 font-display font-medium leading-[1.18] tracking-[-0.03em] ${className}`}
          >
            {text}
          </h2>
        </div>
      </div>
    </section>
  )
}