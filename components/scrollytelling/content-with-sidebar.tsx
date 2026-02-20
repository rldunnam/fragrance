import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ContentWithSidebarProps {
  children: ReactNode
  sidebar?: ReactNode
  className?: string
}

/**
 * Two-column layout: primary content (left) + optional metric sidebar (right).
 * Stacks on mobile.
 */
export function ContentWithSidebar({
  children,
  sidebar,
  className,
}: ContentWithSidebarProps) {
  return (
    <div className={cn("flex flex-col lg:flex-row gap-8 lg:gap-12", className)}>
      <div className="flex-1 min-w-0">{children}</div>
      {sidebar && (
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
          {sidebar}
        </aside>
      )}
    </div>
  )
}
