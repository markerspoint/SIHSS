import { usePage } from "@inertiajs/react"
import {
  Users,
  Search,
  UserPlus,
  KeyRound,
  ClipboardList,
  RefreshCw,
  Trash2,
  Eye,
  Stethoscope,
} from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AppLayout from "@/layouts/AppLayout"

import { useAdminDashboard } from "./hooks/useAdminDashboard"
import type { DashboardProps } from "./types"
import { getRoleBadge, generateRandomPassword, generateRandomEmployeeId } from "./utils/helpers"

export default function Dashboard({ employees, filters }: DashboardProps) {
  const { props: pageProps } = usePage()
  const auth = pageProps.auth as unknown as { user: { id: number; name: string; employee_id: string; role: string } } | undefined
  const currentUser = auth?.user

  const {
    searchTerm,
    setSearchTerm,
    isCreateOpen,
    setIsCreateOpen,
    isResetOpen,
    setIsResetOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    isViewOpen,
    setIsViewOpen,
    selectedEmployee,
    setSelectedEmployee,
    createForm,
    resetForm,
    handleCreateSubmit,
    handleResetSubmit,
    handleDeleteSubmit,
  } = useAdminDashboard(filters.search)

  // Calculate high-fidelity stats cards values
  const totalStaff = employees.length
  const medicalCount = employees.filter((e) => e.role === "medical").length
  const joCount = employees.filter((e) => e.role === "jo").length

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
                  onValueChange={(val) => createForm.setData("role", val as "admin" | "medical" | "jo")}
                >
                  <SelectTrigger id="role" className="rounded-xl border-slate-200 bg-slate-50/50 text-sm">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="jo">Job Order (Staff)</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
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
      <div className="grid gap-4 sm:grid-cols-3">
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

        {/* Card: Medical Staff */}
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Medical Staff</span>
            <h3 className="text-3xl font-extrabold text-slate-900">{medicalCount}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
            <Stethoscope className="h-6 w-6" />
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
                          setIsViewOpen(true)
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        View
                      </Button>
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

      {/* VIEW DETAILS DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Employee Profile</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs mt-1">
              Detailed metadata and role permissions.
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-6 py-4">
              {/* Profile Avatar and Name */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#187e52] font-bold text-xl border border-emerald-100">
                  {selectedEmployee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900 leading-tight">{selectedEmployee.name}</h4>
                  <div>{getRoleBadge(selectedEmployee.role)}</div>
                </div>
              </div>

              {/* Data list */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                  <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Employee ID</span>
                  <span className="font-mono text-slate-900 font-bold bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                    {selectedEmployee.employee_id}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                  <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Email Address</span>
                  <span className="text-slate-800 font-semibold">
                    {selectedEmployee.email || (
                      <span className="text-slate-400 italic font-medium">No email linked</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                  <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Created Date</span>
                  <span className="text-slate-800 font-semibold">
                    {new Date(selectedEmployee.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {selectedEmployee.updated_at && (
                  <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Last Updated</span>
                    <span className="text-slate-800 font-semibold">
                      {new Date(selectedEmployee.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              className="rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-semibold cursor-pointer w-full py-5"
              onClick={() => {
                setIsViewOpen(false)
                setSelectedEmployee(null)
              }}
            >
              Close Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
