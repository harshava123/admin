import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_EXP_SECONDS = 60 * 60 * 24; // 24h

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Fetch employee by email
    const { data: employees, error } = await supabase
      .from('employees')
      .select('id, name, email, role, status, password_hash')
      .eq('email', email)
      .limit(1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const emp = employees && employees[0]
    if (!emp) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (emp.status !== 'Active') {
      return NextResponse.json({ error: 'Account is not active' }, { status: 403 })
    }

    const ok = await bcrypt.compare(password, emp.password_hash || '')
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Missing JWT_SECRET' }, { status: 500 })
    }

    const token = jwt.sign(
      { sub: emp.id, name: emp.name, email: emp.email, role: emp.role },
      secret,
      { expiresIn: JWT_EXP_SECONDS }
    )

    // Return token in body; optionally set cookie (HttpOnly) for session
    return NextResponse.json({
      ok: true,
      token,
      user: { id: emp.id, name: emp.name, email: emp.email, role: emp.role }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}
