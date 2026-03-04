"use client";

import { useFormContext } from "react-hook-form";
import CustomDropdown from "./CustomDropdown";

export default function RequesterInfo() {
  const {
    register,
    watch,
    formState: { errors, touchedFields },
    setValue,
  } = useFormContext();

  const departmentOptions = [
    { value: "", label: "Select a department" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "Product", label: "Product" },
    { value: "Engineering", label: "Engineering" },
    { value: "HR", label: "Human Resources" },
    { value: "Finance", label: "Finance" },
    { value: "Operations", label: "Operations" },
    { value: "Customer Support", label: "Customer Support" },
    { value: "Personal Ad", label: "Personal Ad" },
    { value: "Obituary", label: "Obituary" },
    { value: "Other", label: "Other" },
  ];

  const handleDropdownChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">Requester information</h2>
      <p className="mb-5 text-sm text-gray-600">
        Tell us who’s submitting this request so we can follow up quickly.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="requesterName" className="mb-1 block font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="requesterName"
            type="text"
            className={`w-full rounded-md border px-3 py-2 ${
              errors.requesterName ? "border-red-500" : "border-gray-300"
            }`}
            {...register("requesterName", { required: "Name is required" })}
          />
          {errors.requesterName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.requesterName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="requesterEmail" className="mb-1 block font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="requesterEmail"
            type="email"
            className={`w-full rounded-md border px-3 py-2 ${
              errors.requesterEmail ? "border-red-500" : "border-gray-300"
            }`}
            {...register("requesterEmail", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Please enter a valid email address",
              },
              validate: (value) => {
                if (value.trim() === "") return true;
                return (
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Please enter a valid email address"
                );
              },
            })}
          />
          {touchedFields.requesterEmail && errors.requesterEmail && (
            <p className="mt-1 text-sm text-red-500">
              {errors.requesterEmail.message}
            </p>
          )}
        </div>

        <div>
          <CustomDropdown
            label="Department"
            name="requesterDepartment"
            options={departmentOptions}
            value={watch("requesterDepartment")}
            onChange={handleDropdownChange}
            required={true}
            error={errors.requesterDepartment?.message}
          />
        </div>

        <div>
          <label htmlFor="requesterPhone" className="mb-1 block font-medium">
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            id="requesterPhone"
            type="tel"
            className={`w-full rounded-md border px-3 py-2 ${
              errors.requesterPhone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., (123) 456-7890"
            {...register("requesterPhone", {
              required: "Phone number is required",
              pattern: {
                value: /^[\d\s()+.-]+$/,
                message: "Please enter a valid phone number",
              },
            })}
          />
          {errors.requesterPhone && (
            <p className="mt-1 text-sm text-red-500">
              {errors.requesterPhone.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-md bg-blue-50 p-3 text-blue-700">
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Fields marked with{" "}
          <span className="text-red-500">*</span> are required.
        </p>
      </div>
    </div>
  );
}

