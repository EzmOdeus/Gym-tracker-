"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Save, X, Timer, Weight } from "lucide-react"
import { defaultExercises, type Workout, type WorkoutSet } from "@/lib/workout-data"

interface WorkoutFormProps {
  onSave: (workout: Workout) => void
  onCancel: () => void
  editingWorkout?: Workout
}

export function WorkoutForm({ onSave, onCancel, editingWorkout }: WorkoutFormProps) {
  const [workoutName, setWorkoutName] = useState(editingWorkout?.name || "")
  const [workoutNotes, setWorkoutNotes] = useState(editingWorkout?.notes || "")
  const [sets, setSets] = useState<WorkoutSet[]>(editingWorkout?.sets || [])
  const [duration, setDuration] = useState(editingWorkout?.duration || 0)

  const addSet = (exerciseId: string) => {
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      exerciseId,
      weight: 0,
      reps: 0,
      restTime: 60,
      notes: "",
    }
    setSets([...sets, newSet])
  }

  const updateSet = (setId: string, updates: Partial<WorkoutSet>) => {
    setSets(sets.map((set) => (set.id === setId ? { ...set, ...updates } : set)))
  }

  const removeSet = (setId: string) => {
    setSets(sets.filter((set) => set.id !== setId))
  }

  const handleSave = () => {
    if (!workoutName.trim()) return

    const workout: Workout = {
      id: editingWorkout?.id || Date.now().toString(),
      name: workoutName,
      date: editingWorkout?.date || new Date().toISOString().split("T")[0],
      duration,
      sets,
      notes: workoutNotes,
    }

    onSave(workout)
  }

  const groupedSets = sets.reduce(
    (groups, set) => {
      if (!groups[set.exerciseId]) {
        groups[set.exerciseId] = []
      }
      groups[set.exerciseId].push(set)
      return groups
    },
    {} as Record<string, WorkoutSet[]>,
  )

  return (
    <div className="space-y-6">
      {/* معلومات التمرين الأساسية */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات التمرين</CardTitle>
          <CardDescription>أدخل تفاصيل جلسة التمرين</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workout-name">اسم التمرين</Label>
              <Input
                id="workout-name"
                placeholder="مثال: تمرين الصدر والكتف"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">المدة (بالدقائق)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="45"
                value={duration || ""}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              placeholder="أي ملاحظات حول التمرين..."
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* إضافة تمرين جديد */}
      <Card>
        <CardHeader>
          <CardTitle>إضافة تمرين</CardTitle>
          <CardDescription>اختر تمرين لإضافة مجموعات له</CardDescription>
        </CardHeader>
        <CardContent>
          <ExerciseSelector onSelectExercise={addSet} />
        </CardContent>
      </Card>

      {/* عرض التمارين والمجموعات */}
      {Object.entries(groupedSets).map(([exerciseId, exerciseSets]) => {
        const exercise = defaultExercises.find((e) => e.id === exerciseId)
        if (!exercise) return null

        return (
          <Card key={exerciseId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <CardDescription>
                    <div className="flex gap-1 mt-1">
                      {exercise.muscleGroups.map((muscle) => (
                        <Badge key={muscle} variant="secondary" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSet(exerciseId)}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  مجموعة
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exerciseSets.map((set, index) => (
                  <SetInput
                    key={set.id}
                    set={set}
                    setNumber={index + 1}
                    onUpdate={(updates) => updateSet(set.id, updates)}
                    onRemove={() => removeSet(set.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* أزرار الحفظ والإلغاء */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
        <Button onClick={handleSave} disabled={!workoutName.trim()}>
          <Save className="h-4 w-4 ml-2" />
          حفظ التمرين
        </Button>
      </div>
    </div>
  )
}

interface ExerciseSelectorProps {
  onSelectExercise: (exerciseId: string) => void
}

function ExerciseSelector({ onSelectExercise }: ExerciseSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(defaultExercises.map((e) => e.category)))]
  const filteredExercises =
    selectedCategory === "all" ? defaultExercises : defaultExercises.filter((e) => e.category === selectedCategory)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === "all" ? "جميع التمارين" : category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {filteredExercises.map((exercise) => (
          <Button
            key={exercise.id}
            variant="ghost"
            className="justify-start h-auto p-3"
            onClick={() => onSelectExercise(exercise.id)}
          >
            <div className="text-right">
              <div className="font-medium">{exercise.name}</div>
              <div className="text-xs text-muted-foreground flex gap-1 mt-1">
                {exercise.muscleGroups.slice(0, 2).map((muscle) => (
                  <span key={muscle}>{muscle}</span>
                ))}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

interface SetInputProps {
  set: WorkoutSet
  setNumber: number
  onUpdate: (updates: Partial<WorkoutSet>) => void
  onRemove: () => void
}

function SetInput({ set, setNumber, onUpdate, onRemove }: SetInputProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
        {setNumber}
      </div>

      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-1">
          <Weight className="h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="الوزن"
            value={set.weight || ""}
            onChange={(e) => onUpdate({ weight: Number(e.target.value) })}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">كجم</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">×</span>
          <Input
            type="number"
            placeholder="التكرار"
            value={set.reps || ""}
            onChange={(e) => onUpdate({ reps: Number(e.target.value) })}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">مرة</span>
        </div>

        <div className="flex items-center gap-1">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="الراحة"
            value={set.restTime || ""}
            onChange={(e) => onUpdate({ restTime: Number(e.target.value) })}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">ث</span>
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive">
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default WorkoutForm
