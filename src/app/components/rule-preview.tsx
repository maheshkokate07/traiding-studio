"use client"

interface RulePreviewProps {
  rules: any
  ruleType: string
}

// Helper function to render a rule in human-readable format
const renderRule = (rule: any, ruleType: string): string => {
  if (rule.type === "group") {
    if (rule.rules.length === 0) {
      return "(No rules defined)"
    }

    const renderedRules = rule.rules.map((r: any) => renderRule(r, ruleType)).filter(Boolean)
    if (renderedRules.length === 0) return ""

    return `(${renderedRules.join(` ${rule.operator} `)})`
  }

  // For leaf rules
  if (!rule.field || !rule.operator) return ""

  let fieldLabel = rule.field.replace(/_/g, " ")
  let operatorLabel = ""
  let value = rule.value || ""

  // Format operator
  switch (rule.operator) {
    case "equals":
      operatorLabel = "="
      break
    case "not_equals":
      operatorLabel = "≠"
      break
    case "greater_than":
      operatorLabel = ">"
      break
    case "less_than":
      operatorLabel = "<"
      break
    case "greater_than_equals":
      operatorLabel = "≥"
      break
    case "less_than_equals":
      operatorLabel = "≤"
      break
    case "top_percent":
      operatorLabel = "is among top"
      value = `${value}%`
      break
    case "bottom_percent":
      operatorLabel = "is among bottom"
      value = `${value}%`
      break
    default:
      operatorLabel = rule.operator.replace(/_/g, " ")
  }

  // Format field with period if needed
  if (rule.period) {
    if (rule.field === "price_growth") {
      fieldLabel = `last ${rule.period} days price growth`
    } else if (rule.field === "moving_average") {
      fieldLabel = `last ${rule.period} day moving average`
    } else if (rule.field === "avg_daily_transaction") {
      fieldLabel = `${rule.period} day average daily transaction value`
    }
  }

  return `${fieldLabel} ${operatorLabel} ${value}`
}

export default function RulePreview({ rules, ruleType }: RulePreviewProps) {
  const renderedRules = renderRule(rules, ruleType)

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
      <h3 className="text-sm font-medium mb-2">{ruleType.charAt(0).toUpperCase() + ruleType.slice(1)} Rules Preview</h3>
      <div className="bg-background p-3 rounded-md text-sm whitespace-pre-wrap border border-gray-200">
        {renderedRules || "(No rules defined)"}
      </div>
    </div>
  )
}
