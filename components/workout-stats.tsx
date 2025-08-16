"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Calendar, Weight, Repeat, Clock, Target } from "lucide-react"
import { WorkoutDataManager } from "@/lib/workout-data"

export function WorkoutStats() {
  const stats = useMemo(() => {
    const workouts = WorkoutDataManager.getWorkouts()
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // إحصائيات الشهر الحالي
    const thisMonthWorkouts = workouts.filter((w) => {
      const date = new Date(w.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // إحصائيات الشهر الماضي
    const lastMonthWorkouts = workouts.filter((w) => {
      const date = new Date(w.date)
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    })

    const thisMonthWeight = thisMonthWorkouts.reduce(
      (sum, w) => sum + w.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0),
      0,
    )
    const lastMonthWeight = lastMonthWorkouts.reduce(
      (sum, w) => sum + w.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0),
      0,
    )

    const thisMonthSets = thisMonthWorkouts.reduce((sum, w) => sum + w.sets.length, 0)
    const lastMonthSets = lastMonthWorkouts.reduce((sum, w) => sum + w.sets.length, 0)

    const thisMonthDuration = thisMonthWorkouts.reduce((sum, w) => sum + w.duration, 0)
    const lastMonthDuration = lastMonthWorkouts.reduce((sum, w) => sum + w.duration, 0)

    // حساب النسب المئوية للتغيير
    const workoutChange =
      lastMonthWorkouts.length > 0
        ? ((thisMonthWorkouts.length - lastMonthWorkouts.length) / lastMonthWorkouts.length) * 100
        : 0

    const weightChange = lastMonthWeight > 0 ? ((thisMonthWeight - lastMonthWeight) / lastMonthWeight) * 100 : 0

    const setsChange = lastMonthSets > 0 ? ((thisMonthSets - lastMonthSets) / lastMonthSets) * 100 : 0

    const durationChange =
      lastMonthDuration > 0 ? ((thisMonthDuration - lastMonthDuration) / lastMonthDuration) * 100 : 0

    // أهداف شهرية افتراضية
    const monthlyGoals = {
      workouts: 12, // 3 تمارين في الأسبوع
      weight: 5000, // 5000 كجم شهرياً
      duration: 600, // 10 ساعات شهرياً
    }

    return {
      thisMonth: {
        workouts: thisMonthWorkouts.length,
        weight: thisMonthWeight,
        sets: thisMonthSets,
        duration: thisMonthDuration,
      },
      changes: {
        workouts: workoutChange,
        weight: weightChange,
        sets: setsChange,
        duration: durationChange,
      },
      goals: monthlyGoals,
      progress: {
        workouts: Math.min((thisMonthWorkouts.length / monthlyGoals.workouts) * 100, 100),
        weight: Math.min((thisMonthWeight / monthlyGoals.weight) * 100, 100),
        duration: Math.min((thisMonthDuration / monthlyGoals.duration) * 100, 100),
      },
    }
  }, [])

  const formatChange = (change: number) => {
    if (Math.abs(change) < 0.1) return { icon: Minus, text: "0%", color: "text-muted-foreground" }
    if (change > 0) return { icon: TrendingUp, text: `+${change.toFixed(1)}%`, color: "text-green-600" }
    return { icon: TrendingDown, text: `${change.toFixed(1)}%`, color: "text-red-600" }
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات الشهر الحالي */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تمارين هذا الشهر</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth.workouts}</div>
            <div className="flex items-center gap-1 text-xs">
              {(() => {
                const change = formatChange(stats.changes.workouts)
                const Icon = change.icon
                return (
                  <>
                    <Icon className={`h-3 w-3 ${change.color}`} />
                    <span className={change.color}>{change.text}</span>
                    <span className="text-muted-foreground">من الشهر الماضي</span>
                  </>
                )
              })()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الوزن المرفوع</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth.weight.toLocaleString()} كجم</div>
            <div className="flex items-center gap-1 text-xs">
              {(() => {
                const change = formatChange(stats.changes.weight)
                const Icon = change.icon
                return (
                  <>
                    <Icon className={`h-3 w-3 ${change.color}`} />
                    <span className={change.color}>{change.text}</span>
                    <span className="text-muted-foreground">من الشهر الماضي</span>
                  </>
                )
              })()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المجموعات</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth.sets}</div>
            <div className="flex items-center gap-1 text-xs">
              {(() => {
                const change = formatChange(stats.changes.sets)
                const Icon = change.icon
                return (
                  <>
                    <Icon className={`h-3 w-3 ${change.color}`} />
                    <span className={change.color}>{change.text}</span>
                    <span className="text-muted-foreground">من الشهر الماضي</span>
                  </>
                )
              })()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">وقت التمرين</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.thisMonth.duration / 60)} ساعة</div>
            <div className="flex items-center gap-1 text-xs">
              {(() => {
                const change = formatChange(stats.changes.duration)
                const Icon = change.icon
                return (
                  <>
                    <Icon className={`h-3 w-3 ${change.color}`} />
                    <span className={change.color}>{change.text}</span>
                    <span className="text-muted-foreground">من الشهر الماضي</span>
                  </>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تقدم الأهداف الشهرية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            تقدم الأهداف الشهرية
          </CardTitle>
          <CardDescription>مدى تقدمك نحو تحقيق أهدافك لهذا الشهر</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">عدد التمارين</span>
              <span className="text-sm text-muted-foreground">
                {stats.thisMonth.workouts} / {stats.goals.workouts}
              </span>
            </div>
            <Progress value={stats.progress.workouts} className="h-2" />
            <div className="text-xs text-muted-foreground">{stats.progress.workouts.toFixed(0)}% مكتمل</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">الوزن المرفوع</span>
              <span className="text-sm text-muted-foreground">
                {stats.thisMonth.weight.toLocaleString()} / {stats.goals.weight.toLocaleString()} كجم
              </span>
            </div>
            <Progress value={stats.progress.weight} className="h-2" />
            <div className="text-xs text-muted-foreground">{stats.progress.weight.toFixed(0)}% مكتمل</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">وقت التمرين</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(stats.thisMonth.duration / 60)} / {Math.round(stats.goals.duration / 60)} ساعة
              </span>
            </div>
            <Progress value={stats.progress.duration} className="h-2" />
            <div className="text-xs text-muted-foreground">{stats.progress.duration.toFixed(0)}% مكتمل</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
