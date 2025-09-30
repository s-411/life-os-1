'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ProfileFormData {
  bmr: string
  gender: 'male' | 'female' | 'other' | ''
  height: string
  weight: string
  timezone: string
}

export function ProfileSetupWizard({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    bmr: '',
    gender: '',
    height: '',
    weight: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('No authenticated user found')
      }

      // Validate required fields
      if (!formData.bmr || !formData.gender || !formData.height || !formData.weight) {
        throw new Error('Please fill in all required fields')
      }

      // Validate numeric fields
      const bmr = parseInt(formData.bmr)
      const height = parseFloat(formData.height)
      const weight = parseFloat(formData.weight)

      if (isNaN(bmr) || bmr <= 0) {
        throw new Error('BMR must be a positive number')
      }
      if (isNaN(height) || height <= 0) {
        throw new Error('Height must be a positive number')
      }
      if (isNaN(weight) || weight <= 0) {
        throw new Error('Weight must be a positive number')
      }

      // Insert profile data
      const { error: insertError } = await supabase.from('profiles').upsert({
        id: user.id,
        bmr,
        gender: formData.gender,
        height,
        weight,
        timezone: formData.timezone,
      })

      if (insertError) {
        throw insertError
      }

      // Redirect to daily page
      router.push('/daily')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Set Up Your Profile</CardTitle>
          <CardDescription>
            Tell us about yourself to personalize your health tracking experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Gender */}
              <div className="grid gap-2">
                <Label htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <select
                  id="gender"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.gender}
                  onChange={(e) =>
                    handleChange('gender', e.target.value as 'male' | 'female' | 'other')
                  }
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Height */}
              <div className="grid gap-2">
                <Label htmlFor="height">
                  Height (cm) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  placeholder="170"
                  required
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                />
              </div>

              {/* Weight */}
              <div className="grid gap-2">
                <Label htmlFor="weight">
                  Weight (kg) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  placeholder="70"
                  required
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                />
              </div>

              {/* BMR */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bmr">
                    BMR (Basal Metabolic Rate) <span className="text-red-500">*</span>
                  </Label>
                  <Link
                    href="/bmr-calculator"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Calculate BMR
                  </Link>
                </div>
                <Input
                  id="bmr"
                  type="number"
                  placeholder="2000"
                  required
                  value={formData.bmr}
                  onChange={(e) => handleChange('bmr', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your BMR is the number of calories your body needs at rest
                </p>
              </div>

              {/* Timezone */}
              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  readOnly
                />
                <p className="text-xs text-muted-foreground">
                  Automatically detected from your browser
                </p>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}