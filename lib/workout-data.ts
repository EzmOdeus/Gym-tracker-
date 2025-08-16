export interface Exercise {
  id: string
  name: string
  category: string
  muscleGroups: string[]
}

export interface WorkoutSet {
  id: string
  exerciseId: string
  weight: number
  reps: number
  restTime?: number
  notes?: string
}

export interface Workout {
  id: string
  name: string
  date: string
  duration: number
  sets: WorkoutSet[]
  notes?: string
}

export interface Goal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: string
  category: "strength" | "endurance" | "weight" | "frequency"
  isCompleted: boolean
}

// قائمة التمارين الأساسية
export const defaultExercises: Exercise[] = [
  // تمارين الصدر
  { id: "1", name: "ضغط البنش المسطح", category: "صدر", muscleGroups: ["صدر", "كتف أمامي", "ترايسبس"] },
  { id: "2", name: "ضغط البنش المائل", category: "صدر", muscleGroups: ["صدر علوي", "كتف أمامي", "ترايسبس"] },
  { id: "3", name: "فتح دمبل مسطح", category: "صدر", muscleGroups: ["صدر", "كتف أمامي"] },

  // تمارين الظهر
  { id: "4", name: "سحب عالي", category: "ظهر", muscleGroups: ["ظهر علوي", "بايسبس", "كتف خلفي"] },
  { id: "5", name: "سحب أرضي", category: "ظهر", muscleGroups: ["ظهر سفلي", "بايسبس", "ترابيس"] },
  { id: "6", name: "تجديف بالبار", category: "ظهر", muscleGroups: ["ظهر متوسط", "بايسبس", "كتف خلفي"] },

  // تمارين الأرجل
  { id: "7", name: "سكوات", category: "أرجل", muscleGroups: ["فخذ أمامي", "فخذ خلفي", "مؤخرة"] },
  { id: "8", name: "ديد ليفت", category: "أرجل", muscleGroups: ["فخذ خلفي", "مؤخرة", "ظهر سفلي"] },
  { id: "9", name: "ضغط أرجل", category: "أرجل", muscleGroups: ["فخذ أمامي", "فخذ خلفي", "مؤخرة"] },

  // تمارين الكتف
  { id: "10", name: "ضغط كتف واقف", category: "كتف", muscleGroups: ["كتف", "ترايسبس"] },
  { id: "11", name: "رفرفة جانبي", category: "كتف", muscleGroups: ["كتف جانبي"] },
  { id: "12", name: "رفرفة خلفي", category: "كتف", muscleGroups: ["كتف خلفي", "ظهر علوي"] },
]

// وظائف إدارة البيانات المحلية
export class WorkoutDataManager {
  private static readonly WORKOUTS_KEY = "gym-tracker-workouts"
  private static readonly GOALS_KEY = "gym-tracker-goals"
  private static readonly EXERCISES_KEY = "gym-tracker-exercises"

  static getWorkouts(): Workout[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.WORKOUTS_KEY)
    return data ? JSON.parse(data) : []
  }

  static saveWorkout(workout: Workout): void {
    if (typeof window === "undefined") return
    const workouts = this.getWorkouts()
    const existingIndex = workouts.findIndex((w) => w.id === workout.id)

    if (existingIndex >= 0) {
      workouts[existingIndex] = workout
    } else {
      workouts.push(workout)
    }

    localStorage.setItem(this.WORKOUTS_KEY, JSON.stringify(workouts))
  }

  static deleteWorkout(workoutId: string): void {
    if (typeof window === "undefined") return
    const workouts = this.getWorkouts().filter((w) => w.id !== workoutId)
    localStorage.setItem(this.WORKOUTS_KEY, JSON.stringify(workouts))
  }

  static getGoals(): Goal[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.GOALS_KEY)
    return data ? JSON.parse(data) : []
  }

  static saveGoal(goal: Goal): void {
    if (typeof window === "undefined") return
    const goals = this.getGoals()
    const existingIndex = goals.findIndex((g) => g.id === goal.id)

    if (existingIndex >= 0) {
      goals[existingIndex] = goal
    } else {
      goals.push(goal)
    }

    localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals))
  }

  static getExercises(): Exercise[] {
    if (typeof window === "undefined") return defaultExercises
    const data = localStorage.getItem(this.EXERCISES_KEY)
    return data ? JSON.parse(data) : defaultExercises
  }

  static saveExercises(exercises: Exercise[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.EXERCISES_KEY, JSON.stringify(exercises))
  }

  // إحصائيات سريعة
  static getWorkoutStats() {
    const workouts = this.getWorkouts()
    const totalWorkouts = workouts.length
    const totalWeight = workouts.reduce(
      (sum, workout) => sum + workout.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0),
      0,
    )
    const averageDuration = workouts.length > 0 ? workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length : 0

    return {
      totalWorkouts,
      totalWeight,
      averageDuration: Math.round(averageDuration),
      thisMonthWorkouts: workouts.filter((w) => {
        const workoutDate = new Date(w.date)
        const now = new Date()
        return workoutDate.getMonth() === now.getMonth() && workoutDate.getFullYear() === now.getFullYear()
      }).length,
    }
  }
}
