'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Life OS</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}