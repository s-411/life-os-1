/**
 * BMR (Basal Metabolic Rate) Calculation Service
 * Uses the Mifflin-St Jeor equation
 */

export type Gender = 'male' | 'female' | 'other'

export interface BMRInput {
  age: number
  gender: Gender
  height: number // in cm
  weight: number // in kg
}

/**
 * Calculate BMR using the Mifflin-St Jeor equation
 *
 * Formula:
 * - Male: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
 * - Female: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
 * - Other: Uses average of male/female calculations
 *
 * @param input - BMR calculation parameters
 * @returns Calculated BMR in calories per day
 */
export function calculateBMR(input: BMRInput): number {
  const { age, gender, height, weight } = input

  // Validate inputs
  if (age <= 0 || height <= 0 || weight <= 0) {
    throw new Error('Age, height, and weight must be positive numbers')
  }

  // Base calculation: (10 × weight) + (6.25 × height) - (5 × age)
  const base = (10 * weight) + (6.25 * height) - (5 * age)

  switch (gender) {
    case 'male':
      return Math.round(base + 5)
    case 'female':
      return Math.round(base - 161)
    case 'other':
      // Average of male and female calculations
      const maleResult = base + 5
      const femaleResult = base - 161
      return Math.round((maleResult + femaleResult) / 2)
    default:
      throw new Error(`Invalid gender: ${gender}`)
  }
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * @param bmr - Basal Metabolic Rate
 * @param activityLevel - Activity multiplier (1.2 = sedentary, 1.375 = light, 1.55 = moderate, 1.725 = active, 1.9 = very active)
 * @returns Total daily calorie expenditure
 */
export function calculateTDEE(bmr: number, activityLevel: number = 1.2): number {
  if (activityLevel < 1 || activityLevel > 2.5) {
    throw new Error('Activity level must be between 1 and 2.5')
  }
  return Math.round(bmr * activityLevel)
}