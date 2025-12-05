import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * Create a Supabase service-role client on demand with safety checks.
 * This avoids crashing during build/dev when env vars are missing.
 */
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase service client missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  return createClient(url, serviceKey)
}

export async function POST(request) {
  let supabaseAdmin
  try {
    supabaseAdmin = getServiceClient()
  } catch (err) {
    console.error('notify-officials: missing Supabase envs', err?.message || err)
    return NextResponse.json(
      { error: 'Server not configured for notifications' },
      { status: 500 }
    )
  }

  try {
    const { reportId, reporterUserId, municipality, issueType, reporterName } = await request.json()

    if (!reportId || !reporterUserId || !municipality || !issueType) {
      return NextResponse.json({ error: 'Missing required notification data' }, { status: 400 })
    }

    // 1) Find city officials in the specified municipality
    const { data: officials, error: officialsError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'city_official')
      .eq('municipality', municipality)

    if (officialsError) {
      console.error('notify-officials: fetch officials error', officialsError)
      return NextResponse.json({ error: 'Failed to fetch officials' }, { status: 500 })
    }

    if (officials && officials.length > 0) {
      // 2) Create notifications for each official
      const notificationInserts = officials.map((official) => ({
        user_id: official.id,
        type: 'new_report',
        title: `New Report in ${municipality}`,
        message: `A new report (${issueType}) has been submitted by ${reporterName || 'a resident'} in your municipality.`,
        link: `/dashboard-admin/reports?reportId=${reportId}`,
        is_read: false,
      }))

      const { error: notificationError } = await supabaseAdmin.from('notifications').insert(notificationInserts)

      if (notificationError) {
        console.error('notify-officials: insert notifications error', notificationError)
        return NextResponse.json({ error: 'Failed to insert notifications' }, { status: 500 })
      }

      console.log(`Notifications sent to ${officials.length} city officials for report ${reportId}.`)
      return NextResponse.json({ message: 'Notifications sent successfully' }, { status: 200 })
    }

    console.log(`No city officials found in ${municipality} to notify for report ${reportId}.`)
    return NextResponse.json({ message: 'No officials to notify' }, { status: 200 })
  } catch (error) {
    console.error('notify-officials: unexpected error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

