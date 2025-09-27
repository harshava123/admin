import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (!['admin', 'employee'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or employee' },
        { status: 400 }
      )
    }

    // TODO: Implement proper user creation logic
    // For now, we'll create a simple mock user creation
    // In production, you should:
    // 1. Check if user already exists
    // 2. Hash password using bcrypt
    // 3. Store user in database
    // 4. Generate JWT tokens
    // 5. Send verification email

    // Mock user creation - replace with actual database insertion
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(JSON.stringify({ userId: newUser.id, role: newUser.role })).toString('base64')

    return NextResponse.json({
      success: true,
      token,
      user: newUser
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
