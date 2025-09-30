/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { UpdatePasswordForm } from '@/components/update-password-form'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

jest.mock('@/lib/supabase/client')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('Password Reset Integration', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  const mockSupabase = {
    auth: {
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue(mockRouter as any)
    mockCreateClient.mockReturnValue(mockSupabase as any)
  })

  describe('ForgotPasswordForm', () => {
    it('should send password reset email', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      } as any)

      render(<ForgotPasswordForm />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /send reset email/i }))

      await waitFor(() => {
        expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
          'test@example.com',
          {
            redirectTo: expect.stringContaining('/auth/update-password'),
          }
        )
        expect(screen.getByText(/check your email/i)).toBeInTheDocument()
      })
    })

    it('should show error on failed password reset', async () => {
      const errorObj = Object.assign(new Error('Invalid email'), { message: 'Invalid email' })
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: errorObj,
      } as any)

      render(<ForgotPasswordForm />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalid@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /send reset email/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
      })
    })
  })

  describe('UpdatePasswordForm', () => {
    it('should update user password', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      } as any)

      render(<UpdatePasswordForm />)

      fireEvent.change(screen.getByLabelText(/new password/i), {
        target: { value: 'newpassword123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /save new password/i }))

      await waitFor(() => {
        expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
          password: 'newpassword123',
        })
        expect(mockRouter.push).toHaveBeenCalledWith('/daily')
      })
    })

    it('should show error on failed password update', async () => {
      const errorObj = Object.assign(new Error('Password too weak'), { message: 'Password too weak' })
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: null },
        error: errorObj,
      } as any)

      render(<UpdatePasswordForm />)

      fireEvent.change(screen.getByLabelText(/new password/i), {
        target: { value: '123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /save new password/i }))

      await waitFor(() => {
        expect(screen.getByText(/password too weak/i)).toBeInTheDocument()
      })

      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })
})