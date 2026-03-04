"use client";

import { useFormContext } from "react-hook-form";

export default function Confirmation() {
  const { watch } = useFormContext();
  const formValues = watch();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Request submitted successfully</h2>

      <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
        <div className="flex items-center">
          <svg className="mr-3 h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-green-800">Thank you!</h3>
            <p className="text-green-700">Your ad request has been received and is being processed.</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="border-b bg-gray-50 px-4 py-3">
          <h3 className="font-medium">Request summary</h3>
        </div>

        <div className="p-4">
          <h4 className="mb-2 font-medium text-gray-700">Requester</h4>
          <div className="mb-6 grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{formValues.requesterName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{formValues.requesterEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p>{formValues.requesterDepartment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{formValues.requesterPhone}</p>
            </div>
          </div>

          <h4 className="mb-2 font-medium text-gray-700">Ad details</h4>
          <div className="mb-6 grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Ad Type</p>
              <p className="capitalize">{formValues.adType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Desired completion</p>
              <p>{formatDate(formValues.desiredCompletionDate)}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Purpose</p>
              <p>{formValues.adPurpose}</p>
            </div>
            {formValues.targetAudience && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Target audience</p>
                <p>{formValues.targetAudience}</p>
              </div>
            )}
            {formValues.budget && (
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p>₹{formatCurrency(formValues.budget)}</p>
              </div>
            )}
          </div>

          {(formValues.adTitle || formValues.adDescription || formValues.specialInstructions) && (
            <>
              <h4 className="mb-2 font-medium text-gray-700">Content</h4>
              <div className="mb-6 space-y-3">
                {formValues.adTitle && (
                  <div>
                    <p className="text-sm text-gray-500">Title / Headline</p>
                    <p>{formValues.adTitle}</p>
                  </div>
                )}
                {formValues.adDescription && (
                  <div>
                    <p className="text-sm text-gray-500">Description / Body</p>
                    <p>{formValues.adDescription}</p>
                  </div>
                )}
                {formValues.specialInstructions && (
                  <div>
                    <p className="text-sm text-gray-500">Special instructions</p>
                    <p>{formValues.specialInstructions}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-md bg-blue-50 p-4">
          <h3 className="mb-2 font-medium text-blue-800">What happens next?</h3>
          <ol className="list-decimal space-y-2 pl-5 text-blue-700">
            <li>Your request is reviewed (1–2 business days)</li>
            <li>You’ll receive an email confirmation</li>
            <li>We may contact you for missing details</li>
            <li>You’ll be notified when status changes</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

