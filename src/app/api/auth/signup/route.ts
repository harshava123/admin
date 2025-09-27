import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()

    console.log('Signup attempt:', { name, email, role })

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

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseServer
      .from('employees')
      .select('id, email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user in employees table
    const { data: newUser, error: insertError } = await supabaseServer
      .from('employees')
      .insert({
        name,
        email,
        role: role === 'admin' ? 'Admin' : 'Agent', // Map to database role values
        status: 'Active',
        password_hash: passwordHash
      })
      .select('id, name, email, role, status')
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Generate token
    const token = Buffer.from(JSON.stringify({ 
      userId: newUser.id, 
      role: newUser.role.toLowerCase() 
    })).toString('base64')

    console.log('User created successfully:', { id: newUser.id, email: newUser.email, role: newUser.role })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role.toLowerCase()
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
