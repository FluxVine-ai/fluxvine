import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: Request) {
    const supabase = await createClient()

    // Check if a user's session exists
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    revalidatePath('/', 'layout')

    const { origin } = new URL(request.url)
    return NextResponse.redirect(`${origin}/login`, {
        status: 302,
    })
}
