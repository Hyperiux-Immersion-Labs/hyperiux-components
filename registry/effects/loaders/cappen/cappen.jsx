'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const injectStyles = () => {
  if (typeof document === 'undefined') return
  if (document.getElementById('cappen-loader-styles')) return
  const style = document.createElement('style')
  style.id = 'cappen-loader-styles'
  style.textContent = `
    .cappen-loader {
      position: absolute;
      inset: 0;
      background: #FCFCFC;
      color: #000;
      padding: 0 2.5vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      z-index: 9999;
    }
    .cappen-loader__row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .cappen-loader__label {
      font-size: clamp(1rem, 2vw, 2rem);
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .cappen-loader__imgs {
      position: relative;
      width: 6.5vw;
      height: 6.5vw;
    }
    .cappen-loader__img-slot {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 4px;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .cappen-loader__img-slot img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cappen-loader__desc {
      position: absolute;
      bottom: 3vw;
      left: 50%;
      transform: translateX(-50%);
      color: #000;
      width: 40vw;
      text-align: center;
      line-height: 1.1;
      font-size: clamp(0.75rem, 1vw, 1rem);
    }
  `
  document.head.appendChild(style)
}

export function Cappen({
  label1 = 'HUMAN THINKERS',
  label2 = 'DIGITAL MAKERS',
  description = 'A multi-awarded interactive digital studio crafting immersive & interactive experiences for global brands since 2006.',
  images = [],
}) {
  const rootRef = useRef(null)
  const imagesRef = useRef([])
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)
  const descriptionTextRef = useRef(null)

  useLayoutEffect(() => {
    injectStyles()

    const ctx = gsap.context(() => {
      const imgs = imagesRef.current.filter(Boolean)

      const text1 = SplitText.create(text1Ref.current, { type: 'words' })
      const text2 = SplitText.create(text2Ref.current, { type: 'words' })
      const descriptionText = SplitText.create(descriptionTextRef.current, {
        type: 'words lines',
      })

      gsap.set([text1.words, text2.words, descriptionText.lines], {
        rotateX: 90,
        opacity: 0,
        transformPerspective: 1000,
        transformOrigin: '50% 100%',
        willChange: 'transform',
      })

      const tl = gsap.timeline()

      tl.fromTo(
        '#cappen-imgs-wrapper',
        { yPercent: 500 },
        { yPercent: 0, duration: 0.5, ease: 'cubic-bezier(0.25,1,0.5,1)' }
      )

      tl.to(
        [text1.words, text2.words, descriptionText.lines],
        { rotateX: 0, opacity: 1, stagger: 0.08, ease: 'cubic-bezier(0.25,1,0.5,1)' },
        '<+0.5'
      )

      imgs.forEach((img, i) => {
        tl.to(img, { zIndex: i, duration: 0.1, ease: 'cubic-bezier(0.25,1,0.5,1)' }, i * 0.2)
      })

      tl.to(
        descriptionText.lines,
        {
          rotateX: 90,
          transformOrigin: 'top center',
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'cubic-bezier(0.25,1,0.5,1)',
        },
        '<+0.2'
      )

      tl.to(
        imgs,
        {
          scale: (i) => 1 + i * 0.15,
          yPercent: (i) => -(i * 20),
          duration: 1,
          stagger: { each: 0.01, from: 'end' },
          ease: 'power3.inOut',
        },
        '<'
      )

      tl.to(
        imgs,
        {
          scale: 1,
          yPercent: (i, _, arr) => {
            const n = arr.length
            if (n === 1) return 0
            const totalSpread = 110 * (n - 1)
            return -totalSpread / 2 + i * 110
          },
          duration: 1,
          stagger: { each: 0.01, from: 'end' },
          ease: 'power3.inOut',
        },
        '+=0.2'
      )

      tl.to('#cappen-imgs-wrapper', { yPercent: 0, ease: 'cubic-bezier(0.25,1,0.5,1)' }, '<')

      tl.to(
        [text1.words, text2.words],
        {
          opacity: 0,
          duration: 0.5,
          rotateX: 90,
          transformOrigin: 'top center',
          stagger: 0.08,
          ease: 'cubic-bezier(0.25,1,0.5,1)',
        }
      )

      tl.to(
        imgs,
        {
          opacity: 0,
          duration: 0.8,
          stagger: { each: 0.08, from: 'end' },
          onComplete: () => {
            gsap.to(rootRef.current, {
              opacity: 0,
              duration: 0.5,
              ease: 'cubic-bezier(0.25,1,0.5,1)',
              onComplete: () => {
                gsap.set(rootRef.current, { display: 'none' })
              },
            })
          },
        },
        '<+0.2'
      )

      return () => {
        text1.revert()
        text2.revert()
        descriptionText.revert()
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="cappen-loader">
      <div className="cappen-loader__row">
        <p ref={text1Ref} className="cappen-loader__label">{label1}</p>

        <div id="cappen-imgs-wrapper" className="cappen-loader__imgs">
          {images.map((src, i) => (
            <div
              key={i}
              ref={(el) => (imagesRef.current[i] = el)}
              className="cappen-loader__img-slot"
            >
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        <p ref={text2Ref} className="cappen-loader__label">{label2}</p>
      </div>

      <p ref={descriptionTextRef} className="cappen-loader__desc">
        {description}
      </p>
    </section>
  )
}
