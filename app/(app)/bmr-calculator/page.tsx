'use client'

import { useState } from 'react'
import { calculateBMR, type BMRInput } from '@/src/lib/services/calculations'
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

export default function BMRCalculatorPage() {
  const [formData, setFormData] = useState<BMRInput>({
    age: 0,
    gender: 'male',
    height: 0,
    weight: 0,
  })
  const [bmrResult, setBmrResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof BMRInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear result when inputs change
    setBmrResult(null)
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const result = calculateBMR(formData)
      setBmrResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate BMR')
    }
  }

  const handleUseThisBMR = () => {
    if (bmrResult) {
      // Store in localStorage to prefill profile form
      localStorage.setItem(
        'bmr_prefill',
        JSON.stringify({
          bmr: bmrResult,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
        })
      )
      // Navigate back to profile setup
      window.location.href = '/onboarding/profile-setup'
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">BMR Calculator</CardTitle>
          <CardDescription>
            Calculate your Basal Metabolic Rate - the number of calories your body needs at rest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCalculate}>
            <div className="flex flex-col gap-6">
              {/* Gender */}
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value as 'male' | 'female' | 'other')}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div className="grid gap-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  required
                  value={formData.age || ''}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Height */}
              <div className="grid gap-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  placeholder="170"
                  required
                  value={formData.height || ''}
                  onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
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
                  required
                  value={formData.weight || ''}
                  onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full">
                Calculate BMR
              </Button>

              {bmrResult !== null && (
                <div className="rounded-lg bg-primary/10 p-4">
                  <h3 className="text-lg font-semibold">Your BMR Result</h3>
                  <p className="mt-2 text-3xl font-bold text-primary">
                    {bmrResult} <span className="text-base font-normal">calories/day</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This is the number of calories your body needs to maintain basic functions at rest.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleUseThisBMR} className="flex-1">
                      Use This BMR
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href="/onboarding/profile-setup">Back to Profile</Link>
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground">
                <p>Formula: Mifflin-St Jeor Equation</p>
                <p className="mt-1">
                  Male: (10 × weight) + (6.25 × height) - (5 × age) + 5
                </p>
                <p>Female: (10 × weight) + (6.25 × height) - (5 × age) - 161</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}