"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical } from "lucide-react"
import type { FormField, FeedbackForm } from "@/lib/types"
import { useAuth } from "@/components/auth/auth-provider"

interface FormBuilderProps {
  form?: FeedbackForm
  onSave: (formData: Omit<FeedbackForm, "id" | "createdAt" | "updatedAt" | "embedCode">) => void
  onCancel: () => void
}

export function FormBuilder({ form, onSave, onCancel }: FormBuilderProps) {
  const [title, setTitle] = useState(form?.title || "")
  const [description, setDescription] = useState(form?.description || "")
  const [fields, setFields] = useState<FormField[]>(form?.fields || [])
  const [isActive, setIsActive] = useState(form?.isActive ?? true)
  const { user } = useAuth()

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      order: fields.length + 1,
      ...(type === "select" || type === "checkbox" ? { options: ["Option 1", "Option 2"] } : {}),
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  const handleSave = () => {
    console.log('🔘 Form Builder: Save button clicked')
    console.log('📝 Form data:', { title: title.trim(), user, fields: fields.length })
    
    if (!title.trim()) {
      alert('Please enter a form title')
      return
    }
    
    if (!user) {
      alert("You must be logged in to create a form")
      return
    }

    const formData = {
      userId: user.id,
      title: title.trim(),
      description: description.trim(),
      fields: fields.map((field, index) => ({ ...field, order: index + 1 })),
      isActive,
    }
    
    console.log('📤 Sending form data:', formData)
    onSave(formData)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{form ? "Edit Form" : "Create New Form"}</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {form ? "Update Form" : "Create Form"}
          </Button>
        </div>
      </div>

      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Form Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter form title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter form description"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="active">Form is active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Form Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{field.type}</Badge>
                  {field.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(field.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Field Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Enter field label"
                  />
                </div>

                {(field.type === "text" || field.type === "textarea") && (
                  <div className="space-y-2">
                    <Label>Placeholder</Label>
                    <Input
                      value={field.placeholder || ""}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      placeholder="Enter placeholder text"
                    />
                  </div>
                )}

                {(field.type === "select" || field.type === "checkbox") && (
                  <div className="space-y-2">
                    <Label>Options (one per line)</Label>
                    <Textarea
                      value={field.options?.join("\n") || ""}
                      onChange={(e) => updateField(field.id, { options: e.target.value.split("\n").filter(Boolean) })}
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                />
                <Label>Required field</Label>
              </div>
            </div>
          ))}

          {/* Add Field Buttons */}
          <div className="border-2 border-dashed border-muted rounded-lg p-6">
            <p className="text-center text-muted-foreground mb-4">Add a new field</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => addField("text")}>
                <Plus className="h-4 w-4 mr-1" />
                Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => addField("textarea")}>
                <Plus className="h-4 w-4 mr-1" />
                Textarea
              </Button>
              <Button variant="outline" size="sm" onClick={() => addField("rating")}>
                <Plus className="h-4 w-4 mr-1" />
                Rating
              </Button>
              <Button variant="outline" size="sm" onClick={() => addField("select")}>
                <Plus className="h-4 w-4 mr-1" />
                Select
              </Button>
              <Button variant="outline" size="sm" onClick={() => addField("checkbox")}>
                <Plus className="h-4 w-4 mr-1" />
                Checkbox
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
