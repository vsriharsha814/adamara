"use client";

import { useFormContext } from "react-hook-form";
import CustomDropdown from "./CustomDropdown";

export default function AdDetails() {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext();

  const adType = watch("adType");

  const adTypeOptions = [
    { value: "print", label: "Print" },
    { value: "digital", label: "Digital" },
    { value: "social", label: "Social Media" },
    { value: "video", label: "Video" },
    { value: "other", label: "Other" },
  ];

  const printSizeOptions = [
    { value: "fullPage", label: "Full Page" },
    { value: "halfPage", label: "Half Page" },
    { value: "quarterPage", label: "Quarter Page" },
    { value: "custom", label: "Custom Size" },
  ];

  const printColorOptions = [
    { value: "fullColor", label: "Full Color" },
    { value: "blackWhite", label: "Black & White" },
    { value: "spotColor", label: "Spot Color" },
  ];

  const digitalFormatOptions = [
    { value: "banner", label: "Banner Ad" },
    { value: "popup", label: "Pop-up" },
    { value: "sidebar", label: "Sidebar" },
    { value: "native", label: "Native Ad" },
  ];

  const digitalSizeOptions = [
    { value: "leaderboard", label: "Leaderboard (728×90)" },
    { value: "medium", label: "Medium Rectangle (300×250)" },
    { value: "skyscraper", label: "Skyscraper (160×600)" },
    { value: "custom", label: "Custom Size" },
  ];

  const socialPlatformOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "tiktok", label: "TikTok" },
  ];

  const socialTypeOptions = [
    { value: "post", label: "Regular Post" },
    { value: "story", label: "Story" },
    { value: "carousel", label: "Carousel" },
    { value: "video", label: "Video" },
  ];

  const handleDropdownChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">Ad details</h2>
      <p className="mb-5 text-sm text-gray-600">
        Give the team a clear target so design and review are faster.
      </p>

      <div className="space-y-4">
        <div>
          <CustomDropdown
            label="Ad Type"
            name="adType"
            options={adTypeOptions}
            value={adType}
            onChange={handleDropdownChange}
            required={true}
            error={errors.adType?.message}
          />
        </div>

        {adType === "print" && (
          <div className="rounded-md bg-gray-50 p-3">
            <h3 className="mb-2 font-medium">Print options</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomDropdown
                label="Size"
                name="printSize"
                options={printSizeOptions}
                value={watch("printSize")}
                onChange={handleDropdownChange}
              />
              <CustomDropdown
                label="Color"
                name="printColor"
                options={printColorOptions}
                value={watch("printColor")}
                onChange={handleDropdownChange}
              />
            </div>
          </div>
        )}

        {adType === "digital" && (
          <div className="rounded-md bg-gray-50 p-3">
            <h3 className="mb-2 font-medium">Digital options</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomDropdown
                label="Format"
                name="digitalFormat"
                options={digitalFormatOptions}
                value={watch("digitalFormat")}
                onChange={handleDropdownChange}
              />
              <CustomDropdown
                label="Size"
                name="digitalSize"
                options={digitalSizeOptions}
                value={watch("digitalSize")}
                onChange={handleDropdownChange}
              />
            </div>
          </div>
        )}

        {adType === "social" && (
          <div className="rounded-md bg-gray-50 p-3">
            <h3 className="mb-2 font-medium">Social options</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomDropdown
                label="Platform"
                name="socialPlatform"
                options={socialPlatformOptions}
                value={watch("socialPlatform")}
                onChange={handleDropdownChange}
              />
              <CustomDropdown
                label="Type"
                name="socialType"
                options={socialTypeOptions}
                value={watch("socialType")}
                onChange={handleDropdownChange}
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="adPurpose" className="mb-1 block font-medium">
            Purpose of the ad <span className="text-red-500">*</span>
          </label>
          <textarea
            id="adPurpose"
            rows={3}
            className={`w-full rounded-md border px-3 py-2 ${
              errors.adPurpose ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="What is the main goal? (e.g., promote new product, drive signups)"
            {...register("adPurpose", { required: "Purpose is required" })}
          />
          {errors.adPurpose && (
            <p className="mt-1 text-sm text-red-500">{errors.adPurpose.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="targetAudience" className="mb-1 block font-medium">
            Target audience
          </label>
          <textarea
            id="targetAudience"
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Who should this reach? (age group, interests, location)"
            {...register("targetAudience")}
          />
        </div>

        <div>
          <label htmlFor="desiredPlacement" className="mb-1 block font-medium">
            Desired placement
          </label>
          <input
            id="desiredPlacement"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Where will it be used? (site, channel, magazine, venue)"
            {...register("desiredPlacement")}
          />
        </div>

        <div>
          <label htmlFor="budget" className="mb-1 block font-medium">
            Budget
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500">$</span>
            </div>
            <input
              id="budget"
              type="number"
              className="w-full rounded-md border border-gray-300 px-3 py-2 pl-7"
              placeholder="Estimated budget (optional)"
              {...register("budget", {
                valueAsNumber: true,
                min: { value: 0, message: "Budget cannot be negative" },
              })}
            />
          </div>
          {errors.budget && (
            <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

