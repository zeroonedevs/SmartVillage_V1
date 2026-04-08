import { NextResponse } from 'next/server';
import { getMailConfigurationStatus, createMailTransport } from '../../../../lib/mail';

/**
 * GET /api/health/mail — env presence only (safe).
 * GET /api/health/mail?verify=1 — SMTP verify(); requires header x-mail-health-secret: MAIL_HEALTH_SECRET
 */
export async function GET(request) {
  const status = getMailConfigurationStatus();
  const { searchParams } = new URL(request.url);
  const verify = searchParams.get('verify') === '1';
  const secret = request.headers.get('x-mail-health-secret');
  const expected = process.env.MAIL_HEALTH_SECRET;

  if (!verify) {
    return NextResponse.json({
      ok: status.configured,
      mail: status,
    });
  }

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!status.configured) {
    return NextResponse.json(
      {
        ok: false,
        mail: status,
        verify: { ok: false, error: 'Mail env not configured' },
      },
      { status: 503 }
    );
  }

  try {
    const transport = createMailTransport();
    await transport.verify();
    return NextResponse.json({
      ok: true,
      mail: status,
      verify: { ok: true },
    });
  } catch (err) {
    console.error('[mail health verify]', err);
    return NextResponse.json(
      {
        ok: false,
        mail: status,
        verify: {
          ok: false,
          code: err.code,
          message: err.message,
        },
      },
      { status: 503 }
    );
  }
}
