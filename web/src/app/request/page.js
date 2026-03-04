"use client";

import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Link from "next/link";

import RequesterInfo from "@/components/RequesterInfo";
import AdDetails from "@/components/AdDetails";
import Timeline from "@/components/Timeline";
import ContentInfo from "@/components/ContentInfo";
import FileUpload from "@/components/FileUpload";
import Confirmation from "@/components/Confirmation";
import { createRequest } from "@/lib/firestore";

export default function RequestPage() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestId, setRequestId] = useState(null);

  const methods = useForm({
    mode: "onTouched",
    defaultValues: {
      requesterName: "",
      requesterEmail: "",
      requesterDepartment: "",
      requesterPhone: "",
      adType: "digital",
      adPurpose: "",
      targetAudience: "",
      desiredPlacement: "",
      budget: "",
      desiredCompletionDate: "",
      adTitle: "",
      adDescription: "",
      specialInstructions: "",
    },
  });

  const steps = useMemo(
    () => [
      { name: "Requester", component: <RequesterInfo /> },
      { name: "Ad details", component: <AdDetails /> },
      { name: "Timeline", component: <Timeline /> },
      { name: "Content", component: <ContentInfo /> },
      { name: "Images", component: <FileUpload files={files} setFiles={setFiles} /> },
      { name: "Done", component: <Confirmation /> },
    ],
    [files]
  );

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      let images = [];
      if (files.length > 0) {
        images = await Promise.all(
          files.map(async (file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: await fileToDataUrl(file),
          }))
        );
      }

      const payload = {
        requesterName: data.requesterName,
        requesterEmail: data.requesterEmail,
        requesterDepartment: data.requesterDepartment,
        requesterPhone: data.requesterPhone,
        adType: data.adType,
        adPurpose: data.adPurpose,
        targetAudience: data.targetAudience || null,
        desiredPlacement: data.desiredPlacement || null,
        budget: data.budget ? Number(data.budget) : null,
        desiredCompletionDate: data.desiredCompletionDate || null,
        adTitle: data.adTitle || null,
        adDescription: data.adDescription || null,
        specialInstructions: data.specialInstructions || null,
        images,
      };
      const id = await createRequest(payload);
      setRequestId(id);
      setStep(steps.length - 1);
    } catch (error) {
      setSubmitError(
        error?.message || "There was a problem submitting your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    methods.reset();
    setFiles([]);
    setStep(0);
    setRequestId(null);
  };

  const progress = (step / (steps.length - 1)) * 100;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Ad request</h1>
          <p className="text-gray-600 dark:text-slate-300">
            Complete the steps below. Most people finish in under 3 minutes.
          </p>
        </div>
        <Link href="/" className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">
          Back to home
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Progress</p>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-200 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 space-y-2">
              {steps.map((s, i) => {
                const active = i === step;
                const done = i < step;
                return (
                  <div
                    key={s.name}
                    className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${
                      active
                        ? "bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-200"
                        : "text-gray-700 dark:text-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        done
                          ? "bg-blue-600 text-white"
                          : active
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200"
                          : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-slate-300"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="font-medium">{s.name}</span>
                  </div>
                );
              })}
            </div>

            {requestId && (
              <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-400/30 dark:bg-green-500/10 dark:text-green-200">
                Request ID: <span className="font-semibold">{requestId}</span>
              </div>
            )}
          </div>
        </aside>

        <section className="lg:col-span-8">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            {submitError && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700 dark:bg-red-500/10 dark:text-red-200">
                {submitError}
              </div>
            )}

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="mb-6">{steps[step].component}</div>

                <div className="mt-8 flex items-center justify-between gap-3">
                  {step > 0 && step < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                    >
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < steps.length - 2 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                    >
                      Next
                    </button>
                  )}

                  {step === steps.length - 2 && (
                    <button
                      type="submit"
                      disabled={isSubmitting || !methods.formState.isValid}
                      className={`rounded-md px-4 py-2 font-medium ${
                        isSubmitting || !methods.formState.isValid
                          ? "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-white/10 dark:text-slate-400"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {isSubmitting ? "Submitting…" : "Submit request"}
                    </button>
                  )}

                  {step === steps.length - 1 && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                      >
                        Submit another
                      </button>
                      <Link
                        href="/"
                        className="rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                      >
                        Done
                      </Link>
                    </div>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </section>
      </div>
    </div>
  );
}

