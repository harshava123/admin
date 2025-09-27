import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // TODO: Implement proper authentication logic
    // For now, we'll create a simple mock authentication
    // In production, you should:
    // 1. Hash passwords using bcrypt
    // 2. Verify credentials against database
    // 3. Generate JWT tokens
    // 4. Implement proper session management

    // Mock user data - replace with actual database query
    const mockUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@travloger.com',
        password: 'admin123', // In production, this should be hashed
        role: 'admin'
      },
      {
        id: '2',
        name: 'Employee User',
        email: 'employee@travloger.com',
        password: 'employee123', // In production, this should be hashed
        role: 'employee'
      }
    ]

    const user = mockUsers.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(JSON.stringify({ userId: user.id, role: user.role })).toString('base64')

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}