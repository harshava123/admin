import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '../../../lib/supabaseServer.js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const destination = searchParams.get('destination')

    let query = supabaseServer
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by destination if provided
    if (destination && destination !== 'all') {
      query = query.eq('destination', destination)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabaseServer
      .from('leads')
      .select('*', { count: 'exact', head: true })

    if (destination && destination !== 'all') {
      countQuery = countQuery.eq('destination', destination)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Error counting leads:', countError)
    }

    return NextResponse.json({
      leads: data || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('Error in leads API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
