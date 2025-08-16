"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Dumbbell, Edit, Trash2, Weight } from "lucide-react"
import { WorkoutDataManager, defaultExercises, type Workout } from "@/lib/workout-data"

interface WorkoutListProps {
  onEditWorkout: (workout: Workout) => void
  refreshTrigger?: number
}

export function WorkoutList({ onEditWorkout, refreshTrigger }: WorkoutListProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    setWorkouts(
      WorkoutDataManager.getWorkouts().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    )
  }, [refreshTrigger])

  const handleDeleteWorkout = (workoutId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا التمرين؟")) {
      WorkoutDataManager.deleteWorkout(workoutId)
      setWorkouts(workouts.filter((w) => w.id !== workoutId))
    }
  }

  if (workouts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">لا توجد تمارين بعد</h3>
          <p className="text-muted-foreground">ابدأ بإضافة أول تمرين لك!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onEdit={() => onEditWorkout(workout)}
          onDelete={() => handleDeleteWorkout(workout.id)}
        />
      ))}
    </div>
  )
}

interface WorkoutCardProps {
  workout: Workout
  onEdit: () => void
  onDelete: () => void
}

function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  const totalWeight = workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
  const totalSets = workout.sets.length
  const uniqueExercises = new Set(workout.sets.map((set) => set.exerciseId)).size

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{workout.name}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(workout.date)}
              </div>
              {workout.duration > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {workout.duration} دقيقة
                </div>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* إحصائيات سريعة */}
          <div className="flex gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Dumbbell className="h-3 w-3" />
              {uniqueExercises} تمارين
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Weight className="h-3 w-3" />
              {totalWeight} كجم
            </Badge>
            <Badge variant="secondary">{totalSets} مجموعة</Badge>
          </div>

          {/* عرض التمارين */}
          <div className="space-y-2">
            {Object.entries(
              workout.sets.reduce(
                (groups, set) => {
                  if (!groups[set.exerciseId]) {
                    groups[set.exerciseId] = []
                  }
                  groups[set.exerciseId].push(set)
                  return groups
                },
                {} as Record<string, typeof workout.sets>,
              ),
            ).map(([exerciseId, sets]) => {
              const exercise = defaultExercises.find((e) => e.id === exerciseId)
              if (!exercise) return null

              return (
                <div key={exerciseId} className="text-sm">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-muted-foreground">
                    {sets.map((set, index) => `${set.weight}كجم × ${set.reps}`).join(" • ")}
                  </div>
                </div>
              )
            })}
          </div>

          {workout.notes && (
            <>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <strong>ملاحظات:</strong> {workout.notes}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkoutList
