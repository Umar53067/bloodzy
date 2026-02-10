# 🩸 Bloodzy

**Bloodzy** is a modern, web-based blood donation app built with React and Supabase that connects blood donors and recipients in real-time based on proximity. It helps users find eligible donors within a 5km radius first, and expands the search up to 10km, 15km, and beyond if needed. The app also includes listings of nearby hospitals and welfare organizations with blood banks.

**Live Demo:** Coming Soon  
**GitHub:** [bloodzy](https://github.com/yourusername/bloodzy)

---

## 🎯 Vision

Bloodzy solves the critical problem of finding blood donors quickly. In emergencies, every minute counts. Our app:

- ✅ Eliminates geographic barriers in blood donation
- ✅ Builds a trusted network of available donors
- ✅ Helps hospitals connect with verified blood banks
- ✅ Empowers communities to save lives together

---

## 🚀 Features

### Core Features (MVP - Currently Implemented)

- 🔐 **User Authentication**: Secure email/password registration and login via Supabase Auth
- 👤 **Donor Registration**: Users can register as blood donors with blood group, age, gender, phone, and location
- 🔍 **Donor Search**: Search for available donors by blood group and city
- 📍 **Location-Based Matching**: Capture user's geolocation and display coordinates
- 💾 **Donor Profiles**: View and edit donor information with persistent storage
- 🎫 **Donor Status Tracking**: See if user is registered as donor with clear visual indicators
- 📋 **Donor Availability**: Toggle availability status anytime
- 🚪 **Account Management**: Update profile details and view account information

### Planned Features

- 🔍 **Dynamic Radius Search**: Automatically expand search radius (5km → 10km → 15km → ...) if no donors found
- 🏥 **Hospital & Blood Bank Listings**: Browse nearby hospitals with active blood banks
- 🏘️ **Welfare Organization Directory**: Find verified NGOs and welfare organizations
- 🔔 **Real-Time Alerts**: Notify donors when urgent requests match their criteria (Socket.io)
- 📊 **Donation Eligibility Logic**: Track last donation date and calculate next eligible date
- 🗺️ **Interactive Map View**: Visualize donor and hospital locations on interactive map
- 📱 **Push Notifications**: Receive instant alerts for matching requests
- 🩸 **Blood Request Broadcasting**: Create urgent requests that reach all nearby eligible donors
- 📈 **Donation Statistics**: Track donation history and personal contribution stats
- 🎖️ **Donor Badges & Recognition**: Reward active donors with badges

---

## 🧰 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 19.2.0 + Vite | Modern, fast UI framework |
| **Styling** | Tailwind CSS 4.1.18 | Responsive design system |
| **State Management** | Redux Toolkit 2.11.2 | Global app state |
| **Routing** | React Router 7.12.0 | Client-side navigation |
| **Backend** | Supabase (PostgreSQL) | Database & authentication |
| **Real-Time Sync** | Redux Persist | Persistent state storage |
| **Auth** | Supabase Auth | User authentication & sessions |
| **Maps** | Leaflet 1.9.4 | Location visualization |
| **HTTP Client** | Axios 1.13.2 | API requests |
| **UI Icons** | Lucide React 0.522.0 | Icon library |
| **Charts** | Recharts 3.2.1 | Data visualization |

---

## 📁 Project Structure

```
bloodzy/
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.jsx        # Navigation header
│   │   ├── Footer.jsx        # Footer section
│   │   ├── Button.jsx        # Custom button component
│   │   ├── FormInput.jsx     # Input field wrapper
│   │   ├── FormSelect.jsx    # Select field wrapper
│   │   ├── AlertMessage.jsx  # Alert/notification display
│   │   ├── Card.jsx          # Card container
│   │   ├── DonorCard.jsx     # Donor profile card
│   │   ├── DonorList.jsx     # Donor list container
│   │   ├── SearchDonorForm.jsx # Search form
│   │   └── LoadingSpinner.jsx # Loading indicator
│   │
│   ├── pages/                # Page components
│   │   ├── Homepage.jsx      # Home/dashboard
│   │   ├── Login.jsx         # Login page
│   │   ├── Signup.jsx        # Registration page
│   │   ├── Profile.jsx       # User profile
│   │   ├── Donate.jsx        # Donor registration
│   │   ├── Find.jsx          # Find donors search
│   │   ├── About.jsx         # About page
│   │   ├── Contact.jsx       # Contact page
│   │   └── ForgotPassword.jsx # Password reset
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuthStateSync.js    # Auth state synchronization
│   │   ├── useDonor.js           # Donor operations (CRUD)
│   │   ├── useBloodRequest.js    # Blood request operations
│   │   └── useForm.js            # Form state management
│   │
│   ├── lib/                  # Utility libraries
│   │   ├── supabase.js       # Supabase client setup
│   │   └── authService.js    # Authentication functions
│   │
│   ├── features/             # Redux slices
│   │   └── auth/
│   │       └── authSlice.js  # Auth reducer
│   │
│   ├── app/                  # App configuration
│   │   └── store.js          # Redux store setup
│   │
│   ├── constants/            # App constants
│   │   └── index.js          # Blood types, genders, etc.
│   │
│   ├── assets/               # Static assets
│   ├── App.jsx               # Main app component
│   ├── App.css               # Global styles
│   ├── main.jsx              # Entry point
│   └── index.css             # Base styles
│
├── public/                   # Static files
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── eslint.config.js          # ESLint configuration
└── README.md                 # This file
```

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **Supabase Account**: Free tier at [supabase.com](https://supabase.com)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/bloodzy.git
cd bloodzy
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Application Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_TIMEOUT=30000
VITE_DEBUG_MODE=false
```

**How to get Supabase credentials:**
1. Go to [supabase.com](https://supabase.com) and create a project
2. Navigate to **Settings > API**
3. Copy **Project URL** and **anon public key**
4. Paste into `.env` file

### Step 4: Setup Supabase Database

Create required tables in Supabase SQL Editor:

```sql
-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blood_group VARCHAR(3) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  available BOOLEAN DEFAULT true,
  last_donation TIMESTAMPTZ,
  location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create blood_requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(3) NOT NULL,
  units INT NOT NULL,
  hospital VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  urgency VARCHAR(20) DEFAULT 'normal',
  status VARCHAR(20) DEFAULT 'pending',
  description TEXT,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for donors
CREATE POLICY "Users can insert own donor profile"
ON donors FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view donors"
ON donors FOR SELECT USING (true);

CREATE POLICY "Users can update own donor profile"
ON donors FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_donors_user_id ON donors(user_id);
CREATE INDEX idx_donors_blood_group ON donors(blood_group);
CREATE INDEX idx_donors_city ON donors(city);
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 🔐 Authentication Flow

1. **Sign Up**: User registers with email, password, and username
2. **Email Confirmation**: (Optional) User confirms email if enabled in Supabase
3. **Auth State Sync**: Redux automatically syncs with Supabase session
4. **Protected Routes**: Require authentication for `/donate`, `/profile`, `/find`
5. **Logout**: Clears Supabase session + Redux state

---

## 💾 Database Schema

### Users Table (Managed by Supabase Auth)
- `id` (UUID): Unique identifier
- `email`: User's email
- `created_at`: Registration timestamp

### Donors Table
```javascript
{
  id: number,
  user_id: UUID,
  blood_group: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-",
  age: number,
  gender: "Male" | "Female" | "Other",
  phone: string,
  city: string,
  available: boolean,
  last_donation: timestamp (nullable),
  location: {
    latitude: number,
    longitude: number
  },
  created_at: timestamp
}
```

### Blood Requests Table
```javascript
{
  id: number,
  user_id: UUID,
  patient_name: string,
  blood_group: string,
  units: number,
  hospital: string,
  city: string,
  urgency: "low" | "normal" | "urgent",
  status: "pending" | "fulfilled" | "cancelled",
  description: string,
  contact_phone: string,
  contact_email: string,
  created_at: timestamp
}
```

---

## 🎯 Key Features Breakdown

### 1. Donor Registration (`/donate`)
- Fill in blood group, age, gender, phone, and city
- Capture GPS location using browser geolocation
- Register in database with availability status

### 2. Find Donors (`/find`)
- Search by blood group and city
- View results as cards with contact information
- Expand search radius if no results found

### 3. User Profile (`/profile`)
- View donor status ("Active Donor" or "Not Yet a Donor")
- Edit donor information
- Update availability anytime

### 4. Authentication System
- Secure login/signup with Supabase
- Password reset flow
- Auto-sync auth state with Redux

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Backend Expansion (Optional)

For future Node.js/Express backend:

```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📖 Documentation

- [Email Confirmation Fix](EMAIL_CONFIRMATION_FIX.md) - Disable email confirmation for development
- [Donor Registration Guide](DONOR_REGISTRATION_FIX.md) - How donor registration works
- [Supabase Connection Test](SUPABASE_CONNECTION_TEST.md) - Testing database connection
- [Profile Donor Status](PROFILE_DONOR_STATUS_FIX.md) - How donor status is displayed
- [Logout Fix](LOGOUT_FIX_EXPLANATION.md) - Understanding logout flow
- [Donor Search Guide](DONOR_SEARCH_FIX.md) - How donor search queries work

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** changes: `git commit -m 'Add your feature'`
4. **Push** to branch: `git push origin feature/your-feature`
5. **Submit** a Pull Request

### Code Standards
- Use ESLint for code quality
- Follow React best practices
- Add comments for complex logic
- Test changes locally before pushing

---

## 🐛 Troubleshooting

### "Email not confirmed" Error
- Disable email confirmation in Supabase: Settings > Providers > Email > Confirm email: OFF
- See [EMAIL_CONFIRMATION_FIX.md](EMAIL_CONFIRMATION_FIX.md)

### "Donors table does not exist"
- Create tables using SQL provided in Step 4 above
- See [DONOR_REGISTRATION_FIX.md](DONOR_REGISTRATION_FIX.md)

### "No donors found" in search
- Ensure at least one donor is registered in the same city
- Check Supabase table has data: Tables > donors
- Verify RLS policies allow SELECT

### Screen blinking after logout
- Already fixed! Logout now properly clears Supabase session
- See [LOGOUT_FIX_EXPLANATION.md](LOGOUT_FIX_EXPLANATION.md)

---

## 📊 Project Statistics

- **Total Components**: 15+
- **Custom Hooks**: 4
- **Pages**: 10+
- **Redux Slices**: 1
- **Supported Blood Groups**: 8
- **Database Tables**: 2

---

## 📋 Roadmap

### Phase 1 (Current MVP)
- ✅ User authentication
- ✅ Donor registration and search
- ✅ Profile management
- ✅ Location capture

### Phase 2 (Next)
- ⏳ Hospital/blood bank listings
- ⏳ Dynamic radius expansion
- ⏳ Real-time notifications (Socket.io)
- ⏳ Interactive map view

### Phase 3 (Future)
- ⏳ Donation eligibility calculator
- ⏳ Donation history tracking
- ⏳ Donor badges and recognition
- ⏳ Mobile app (React Native)
- ⏳ Webhook integration with hospitals

---

## 📝 Environment Setup Reference

```env
# Required
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional
VITE_APP_URL=http://localhost:5173
VITE_API_TIMEOUT=30000
VITE_DEBUG_MODE=false
```

---

## 🙏 Acknowledgments

- **Supabase** for authentication and database
- **React** and **Vite** for the development framework
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- All contributors and supporters of the blood donation initiative

---

## 📞 Contact & Support

- **GitHub Issues**: Report bugs or request features
- **Email**: support@bloodzy.com (coming soon)
- **Twitter**: @bloodzyapp

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💡 Fun Fact

Every blood donation can save up to 3 lives. With Bloodzy, you're not just saving lives—you're building a community of heroes. 🦸‍♀️🦸‍♂️

**Together, we can ensure no one ever waits for blood.**

---

**Made with ❤️ for those who give.**
