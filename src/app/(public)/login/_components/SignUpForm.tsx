"use client";

import { useSignUpForm } from "./useSignUpForm";
import { StepProgress } from "./StepProgress";
import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";

export default function SignUpForm() {
  const form = useSignUpForm();

  return (
    <div className="flex flex-col gap-5">
      <StepProgress step={form.step} />

      {form.step === 1 && (
        <Step1Form
          s1={form.s1}
          setS1={form.setS1}
          telDisplay={form.telDisplay}
          setTelDisplay={form.setTelDisplay}
          localError={form.localError}
          onSubmit={form.handleStep1}
        />
      )}

      {form.step === 2 && (
        <Step2Form
          s1={form.s1}
          s2={form.s2}
          setS2={form.setS2}
          isAsso={form.isAsso}
          step2FormRef={form.step2FormRef}
          suggestionsRef={form.suggestionsRef}
          banSuggestions={form.banSuggestions}
          handleRueChange={form.handleRueChange}
          handleSelectSuggestion={form.handleSelectSuggestion}
          acceptsCgu={form.acceptsCgu}
          setAcceptsCgu={form.setAcceptsCgu}
          localError={form.localError}
          state={form.state}
          isTelError={form.isTelError}
          pending={form.pending}
          onSubmit={form.handleStep2}
          onBack={form.handleBack}
        />
      )}
    </div>
  );
}
