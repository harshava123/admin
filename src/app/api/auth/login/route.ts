import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    console.log('Login attempt:', { email, password: password ? '***' : 'missing' })

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user in employees table
    const { data: user, error: userError } = await supabaseServer
      .from('employees')
      .select('id, name, email, role, status, password_hash')
      .eq('email', email)
      .eq('status', 'Active')
      .single()

    if (userError || !user) {
      console.log('User not found or inactive:', userError?.message)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = Buffer.from(JSON.stringify({ 
      userId: user.id, 
      role: user.role.toLowerCase() 
    })).toString('base64')

    console.log('Login successful:', { id: user.id, email: user.email, role: user.role })

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase()
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}