'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

const NAV_DELAY_MS = 200
const BRAND_NAME = '\u898b\u7a4d\u8ffd\u5ba2\u304f\u3093'
const SIGN_OUT_LABEL = '\u30ed\u30b0\u30a2\u30a6\u30c8'

const MENU_ITEMS = [
  {
    name: '\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: '\u9867\u5ba2\u30ea\u30b9\u30c8',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    name: '\u898b\u7a4d\u4f5c\u6210',
    href: '/dashboard/create',
    icon: FileText,
  },
  {
    name: '\u8a2d\u5b9a',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPendingPath(null)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [pathname])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.button !== 0) {
      return
    }

    event.preventDefault()
    setPendingPath(href)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Delay navigation slightly so the selected tab state can appear instantly.
    timerRef.current = setTimeout(() => {
      router.push(href)
    }, NAV_DELAY_MS)
  }

  const activePath = pendingPath ?? pathname

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-green-600 text-white p-1 rounded">
            <FileText size={20} />
          </span>
          {BRAND_NAME}
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = activePath === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-green-50 text-green-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50 font-medium'
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <form action="/auth/signout" method="post">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 w-full transition-colors font-medium">
            <LogOut size={20} />
            {SIGN_OUT_LABEL}
          </button>
        </form>
      </div>
    </aside>
  )
}
