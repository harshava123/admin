import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET - Fetch a specific package by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ package: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a package
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('packages')
      .update({
        name: body.name,
        destination: body.destination,
        duration: body.duration,
        price: body.price,
        original_price: body.originalPrice,
        description: body.description,
        highlights: body.highlights,
        includes: body.includes,
        category: body.category,
        status: body.status,
        featured: body.featured,
        image: body.image,
        route: body.route,
        nights: body.nights,
        days: body.days,
        trip_type: body.tripType,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ package: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a package
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Package deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

