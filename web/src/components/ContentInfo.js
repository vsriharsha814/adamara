"use client";

import { useFormContext } from "react-hook-form";

export default function ContentInfo() {
  const { register } = useFormContext();

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">Content</h2>
      <p className="mb-5 text-sm text-gray-600">
        Share copy, headlines, and any specific requirements.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="adTitle" className="mb-1 block font-medium">
            Ad title / headline
          </label>
          <input
            id="adTitle"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Main headline for your ad"
            {...register("adTitle")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Keep it concise and attention-grabbing (recommended: 5–10 words)
          </p>
        </div>

        <div>
          <label htmlFor="adDescription" className="mb-1 block font-medium">
            Ad description / body copy
          </label>
          <textarea
            id="adDescription"
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Main content of your ad"
            {...register("adDescription")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Provide the core message you want to communicate.
          </p>
        </div>

        <div>
          <label htmlFor="specialInstructions" className="mb-1 block font-medium">
            Special instructions
          </label>
          <textarea
            id="specialInstructions"
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Brand rules, do/don’t, legal disclaimers, etc."
            {...register("specialInstructions")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Include any brand guidelines, required logos, colors, or mandatory text.
          </p>
        </div>

        <div className="rounded-md bg-gray-50 p-4">
          <h3 className="mb-2 font-medium text-gray-800">Content guidelines</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>Use clear, direct language for your target audience</li>
            <li>Include a call-to-action (CTA) when appropriate</li>
            <li>Ensure claims are accurate and can be substantiated</li>
            <li>Avoid copyrighted material without permission</li>
            <li>Stick to approved brand tone and voice</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

