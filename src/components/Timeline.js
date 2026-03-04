"use client";

import { useFormContext } from "react-hook-form";

export default function Timeline() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const sixMonthsLater = new Date(today);
  sixMonthsLater.setMonth(today.getMonth() + 6);
  const maxDate = sixMonthsLater.toISOString().split("T")[0];

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">Timeline</h2>
      <p className="mb-5 text-sm text-gray-600">
        Choose a due date that gives enough time for review and revisions.
      </p>

      <div className="space-y-6">
        <div>
          <label htmlFor="desiredCompletionDate" className="mb-1 block font-medium">
            Desired completion date <span className="text-red-500">*</span>
          </label>
          <input
            id="desiredCompletionDate"
            type="date"
            min={minDate}
            max={maxDate}
            className={`w-full rounded-md border px-3 py-2 ${
              errors.desiredCompletionDate ? "border-red-500" : "border-gray-300"
            }`}
            {...register("desiredCompletionDate", {
              required: "Completion date is required",
              validate: {
                futureDate: (value) => {
                  const selected = new Date(value);
                  const t = new Date();
                  t.setHours(0, 0, 0, 0);
                  return selected >= t || "Date must be today or in the future";
                },
              },
            })}
          />
          {errors.desiredCompletionDate && (
            <p className="mt-1 text-sm text-red-500">
              {errors.desiredCompletionDate.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Please allow at least 5 business days for standard requests.
          </p>
        </div>

        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="mb-2 font-medium text-yellow-800">Typical timeline</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li className="flex items-start">
              <span className="mr-2 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-200 text-yellow-900">
                1
              </span>
              <span>
                <strong>Review:</strong> 1–2 business days
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-200 text-yellow-900">
                2
              </span>
              <span>
                <strong>Design:</strong> 2–3 business days
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-200 text-yellow-900">
                3
              </span>
              <span>
                <strong>Revisions:</strong> 1–2 business days
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-200 text-yellow-900">
                4
              </span>
              <span>
                <strong>Finalization:</strong> 1 business day
              </span>
            </li>
          </ul>
          <p className="mt-3 text-sm text-yellow-800">
            Rush requests may be possible based on availability, but can’t be guaranteed.
          </p>
        </div>

        <div className="flex items-start rounded-md border border-blue-200 bg-blue-50 p-4">
          <svg
            className="mr-3 mt-0.5 h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="mb-1 font-medium text-blue-800">Heads up</h3>
            <p className="text-sm text-blue-700">
              All requests are reviewed for completeness and compliance. We’ll email you if we need
              anything else.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

