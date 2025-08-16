"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { WorkoutDataManager } from "@/lib/workout-data"

export function GoalsSummary() {
  const stats = useMemo(() => {
    const goals = WorkoutDataManager.getGoals()
    const total = goals.length
    const completed = goals.filter((g) => g.isCompleted).length
    const inProgress = goals.filter((g) => !g.isCompleted && new Date(g.deadline) >= new Date()).length
    const overdue = goals.filter((g) => !g.isCompleted && new Date(g.deadline) < new Date()).length

    const completionRate = total > 0 ? (completed / total) * 100 : 0

    // أهداف قريبة من الانتهاء (خلال أسبوع)
    const upcoming = goals.filter((g) => {
      if (g.isCompleted) return false
      const daysLeft = Math.ceil((new Date(g.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysLeft <= 7 && daysLeft >= 0
    })

    // أهداف قريبة من التحقيق (أكثر من 80%)
    const nearCompletion = goals.filter((g) => {
      if (g.isCompleted) return false
      const progress = g.targetValue > 0 ? (g.currentValue / g.targetValue) * 100 : 0
      return progress >= 80
    })

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate,
      upcoming,
      nearCompletion,
    }
  }, [])

  if (stats.total === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">لا توجد أهداف محددة بعد</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* إحصائيات عامة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <div className="text-lg font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">إجمالي الأهداف</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-lg font-bold">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">مكتملة</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-lg font-bold">{stats.inProgress}</div>
                <div className="text-xs text-muted-foreground">قيد التنفيذ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-lg font-bold">{stats.overdue}</div>
                <div className="text-xs text-muted-foreground">متأخرة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* معدل الإنجاز */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">معدل إنجاز الأهداف</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={stats.completionRate} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{stats.completionRate.toFixed(0)}% مكتمل</span>
              <span className="text-muted-foreground">
                {stats.completed} من {stats.total}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تنبيهات */}
      {(stats.upcoming.length > 0 || stats.nearCompletion.length > 0 || stats.overdue > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">تنبيهات مهمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.overdue > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm">لديك {stats.overdue} أهداف متأخرة</span>
              </div>
            )}

            {stats.upcoming.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm">{stats.upcoming.length} أهداف تنتهي خلال أسبوع</span>
              </div>
            )}

            {stats.nearCompletion.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{stats.nearCompletion.length} أهداف قريبة من التحقيق</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
