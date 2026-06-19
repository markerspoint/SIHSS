import { ShieldCheck, Stethoscope, ClipboardList } from "lucide-react"
import React from "react"

// Auto-generate random secure password (4 numbers and 1 letter)
export const generateRandomPassword = () => {
  const numbers = "0123456789"
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let pass = ""

  for (let i = 0; i < 4; i++) {
    pass += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }

  pass += letters.charAt(Math.floor(Math.random() * letters.length))

  return pass
}

// Auto-generate random Employee ID
export const generateRandomEmployeeId = () => {
  const year = new Date().getFullYear()
  const rand = Math.floor(100 + Math.random() * 900)

  return `EMP-${year}-${rand}`
}

export const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800 border border-slate-200">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
          Admin
        </span>
      )
    case "medical":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
          <Stethoscope className="h-3.5 w-3.5 text-indigo-600" />
          Medical
        </span>
      )
    case "jo":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100">
          <ClipboardList className="h-3.5 w-3.5 text-amber-600" />
          Job Order
        </span>
      )
  }
}
