/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignUpForm } from '@/components/sign-up-form'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

jest.mock('@/lib/supabase/client')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('SignUpForm Integration', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  const mockSupabase = {
    auth: {
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue(mockRouter as any)
    mockCreateClient.mockReturnValue(mockSupabase as any)
  })

  it('should sign up user with valid credentials', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' }, session: null },
      error: null,
    } as any)

    render(<SignUpForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/repeat password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.stringContaining('/daily'),
        },
      })
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/sign-up-success')
    })
  })

  it('should show error when passwords do not match', async () => {
    render(<SignUpForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/repeat password/i), {
      target: { value: 'different' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })

    expect(mockSupabase.auth.signUp).not.toHaveBeenCalled()
  })

  it('should show error on failed signup', async () => {
    const errorObj = Object.assign(new Error('User already exists'), { message: 'User already exists' })
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: errorObj,
    } as any)

    render(<SignUpForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/repeat password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument()
    })
  })

  it('should handle OAuth signup', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      data: { provider: 'google', url: 'https://oauth.url' },
      error: null,
    } as any)

    render(<SignUpForm />)

    const googleButton = screen.getByRole('button', { name: /google/i })
    fireEvent.click(googleButton)

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/confirm?next=/daily'),
        },
      })
    })
  })
})