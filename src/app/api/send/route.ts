import { Resend } from "resend";
import { z } from "zod";

// Place RESEND_API_KEY and CONTACT_EMAIL in `.env.local` for local development
// and in your hosting provider's environment variables for production deployments.
// Example: CONTACT_EMAIL=sm.aniketraj@gmail.com
const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_RECIPIENT =
  process.env.CONTACT_EMAIL ??
  "aniketraj00384@gmail.com";
const SEND_AUTO_REPLY = false;

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const Email = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email({ message: "Email is invalid." }),
  message: z.string().trim().min(1, "Message is required."),
});

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "RESEND_API_KEY is not configured." }, { status: 500 });
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const {
      success: zodSuccess,
      data: zodData,
      error: zodError,
    } = Email.safeParse(body);
    if (!zodSuccess)
      return Response.json({ error: zodError?.message }, { status: 400 });

    const submittedAt = new Date().toISOString();

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [CONTACT_RECIPIENT],
      replyTo: zodData.email,
      subject: "New Portfolio Contact Request",
      text: [
        "Name:",
        zodData.name,
        "",
        "Email:",
        zodData.email,
        "",
        "Message:",
        zodData.message,
        "",
        "Submitted At:",
        submittedAt,
        "",
        "IP Address:",
        ip,
      ].join("\n"),
    });

    if (resendError) {
      console.error("Resend send error:", resendError);

      return Response.json(
        {
          error: resendError.message,
          details: resendError,
        },
        { status: 500 }
      );
    }

    // Enable this again after verifying a sending domain in Resend.
    if (SEND_AUTO_REPLY) {
      const { error: autoReplyError } = await resend.emails.send({
        from: "Aniket Raj <onboarding@resend.dev>",
        to: [zodData.email],
        subject: "Thank you for contacting Aniket Raj",
        text: [
          `Hi ${zodData.name},`,
          "",
          "Thank you for reaching out through my portfolio.",
          "",
          "I have successfully received your message and will get back to you as soon as possible.",
          "",
          "Best Regards,",
          "",
          "Aniket Raj",
          "Full Stack Developer | AI Engineer",
        ].join("\n"),
      });

      if (autoReplyError) {
        console.error("Auto reply error:", autoReplyError);

        return Response.json(
          {
            error: autoReplyError.message,
            details: autoReplyError,
          },
          { status: 500 }
        );
      }
    }

    return Response.json(resendData);
  } catch (error) {
    console.error("API Error:", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
