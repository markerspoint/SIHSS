import { Head, usePage, Link } from "@inertiajs/react"
import {
  HeartPulse,
  MapPin,
  FileText,
  Calendar,
  Map,
  PlusCircle,
  Activity,
  ArrowRight,
} from "lucide-react"
import React from "react"
import { Card } from "@/components/ui/card"
import AppLayout from "@/layouts/AppLayout"
import type { PatientRecord } from "@/types/geotag-types"

interface ConditionStat {
  condition: string
  count: number
}

interface DashboardProps {
  stats: {
    totalTagged: number
    activeCases: number
    totalRecords: number
  }
  recentTags: PatientRecord[]
  conditionsData: ConditionStat[]
}

export default function MedicalDashboard() {
  const { props } = usePage()
  const { stats, recentTags, conditionsData } = props as unknown as DashboardProps
  
  const auth = (props.auth as any) || {}
  const user = auth.user || { name: "Medical Practitioner", employee_id: "0000" }

  // Custom greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) {
return "Good morning"
}

    if (hour < 18) {
return "Good afternoon"
}

    return "Good evening"
  }

  // Calculate percentages for condition breakdown
  const totalConditionsCount = conditionsData.reduce((acc, curr) => acc + curr.count, 0) || 1

  return (
    <>
      <Head title="Medical Dashboard" />
      <AppLayout breadcrumbs={[{ title: "Medical Portal" }, { title: "Dashboard" }]}>
        
        {/* Welcome Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              {getGreeting()}, <span className="text-[#187e52]">{user.name}</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage local mental health case registries, geotag client locations, and track treatment histories.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs bg-slate-100/80 border border-slate-200/50 rounded-xl px-3 py-2 text-slate-600 font-semibold self-start md:self-auto shadow-sm">
            <Calendar className="h-4 w-4 text-[#187e52]" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* MENTAL HEALTH STATS TILES */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card: Total Geotagged */}
          <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Geotagged Patients</span>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats?.totalTagged ?? 0}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
              <MapPin className="h-6 w-6" />
            </div>
          </Card>

          {/* Card: Active Cases */}
          <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Cases</span>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats?.activeCases ?? 0}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <HeartPulse className="h-6 w-6" />
            </div>
          </Card>

          {/* Card: Case Files */}
          <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Records</span>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats?.totalRecords ?? 0}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#187e52] border border-emerald-100">
              <FileText className="h-6 w-6" />
            </div>
          </Card>
        </div>

        {/* WORKSPACE & OVERVIEW */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Recent Geotags Table */}
          <Card className="md:col-span-2 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#187e52]" />
                    Recently Geotagged Patients
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">Latest records pinned on the Sipalay City map.</p>
                </div>
                <Link
                  href="/medical/patient-records"
                  className="inline-flex items-center gap-1.5 text-xs text-[#187e52] hover:text-[#136642] font-semibold transition-colors"
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {recentTags && recentTags.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                        <th className="py-2.5 px-3">Patient Name</th>
                        <th className="py-2.5 px-3">Condition</th>
                        <th className="py-2.5 px-3">Address</th>
                        <th className="py-2.5 px-3 text-right">Date Tagged</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {recentTags.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-900">{t.name}</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-100">
                              {t.condition}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500">{t.address}</td>
                          <td className="py-3 px-3 text-right text-slate-400 font-mono text-[10px]">
                            {new Date(t.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Map className="h-12 w-12 text-[#187e52] mx-auto opacity-70" />
                  <h3 className="font-bold text-slate-700 text-sm">Spatial registry map is empty</h3>
                  <p className="text-xs text-slate-400 max-w-[320px] mx-auto leading-relaxed">
                    Start adding mental health client entries and tags to populate patient locations over Sipalay City zones.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Side Panels: Breakdown & Quick Actions */}
          <div className="space-y-6">
            
            {/* Condition Breakdown Panel */}
            <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                Condition Breakdown
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Distribution of mental health disorders in registered clients.
              </p>

              <div className="space-y-4 pt-2">
                {conditionsData && conditionsData.length > 0 ? (
                  conditionsData.map((c, i) => {
                    const percentage = Math.round((c.count / totalConditionsCount) * 100);
                    // Cycle colors
                    const barColors = ["bg-[#187e52]", "bg-indigo-600", "bg-teal-600", "bg-amber-500", "bg-rose-500"];
                    const barColor = barColors[i % barColors.length];

                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span className="truncate max-w-[170px]">{c.condition}</span>
                          <span className="text-slate-500 font-mono">{c.count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No records to compute distribution.</p>
                )}
              </div>
            </Card>

            {/* Quick Actions Panel */}
            <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-[#187e52]" />
                Quick Actions
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Register clients, perform assessments, and view spatial maps.
              </p>

              <div className="space-y-3 pt-2">
                <Link 
                  href="/medical/geotagging"
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/85 border border-slate-100 rounded-xl text-left text-xs text-slate-700 font-bold shadow-sm transition-all cursor-pointer"
                >
                  <MapPin className="h-4.5 w-4.5 text-teal-600" />
                  Open Geotagging Desk
                </Link>
                
                <Link 
                  href="/medical/patients-tagged"
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/85 border border-slate-100 rounded-xl text-left text-xs text-slate-700 font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Map className="h-4.5 w-4.5 text-indigo-600" />
                  View Spatial Tagged Map
                </Link>
                
                <Link 
                  href="/medical/patient-records"
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/85 border border-slate-100 rounded-xl text-left text-xs text-slate-700 font-bold shadow-sm transition-all cursor-pointer"
                >
                  <FileText className="h-4.5 w-4.5 text-[#187e52]" />
                  Open Patient Records
                </Link>
              </div>
            </Card>

          </div>

        </div>

      </AppLayout>
    </>
  )
}
