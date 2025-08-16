"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, Weight, Repeat } from "lucide-react"
import { WorkoutDataManager, defaultExercises } from "@/lib/workout-data"

export function ProgressCharts() {
  const workouts = WorkoutDataManager.getWorkouts()

  const chartData = useMemo(() => {
    // بيانات التطور الزمني
    const timelineData = workouts
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((workout) => {
        const totalWeight = workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
        const totalSets = workout.sets.length
        const avgWeight = totalSets > 0 ? totalWeight / totalSets : 0

        return {
          date: new Date(workout.date).toLocaleDateString("ar-SA", { month: "short", day: "numeric" }),
          totalWeight,
          avgWeight: Math.round(avgWeight),
          sets: totalSets,
          duration: workout.duration,
        }
      })

    // بيانات التمارين حسب العضلات
    const muscleGroupData = workouts.reduce(
      (acc, workout) => {
        workout.sets.forEach((set) => {
          const exercise = defaultExercises.find((e) => e.id === set.exerciseId)
          if (exercise) {
            exercise.muscleGroups.forEach((muscle) => {
              if (!acc[muscle]) {
                acc[muscle] = { name: muscle, count: 0, totalWeight: 0 }
              }
              acc[muscle].count += 1
              acc[muscle].totalWeight += set.weight * set.reps
            })
          }
        })
        return acc
      },
      {} as Record<string, { name: string; count: number; totalWeight: number }>,
    )

    const muscleData = Object.values(muscleGroupData)
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 6)

    // بيانات أفضل التمارين
    const exerciseData = workouts.reduce(
      (acc, workout) => {
        workout.sets.forEach((set) => {
          const exercise = defaultExercises.find((e) => e.id === set.exerciseId)
          if (exercise) {
            if (!acc[exercise.id]) {
              acc[exercise.id] = {
                name: exercise.name,
                category: exercise.category,
                totalWeight: 0,
                maxWeight: 0,
                sessions: 0,
              }
            }
            acc[exercise.id].totalWeight += set.weight * set.reps
            acc[exercise.id].maxWeight = Math.max(acc[exercise.id].maxWeight, set.weight)
            acc[exercise.id].sessions += 1
          }
        })
        return acc
      },
      {} as Record<
        string,
        { name: string; category: string; totalWeight: number; maxWeight: number; sessions: number }
      >,
    )

    const topExercises = Object.values(exerciseData)
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 5)

    return {
      timeline: timelineData,
      muscles: muscleData,
      exercises: topExercises,
    }
  }, [workouts])

  if (workouts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">لا توجد بيانات للعرض</h3>
          <p className="text-muted-foreground">ابدأ بإضافة تمارين لرؤية التقدم والإحصائيات</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* مخطط التطور الزمني */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight className="h-5 w-5" />
              تطور الوزن المرفوع
            </CardTitle>
            <CardDescription>إجمالي الوزن المرفوع في كل جلسة تمرين</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                totalWeight: {
                  label: "الوزن الإجمالي",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="totalWeight"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              عدد المجموعات
            </CardTitle>
            <CardDescription>عدد المجموعات في كل جلسة تمرين</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sets: {
                  label: "المجموعات",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sets" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* مخطط العضلات */}
      <Card>
        <CardHeader>
          <CardTitle>توزيع التمارين حسب العضلات</CardTitle>
          <CardDescription>أكثر العضلات التي تم تمرينها</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              totalWeight: {
                label: "الوزن الإجمالي",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.muscles} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="totalWeight" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* أفضل التمارين */}
      <Card>
        <CardHeader>
          <CardTitle>أفضل التمارين</CardTitle>
          <CardDescription>التمارين الأكثر استخداماً وفعالية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.exercises.map((exercise, index) => (
              <div key={exercise.name} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground">{exercise.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{exercise.totalWeight.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">كجم إجمالي</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{exercise.maxWeight}</div>
                    <div className="text-xs text-muted-foreground">أقصى وزن</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{exercise.sessions}</div>
                    <div className="text-xs text-muted-foreground">جلسة</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
