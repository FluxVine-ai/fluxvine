import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: "Skill Engine API is active." });
}
