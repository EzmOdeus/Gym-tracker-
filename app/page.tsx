"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, TrendingUp, Target, Plus, BarChart3, FileText } from "lucide-react"
import { WorkoutDataManager, type Workout } from "@/lib/workout-data"
import WorkoutForm from "@/components/workout-form"
import WorkoutList from "@/components/workout-list"
import { ProgressCharts } from "@/components/progress-charts"
import { WorkoutStats } from "@/components/workout-stats"
import { GoalsManager } from "@/components/goals-manager"
import { GoalsSummary } from "@/components/goals-summary"
import { ReportsInsights } from "@/components/reports-insights"
import InstallPrompt from "@/components/install-prompt"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration)
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError)
          })
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <InstallPrompt />

      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-heading">نظام تتبع الأداء</h1>
                <p className="text-sm text-muted-foreground">صالة الألعاب الرياضية</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setActiveTab("workouts")}>
              <Plus className="h-4 w-4 ml-2" />
              تمرين جديد
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {[
              { id: "dashboard", label: "لوحة المعلومات", icon: BarChart3 },
              { id: "workouts", label: "التمارين", icon: Dumbbell },
              { id: "progress", label: "التطور", icon: TrendingUp },
              { id: "goals", label: "الأهداف", icon: Target },
              { id: "reports", label: "التقارير والنصائح", icon: FileText },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "workouts" && <WorkoutsView />}
        {activeTab === "progress" && <ProgressView />}
        {activeTab === "goals" && <GoalsView />}
        {activeTab === "reports" && <ReportsView />}
      </main>
    </div>
  )
}

function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Dynamic Stats */}
      <WorkoutStats />

      {/* Goals Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الأهداف</CardTitle>
          <CardDescription>نظرة سريعة على تقدمك نحو أهدافك</CardDescription>
        </CardHeader>
        <CardContent>
          <GoalsSummary />
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>التمارين الأخيرة</CardTitle>
          <CardDescription>آخر التمارين التي قمت بها</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkoutList onEditWorkout={() => {}} refreshTrigger={0} />
        </CardContent>
      </Card>
    </div>
  )
}

function WorkoutsView() {
  const [showForm, setShowForm] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | undefined>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSaveWorkout = (workout: Workout) => {
    WorkoutDataManager.saveWorkout(workout)
    setShowForm(false)
    setEditingWorkout(undefined)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingWorkout(undefined)
  }

  if (showForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{editingWorkout ? "تعديل التمرين" : "تمرين جديد"}</h2>
        </div>
        <WorkoutForm onSave={handleSaveWorkout} onCancel={handleCancelForm} editingWorkout={editingWorkout} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">التمارين</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          تمرين جديد
        </Button>
      </div>
      <WorkoutList onEditWorkout={handleEditWorkout} refreshTrigger={refreshTrigger} />
    </div>
  )
}

function ProgressView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">تقدم الأداء</h2>
      </div>
      <ProgressCharts />
    </div>
  )
}

function GoalsView() {
  return <GoalsManager />
}

function ReportsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">التقارير والنصائح</h2>
      </div>
      <ReportsInsights />
    </div>
  )
}
