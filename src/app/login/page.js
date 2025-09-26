// client-side login form (simplified)
"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"

export default function  LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onLogin = async (e) => {
    e.preventDefault()
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) alert(res.error)
    else window.location.href = "/"
  }

  return (
    <form onSubmit={onLogin}>
      <input value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Log in</button>
    </form>
  )
}
