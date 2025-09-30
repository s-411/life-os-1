'use client'

import { ProfileSetupWizard } from '@/components/onboarding/ProfileSetupWizard'

export default function ProfileSetupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <ProfileSetupWizard className="w-full max-w-lg" />
    </div>
  )
}