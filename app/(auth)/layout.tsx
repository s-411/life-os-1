export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Life OS</h1>
        <p className="mt-2 text-muted-foreground">Your personal health tracking system</p>
      </div>
      {children}
    </div>
  )
}