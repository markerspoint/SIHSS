import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

interface AppLayoutProps {
  children: React.ReactNode
  breadcrumbs?: { title: string; url?: string }[]
}

export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#f8fafc]">
          {/* Header Area */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-100 bg-white px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-700 cursor-pointer" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bg-slate-200"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                      SIHSS Portal
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  
                  {breadcrumbs && breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      <BreadcrumbSeparator className="hidden md:block text-slate-300 text-xs" />
                      <BreadcrumbItem>
                        {crumb.url && idx < breadcrumbs.length - 1 ? (
                          <BreadcrumbLink href={crumb.url} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                            {crumb.title}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="text-xs font-bold text-emerald-800">
                            {crumb.title}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                  
                  {(!breadcrumbs || breadcrumbs.length === 0) && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block text-slate-300 text-xs" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-xs font-bold text-emerald-800">Dashboard</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Core Content Viewport */}
          <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
