// app/api/auth/verify/route.ts
// import prisma from "@/lib/prismadb"
import prisma from "../../../../../lib/prismadb"

export async function GET(req) {
  const url = new URL(req.url)
  const token = url.searchParams.get("token")
  if (!token) return new Response("Invalid", { status: 400 })

  const vr = await prisma.verificationRequest.findUnique({ where: { token } })
  if (!vr || vr.expires < new Date()) {
    return new Response("Token expired or invalid", { status: 400 })
  }

  // mark user verified
  await prisma.user.update({
    where: { email: vr.identifier },
    data: { emailVerified: new Date() },
  })

  // optionally delete the token
  await prisma.verificationRequest.deleteMany({ where: { token } })

  // redirect to login page
  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?verified=1`)
}
