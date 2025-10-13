import { NextRequest } from 'next/server'
import { sendEmailSimple } from '@/lib/sendEmailSimple'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = 'iad1'

function sseFormat(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const to = searchParams.get('to') || process.env.NEXT_PUBLIC_FALLBACK_EMAIL || ''
    const subject = searchParams.get('subject') || 'New Contact Submission - Jet Ride Rentals'
    const text = searchParams.get('text') || undefined
    const html = searchParams.get('html') || (text ? `<pre>${text}</pre>` : '<div>Jet Ride Rentals</div>')

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder()
        const send = (payload: unknown) => controller.enqueue(encoder.encode(sseFormat(payload)))

        send({ step: 'init', ts: new Date().toISOString() })

        if (!to) {
          send({ step: 'error', message: 'Missing recipient email (to)', ts: new Date().toISOString() })
          controller.close()
          return
        }

        send({ step: 'validate', ok: true, ts: new Date().toISOString() })
        send({ step: 'prepare', provider: 'resend', ts: new Date().toISOString() })

        // Small heartbeat to keep connection alive while preparing
        send({ step: 'heartbeat', ts: new Date().toISOString() })

        try {
          send({ step: 'attempt', attempt: 1, ts: new Date().toISOString() })
          await sendEmailSimple({ to, subject, html, text })
          send({ step: 'success', message: 'Email sent', ts: new Date().toISOString() })
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          send({ step: 'error', message, ts: new Date().toISOString() })
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    return new Response(sseFormat({ step: 'error', message: 'Failed to start stream' }), {
      headers: { 'Content-Type': 'text/event-stream' },
      status: 500,
    })
  }
}


