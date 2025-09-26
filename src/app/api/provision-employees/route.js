import { NextResponse } from 'next/server'
import { Client } from 'pg'

export async function GET() {
  const databaseUrl = process.env.SUPABASE_DB_URL
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: 'Missing SUPABASE_DB_URL' }, { status: 500 })
  }

  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    await client.query(`
      create table if not exists public.employees (
        id bigserial primary key,
        name text not null,
        email text,
        phone text,
        location text,
        role text default 'Agent',
        status text default 'Active',
        inserted_at timestamptz default now()
      );
    `)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  } finally {
    await client.end()
  }
}



