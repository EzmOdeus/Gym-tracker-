"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, Edit, Trash2, Calendar, TrendingUp, Weight, Repeat, CheckCircle } from "lucide-react"
import { WorkoutDataManager, type Goal } from "@/lib/workout-data"

export function GoalsManager() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>()

  useEffect(() => {
    setGoals(WorkoutDataManager.getGoals())
  }, [])

  const handleSaveGoal = (goal: Goal) => {
    WorkoutDataManager.saveGoal(goal)
    setGoals(WorkoutDataManager.getGoals())
    setShowForm(false)
    setEditingGoal(undefined)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setShowForm(true)
  }

  const handleDeleteGoal = (goalId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الهدف؟")) {
      const updatedGoals = goals.filter((g) => g.id !== goalId)
      setGoals(updatedGoals)
      // حفظ القائمة المحدثة
      updatedGoals.forEach((goal) => WorkoutDataManager.saveGoal(goal))
    }
  }

  const handleCompleteGoal = (goalId: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, isCompleted: true, currentValue: goal.targetValue } : goal,
    )
    setGoals(updatedGoals)
    updatedGoals.forEach((goal) => WorkoutDataManager.saveGoal(goal))
  }

  if (showForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{editingGoal ? "تعديل الهدف" : "هدف جديد"}</h2>
        </div>
        <GoalForm
          onSave={handleSaveGoal}
          onCancel={() => {
            setShowForm(false)
            setEditingGoal(undefined)
          }}
          editingGoal={editingGoal}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">الأهداف الشخصية</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          هدف جديد
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد أهداف بعد</h3>
            <p className="text-muted-foreground">ابدأ بإضافة أهدافك الشخصية لتتبع تقدمك</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => handleEditGoal(goal)}
              onDelete={() => handleDeleteGoal(goal.id)}
              onComplete={() => handleCompleteGoal(goal.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface GoalFormProps {
  onSave: (goal: Goal) => void
  onCancel: () => void
  editingGoal?: Goal
}

function GoalForm({ onSave, onCancel, editingGoal }: GoalFormProps) {
  const [title, setTitle] = useState(editingGoal?.title || "")
  const [description, setDescription] = useState(editingGoal?.description || "")
  const [category, setCategory] = useState<Goal["category"]>(editingGoal?.category || "strength")
  const [targetValue, setTargetValue] = useState(editingGoal?.targetValue || 0)
  const [currentValue, setCurrentValue] = useState(editingGoal?.currentValue || 0)
  const [unit, setUnit] = useState(editingGoal?.unit || "كجم")
  const [deadline, setDeadline] = useState(editingGoal?.deadline || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !targetValue || !deadline) return

    const goal: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      title,
      description,
      category,
      targetValue,
      currentValue,
      unit,
      deadline,
      isCompleted: editingGoal?.isCompleted || false,
    }

    onSave(goal)
  }

  const categoryOptions = [
    { value: "strength", label: "القوة", icon: Weight },
    { value: "endurance", label: "التحمل", icon: TrendingUp },
    { value: "weight", label: "الوزن", icon: Weight },
    { value: "frequency", label: "التكرار", icon: Repeat },
  ]

  const unitOptions = {
    strength: ["كجم", "رطل"],
    endurance: ["دقيقة", "ساعة", "كم"],
    weight: ["كجم", "رطل"],
    frequency: ["مرة", "يوم", "أسبوع"],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات الهدف</CardTitle>
        <CardDescription>حدد تفاصيل هدفك الشخصي</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الهدف</Label>
              <Input
                id="title"
                placeholder="مثال: رفع 100 كجم في البنش"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">نوع الهدف</Label>
              <Select value={category} onValueChange={(value: Goal["category"]) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الهدف</Label>
            <Textarea
              id="description"
              placeholder="اكتب تفاصيل إضافية عن هدفك..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">القيمة المستهدفة</Label>
              <Input
                id="target"
                type="number"
                placeholder="100"
                value={targetValue || ""}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current">القيمة الحالية</Label>
              <Input
                id="current"
                type="number"
                placeholder="80"
                value={currentValue || ""}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">الوحدة</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions[category].map((unitOption) => (
                    <SelectItem key={unitOption} value={unitOption}>
                      {unitOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">الموعد المستهدف</Label>
            <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
            <Button type="submit">حفظ الهدف</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

interface GoalCardProps {
  goal: Goal
  onEdit: () => void
  onDelete: () => void
  onComplete: () => void
}

function GoalCard({ goal, onEdit, onDelete, onComplete }: GoalCardProps) {
  const progress = goal.targetValue > 0 ? Math.min((goal.currentValue / goal.targetValue) * 100, 100) : 0
  const isOverdue = new Date(goal.deadline) < new Date() && !goal.isCompleted
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getCategoryIcon = (category: Goal["category"]) => {
    switch (category) {
      case "strength":
        return Weight
      case "endurance":
        return TrendingUp
      case "weight":
        return Weight
      case "frequency":
        return Repeat
      default:
        return Target
    }
  }

  const getCategoryLabel = (category: Goal["category"]) => {
    switch (category) {
      case "strength":
        return "القوة"
      case "endurance":
        return "التحمل"
      case "weight":
        return "الوزن"
      case "frequency":
        return "التكرار"
      default:
        return "عام"
    }
  }

  const Icon = getCategoryIcon(goal.category)

  return (
    <Card
      className={`${goal.isCompleted ? "bg-green-50 border-green-200" : isOverdue ? "bg-red-50 border-red-200" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${goal.isCompleted ? "bg-green-100" : "bg-primary/10"}`}>
              {goal.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Icon className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{goal.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{getCategoryLabel(goal.category)}</Badge>
                {goal.isCompleted && <Badge className="bg-green-100 text-green-800">مكتمل</Badge>}
                {isOverdue && !goal.isCompleted && <Badge variant="destructive">متأخر</Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {!goal.isCompleted && progress >= 100 && (
              <Button variant="ghost" size="sm" onClick={onComplete} className="text-green-600 hover:text-green-700">
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">التقدم</span>
            <span className="text-sm text-muted-foreground">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">{progress.toFixed(0)}% مكتمل</div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(goal.deadline).toLocaleDateString("ar-SA")}
          </div>
          {!goal.isCompleted && (
            <div
              className={`text-sm ${isOverdue ? "text-red-600" : daysLeft <= 7 ? "text-orange-600" : "text-muted-foreground"}`}
            >
              {isOverdue ? "متأخر" : daysLeft === 0 ? "اليوم" : daysLeft === 1 ? "غداً" : `${daysLeft} يوم متبقي`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
