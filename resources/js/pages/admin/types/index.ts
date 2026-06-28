export interface Employee {
  id: number
  employee_id: string
  name: string
  role: 'admin' | 'medical' | 'jo'
  email?: string | null
  accessible_modules?: string[]
  created_at: string
  updated_at?: string
}

export interface DashboardProps {
  employees: Employee[]
  filters: {
    search: string
  }
}
