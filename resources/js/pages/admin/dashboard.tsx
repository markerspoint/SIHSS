import React, { useState, useEffect } from "react"
import { useForm, router, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/AppLayout"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Search,
  UserPlus,
  KeyRound,
  ShieldCheck,
  Stethoscope,
  Heart,
  ClipboardList,
  RefreshCw,
  CheckCircle2,
  Trash2,
} from "lucide-react"

interface Employee {
  id: number
  employee_id: string
  name: string
  role: 'admin' | 'doctor' | 'nurse' | 'jo'
  created_at: string
}

interface DashboardProps {
  employees: Employee[]
  filters: {
    search: string
  }
}

export default function Dashboard({ employees, filters }: DashboardProps) {
  const { props: pageProps } = usePage()
  const auth = pageProps.auth as unknown as { user: { id: number; name: string; employee_id: string; role: string } } | undefined
  const currentUser = auth?.user

  const [searchTerm, setSearchTerm] = useState(filters.search || "")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Form handling for new employee generation
  const createForm = useForm({
    employee_id: "",
    name: "",
    role: "jo",
    password: "",
  })

  // Form handling for password resetting
  const resetForm = useForm({
    password: "",
  })

  // Auto-generate random secure password (4 numbers and 1 letter)
  const generateRandomPassword = () => {
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
  const generateRandomEmployeeId = () => {
    const year = new Date().getFullYear()
    const rand = Math.floor(100 + Math.random() * 900)
    return `EMP-${year}-${rand}`
  }

  // Pre-fill generated password or auto-generate when modal opens
  useEffect(() => {
    if (isCreateOpen) {
      if (!createForm.data.password) {
        createForm.setData("password", generateRandomPassword())
      }
      if (!createForm.data.employee_id) {
        createForm.setData("employee_id", generateRandomEmployeeId())
      }
    }
  }, [isCreateOpen])

  // Handle live search with debounced effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      router.get(
        "/admin/dashboard",
        { search: searchTerm },
        {
          preserveState: true,
          replace: true,
        }
      )
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // Handle employee account generation submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let toastId: string | number = ""
    createForm.post("/admin/employees", {
      onStart: () => {
        toastId = toast.loading("Generating employee account...")
      },
      onSuccess: () => {
        toast.dismiss(toastId)
        setIsCreateOpen(false)
        createForm.reset()
        toast.success("Employee account generated successfully!")
      },
      onError: () => {
        toast.dismiss(toastId)
        toast.error("Failed to generate employee account.")
      },
    })
  }

  // Handle password reset submit
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee) return

    let toastId: string | number = ""
    resetForm.post(`/admin/employees/${selectedEmployee.id}/reset-password`, {
      onStart: () => {
        toastId = toast.loading("Resetting employee password...")
      },
      onSuccess: () => {
        toast.dismiss(toastId)
        setIsResetOpen(false)
        resetForm.reset()
        setSelectedEmployee(null)
        toast.success("Employee password reset successfully!")
      },
      onError: () => {
        toast.dismiss(toastId)
        toast.error("Failed to reset password.")
      },
    })
  }

  // Handle employee account deletion
  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee) return

    let toastId: string | number = ""
    router.delete(`/admin/employees/${selectedEmployee.id}`, {
      onStart: () => {
        toastId = toast.loading("Deleting employee account...")
      },
      onSuccess: () => {
        toast.dismiss(toastId)
        setIsDeleteOpen(false)
        setSelectedEmployee(null)
        toast.success("Employee account successfully deleted.")
      },
      onError: () => {
        toast.dismiss(toastId)
        toast.error("Failed to delete employee account.")
      },
    })
  }

  // Calculate high-fidelity stats cards values
  const totalStaff = employees.length
  const doctorsCount = employees.filter((e) => e.role === "doctor").length
  const nursesCount = employees.filter((e) => e.role === "nurse").length
  const joCount = employees.filter((e) => e.role === "jo").length

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800 border border-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
            Admin
          </span>
        )
      case "doctor":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
            <Stethoscope className="h-3.5 w-3.5 text-indigo-600" />
            Doctor
          </span>
        )
      case "nurse":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 border border-teal-100">
            <Heart className="h-3.5 w-3.5 text-teal-600" />
            Nurse
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

  return (
    <AppLayout breadcrumbs={[{ title: "Admin Console" }, { title: "Employee Registry" }]}>

      {/* Hero / Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Employee Accounts Registry
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage system roles, generate secure credentials, and perform password resets.
          </p>
        </div>

        {/* Generate Account Action Button */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="inline-flex items-center gap-2 rounded-xl bg-[#187e52] hover:bg-[#136642] text-white py-6 px-5 font-semibold shadow-md transition-all cursor-pointer">
              <UserPlus className="h-4.5 w-4.5" />
              Generate Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">Generate Employee Account</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs mt-1">
                Add a new staff member to the directory. Credentials will be activated instantly.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="employee_id" className="text-xs font-bold text-slate-600">Employee ID Number</Label>
                  <button
                    type="button"
                    onClick={() => createForm.setData("employee_id", generateRandomEmployeeId())}
                    className="flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </button>
                </div>
                <Input
                  id="employee_id"
                  required
                  placeholder="e.g. EMP-2026-009"
                  className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-sm"
                  value={createForm.data.employee_id}
                  onChange={(e) => createForm.setData("employee_id", e.target.value)}
                />
                {createForm.errors.employee_id && (
                  <p className="text-xs text-red-500 font-medium">{createForm.errors.employee_id}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-bold text-slate-600">Full Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="e.g. Jane Doe"
                  className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-sm"
                  value={createForm.data.name}
                  onChange={(e) => createForm.setData("name", e.target.value)}
                />
                {createForm.errors.name && (
                  <p className="text-xs text-red-500 font-medium">{createForm.errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="role" className="text-xs font-bold text-slate-600">System Access Role</Label>
                <Select
                  value={createForm.data.role}
                  onValueChange={(val) => createForm.setData("role", val)}
                >
                  <SelectTrigger id="role" className="rounded-xl border-slate-200 bg-slate-50/50 text-sm">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="jo">Job Order (Staff)</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="doctor">Medical Doctor</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
                {createForm.errors.role && (
                  <p className="text-xs text-red-500 font-medium">{createForm.errors.role}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-600">Initial Password</Label>
                  <button
                    type="button"
                    onClick={() => createForm.setData("password", generateRandomPassword())}
                    className="flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-950 font-bold"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </button>
                </div>
                <Input
                  id="password"
                  required
                  placeholder="Password"
                  className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white font-mono text-sm"
                  value={createForm.data.password}
                  onChange={(e) => createForm.setData("password", e.target.value)}
                />
                {createForm.errors.password && (
                  <p className="text-xs text-red-500 font-medium">{createForm.errors.password}</p>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl cursor-pointer"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createForm.processing}
                  className="rounded-xl bg-[#187e52] hover:bg-[#136642] text-white font-semibold cursor-pointer"
                >
                  Generate Account
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* STATISTICS CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card: Total Staff */}
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Staff</span>
            <h3 className="text-3xl font-extrabold text-slate-900">{totalStaff}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#187e52]">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card: Doctors */}
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doctors</span>
            <h3 className="text-3xl font-extrabold text-slate-900">{doctorsCount}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
            <Stethoscope className="h-6 w-6" />
          </div>
        </div>

        {/* Card: Nurses */}
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nurses</span>
            <h3 className="text-3xl font-extrabold text-slate-900">{nursesCount}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <Heart className="h-6 w-6" />
          </div>
        </div>

        {/* Card: Job Orders */}
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Orders</span>
            <h3 className="text-3xl font-extrabold text-slate-900">{joCount}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* SEARCH AND DIRECTORY TABLE SECTION */}
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Employee Directory
            <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-semibold">
              {employees.length} accounts
            </span>
          </h2>

          {/* Search Field */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name or ID..."
              className="pl-9 rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider uppercase border-b border-slate-100">
                <th className="py-3.5 px-4 font-semibold">Employee ID</th>
                <th className="py-3.5 px-4 font-semibold">Name</th>
                <th className="py-3.5 px-4 font-semibold">Access Role</th>
                <th className="py-3.5 px-4 font-semibold">Created Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-900 font-bold">{emp.employee_id}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">{emp.name}</td>
                    <td className="py-3.5 px-4">{getRoleBadge(emp.role)}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      {new Date(emp.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center gap-1 text-xs border-slate-200 hover:bg-slate-50 hover:text-emerald-800 rounded-lg cursor-pointer"
                        onClick={() => {
                          setSelectedEmployee(emp)
                          resetForm.setData("password", generateRandomPassword())
                          setIsResetOpen(true)
                        }}
                      >
                        <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                        Reset Password
                      </Button>
                      {currentUser?.id !== emp.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="inline-flex items-center gap-1 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-800 rounded-lg cursor-pointer"
                          onClick={() => {
                            setSelectedEmployee(emp)
                            setIsDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="max-w-[280px] mx-auto space-y-2">
                      <Users className="h-12 w-12 text-slate-300 mx-auto" />
                      <h3 className="font-bold text-slate-700">No employees found</h3>
                      <p className="text-xs text-slate-400">
                        Try searching for a different name/ID or generate a new employee account.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PASSWORD RESET DIALOG */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Reset Employee Password</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs mt-1">
              Overwrite the password for <span className="font-bold text-slate-800">{selectedEmployee?.name}</span> (ID: <span className="font-mono text-slate-800 font-bold">{selectedEmployee?.employee_id}</span>).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetSubmit} className="space-y-4 py-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="reset_password" className="text-xs font-bold text-slate-600">New Secure Password</Label>
                <button
                  type="button"
                  onClick={() => resetForm.setData("password", generateRandomPassword())}
                  className="flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-950 font-bold"
                >
                  <RefreshCw className="h-3 w-3" />
                  Regenerate
                </button>
              </div>
              <Input
                id="reset_password"
                required
                placeholder="New Password"
                className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white font-mono text-sm"
                value={resetForm.data.password}
                onChange={(e) => resetForm.setData("password", e.target.value)}
              />
              {resetForm.errors.password && (
                <p className="text-xs text-red-500 font-medium">{resetForm.errors.password}</p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl cursor-pointer"
                onClick={() => {
                  setIsResetOpen(false)
                  setSelectedEmployee(null)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={resetForm.processing}
                className="rounded-xl bg-emerald-800 hover:bg-emerald-950 text-white font-semibold cursor-pointer"
              >
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE ACCOUNT DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Employee Account
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs mt-1">
              Are you sure you want to delete the account for <span className="font-bold text-slate-800">{selectedEmployee?.name}</span> (ID: <span className="font-mono text-slate-800 font-bold">{selectedEmployee?.employee_id}</span>)?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-3 font-semibold leading-relaxed">
              ⚠️ Warning: This action is permanent and cannot be undone. All access permissions for this employee will be revoked immediately.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl cursor-pointer"
              onClick={() => {
                setIsDeleteOpen(false)
                setSelectedEmployee(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              className="rounded-xl bg-red-600 hover:bg-red-800 text-white font-semibold cursor-pointer"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
