import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET - Fetch packages filtered by city slug (matches destination ILIKE '%city%')
export async function GET(request, { params }) {
  try {
    const { city } = params
    if (!city) {
      return NextResponse.json({ error: 'city is required' }, { status: 400 })
    }

    const pattern = `%${city}%`
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .ilike('destination', pattern)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ packages: data || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



