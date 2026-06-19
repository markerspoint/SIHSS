import { router } from "@inertiajs/react"
import { ChevronsUpDownIcon, BadgeCheckIcon, BellIcon, LogOutIcon, UserIcon } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    employee_id: string
    role: string
    avatar?: string
  }
}) {
  const { isMobile } = useSidebar()

  const handleLogout = () => {
    router.post('/logout')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const formatRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator'
      case 'medical':
        return 'Medical Staff'
      case 'jo':
        return 'Job Order Staff'
      default:
        return role.toUpperCase()
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-emerald-700 text-white rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-slate-700">{user.name}</span>
                <span className="truncate text-xs text-slate-500 font-mono">ID: {user.employee_id}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4 text-slate-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-emerald-700 text-white rounded-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-slate-800">{user.name}</span>
                  <span className="truncate text-xs text-slate-500 font-medium">{formatRole(user.role)}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4 text-slate-500" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <BellIcon className="mr-2 h-4 w-4 text-slate-500" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
