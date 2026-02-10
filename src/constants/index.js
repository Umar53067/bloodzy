/**
 * Constants file for Bloodzy application
 * Contains reusable values, design system tokens, and configuration
 */

// ============================================================================
// BLOOD & DONOR RELATED
// ============================================================================

export const BLOOD_TYPES = [
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
];

export const GENDERS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

export const DONOR_AGE_MIN = 18;
export const DONOR_AGE_MAX = 65;

// ============================================================================
// MAP CONFIGURATION
// ============================================================================

export const DEFAULT_MAP_CENTER = [51.505, -0.09];
export const DEFAULT_MAP_ZOOM = 13;
export const DEFAULT_SEARCH_RADIUS = 5;
export const MAX_SEARCH_RADIUS = 100;
export const MIN_SEARCH_RADIUS = 1;

// ============================================================================
// AUTHENTICATION & SECURITY
// ============================================================================

export const PASSWORD_MIN_LENGTH = 6;
export const USERNAME_MIN_LENGTH = 3;

// ============================================================================
// PERFORMANCE & TIMING
// ============================================================================

export const API_TIMEOUT = 5000;
export const DEBOUNCE_DELAY = 300;
export const NOTIFICATION_TIMEOUT = 3000; // Auto-dismiss notifications

// ============================================================================
// DESIGN SYSTEM - SPACING
// ============================================================================

export const SPACING = {
  // Padding/Margin sizes (using Tailwind scale)
  xs: 'p-2',    // 8px
  sm: 'p-4',    // 16px
  md: 'p-6',    // 24px
  lg: 'p-8',    // 32px
  xl: 'p-12',   // 48px
  
  // Container padding (responsive)
  containerPadding: 'px-4 md:px-6 lg:px-8',
  
  // Section padding (responsive, vertical)
  sectionPadding: 'py-12 md:py-16 lg:py-20',
  
  // Section padding (responsive, both)
  sectionPaddingFull: 'px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20',
};

// ============================================================================
// DESIGN SYSTEM - TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
  // Headings
  h1: 'text-4xl md:text-5xl font-bold leading-tight',
  h2: 'text-3xl md:text-4xl font-bold leading-snug',
  h3: 'text-2xl md:text-3xl font-semibold leading-snug',
  h4: 'text-xl md:text-2xl font-semibold leading-snug',
  
  // Body text
  body: 'text-base leading-relaxed text-gray-700',
  'body-sm': 'text-sm leading-relaxed text-gray-600',
  'body-lg': 'text-lg leading-relaxed text-gray-700',
  
  // Special text
  caption: 'text-xs leading-relaxed text-gray-500',
  label: 'text-sm font-semibold text-gray-700',
};

// ============================================================================
// DESIGN SYSTEM - COLORS
// ============================================================================

export const COLORS = {
  brand: {
    primary: 'rgb(220, 38, 38)',      // red-600
    'primary-dark': 'rgb(153, 27, 27)', // red-900
    'primary-light': 'rgb(254, 226, 226)', // red-50
  },
  semantic: {
    success: 'rgb(22, 163, 74)',      // green-600
    error: 'rgb(220, 38, 38)',        // red-600
    warning: 'rgb(234, 88, 12)',      // orange-600
    info: 'rgb(3, 105, 161)',         // blue-700
  },
};

// ============================================================================
// DESIGN SYSTEM - CARDS
// ============================================================================

export const CARD_STYLES = {
  default: 'bg-white rounded-lg shadow-md border border-gray-100',
  hover: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
  elevated: 'bg-white rounded-lg shadow-lg',
  bordered: 'bg-white rounded-lg border-2 border-gray-200',
};

// ============================================================================
// BUSINESS INFORMATION
// ============================================================================

// Team members for About page
export const TEAM_MEMBERS = [
  {
    name: 'Ahmed Hassan',
    role: 'Founder & CEO',
    avatar: 'https://i.pravatar.cc/150?u=ahmed',
  },
  {
    name: 'Fatima Ali',
    role: 'Medical Director',
    avatar: 'https://i.pravatar.cc/150?u=fatima',
  },
  {
    name: 'Mohammed Khan',
    role: 'Tech Lead',
    avatar: 'https://i.pravatar.cc/150?u=mohammed',
  },
  {
    name: 'Layla Samir',
    role: 'Operations Manager',
    avatar: 'https://i.pravatar.cc/150?u=layla',
  },
];

// Contact information
export const CONTACT_INFO = {
  phone: '+20 100 123 4567',
  email: 'support@bloodzy.com',
  address: '123 Medical Street, Cairo, Egypt',
  hours: 'Monday - Friday: 9:00 AM - 5:00 PM',
};

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/bloodzy',
  twitter: 'https://twitter.com/bloodzy',
  instagram: 'https://instagram.com/bloodzy',
  linkedin: 'https://linkedin.com/company/bloodzy',
};
