import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET - Fetch all packages
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ packages: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new package
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Basic normalization and safe defaults so inserts don't fail
    const destination = (body.destination || '').toString().trim()
    const plan = (body.plan || '').toString().trim() // 'Custom Plan' | 'Fixed Plan' | 'Both'
    const tripType = body.tripType || (plan === 'Fixed Plan' ? 'group' : 'custom')
    const name = (body.name && body.name.toString().trim()) || (destination ? `${destination.charAt(0).toUpperCase() + destination.slice(1)} Itinerary` : '')
    const duration = body.duration || (body.days && body.nights ? `${body.days} days / ${body.nights} nights` : '')
    const price = body.price ?? body.fixedPricePerPerson ?? 0

    if (!destination) {
      return NextResponse.json({ error: 'destination is required' }, { status: 400 })
    }
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('packages')
      .insert([{
        name,
        destination,
        duration,
        price,
        original_price: body.originalPrice,
        description: body.description,
        highlights: body.highlights,
        includes: body.includes,
        category: body.category,
        status: body.status || 'Active',
        featured: body.featured || false,
        image: body.image || '/cards/1.jpg',
        route: body.route || '',
        nights: body.nights || 0,
        days: body.days || 0,
        trip_type: tripType
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ package: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
