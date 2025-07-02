"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, Sparkles, Utensils, DollarSign, Clock, Target, Zap } from "lucide-react"
import { toast } from "sonner"
import { useAIPlanner } from "@/hooks/use-ai-planner"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import dynamic from "next/dynamic"
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { useAuth } from '@/hooks/use-auth'

// Dynamic import for server action
const saveAIWorkoutPlanAction = async (planData: any) =>
  (await import("@/lib/actions/ai-planner")).saveAIWorkoutPlan(planData)

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

export function AIWorkoutPlanner() {
  const [includeNutrition, setIncludeNutrition] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null)
  const { generatePlan, loading, error, streamingPlan } = useAIPlanner()
  const [formData, setFormData] = useState({
    fitnessLevel: "",
    goals: [] as string[],
    workoutDays: "",
    sessionDuration: "",
    equipment: [] as string[],
    injuries: "",
    preferences: "",
    age: "",
    weight: "",
    height: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const { user } = useAuth()

  const fitnessLevels = [
    { value: "beginner", label: "Beginner", description: "New to fitness or returning after a break" },
    { value: "intermediate", label: "Intermediate", description: "Regular exercise for 6+ months" },
    { value: "advanced", label: "Advanced", description: "Consistent training for 2+ years" },
  ]

  const fitnessGoals = [
    { id: "weight-loss", label: "Weight Loss", icon: Target },
    { id: "muscle-gain", label: "Muscle Gain", icon: Zap },
    { id: "strength", label: "Build Strength", icon: Target },
    { id: "endurance", label: "Improve Endurance", icon: Clock },
    { id: "flexibility", label: "Increase Flexibility", icon: Target },
    { id: "general-fitness", label: "General Fitness", icon: Target },
  ]

  const equipmentOptions = [
    "Dumbbells",
    "Barbell",
    "Resistance Bands",
    "Pull-up Bar",
    "Kettlebells",
    "Gym Access",
    "Bodyweight Only",
    "Cardio Equipment",
  ]

  const handleGoalToggle = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId) ? prev.goals.filter((g) => g !== goalId) : [...prev.goals, goalId],
    }))
  }

  const handleEquipmentToggle = (equipment: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter((e) => e !== equipment)
        : [...prev.equipment, equipment],
    }))
  }

  const handleGeneratePlan = async () => {
    if (!formData.fitnessLevel || formData.goals.length === 0 || !formData.workoutDays) {
      return
    }
    try {
      const plan = await generatePlan({
        ...formData,
        includeNutrition,
        body_weight: Number(formData.weight) || 0,
      })
      setGeneratedPlan(plan)
      setSaveSuccess(false)
      setSaveError(null)
    } catch { }
  }

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setSaveError('You must be logged in to save plans.')
      return
    }
    if (!generatedPlan) return
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      await saveAIWorkoutPlanAction({
        fitness_level: formData.fitnessLevel,
        goals: formData.goals,
        workout_days: Number(formData.workoutDays),
        session_duration: Number(formData.sessionDuration),
        equipment: formData.equipment,
        injuries_limitations: formData.injuries || null,
        nutrition_plan: includeNutrition,
        body_weight: Number(formData.weight) || null,
        generated_plan: generatedPlan,
      })
      setSaveSuccess(true)
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save plan.')
    } finally {
      setIsSaving(false)
    }
  }

  const basePlanPrice = 29
  const nutritionAddon = 19
  const totalPrice = basePlanPrice + (includeNutrition ? nutritionAddon : 0)

  if (loading && streamingPlan) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <span>Generating Your AI Workout Plan...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings]}>{streamingPlan}</ReactMarkdown>
        </CardContent>
      </Card>
    )
  }

  if (generatedPlan) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <span>Your AI-Generated Workout Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings]}>{generatedPlan}</ReactMarkdown>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
            <Button onClick={() => setGeneratedPlan(null)} variant="outline">
              Generate New Plan
            </Button>
            <Button onClick={handleSavePlan} disabled={isSaving || saveSuccess} variant="default">
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to My Plans'}
            </Button>
            <a href="/profile/me" className="underline text-primary text-sm ml-2">View My Plans</a>
          </div>
          {saveError && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded" role="alert">{saveError}</div>}
          {saveSuccess && <div className="mt-4 p-2 bg-green-100 text-green-700 rounded" role="status">Plan saved successfully!</div>}
        </CardContent>
      </Card>
    )
  }

  if (loading) return <LoadingSkeleton className="w-full max-w-4xl mx-auto h-96" />

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Brain className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">AI Workout Planner</CardTitle>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-muted-foreground">
          Get a personalized workout plan tailored to your goals, fitness level, and available equipment
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {error && (
          <div
            className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300"
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
          >
            {error}
          </div>
        )}
        {/* Fitness Level */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Fitness Level *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fitnessLevels.map((level) => (
              <Card
                key={level.value}
                className={`cursor-pointer transition-all hover:shadow-md ${formData.fitnessLevel === level.value ? "border-primary bg-primary/5" : ""
                  }`}
                onClick={() => setFormData((prev) => ({ ...prev, fitnessLevel: level.value }))}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium">{level.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Fitness Goals * (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {fitnessGoals.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${formData.goals.includes(goal.id) ? "border-primary bg-primary/5" : ""
                  }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <Checkbox checked={formData.goals.includes(goal.id)} onChange={() => handleGoalToggle(goal.id)} />
                <goal.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{goal.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="workout-days">Workout Days per Week *</Label>
            <Select
              value={formData.workoutDays}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, workoutDays: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select days per week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 days/week</SelectItem>
                <SelectItem value="4">4 days/week</SelectItem>
                <SelectItem value="5">5 days/week</SelectItem>
                <SelectItem value="6">6 days/week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-duration">Session Duration</Label>
            <Select
              value={formData.sessionDuration}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, sessionDuration: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Available Equipment */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Available Equipment</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {equipmentOptions.map((equipment) => (
              <div
                key={equipment}
                className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${formData.equipment.includes(equipment) ? "border-primary bg-primary/5" : ""
                  }`}
                onClick={() => handleEquipmentToggle(equipment)}
              >
                <Checkbox
                  checked={formData.equipment.includes(equipment)}
                  onChange={() => handleEquipmentToggle(equipment)}
                />
                <span className="text-sm">{equipment}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Personal Information (Optional)</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="150"
                value={formData.weight}
                onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (ft)</Label>
              <Input
                id="height"
                placeholder={`5'8"`}
                value={formData.height}
                onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Injuries & Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="injuries">Injuries or Limitations</Label>
            <Textarea
              id="injuries"
              placeholder="Any injuries, physical limitations, or exercises to avoid..."
              value={formData.injuries}
              onChange={(e) => setFormData((prev) => ({ ...prev, injuries: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferences">Additional Preferences</Label>
            <Textarea
              id="preferences"
              placeholder="Favorite exercises, workout styles, or specific requests..."
              value={formData.preferences}
              onChange={(e) => setFormData((prev) => ({ ...prev, preferences: e.target.value }))}
            />
          </div>
        </div>

        <Separator />

        {/* Nutrition Add-on */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={includeNutrition}
              onCheckedChange={(checked) => setIncludeNutrition(checked === true)}
            />
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-green-500" />
              <Label className="text-base font-semibold">Add Personalized Nutrition Plan</Label>
              <Badge variant="secondary">+${nutritionAddon}</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground ml-8">
            Get a customized meal plan with recipes, macros, and shopping lists tailored to your goals and dietary
            preferences.
          </p>
        </div>

        {/* Pricing & Generate */}
        <div className="bg-accent/50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Your Personalized Plan</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span>• AI-generated workout plan</span>
                  <Badge variant="outline">${basePlanPrice}</Badge>
                </div>
                {includeNutrition && (
                  <div className="flex items-center space-x-2">
                    <span>• Personalized nutrition plan</span>
                    <Badge variant="outline">+${nutritionAddon}</Badge>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">${totalPrice}</span>
              </div>
              <p className="text-sm text-muted-foreground">One-time payment</p>
            </div>
          </div>

          <Button onClick={handleGeneratePlan} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-pulse" />
                Generating Your Plan...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate My Plan - ${totalPrice}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AIWorkoutPlanner
