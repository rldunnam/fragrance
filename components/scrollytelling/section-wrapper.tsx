"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
  /** Whether this is a full-bleed section or contained */
  variant?: "contained" | "full"
  /** Background style override */
  bgClassName?: string
}

export function SectionWrapper({
  id,
  children,
  className,
  variant = "contained",
  bgClassName,
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = el.querySelectorAll(".scroll-reveal")
            reveals.forEach((reveal, i) => {
              setTimeout(() => {
                reveal.classList.add("revealed")
              }, i * 120)
            })
          }
        })
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "relative",
        bgClassName,
        className
      )}
    >
      <div
        className={cn(
          variant === "contained" &&
            "mx-auto max-w-[1200px] px-6 py-20 md:py-28 lg:py-32 lg:px-8"
        )}
      >
        {children}
      </div>
    </section>
  )
}
