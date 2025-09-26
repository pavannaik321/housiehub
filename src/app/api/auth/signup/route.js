// app/api/auth/signup/route.ts
import prisma from "../../../../../lib/prismadb"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { Resend } from "resend" // optional: only if you use Resend

const resend = new Resend(process.env.RESEND_API_KEY) // optional

export async function POST(req) {
  const { email, password, name } = await req.json()
  if (!email || !password) return new Response("Missing", { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return new Response("User exists", { status: 400 })

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, name, password: hashed, emailVerified: null },
  })

  // create verification token (using the VerificationRequest table defined earlier)
  const token = uuidv4()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
  await prisma.verificationRequest.create({
    data: { identifier: email, token, expires },
  })

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`

  // send email — example with Resend (replace or remove if you use another provider)
  await resend.emails.send({
    from: "Auth <no-reply@yourapp.com>",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
  })

  return new Response("ok", { status: 201 })
}
