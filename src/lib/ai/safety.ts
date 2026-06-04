export const AI_HEALTH_DISCLAIMER =
  "AI-generated information is for educational purposes only and is not medical advice.";

const medicalRiskPatterns = [
  /\bdiagnos(e|is|ing)\b/i,
  /\bprescrib(e|ed|ing|tion)\b/i,
  /\bmedication dosage\b/i,
  /\bchange my (dose|medication|medicine)\b/i,
  /\bwhat disease\b/i,
  /\bemergency\b/i,
  /\bchest pain\b/i,
  /\bsuicid(e|al)\b/i,
  /\bself-harm\b/i
];

export function detectMedicalRisk(message: string) {
  return medicalRiskPatterns
    .filter((pattern) => pattern.test(message))
    .map((pattern) => pattern.source);
}

export function isMedicalRisk(message: string) {
  return detectMedicalRisk(message).length > 0;
}

export function medicalSafetyResponse() {
  return [
    AI_HEALTH_DISCLAIMER,
    "I cannot diagnose conditions, prescribe medication, adjust medication doses, or replace a clinician.",
    "For urgent symptoms or safety concerns, contact local emergency services or a qualified medical professional now.",
    "I can still help with general wellness habits, questions to ask a clinician, hydration, sleep routines, nutrition planning, and habit tracking."
  ].join("\n\n");
}
