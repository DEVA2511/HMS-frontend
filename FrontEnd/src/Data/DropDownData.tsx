const bloodGroups = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
];
const bloodGroup: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

const bloodGroupMap: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

const doctorSpecialization = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Urology",
  "General surgery",
  "Dental",
  "Ophthalmology",
  "ENT",
  "Pediatric surgery",
  "Obstetrics and gynecology",
];
const doctorDepatment = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Urology",
  "General surgery",
  "Dental",
  "Ophthalmology",
  "ENT",
  "Pediatric surgery",
  "Obstetrics and gynecology",
];

// add the appointment restons
const appointmentReason = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Urology",
  "General surgery",
  "Dental",
  "Ophthalmology",
  "ENT",
  "Pediatric surgery",
  "Obstetrics and gynecology",
];
// add teh symtoms
const sysmptoms = [
  "Fever",
  "Cough",
  "Cold",
  "Chills",
  "Chest Pain",
  "Shortness of breath",
  "Headache",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Back pain",
  "Joint pain",
  "Muscle pain",
  "Fatigue",
  "Weakness",
  "Dizziness",
  "Numbness",
  " Tingling",
  "Canker sores",
  "Runny nose",
  "Difficulty breathing",
  "Difficulty swallowing",
  "Difficulty speaking",
  "Difficulty walking",
  "Difficulty hearing",
  "Difficulty seeing",
  "Difficulty smelling",
  "Difficulty tasting",
  "Difficulty urinating",
  "Difficulty defecating",
];

// add the test
const test = [
  "Blood Test",
  "Urine Test",
  "Stool Test",
  "Chest X-ray",
  "CT Scan",
  "MRI",
  "Ultrasound",
  "Endoscopy",
  "Colonoscopy",
  "Biopsy",
  "Allergy Test",
  "X-Ray",
  "Bone Scan",
  "Covid Test",
];
// dosage
const dosageFrequency = [
  "1-0-1",
  "0-1-0",
  "0-0-1",
  "1-1-0",

  "0-1-1",
  "1-1-1",
  "2-0-2",
  "1-0-0.5",
  "1-0-0 (SOS)",
  "1-0-1 (Alt Day)",
];

const freqMap: Record<string, number> = {
  "1-0-1": 2,
  "0-1-0": 1,
  "0-0-1": 1,
  "1-1-0": 2,
  "0-1-1": 2,
  "1-1-1": 3,
  "2-0-2": 4,
  "1-0-0.5": 1.5,
  "1-0-0 (SOS)": 1,
  "1-0-1 (Alt Day)": 1,
  "0-0-0": 0,
};

// here use the lable and value
const medicineCategories = [
  { label: "Antihistamine", value: "ANTIHISTAMINE" },
  { label: "Vaccine", value: "VACCINE" },
  { label: "Antidepressant", value: "ANTIDEPRESSANT" },
  { label: "Herbal", value: "HERBAL" },
  { label: "Supplement", value: "SUPPLEMENT" },
  { label: "Steroid", value: "STEROID" },
  { label: "Homeopathic", value: "HOMEOPATHIC" },
  { label: "Antifungal", value: "ANTIFUNGAL" },
  { label: "Analgesic", value: "ANALGESIC" },
  { label: "Antibiotic", value: "ANTIBIOTIC" },
  { label: "Antiviral", value: "ANTIVIRAL" },
  { label: "Other", value: "OTHER" },
];

// medicine types
const medicineType = [
  { label: "Syrup", value: "SYRUP" },
  { label: "Tablet", value: "TABLET" },
  { label: "Capsule", value: "CAPSULE" },
  { label: "Injection", value: "INJECTION" },
  { label: "Other", value: "OTHER" },
  { label: "Powder", value: "POWDER" },
  { label: "Liquid", value: "LIQUID" },
  { label: "Drops", value: "DROPS" },
  { label: "Cream", value: "CREAM" },
  { label: "Ointment", value: "OINTMENT" },
];
export {
  bloodGroups,
  doctorSpecialization,
  doctorDepatment,
  bloodGroup,
  appointmentReason,
  sysmptoms,
  test,
  dosageFrequency,
  medicineCategories,
  medicineType,
  freqMap,
  bloodGroupMap,
};
