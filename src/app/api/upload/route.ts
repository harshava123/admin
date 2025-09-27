import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getEnv(name: string): string {
	const value = process.env[name]
	if (!value) {
		throw new Error(`Missing required env var: ${name}`)
	}
	return value
}

export async function POST(request: Request) {
	try {
		const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL')
		const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')
		const bucket = process.env.SUPABASE_PUBLIC_BUCKET || 'city-assets'
		
		console.log('Upload API - Supabase URL:', supabaseUrl ? 'SET' : 'MISSING')
		console.log('Upload API - Service Key:', serviceKey ? 'SET' : 'MISSING')
		console.log('Upload API - Bucket:', bucket)

		const form = await request.formData()
		const file = form.get('file') as File | null
		const slug = (form.get('slug') as string | null) || 'common'
		const folder = (form.get('folder') as string | null) || 'hero'

		if (!file) {
			return NextResponse.json({ error: 'file is required' }, { status: 400 })
		}

		const supabase = createClient(supabaseUrl, serviceKey)

		// Ensure deterministic path: folder/slug/timestamp-filename
		const timestamp = Date.now()
		const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'upload'
		const path = `${folder}/${slug}/${timestamp}-${safeName}`
		
		console.log('Upload API - File:', file.name, 'Size:', file.size, 'Type:', file.type)
		console.log('Upload API - Path:', path)

		const arrayBuffer = await file.arrayBuffer()
		const { error: uploadError } = await supabase.storage
			.from(bucket)
			.upload(path, Buffer.from(arrayBuffer), {
				upsert: true,
				contentType: file.type || 'application/octet-stream'
			})

		if (uploadError) {
			console.log('Upload API - Upload error:', uploadError)
			return NextResponse.json({ error: uploadError.message }, { status: 500 })
		}

		const { data } = supabase.storage.from(bucket).getPublicUrl(path)
		console.log('Upload API - Success! URL:', data.publicUrl)
		return NextResponse.json({ ok: true, url: data.publicUrl, path })
	} catch (e: any) {
		return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
	}
}


