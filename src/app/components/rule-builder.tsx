"use client";
import type React from "react";
import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

// Define rule options based on rule type
const getRuleOptions = (ruleType: string) => {
  switch (ruleType) {
    case "scanner":
      return [
        { value: "exchange", label: "Exchange" },
        { value: "instrument_type", label: "Instrument Type" },
        { value: "price_growth", label: "Price Growth" },
        { value: "price", label: "Price" },
        { value: "market_cap_rank", label: "Market Cap Rank" },
        { value: "avg_daily_transaction", label: "Average Daily Transaction Value" },
      ];
    case "buy":
      return [
        { value: "last_price", label: "Last Price" },
        { value: "last_close", label: "Last Close" },
        { value: "moving_average", label: "Moving Average" },
        { value: "volume", label: "Volume" },
        { value: "rsi", label: "RSI" },
      ];
    case "sell":
      return [
        { value: "trailing_stoploss", label: "Trailing Stoploss" },
        { value: "hold_days", label: "Hold Days" },
        { value: "take_profit", label: "Take Profit" },
        { value: "price_drop", label: "Price Drop" },
      ];
    default:
      return [];
  }
};

// Define operators based on rule field
const getOperators = (field: string) => {
  switch (field) {
    case "exchange":
    case "instrument_type":
      return [
        { value: "equals", label: "=" },
        { value: "not_equals", label: "≠" },
      ];
    case "price":
    case "last_price":
    case "last_close":
    case "moving_average":
    case "volume":
    case "rsi":
    case "trailing_stoploss":
    case "hold_days":
    case "take_profit":
    case "price_drop":
    case "price_growth":
    case "avg_daily_transaction":
      return [
        { value: "greater_than", label: ">" },
        { value: "less_than", label: "<" },
        { value: "greater_than_equals", label: "≥" },
        { value: "less_than_equals", label: "≤" },
        { value: "equals", label: "=" },
      ];
    case "market_cap_rank":
      return [
        { value: "top_percent", label: "Top %" },
        { value: "bottom_percent", label: "Bottom %" },
      ];
    default:
      return [];
  }
};

// Define value options based on field
const getValueOptions = (field: string) => {
  switch (field) {
    case "exchange":
      return [
        { value: "NSE", label: "NSE" },
        { value: "BSE", label: "BSE" },
        { value: "NYSE", label: "NYSE" },
        { value: "NASDAQ", label: "NASDAQ" },
      ];
    case "instrument_type":
      return [
        { value: "EQUITY", label: "EQUITY" },
        { value: "FUTURES", label: "FUTURES" },
        { value: "OPTIONS", label: "OPTIONS" },
        { value: "CURRENCY", label: "CURRENCY" },
      ];
    default:
      return null; // For numeric inputs
  }
};

// Get field parameters based on field type
const getFieldParams = (field: string) => {
  switch (field) {
    case "price_growth":
      return { suffix: "%", placeholder: "e.g. 10", label: "Last X days", defaultPeriod: 300 };
    case "moving_average":
      return { suffix: "", placeholder: "e.g. 100", label: "Period (days)", defaultPeriod: 30 };
    case "hold_days":
      return { suffix: "days", placeholder: "e.g. 5", label: "" };
    case "trailing_stoploss":
    case "take_profit":
      return { suffix: "%", placeholder: "e.g. 10", label: "" };
    case "avg_daily_transaction":
      return { suffix: "", placeholder: "e.g. 300000000", label: "Last X days", defaultPeriod: 90 };
    default:
      return { suffix: "", placeholder: "Enter value", label: "" };
  }
};

interface RuleProps {
  rule: any;
  onChange: (rule: any) => void;
  onDelete: () => void;
  ruleType: string;
  level: number;
}

const Rule: React.FC<RuleProps> = ({ rule, onChange, onDelete, ruleType, level }) => {
  const ruleOptions = getRuleOptions(ruleType);
  const operators = rule.field ? getOperators(rule.field) : [];
  const valueOptions = rule.field ? getValueOptions(rule.field) : null;
  const fieldParams = rule.field ? getFieldParams(rule.field) : { suffix: "", placeholder: "", label: "" };

  const handleFieldChange = (value: string) => {
    const newRule = { ...rule, field: value };
    delete newRule.operator;
    delete newRule.value;
    delete newRule.period;
    if (fieldParams.defaultPeriod) {
      newRule.period = fieldParams.defaultPeriod;
    }
    onChange(newRule);
  };

  const handleOperatorChange = (value: string) => {
    onChange({ ...rule, operator: value });
  };

  const handleValueChange = (value: string) => {
    onChange({ ...rule, value });
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...rule, period: Number.parseInt(e.target.value) || "" });
  };

  return (
    <div className="flex items-center gap-2 mb-2 hover:bg-gray-100 rounded-md transition-all">
      <div className="flex-1 grid grid-cols-12 gap-2 items-center">
        {/* Field selector */}
        <div className="col-span-3">
          <div className="relative">
            <select
              value={rule.field || ""}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="h-8 w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select field
              </option>
              {ruleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Period input for fields that need it */}
        {rule.field && fieldParams.label && (
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="number"
              value={rule.period || ""}
              onChange={handlePeriodChange}
              className="h-8 w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Period"
            />
            <span className="text-xs whitespace-nowrap text-gray-500">{fieldParams.label}</span>
          </div>
        )}

        {/* Operator selector */}
        {rule.field && (
          <div className={`${fieldParams.label ? "col-span-2" : "col-span-3"}`}>
            <div className="relative">
              <select
                value={rule.operator || ""}
                onChange={(e) => handleOperatorChange(e.target.value)}
                className="h-8 w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Operator
                </option>
                {operators.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Value input */}
        {rule.field && rule.operator && (
          <div className={`${fieldParams.label ? "col-span-3" : "col-span-4"}`}>
            {valueOptions ? (
              <div className="relative">
                <select
                  value={rule.value || ""}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="h-8 w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select value
                  </option>
                  {valueOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <input
                  type="text"
                  value={rule.value || ""}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder={fieldParams.placeholder}
                  className="h-8 w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldParams.suffix && <span className="ml-2 text-xs text-gray-500">{fieldParams.suffix}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="h-7 w-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 cursor-pointer"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
};

interface RuleGroupProps {
  group: any;
  onChange: (group: any) => void;
  onDelete?: () => void;
  ruleType: string;
  level: number;
}

const RuleGroup: React.FC<RuleGroupProps> = ({ group, onChange, onDelete, ruleType, level }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleOperatorChange = (value: string) => {
    onChange({ ...group, operator: value });
  };

  const handleAddRule = () => {
    const newRules = [...group.rules, { type: "rule" }];
    onChange({ ...group, rules: newRules });
  };

  const handleAddGroup = () => {
    const newRules = [...group.rules, { type: "group", operator: "AND", rules: [] }];
    onChange({ ...group, rules: newRules });
  };

  const handleRuleChange = (index: number, rule: any) => {
    const newRules = [...group.rules];
    newRules[index] = rule;
    onChange({ ...group, rules: newRules });
  };

  const handleRuleDelete = (index: number) => {
    const newRules = group.rules.filter((_: any, i: number) => i !== index);
    onChange({ ...group, rules: newRules });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`border border-gray-200 rounded-md p-4 mb-3 hover:border-blue-200 hover:bg-gray-50 transition-all ${level > 0 ? "ml-4" : ""}`}
    >
      <div className="flex items-center mb-3">
        <button
          onClick={toggleExpand}
          className="p-0 h-6 w-6 mr-2 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md cursor-pointer"
        >
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={group.operator}
              onChange={(e) => handleOperatorChange(e.target.value)}
              className="h-7 w-20 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <span className="text-xs text-gray-500">of the following rules:</span>
        </div>

        {onDelete && (
          <button
            onClick={onDelete}
            className="ml-auto h-6 w-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>

      {isExpanded && (
        <>
          <div>
            {group.rules.map((rule: any, index: number) => (
              <div key={index}>
                {rule.type === "group" ? (
                  <RuleGroup
                    group={rule}
                    onChange={(newGroup) => handleRuleChange(index, newGroup)}
                    onDelete={() => handleRuleDelete(index)}
                    ruleType={ruleType}
                    level={level + 1}
                  />
                ) : (
                  <Rule
                    rule={rule}
                    onChange={(newRule) => handleRuleChange(index, newRule)}
                    onDelete={() => handleRuleDelete(index)}
                    ruleType={ruleType}
                    level={level + 1}
                  />
                )}
              </div>
            ))}

            {group.rules.length === 0 && (
              <div className="text-center py-3 text-xs text-gray-500">
                No rules added yet. Add a rule or group to get started.
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddRule}
              className="h-7 px-2 flex items-center border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 text-xs cursor-pointer"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Rule
            </button>
            <button
              onClick={handleAddGroup}
              className="h-7 px-2 flex items-center border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 text-xs cursor-pointer"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Group
            </button>
          </div>
        </>
      )}
    </div>
  );
};

interface RuleBuilderProps {
  rules: any;
  onChange: (rules: any) => void;
  ruleType: string;
}

export default function RuleBuilder({ rules, onChange, ruleType }: RuleBuilderProps) {
  return (
    <div>
      <RuleGroup group={rules} onChange={onChange} ruleType={ruleType} level={0} />
    </div>
  );
}