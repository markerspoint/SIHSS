import { useForm, router } from "@inertiajs/react"
import type React from "react";
import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { Employee } from "../types"
import { generateRandomPassword, generateRandomEmployeeId } from "../utils/helpers"

export function useAdminDashboard(initialSearch: string) {
  const [searchTerm, setSearchTerm] = useState(initialSearch || "")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Form handling for new employee generation
  const createForm = useForm<{
    employee_id: string
    name: string
    role: "admin" | "medical" | "jo"
    password: string
  }>({
    employee_id: "",
    name: "",
    role: "jo",
    password: "",
  })

  // Form handling for password resetting
  const resetForm = useForm({
    password: "",
  })

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

    if (!selectedEmployee) {
return
}

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

    if (!selectedEmployee) {
return
}

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

  return {
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
  }
}
