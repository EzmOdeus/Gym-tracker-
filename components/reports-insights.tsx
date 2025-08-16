"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertCircle, Target, Calendar, Lightbulb, BarChart3, Award, Zap } from "lucide-react"
import { WorkoutDataManager, defaultExercises } from "@/lib/workout-data"

export function ReportsInsights() {
  const analysis = useMemo(() => {
    const workouts = WorkoutDataManager.getWorkouts()
    const goals = WorkoutDataManager.getGoals()

    if (workouts.length === 0) {
      return {
        weeklyReport: null,
        monthlyReport: null,
        insights: [],
        recommendations: [],
      }
    }

    // تحليل الأسبوع الحالي
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

    const thisWeekWorkouts = workouts.filter((w) => {
      const workoutDate = new Date(w.date)
      return workoutDate >= weekStart && workoutDate < weekEnd
    })

    // تحليل الشهر الحالي
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const thisMonthWorkouts = workouts.filter((w) => {
      const workoutDate = new Date(w.date)
      return workoutDate >= monthStart && workoutDate <= monthEnd
    })

    // تحليل الشهر الماضي للمقارنة
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const lastMonthWorkouts = workouts.filter((w) => {
      const workoutDate = new Date(w.date)
      return workoutDate >= lastMonthStart && workoutDate <= lastMonthEnd
    })

    // حساب الإحصائيات
    const weeklyStats = calculateStats(thisWeekWorkouts)
    const monthlyStats = calculateStats(thisMonthWorkouts)
    const lastMonthStats = calculateStats(lastMonthWorkouts)

    // تحليل التقدم
    const insights = generateInsights(workouts, goals, monthlyStats, lastMonthStats)
    const recommendations = generateRecommendations(workouts, goals, monthlyStats)

    return {
      weeklyReport: {
        period: `${weekStart.toLocaleDateString("ar-SA")} - ${weekEnd.toLocaleDateString("ar-SA")}`,
        stats: weeklyStats,
        workouts: thisWeekWorkouts,
      },
      monthlyReport: {
        period: `${monthStart.toLocaleDateString("ar-SA", { month: "long", year: "numeric" })}`,
        stats: monthlyStats,
        lastMonthStats,
        workouts: thisMonthWorkouts,
      },
      insights,
      recommendations,
    }
  }, [])

  if (!analysis.weeklyReport) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">لا توجد بيانات كافية</h3>
          <p className="text-muted-foreground">ابدأ بإضافة تمارين لرؤية التقارير والتحليلات</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* التقرير الأسبوعي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            التقرير الأسبوعي
          </CardTitle>
          <CardDescription>{analysis.weeklyReport.period}</CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyReport report={analysis.weeklyReport} />
        </CardContent>
      </Card>

      {/* التقرير الشهري */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            التقرير الشهري
          </CardTitle>
          <CardDescription>{analysis.monthlyReport.period}</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyReport report={analysis.monthlyReport} />
        </CardContent>
      </Card>

      {/* الرؤى والتحليلات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            رؤى وتحليلات
          </CardTitle>
          <CardDescription>تحليل ذكي لأدائك وتقدمك</CardDescription>
        </CardHeader>
        <CardContent>
          <InsightsList insights={analysis.insights} />
        </CardContent>
      </Card>

      {/* التوصيات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            توصيات لتحسين الأداء
          </CardTitle>
          <CardDescription>نصائح مخصصة لتحقيق أهدافك</CardDescription>
        </CardHeader>
        <CardContent>
          <RecommendationsList recommendations={analysis.recommendations} />
        </CardContent>
      </Card>
    </div>
  )
}

function calculateStats(workouts: any[]) {
  const totalWorkouts = workouts.length
  const totalWeight = workouts.reduce(
    (sum, w) => sum + w.sets.reduce((setSum: number, set: any) => setSum + set.weight * set.reps, 0),
    0,
  )
  const totalSets = workouts.reduce((sum, w) => sum + w.sets.length, 0)
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0)
  const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0

  // تحليل العضلات المدربة
  const muscleGroups = workouts.reduce(
    (acc, workout) => {
      workout.sets.forEach((set: any) => {
        const exercise = defaultExercises.find((e) => e.id === set.exerciseId)
        if (exercise) {
          exercise.muscleGroups.forEach((muscle) => {
            acc[muscle] = (acc[muscle] || 0) + 1
          })
        }
      })
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalWorkouts,
    totalWeight,
    totalSets,
    totalDuration,
    avgDuration,
    muscleGroups,
  }
}

function generateInsights(workouts: any[], goals: any[], monthlyStats: any, lastMonthStats: any) {
  const insights = []

  // مقارنة الأداء الشهري
  if (lastMonthStats.totalWorkouts > 0) {
    const workoutChange =
      ((monthlyStats.totalWorkouts - lastMonthStats.totalWorkouts) / lastMonthStats.totalWorkouts) * 100
    const weightChange = ((monthlyStats.totalWeight - lastMonthStats.totalWeight) / lastMonthStats.totalWeight) * 100

    if (workoutChange > 10) {
      insights.push({
        type: "positive",
        title: "تحسن ملحوظ في التكرار",
        description: `زادت تماريك بنسبة ${workoutChange.toFixed(0)}% مقارنة بالشهر الماضي`,
        icon: TrendingUp,
      })
    } else if (workoutChange < -10) {
      insights.push({
        type: "warning",
        title: "انخفاض في التكرار",
        description: `قلت تماريك بنسبة ${Math.abs(workoutChange).toFixed(0)}% مقارنة بالشهر الماضي`,
        icon: TrendingDown,
      })
    }

    if (weightChange > 15) {
      insights.push({
        type: "positive",
        title: "تطور قوي في الأوزان",
        description: `زاد إجمالي الوزن المرفوع بنسبة ${weightChange.toFixed(0)}%`,
        icon: Award,
      })
    }
  }

  // تحليل الأهداف
  const activeGoals = goals.filter((g) => !g.isCompleted)
  const nearCompletionGoals = activeGoals.filter((g) => (g.currentValue / g.targetValue) * 100 >= 80)

  if (nearCompletionGoals.length > 0) {
    insights.push({
      type: "positive",
      title: "أهداف قريبة من التحقيق",
      description: `لديك ${nearCompletionGoals.length} أهداف قريبة من التحقيق`,
      icon: Target,
    })
  }

  // تحليل توازن العضلات
  const muscleGroups = Object.entries(monthlyStats.muscleGroups)
  if (muscleGroups.length > 0) {
    const maxMuscle = muscleGroups.reduce((a, b) => (a[1] > b[1] ? a : b))
    const minMuscle = muscleGroups.reduce((a, b) => (a[1] < b[1] ? a : b))

    if (maxMuscle[1] > minMuscle[1] * 2) {
      insights.push({
        type: "warning",
        title: "عدم توازن في التمارين",
        description: `تركز كثيراً على ${maxMuscle[0]} وتهمل ${minMuscle[0]}`,
        icon: AlertCircle,
      })
    }
  }

  return insights
}

function generateRecommendations(workouts: any[], goals: any[], monthlyStats: any) {
  const recommendations = []

  // توصيات بناءً على التكرار
  if (monthlyStats.totalWorkouts < 8) {
    recommendations.push({
      category: "التكرار",
      title: "زيادة عدد التمارين",
      description: "حاول الوصول إلى 3-4 تمارين أسبوعياً لنتائج أفضل",
      priority: "high",
    })
  }

  // توصيات بناءً على المدة
  if (monthlyStats.avgDuration < 30) {
    recommendations.push({
      category: "المدة",
      title: "إطالة مدة التمرين",
      description: "زيادة مدة التمرين إلى 45-60 دقيقة لتحقيق أقصى استفادة",
      priority: "medium",
    })
  }

  // توصيات بناءً على الأهداف
  const overdueGoals = goals.filter((g) => !g.isCompleted && new Date(g.deadline) < new Date())
  if (overdueGoals.length > 0) {
    recommendations.push({
      category: "الأهداف",
      title: "مراجعة الأهداف المتأخرة",
      description: "قم بمراجعة وتعديل الأهداف المتأخرة لتكون أكثر واقعية",
      priority: "high",
    })
  }

  // توصيات عامة للتحسين
  recommendations.push({
    category: "التطوير",
    title: "تنويع التمارين",
    description: "جرب تمارين جديدة لتجنب الملل وتحفيز عضلات مختلفة",
    priority: "low",
  })

  recommendations.push({
    category: "الراحة",
    title: "أهمية الراحة",
    description: "تأكد من أخذ يوم راحة بين التمارين المكثفة للسماح للعضلات بالتعافي",
    priority: "medium",
  })

  return recommendations
}

function WeeklyReport({ report }: { report: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{report.stats.totalWorkouts}</div>
          <div className="text-sm text-muted-foreground">تمارين</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{report.stats.totalWeight.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">كجم مرفوع</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{report.stats.totalSets}</div>
          <div className="text-sm text-muted-foreground">مجموعة</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{Math.round(report.stats.totalDuration / 60)}</div>
          <div className="text-sm text-muted-foreground">ساعة</div>
        </div>
      </div>

      {report.workouts.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">تمارين هذا الأسبوع:</h4>
          {report.workouts.map((workout: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="font-medium">{workout.name}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(workout.date).toLocaleDateString("ar-SA")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MonthlyReport({ report }: { report: any }) {
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{report.stats.totalWorkouts}</div>
          <div className="text-sm text-muted-foreground">تمارين</div>
          {report.lastMonthStats.totalWorkouts > 0 && (
            <div className="text-xs text-muted-foreground">
              {calculateChange(report.stats.totalWorkouts, report.lastMonthStats.totalWorkouts) > 0 ? "+" : ""}
              {calculateChange(report.stats.totalWorkouts, report.lastMonthStats.totalWorkouts).toFixed(0)}%
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{report.stats.totalWeight.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">كجم مرفوع</div>
          {report.lastMonthStats.totalWeight > 0 && (
            <div className="text-xs text-muted-foreground">
              {calculateChange(report.stats.totalWeight, report.lastMonthStats.totalWeight) > 0 ? "+" : ""}
              {calculateChange(report.stats.totalWeight, report.lastMonthStats.totalWeight).toFixed(0)}%
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{report.stats.totalSets}</div>
          <div className="text-sm text-muted-foreground">مجموعة</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{Math.round(report.stats.avgDuration)}</div>
          <div className="text-sm text-muted-foreground">دقيقة متوسط</div>
        </div>
      </div>

      {/* توزيع العضلات */}
      <div>
        <h4 className="font-medium mb-3">توزيع التمارين حسب العضلات</h4>
        <div className="space-y-2">
          {Object.entries(report.stats.muscleGroups)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([muscle, count]) => (
              <div key={muscle} className="flex items-center justify-between">
                <span className="text-sm">{muscle}</span>
                <div className="flex items-center gap-2">
                  <Progress value={(count as number) * 10} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function InsightsList({ insights }: { insights: any[] }) {
  if (insights.length === 0) {
    return <p className="text-muted-foreground">لا توجد رؤى متاحة حالياً</p>
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => {
        const Icon = insight.icon
        return (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              insight.type === "positive"
                ? "bg-green-50 border border-green-200"
                : insight.type === "warning"
                  ? "bg-orange-50 border border-orange-200"
                  : "bg-blue-50 border border-blue-200"
            }`}
          >
            <Icon
              className={`h-5 w-5 mt-0.5 ${
                insight.type === "positive"
                  ? "text-green-600"
                  : insight.type === "warning"
                    ? "text-orange-600"
                    : "text-blue-600"
              }`}
            />
            <div>
              <h4 className="font-medium">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RecommendationsList({ recommendations }: { recommendations: any[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "عالية"
      case "medium":
        return "متوسطة"
      case "low":
        return "منخفضة"
      default:
        return "عادية"
    }
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium">{rec.title}</h4>
              <Badge variant="outline" className="text-xs mt-1">
                {rec.category}
              </Badge>
            </div>
            <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>{getPriorityLabel(rec.priority)}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{rec.description}</p>
        </div>
      ))}
    </div>
  )
}
