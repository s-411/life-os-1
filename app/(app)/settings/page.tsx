'use client'

import { useState, useEffect } from 'react'
import { useProfile } from '@/lib/hooks/useProfile'
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
import type { ProfileUpdate } from '@/types'
import { TIMEZONES } from '@/lib/constants/timezones'
import { formatDateInTimezone, getBrowserTimezone } from '@/lib/utils/date'

export default function SettingsPage() {
  const { profile, loading, error, updateProfile } = useProfile()
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const [formData, setFormData] = useState({
    bmr: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    height: '',
    weight: '',
    timezone: '',
    first_name: '',
  })

  const [currentTimePreview, setCurrentTimePreview] = useState('')

  // Load profile data into form when it's available
  useEffect(() => {
    if (profile) {
      const tz = profile.timezone || getBrowserTimezone()
      setFormData({
        bmr: profile.bmr?.toString() || '',
        gender: (profile.gender as 'male' | 'female' | 'other') || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        timezone: tz,
        first_name: profile.first_name || '',
      })
    }
  }, [profile])

  // Update time preview when timezone changes
  useEffect(() => {
    if (formData.timezone) {
      const updatePreview = () => {
        const preview = formatDateInTimezone(
          new Date(),
          formData.timezone,
          'EEEE, MMMM d, yyyy h:mm:ss a zzz'
        )
        setCurrentTimePreview(preview)
      }
      updatePreview()
      const interval = setInterval(updatePreview, 1000)
      return () => clearInterval(interval)
    }
  }, [formData.timezone])

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    // Reset form to current profile data
    if (profile) {
      setFormData({
        bmr: profile.bmr?.toString() || '',
        gender: (profile.gender as 'male' | 'female' | 'other') || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        timezone: profile.timezone || '',
        first_name: profile.first_name || '',
      })
    }
    setNotification(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setNotification(null)

    try {
      // Validate numeric fields
      const bmr = formData.bmr ? parseInt(formData.bmr) : undefined
      const height = formData.height ? parseFloat(formData.height) : undefined
      const weight = formData.weight ? parseFloat(formData.weight) : undefined

      if (bmr && (isNaN(bmr) || bmr <= 0)) {
        throw new Error('BMR must be a positive number')
      }
      if (height && (isNaN(height) || height <= 0)) {
        throw new Error('Height must be a positive number')
      }
      if (weight && (isNaN(weight) || weight <= 0)) {
        throw new Error('Weight must be a positive number')
      }

      const updates: ProfileUpdate = {
        bmr,
        gender: formData.gender || undefined,
        height,
        weight,
        timezone: formData.timezone || undefined,
        first_name: formData.first_name || undefined,
      }

      await updateProfile(updates)
      setNotification({ type: 'success', message: 'Profile updated successfully!' })

      // Auto-dismiss success notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update profile',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-2xl py-10">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-2xl py-10">
        <p className="text-red-500">Error loading profile: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <CardDescription>Manage your health profile and personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* First Name */}
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                />
              </div>

              {/* Gender */}
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.gender}
                  onChange={(e) =>
                    handleChange('gender', e.target.value as 'male' | 'female' | 'other')
                  }
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Height */}
              <div className="grid gap-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                />
              </div>

              {/* Weight */}
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                />
              </div>

              {/* BMR */}
              <div className="grid gap-2">
                <Label htmlFor="bmr">BMR (Basal Metabolic Rate)</Label>
                <Input
                  id="bmr"
                  type="number"
                  placeholder="2000"
                  value={formData.bmr}
                  onChange={(e) => handleChange('bmr', e.target.value)}
                />
              </div>

              {/* Timezone */}
              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                {currentTimePreview && (
                  <p className="text-sm text-muted-foreground">
                    Current time: <span className="font-medium">{currentTimePreview}</span>
                  </p>
                )}
              </div>

              {/* Notification */}
              {notification && (
                <div
                  className={`rounded-lg p-4 ${
                    notification.type === 'success'
                      ? 'bg-green-50 text-green-900'
                      : 'bg-red-50 text-red-900'
                  }`}
                >
                  {notification.message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}