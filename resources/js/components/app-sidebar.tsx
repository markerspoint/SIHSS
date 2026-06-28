import { usePage, Link } from "@inertiajs/react"
import {
  Users,
  FileText,
  Settings,
  HeartPulse,
  UserPlus,
  Layers,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react"
import * as React from "react"
import { NavUser } from "@/components/nav-user"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<any>
  isActive?: boolean
  comingSoon?: boolean
  items?: {
    title: string
    url: string
    isActive?: boolean
  }[]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  // Access Inertia share data
  const { props: pageProps, url: currentUrl } = usePage()
  const user = (pageProps.auth as any)?.user || { name: "Guest User", employee_id: "0000", role: "jo" }

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
      case 'medical':
      case 'jo':
        const modules = user.accessible_modules || [];
        const medicalItems: NavItem[] = [
          {
            title: "Dashboard",
            url: "/medical/dashboard",
            icon: LayoutDashboard,
          },
        ];

        if (user.role === 'admin' || modules.includes('mental_health')) {
          medicalItems.push({
            title: "Mental Health",
            url: "#",
            icon: HeartPulse,
            items: [
              {
                title: "Geotagging",
                url: "/medical/geotagging",
              },
              {
                title: "Patients Tagged",
                url: "/medical/patients-tagged",
              },
              {
                title: "Patient Records",
                url: "/medical/patient-records",
              },
            ],
          });
        }

        if (user.role === 'admin' || modules.includes('pharmacy_inventory')) {
          medicalItems.push({
            title: "Pharmacy Inventory",
            url: "#",
            icon: Layers,
            comingSoon: true,
          });
        }

        return {
          label: "Medical Portal",
          items: medicalItems,
        }
      default:
        return {
          label: "Medical Portal",
          items: [],
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
      <SidebarHeader className="border-b border-slate-100 py-4 px-3 group-data-[state=collapsed]:px-1.5">
        <div className="flex items-center gap-3 group-data-[state=collapsed]:gap-0 group-data-[state=collapsed]:justify-center transition-all duration-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden bg-white shadow-sm border border-slate-100 p-0.5 shrink-0">
            <img
              src="/img/logo.png"
              alt="SIHSS Logo"
              className="h-full w-full object-contain"
            />
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
              const isItemActive = item.url !== "#" && (currentUrl === item.url || currentUrl.startsWith(item.url))
              const isCollapsibleOpen = item.items?.some(s => s.url !== "#" && (currentUrl === s.url || currentUrl.startsWith(s.url))) || item.isActive

              if (item.items && item.items.length > 0) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isCollapsibleOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <IconComponent className="h-4 w-4 shrink-0 text-slate-400" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-slate-400" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-7 border-l border-slate-100 pl-3 space-y-1">
                          {item.items.map((subItem) => {
                            const isSubActive = subItem.url !== "#" && (currentUrl === subItem.url || currentUrl.startsWith(subItem.url))

                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link 
                                    href={subItem.url}
                                    className={`block py-1 text-xs font-medium transition-colors cursor-pointer ${
                                      isSubActive 
                                        ? "text-[#187e52] font-semibold" 
                                        : "text-slate-500 hover:text-slate-900"
                                    }`}
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isItemActive
                        ? "bg-emerald-50 text-[#187e52] hover:bg-emerald-50 hover:text-[#187e52]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    onClick={(e) => handleComingSoon(e, item.comingSoon)}
                  >
                    {item.comingSoon ? (
                      <a href={item.url}>
                        <IconComponent className={`h-4 w-4 shrink-0 ${isItemActive ? "text-[#187e52]" : "text-slate-400"}`} />
                        <span className="flex-1">{item.title}</span>
                        <span className="text-[8px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">Soon</span>
                      </a>
                    ) : (
                      <Link href={item.url}>
                        <IconComponent className={`h-4 w-4 shrink-0 ${isItemActive ? "text-[#187e52]" : "text-slate-400"}`} />
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
