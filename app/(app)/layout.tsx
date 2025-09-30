'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/navigation/Sidebar'
import BottomNav from '@/components/navigation/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] text-[#e5e5e5]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e5e5e5]">
      {/* Desktop: Sidebar Navigation (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Desktop: Header Navigation Alternative (optional - commented out by default, use Sidebar instead) */}
      {/* <div className="hidden md:block">
        <Header />
      </div> */}

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile: Bottom Navigation (shown only on mobile) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}