import { configureSanitizer as configureEngineSanitizer, type SanitizerPolicy } from "@rangex/core";

import { basePolicy } from "../BasePolicy";

let isSanitizerConfigured = false;

/*
 * Sets the SanitizerPolicies for every editor instance and every snapshot validation, followed by the basePolicy.
 * The first policy that has a rule for an attribute decides, so the passed policies override the basePolicy's rules.
 * Calling it again replaces all the previous policies.
 */
export const configureSanitizer = (...sanitizerPolicies: SanitizerPolicy[]) => {
  configureEngineSanitizer(...sanitizerPolicies, basePolicy);

  isSanitizerConfigured = true;
};

/*
 * Sets the basePolicy alone, with a warning, if configureSanitizer hasn't been called yet, so the Sanitizer never runs
 * without rules.
 */
export const ensureSanitizerConfigured = () => {
  if (isSanitizerConfigured) {
    return;
  }

  console.warn(
    "configureSanitizer should be called before creating an editor or a view, or validating a snapshot. The basePolicy is applied regardless.",
  );

  configureSanitizer();
};
