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

export function AIWorkoutPlanner() {
  const [includeNutrition, setIncludeNutrition] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const { generatePlan, loading } = useAIPlanner()
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
      toast.error("Please fill in the required fields")
      return
    }

    try {
      const plan = await generatePlan({
        ...formData,
        includeNutrition,
        body_weight: Number(formData.weight) || 0,
      })
      setGeneratedPlan(plan)
      toast.success(`${includeNutrition ? "Workout & Nutrition" : "Workout"} plan generated! 🎉`)
    } catch (error) {
      toast.error("Failed to generate plan")
    }
  }

  const basePlanPrice = 29
  const nutritionAddon = 19
  const totalPrice = basePlanPrice + (includeNutrition ? nutritionAddon : 0)

  if (generatedPlan) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <span>Your AI-Generated Workout Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold">Fitness Level</h3>
                <Badge className="mt-2">{generatedPlan.fitnessLevel}</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold">Workout Days</h3>
                <p className="text-2xl font-bold mt-2">{generatedPlan.workoutDays}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold">Session Duration</h3>
                <p className="text-2xl font-bold mt-2">{generatedPlan.sessionDuration} min</p>
              </CardContent>
            </Card>
          </div>

          {/* Workouts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Workouts</h3>
            {generatedPlan.workouts.map((workout: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Badge variant="outline">Day {workout.day}</Badge>
                    <span>{workout.name}</span>
                    <Badge variant="secondary">{workout.duration} min</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workout.exercises.map((exercise: any, exIndex: number) => (
                      <div key={exIndex} className="border-l-4 border-l-primary pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{exercise.name}</h4>
                          <div className="flex space-x-2 text-sm text-muted-foreground">
                            <span>{exercise.sets} sets</span>
                            <span>•</span>
                            <span>{exercise.reps} reps</span>
                            <span>•</span>
                            <span>{exercise.rest} rest</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Nutrition Plan */}
          {generatedPlan.nutritionPlan && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-green-500" />
                <span>Nutrition Plan</span>
              </h3>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Daily Targets</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Calories:</span>
                          <span className="font-medium">{generatedPlan.nutritionPlan.dailyCalories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-medium">{generatedPlan.nutritionPlan.macros.protein}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span className="font-medium">{generatedPlan.nutritionPlan.macros.carbs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fats:</span>
                          <span className="font-medium">{generatedPlan.nutritionPlan.macros.fats}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Sample Meals</h4>
                      <div className="space-y-2">
                        {generatedPlan.nutritionPlan.meals.map((meal: any, index: number) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{meal.name}</h5>
                                <p className="text-sm text-muted-foreground">{meal.description}</p>
                              </div>
                              <Badge variant="outline">{meal.calories} cal</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setGeneratedPlan(null)} variant="outline">
              Generate New Plan
            </Button>
            <Button>Save to My Plans</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

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
        {/* Fitness Level */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Fitness Level *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fitnessLevels.map((level) => (
              <Card
                key={level.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.fitnessLevel === level.value ? "border-primary bg-primary/5" : ""
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
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                  formData.goals.includes(goal.id) ? "border-primary bg-primary/5" : ""
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
                className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                  formData.equipment.includes(equipment) ? "border-primary bg-primary/5" : ""
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
