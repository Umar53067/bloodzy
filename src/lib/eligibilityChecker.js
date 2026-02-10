/**
 * Donation Eligibility Checker
 * Determines if a donor is eligible to donate based on various criteria
 */

export const ELIGIBILITY_CRITERIA = {
  MIN_AGE: 18,
  MAX_AGE: 65,
  MIN_WEIGHT_KG: 50,
  MIN_HEMOGLOBIN_MALE: 13.5, // g/dL
  MIN_HEMOGLOBIN_FEMALE: 12.5, // g/dL
  MIN_DAYS_BETWEEN_DONATIONS: 56, // 8 weeks
  MIN_DAYS_AFTER_SURGERY: 180, // 6 months
  MIN_DAYS_AFTER_VACCINE: 14, // 2 weeks
};

export const INELIGIBILITY_REASONS = {
  UNDER_AGE: "Must be at least 18 years old",
  OVER_AGE: "Must be under 65 years old",
  LOW_WEIGHT: `Must weigh at least ${ELIGIBILITY_CRITERIA.MIN_WEIGHT_KG} kg`,
  LOW_HEMOGLOBIN: "Hemoglobin levels are too low",
  RECENT_DONATION: `Must wait ${ELIGIBILITY_CRITERIA.MIN_DAYS_BETWEEN_DONATIONS} days between donations`,
  RECENT_SURGERY: `Must wait ${ELIGIBILITY_CRITERIA.MIN_DAYS_AFTER_SURGERY} days after surgery`,
  RECENT_VACCINE: `Must wait ${ELIGIBILITY_CRITERIA.MIN_DAYS_AFTER_VACCINE} days after vaccination`,
  PREGNANT: "Cannot donate while pregnant",
  INFECTIOUS_DISEASE: "Cannot donate with active infections",
  MEDICATION: "Current medication may prevent donation",
  BLOOD_PRESSURE: "Blood pressure is out of safe range",
  HEART_CONDITION: "Heart condition may prevent donation",
  ANEMIA: "Anemia may prevent donation",
};

/**
 * Check if donor is eligible to donate
 * @param {Object} donor - Donor object with health data
 * @returns {Object} { eligible: boolean, reasons: string[], nextEligibleDate: Date|null }
 */
export const checkDonorEligibility = (donor) => {
  const reasons = [];
  const now = new Date();

  // Age check
  if (donor.age < ELIGIBILITY_CRITERIA.MIN_AGE) {
    reasons.push(INELIGIBILITY_REASONS.UNDER_AGE);
  }
  if (donor.age > ELIGIBILITY_CRITERIA.MAX_AGE) {
    reasons.push(INELIGIBILITY_REASONS.OVER_AGE);
  }

  // Weight check
  if (donor.weight && donor.weight < ELIGIBILITY_CRITERIA.MIN_WEIGHT_KG) {
    reasons.push(INELIGIBILITY_REASONS.LOW_WEIGHT);
  }

  // Hemoglobin check
  if (donor.hemoglobin) {
    const minHemoglobin =
      donor.gender === "Female"
        ? ELIGIBILITY_CRITERIA.MIN_HEMOGLOBIN_FEMALE
        : ELIGIBILITY_CRITERIA.MIN_HEMOGLOBIN_MALE;
    if (donor.hemoglobin < minHemoglobin) {
      reasons.push(INELIGIBILITY_REASONS.LOW_HEMOGLOBIN);
    }
  }

  // Recent donation check
  if (donor.last_donation) {
    const lastDonationDate = new Date(donor.last_donation);
    const daysSinceLastDonation = Math.floor(
      (now - lastDonationDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastDonation < ELIGIBILITY_CRITERIA.MIN_DAYS_BETWEEN_DONATIONS) {
      reasons.push(INELIGIBILITY_REASONS.RECENT_DONATION);
    }
  }

  // Medical conditions
  if (donor.pregnant) {
    reasons.push(INELIGIBILITY_REASONS.PREGNANT);
  }

  if (donor.has_infection) {
    reasons.push(INELIGIBILITY_REASONS.INFECTIOUS_DISEASE);
  }

  if (donor.has_heart_condition) {
    reasons.push(INELIGIBILITY_REASONS.HEART_CONDITION);
  }

  if (donor.has_anemia) {
    reasons.push(INELIGIBILITY_REASONS.ANEMIA);
  }

  // Medication check
  if (donor.current_medications && donor.current_medications.length > 0) {
    const restrictedMeds = [
      "aspirin",
      "warfarin",
      "isotretinoin",
      "dutasteride",
      "finasteride",
    ];
    const hasRestrictedMeds = donor.current_medications.some((med) =>
      restrictedMeds.some((restricted) =>
        med.toLowerCase().includes(restricted)
      )
    );

    if (hasRestrictedMeds) {
      reasons.push(INELIGIBILITY_REASONS.MEDICATION);
    }
  }

  // Blood pressure check
  if (
    donor.systolic_bp &&
    donor.diastolic_bp &&
    (donor.systolic_bp > 180 ||
      donor.diastolic_bp > 110 ||
      donor.systolic_bp < 90 ||
      donor.diastolic_bp < 60)
  ) {
    reasons.push(INELIGIBILITY_REASONS.BLOOD_PRESSURE);
  }

  const eligible = reasons.length === 0;

  // Calculate next eligible date
  let nextEligibleDate = null;
  if (!eligible && donor.last_donation) {
    const lastDonationDate = new Date(donor.last_donation);
    nextEligibleDate = new Date(
      lastDonationDate.getTime() +
        ELIGIBILITY_CRITERIA.MIN_DAYS_BETWEEN_DONATIONS * 24 * 60 * 60 * 1000
    );
  }

  return {
    eligible,
    reasons,
    nextEligibleDate,
  };
};

/**
 * Calculate days until next eligible donation
 * @param {Date} lastDonationDate - Date of last donation
 * @returns {number} Days remaining
 */
export const getDaysUntilNextDonation = (lastDonationDate) => {
  if (!lastDonationDate) return 0;

  const now = new Date();
  const lastDate = new Date(lastDonationDate);
  const nextEligibleDate = new Date(
    lastDate.getTime() +
      ELIGIBILITY_CRITERIA.MIN_DAYS_BETWEEN_DONATIONS * 24 * 60 * 60 * 1000
  );

  const daysRemaining = Math.ceil(
    (nextEligibleDate - now) / (1000 * 60 * 60 * 24)
  );

  return Math.max(0, daysRemaining);
};

/**
 * Get eligibility score (percentage)
 * @param {Object} donor - Donor object
 * @returns {number} Score 0-100
 */
export const getEligibilityScore = (donor) => {
  const { reasons } = checkDonorEligibility(donor);
  const totalChecks = Object.keys(INELIGIBILITY_REASONS).length;
  const passedChecks = totalChecks - reasons.length;

  return Math.round((passedChecks / totalChecks) * 100);
};

/**
 * Get eligibility status with message
 * @param {Object} donor - Donor object
 * @returns {string} Status message
 */
export const getEligibilityStatus = (donor) => {
  const { eligible, nextEligibleDate } = checkDonorEligibility(donor);

  if (eligible) {
    return "✓ You are eligible to donate!";
  }

  if (nextEligibleDate) {
    const daysRemaining = getDaysUntilNextDonation(donor.last_donation);
    return `You can donate again in ${daysRemaining} days`;
  }

  return "Not eligible for donation at this time";
};

/**
 * Format eligibility information for display
 * @param {Object} donor - Donor object
 * @returns {Object} Formatted eligibility data
 */
export const formatEligibilityInfo = (donor) => {
  const { eligible, reasons, nextEligibleDate } = checkDonorEligibility(donor);
  const score = getEligibilityScore(donor);
  const daysUntilNext =
    nextEligibleDate ? getDaysUntilNextDonation(donor.last_donation) : null;

  return {
    eligible,
    score,
    reasons,
    nextEligibleDate,
    daysUntilNext,
    message: getEligibilityStatus(donor),
    lastDonationDate: donor.last_donation
      ? new Date(donor.last_donation).toLocaleDateString()
      : "Never donated",
  };
};
