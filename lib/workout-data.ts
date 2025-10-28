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
  { id: "1", name: "ضغط بنش مسطح بالبار", category: "صدر", muscleGroups: ["صدر", "كتف أمامي", "ترايسبس"] },
  { id: "2", name: "ضغط بنش مائل لأعلى بالبار", category: "صدر", muscleGroups: ["صدر علوي", "كتف أمامي", "ترايسبس"] },
  { id: "3", name: "ضغط بنش مائل لأسفل", category: "صدر", muscleGroups: ["صدر سفلي", "ترايسبس"] },
  { id: "4", name: "ضغط دمبل مسطح", category: "صدر", muscleGroups: ["صدر", "كتف أمامي"] },
  { id: "5", name: "ضغط دمبل مائل لأعلى", category: "صدر", muscleGroups: ["صدر علوي", "كتف أمامي"] },
  { id: "6", name: "ضغط دمبل مائل لأسفل", category: "صدر", muscleGroups: ["صدر سفلي"] },
  { id: "7", name: "فتح دمبل مسطح", category: "صدر", muscleGroups: ["صدر"] },
  { id: "8", name: "فتح دمبل مائل", category: "صدر", muscleGroups: ["صدر علوي"] },
  { id: "9", name: "كابل كروس أوفر", category: "صدر", muscleGroups: ["صدر", "كتف أمامي"] },
  { id: "10", name: "كابل كروس أوفر علوي", category: "صدر", muscleGroups: ["صدر سفلي"] },
  { id: "11", name: "كابل كروس أوفر سفلي", category: "صدر", muscleGroups: ["صدر علوي"] },
  { id: "12", name: "ضغط صدر على الجهاز", category: "صدر", muscleGroups: ["صدر", "ترايسبس"] },
  { id: "13", name: "ديبس للصدر", category: "صدر", muscleGroups: ["صدر سفلي", "ترايسبس"] },
  { id: "14", name: "بل أوفر بالدمبل", category: "صدر", muscleGroups: ["صدر", "ظهر علوي"] },

  // تمارين الظهر
  { id: "15", name: "سحب عالي أمامي", category: "ظهر", muscleGroups: ["ظهر علوي", "بايسبس", "كتف خلفي"] },
  { id: "16", name: "سحب عالي ضيق", category: "ظهر", muscleGroups: ["ظهر متوسط", "بايسبس"] },
  { id: "17", name: "تجديف بالبار", category: "ظهر", muscleGroups: ["ظهر متوسط", "بايسبس"] },
  { id: "18", name: "تجديف بالدمبل", category: "ظهر", muscleGroups: ["ظهر متوسط", "بايسبس"] },
  { id: "19", name: "تجديف بالكابل", category: "ظهر", muscleGroups: ["ظهر متوسط", "بايسبس"] },
  { id: "20", name: "سحب أرضي بالكابل", category: "ظهر", muscleGroups: ["ظهر سفلي", "بايسبس"] },
  { id: "21", name: "ديد ليفت", category: "ظهر", muscleGroups: ["ظهر سفلي", "فخذ خلفي", "مؤخرة"] },
  { id: "22", name: "ديد ليفت روماني", category: "ظهر", muscleGroups: ["ظهر سفلي", "هامسترنج"] },
  { id: "23", name: "بل أوفر بالكابل", category: "ظهر", muscleGroups: ["ظهر علوي"] },
  { id: "24", name: "تي بار رو", category: "ظهر", muscleGroups: ["ظهر متوسط", "ترابيس"] },
  { id: "25", name: "سحب وزن الجسم بالعقلة", category: "ظهر", muscleGroups: ["ظهر علوي", "بايسبس", "كتف خلفي"] },
  { id: "26", name: "فيس بول بالكابل", category: "ظهر", muscleGroups: ["كتف خلفي", "ترابيس"] },

  // تمارين الأرجل
  { id: "27", name: "سكوات بالبار", category: "أرجل", muscleGroups: ["فخذ أمامي", "فخذ خلفي", "مؤخرة"] },
  { id: "28", name: "فرونت سكوات", category: "أرجل", muscleGroups: ["فخذ أمامي", "كور"] },
  { id: "29", name: "هاك سكوات", category: "أرجل", muscleGroups: ["فخذ أمامي", "مؤخرة"] },
  { id: "30", name: "لانجز", category: "أرجل", muscleGroups: ["فخذ أمامي", "مؤخرة"] },
  { id: "31", name: "لانجز خلفي", category: "أرجل", muscleGroups: ["فخذ خلفي", "مؤخرة"] },
  { id: "32", name: "ضغط أرجل", category: "أرجل", muscleGroups: ["فخذ أمامي", "فخذ خلفي", "مؤخرة"] },
  { id: "33", name: "ليج إكستنشن", category: "أرجل", muscleGroups: ["فخذ أمامي"] },
  { id: "34", name: "ليج كيرل", category: "أرجل", muscleGroups: ["فخذ خلفي"] },
  { id: "35", name: "كاف رايز واقف", category: "ساق", muscleGroups: ["سمانة"] },
  { id: "36", name: "كاف رايز جالس", category: "ساق", muscleGroups: ["سمانة"] },
  { id: "37", name: "ستيف ديد ليفت", category: "أرجل", muscleGroups: ["فخذ خلفي", "ظهر سفلي"] },
  { id: "38", name: "بولغاريان سبليت سكوات", category: "أرجل", muscleGroups: ["فخذ أمامي", "مؤخرة"] },
  { id: "39", name: "سومو سكوات", category: "أرجل", muscleGroups: ["مؤخرة", "فخذ داخلي"] },
  { id: "40", name: "أبداكشن (Abduction Machine)", category: "أرجل", muscleGroups: ["مؤخرة", "فخذ خارجي"] },
  { id: "41", name: "أداكشن (Adduction Machine)", category: "أرجل", muscleGroups: ["فخذ داخلي"] },

  // تمارين الكتف
  { id: "42", name: "ضغط كتف بالبار واقف", category: "كتف", muscleGroups: ["كتف أمامي", "ترايسبس"] },
  { id: "43", name: "ضغط كتف بالدمبل جالس", category: "كتف", muscleGroups: ["كتف أمامي", "ترايسبس"] },
  { id: "44", name: "رفرفة جانبي", category: "كتف", muscleGroups: ["كتف جانبي"] },
  { id: "45", name: "رفرفة أمامي", category: "كتف", muscleGroups: ["كتف أمامي"] },
  { id: "46", name: "رفرفة خلفي", category: "كتف", muscleGroups: ["كتف خلفي", "ظهر علوي"] },
  { id: "47", name: "ضغط كتف على الجهاز", category: "كتف", muscleGroups: ["كتف", "ترايسبس"] },
  { id: "48", name: "شراجز بار", category: "كتف", muscleGroups: ["ترابيس"] },
  { id: "49", name: "أرنولد برس", category: "كتف", muscleGroups: ["كتف أمامي", "كتف جانبي"] },
  { id: "50", name: "أب رايت رو", category: "كتف", muscleGroups: ["كتف جانبي", "ترابيس"] },

  // تمارين الذراع
  { id: "51", name: "بايسبس بالبار", category: "ذراع", muscleGroups: ["بايسبس"] },
  { id: "52", name: "بايسبس دمبل", category: "ذراع", muscleGroups: ["بايسبس"] },
  { id: "53", name: "هامر كورل", category: "ذراع", muscleGroups: ["بايسبس", "ساعد"] },
  { id: "54", name: "بايسبس على الجهاز", category: "ذراع", muscleGroups: ["بايسبس"] },
  { id: "55", name: "ترايسبس كابل", category: "ذراع", muscleGroups: ["ترايسبس"] },
  { id: "56", name: "ترايسبس خلف الرأس", category: "ذراع", muscleGroups: ["ترايسبس"] },
  { id: "57", name: "ديبس ترايسبس", category: "ذراع", muscleGroups: ["ترايسبس", "صدر"] },
  { id: "58", name: "كلوز جريب بنش برس", category: "ذراع", muscleGroups: ["ترايسبس", "صدر"] },
  { id: "59", name: "بايسبس تركيزي", category: "ذراع", muscleGroups: ["بايسبس"] },
  { id: "60", name: "ترايسبس سكول كراشر", category: "ذراع", muscleGroups: ["ترايسبس"] },
  { id: "61", name: "ريفرس كورل", category: "ذراع", muscleGroups: ["ساعد", "بايسبس"] },

  // تمارين البطن
  { id: "62", name: "كرنش", category: "بطن", muscleGroups: ["بطن علوي"] },
  { id: "63", name: "ليج رايز", category: "بطن", muscleGroups: ["بطن سفلي"] },
  { id: "64", name: "بلانك", category: "بطن", muscleGroups: ["كور"] },
  { id: "65", name: "تمرين الدراجة", category: "بطن", muscleGroups: ["بطن جانبي", "كور"] },
  { id: "66", name: "كابل كرنش", category: "بطن", muscleGroups: ["بطن علوي"] },
  { id: "67", name: "سايد بلانك", category: "بطن", muscleGroups: ["بطن جانبي", "كور"] },
  { id: "68", name: "تو تاتش", category: "بطن", muscleGroups: ["بطن علوي"] },
  { id: "69", name: "فلاتر كيك", category: "بطن", muscleGroups: ["بطن سفلي"] },
  { id: "70", name: "جاك نايف", category: "بطن", muscleGroups: ["بطن علوي", "سفلي"] },

  // تمارين الكارديو
  { id: "71", name: "المشي السريع على السير", category: "كارديو", muscleGroups: ["قلب", "ساق"] },
  { id: "72", name: "الجري على السير", category: "كارديو", muscleGroups: ["قلب", "ساق"] },
  { id: "73", name: "العجلة الثابتة", category: "كارديو", muscleGroups: ["قلب", "ساق"] },
  { id: "74", name: "نط الحبل", category: "كارديو", muscleGroups: ["قلب", "كور", "ساق"] },
  { id: "75", name: "إليبتيكال", category: "كارديو", muscleGroups: ["قلب", "ساق"] },
  { id: "76", name: "السباحة", category: "كارديو", muscleGroups: ["قلب", "صدر", "كتف", "ظهر"] },
  { id: "77", name: "هرولة خفيفة", category: "كارديو", muscleGroups: ["قلب", "ساق"] },
  { id: "78", name: "روينج ماشين", category: "كارديو", muscleGroups: ["قلب", "ظهر", "ساق"] },

  // تمارين الجسم بالكامل
  { id: "79", name: "بيربيز", category: "جسم كامل", muscleGroups: ["صدر", "ساق", "كور", "كتف"] },
  { id: "80", name: "كلين آند برس", category: "جسم كامل", muscleGroups: ["كتف", "ساق", "ظهر", "كور"] },
  { id: "81", name: "سناتش", category: "جسم كامل", muscleGroups: ["كتف", "ساق", "ظهر"] },
  { id: "82", name: "كيبل وود تشوبر", category: "جسم كامل", muscleGroups: ["كور", "بطن جانبي", "كتف"] },
  { id: "83", name: "فارمر ووك", category: "جسم كامل", muscleGroups: ["ساعد", "كتف", "كور", "ساق"] },

  // تمارين الساعدين
  { id: "84", name: "ريست كورل", category: "ساعد", muscleGroups: ["ساعد"] },
  { id: "85", name: "ريفرس ريست كورل", category: "ساعد", muscleGroups: ["ساعد"] },
  { id: "86", name: "هامر كورل واقف", category: "ساعد", muscleGroups: ["ساعد", "بايسبس"] },
  { id: "87", name: "بلت رول", category: "ساعد", muscleGroups: ["ساعد"] },

  // تمارين الترابيس
  { id: "88", name: "شراجز بالبار", category: "ترابيس", muscleGroups: ["ترابيس"] },
  { id: "89", name: "شراجز دمبل", category: "ترابيس", muscleGroups: ["ترابيس"] },
  { id: "90", name: "رفرفة خلفي بالكابل", category: "ترابيس", muscleGroups: ["ترابيس", "كتف خلفي"] },

  // تمارين الإحماء والإطالة
  { id: "91", name: "تمارين فتح الورك", category: "إطالة", muscleGroups: ["فخذ داخلي", "مؤخرة"] },
  { id: "92", name: "تمارين الكتف بالاستطالة", category: "إطالة", muscleGroups: ["كتف"] },
  { id: "93", name: "تمارين إطالة الظهر", category: "إطالة", muscleGroups: ["ظهر سفلي", "كور"] },
  { id: "94", name: "إطالة الفخذ الخلفي", category: "إطالة", muscleGroups: ["هامسترنج"] },
  { id: "95", name: "إطالة السمانة", category: "إطالة", muscleGroups: ["سمانة"] },

  // تمارين وزن الجسم (كاليستنكس)
  { id: "96", name: "ضغط (Push Ups)", category: "جسم", muscleGroups: ["صدر", "ترايسبس", "كتف"] },
  { id: "97", name: "عقلة (Pull Ups)", category: "ظهر", muscleGroups: ["ظهر", "بايسبس"] },
  { id: "98", name: "ديبس وزن الجسم", category: "ذراع", muscleGroups: ["ترايسبس", "صدر"] },
  { id: "99", name: "سكوات وزن الجسم", category: "أرجل", muscleGroups: ["فخذ", "مؤخرة"] },
  { id: "100", name: "بلانك جانبي", category: "كور", muscleGroups: ["بطن جانبي", "كور"] },
  { id: "101", name: "جسر المؤخرة (Glute Bridge)", category: "أرجل", muscleGroups: ["مؤخرة", "كور"] },
  { id: "102", name: "بلانك مع لمس الكتف", category: "كور", muscleGroups: ["كور", "كتف"] },
  { id: "103", name: "ماونتن كلايمبرز", category: "كور", muscleGroups: ["كور", "ساق", "كتف"] },
  { id: "104", name: "برود جامب", category: "أرجل", muscleGroups: ["فخذ", "كور"] },
  { id: "105", name: "سكوات جمب", category: "أرجل", muscleGroups: ["فخذ", "مؤخرة", "كور"] },
  { id: "106", name: "بلانك إلى ضغط", category: "كور", muscleGroups: ["كور", "كتف", "صدر"] },

  // تمارين متقدمة وأولمبية
  { id: "107", name: "كلين أند جيرك", category: "جسم كامل", muscleGroups: ["كتف", "ظهر", "ساق"] },
  { id: "108", name: "باور كلين", category: "جسم كامل", muscleGroups: ["ظهر", "كتف", "كور"] },
  { id: "109", name: "هاف سناتش", category: "جسم كامل", muscleGroups: ["كتف", "ساق"] },
  { id: "110", name: "ديد ليفت سومو", category: "ظهر", muscleGroups: ["فخذ داخلي", "ظهر سفلي", "مؤخرة"] },
  { id: "111", name: "بينت أوفر رو", category: "ظهر", muscleGroups: ["ظهر متوسط", "بايسبس"] },]

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
