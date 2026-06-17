import * as React from "react"
import { usePage, Link } from "@inertiajs/react"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Users,
  FileText,
  Settings,
  ClipboardList,
  History,
  HeartPulse,
  Package,
  Syringe,
  UserPlus,
  Layers,
  Activity,
  ShieldCheck,
  Building2,
} from "lucide-react"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<any>
  isActive?: boolean
  comingSoon?: boolean
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  // Access Inertia share data
  const { props: pageProps } = usePage()
  const auth = pageProps.auth as unknown as { user: { name: string; employee_id: string; role: string } } | undefined
  const user = auth?.user || { name: "Guest User", employee_id: "0000", role: "jo" }

  // Define sidebar menu configurations based on roles
  const getNavItems = (role: string): { label: string; items: NavItem[] } => {
    switch (role) {
      case 'admin':
        return {
          label: "Administrator Console",
          items: [
            {
              title: "Employee Registry",
              url: "/admin/dashboard",
              icon: Users,
              isActive: true,
            },
            {
              title: "Audit Logs",
              url: "#",
              icon: FileText,
              comingSoon: true,
            },
            {
              title: "System Settings",
              url: "#",
              icon: Settings,
              comingSoon: true,
            },
          ],
        }
      case 'doctor':
        return {
          label: "Medical Portal",
          items: [
            {
              title: "Patient Consultations",
              url: "#",
              icon: ClipboardList,
              isActive: true,
            },
            {
              title: "Consultation History",
              url: "#",
              icon: History,
            },
          ],
        }
      case 'nurse':
        return {
          label: "Nursing Station",
          items: [
            {
              title: "Triage Desk",
              url: "#",
              icon: HeartPulse,
              isActive: true,
            },
            {
              title: "Inventory Control",
              url: "#",
              icon: Package,
            },
            {
              title: "Vaccination Logs",
              url: "#",
              icon: Syringe,
            },
          ],
        }
      case 'jo':
      default:
        return {
          label: "Job Order Portal",
          items: [
            {
              title: "Patient Registration",
              url: "#",
              icon: UserPlus,
              isActive: true,
            },
            {
              title: "Queue Registry",
              url: "#",
              icon: Layers,
            },
          ],
        }
    }
  }

  const navSection = getNavItems(user.role)

  const handleComingSoon = (e: React.MouseEvent, comingSoon?: boolean) => {
    if (comingSoon) {
      e.preventDefault()
      alert("This module is coming soon!")
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white" {...props}>
      {/* Brand Header */}
      <SidebarHeader className="border-b border-slate-100 py-4 px-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00472e] text-white shadow-md shrink-0">
            <Building2 className="h-5 w-5 text-amber-400" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col text-left animate-in fade-in duration-200">
              <span className="text-sm font-extrabold tracking-tight text-[#00472e]">SIHSS Portal</span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-semibold">City Health Office</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Main Dynamic Role Menu */}
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-slate-400 tracking-widest uppercase">
            {navSection.label}
          </SidebarGroupLabel>
          <SidebarMenu className="mt-1 space-y-1 px-1">
            {navSection.items.map((item) => {
              const IconComponent = item.icon
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      item.isActive
                        ? "bg-emerald-50 text-[#187e52] hover:bg-emerald-50 hover:text-[#187e52]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    onClick={(e) => handleComingSoon(e, item.comingSoon)}
                  >
                    {item.comingSoon ? (
                      <a href={item.url}>
                        <IconComponent className={`h-4 w-4 shrink-0 ${item.isActive ? "text-[#187e52]" : "text-slate-400"}`} />
                        <span className="flex-1">{item.title}</span>
                        <span className="text-[8px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">Soon</span>
                      </a>
                    ) : (
                      <Link href={item.url}>
                        <IconComponent className={`h-4 w-4 shrink-0 ${item.isActive ? "text-[#187e52]" : "text-slate-400"}`} />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer Profile */}
      <SidebarFooter className="border-t border-slate-100 p-2">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
