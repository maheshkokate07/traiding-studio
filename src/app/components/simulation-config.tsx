"use client";
import * as React from "react";

interface SimulationConfigProps {
  config: {
    startMargin: number;
    startDate: string;
    endDate: string;
    maxPositions: number;
    maxPositionsPerInstrument: number;
    orderSortingType: string;
  };
  onChange: (config: any) => void;
}

export default function SimulationConfig({ config, onChange }: SimulationConfigProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="start-margin" className="text-sm font-medium text-gray-900">
          Start Margin
        </label>
        <input
          id="start-margin"
          type="number"
          value={config.startMargin}
          onChange={(e) => handleChange("startMargin", Number(e.target.value))}
          placeholder="Enter starting margin amount"
          className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The initial capital available for trading on day 1 of the simulation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="start-date" className="text-sm font-medium text-gray-900">
            Simulation Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={config.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="end-date" className="text-sm font-medium text-gray-900">
            Simulation End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={config.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="max-positions" className="text-sm font-medium text-gray-900">
            Maximum Positions
          </label>
          <input
            id="max-positions"
            type="number"
            value={config.maxPositions}
            onChange={(e) => handleChange("maxPositions", Number(e.target.value))}
            min={1}
            className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum number of open positions allowed at any time.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="max-positions-per-instrument" className="text-sm font-medium text-gray-900">
            Maximum Positions Per Instrument
          </label>
          <input
            id="max-positions-per-instrument"
            type="number"
            value={config.maxPositionsPerInstrument}
            onChange={(e) => handleChange("maxPositionsPerInstrument", Number(e.target.value))}
            min={1}
            className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of positions allowed for a single instrument.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="order-sorting" className="text-sm font-medium text-gray-900">
          Order Sorting Type
        </label>
        <div className="relative">
          <select
            id="order-sorting"
            value={config.orderSortingType}
            onChange={(e) => handleChange("orderSortingType", e.target.value)}
            className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select order sorting type
            </option>
            <option value="300-days-top-gainer-first">300 Days Top Gainer First</option>
            <option value="volume-desc">Highest Volume First</option>
            <option value="price-desc">Highest Price First</option>
            <option value="price-asc">Lowest Price First</option>
            <option value="market-cap-desc">Highest Market Cap First</option>
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
        <p className="text-xs text-gray-500 mt-1">
          Determines the priority order when multiple instruments are eligible for entry.
        </p>
      </div>
    </div>
  );
}