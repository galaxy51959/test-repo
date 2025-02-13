export const REPORT_TEMPLATE_TYPE = [
  "Psychoeducational",
  "Triennial",
  "Initial",
];

export const REPORT_SECTIONS = [
  {
    section: "Identifying Information",
  },
  {
    section: "Background Information",
  },
  {
    section: "Academic History",
  },
  {
    section: "Interviews",
    need: ["Interview(Parent)", "Interview(Teacher)", "Interview(Student)"],
  },
  {
    section: "Behavioral Observations",
    need: ["Evaluation", "Classroom", "Unstructured Time"],
  },
  {
    section: "Current Assessment Results and Interpretation",
  },
  {
    section: "Cognitive Functioning Skills",
    need: ["DAYC-2", "WRAML-3", "CTONI-2", "WJV", "CAS-2"],
  },
  {
    section: "Auditory Processing",
    need: ["TAPS-4"],
  },
  {
    section: "Visual Processing",
    need: ["TVPS-4", "MVPT-4", "BVPT-6"],
  },
  {
    section: "Sensory-Motor Integration",
    need: ["BG-2", "VMI"],
  },
  {
    section: "Social-Emotional",
    need: ["BASC-3(Parent)", "BASC-3(Teacher)", "Vineland-3"],
  },
  {
    section: "Academic Evaluation",
    need: ["Woodcoock Johnson", "FAR", "KTEA-3", "WRAT-5"],
  },
  {
    section: "Specialty Rating Scale",
    need: [
      "GARS-3(Parent)",
      "GARS-3(Teacher)",
      "ASRS-3(Parent)",
      "ASRS-3(Teacher)",
    ],
  },
];23452345234
