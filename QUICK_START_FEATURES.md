# Quick Start Guide: Using the New Features

## 🏥 Hospital & Blood Bank Listings

### For Users
1. Go to `/hospitals` (add link in Header navigation)
2. Search by hospital name, address, or blood type
3. Filter by city or hospital type
4. Click on hospital to view full details
5. Call directly from the app

### For Developers
```javascript
import { useHospital } from '../hooks/useHospital';

const MyComponent = () => {
  const { getHospitals, searchHospitals } = useHospital();
  
  // Get all hospitals
  const { data: hospitals } = await getHospitals('New York');
  
  // Search hospitals
  const { data: results } = await searchHospitals('blood bank');
};
```

---

## 🗺️ Interactive Map

### Display Locations on Map
```jsx
import DonorMap from '../components/DonorMap';

<DonorMap 
  locations={[
    { id: 1, name: "John Doe", type: "donor", lat: 40.7128, lng: -74.006, info: "O+" },
    { id: 2, name: "City Hospital", type: "hospital", lat: 40.7580, lng: -73.9855, info: "24/7" }
  ]}
/>
```

### Location Types
- `'donor'` - Red marker 🩸
- `'hospital'` - Blue marker 🏥
- `'bloodbank'` - Dark red marker 🩹

---

## 📢 Real-Time Notifications

### Setup Backend (Node.js)
See `SOCKET_IO_SETUP.md` for complete server code.

### Use in Component
```javascript
import { useSocket } from '../hooks/useSocket';

const HeaderComponent = () => {
  const { socket, notifications, connected, unreadCount } = useSocket();
  
  return (
    <>
      <NotificationBell unreadCount={unreadCount} />
      <NotificationPanel notifications={notifications} />
    </>
  );
};
```

### Emit Events
```javascript
import { emitBloodRequest, subscribeToBloodGroup } from '../lib/socketService';

// Subscribe to blood group notifications
subscribeToBloodGroup('O+', userId);

// Emit a blood request
emitBloodRequest({
  patient_name: 'John',
  blood_group: 'O+',
  units: 2,
  hospital: 'City Hospital'
});
```

---

## 💉 Donation Eligibility

### Check Eligibility
```javascript
import { checkDonorEligibility } from '../lib/eligibilityChecker';

const donor = {
  age: 28,
  gender: 'Male',
  weight: 70,
  hemoglobin: 14.5,
  last_donation: '2024-12-10'
};

const { eligible, reasons, nextEligibleDate } = checkDonorEligibility(donor);

if (eligible) {
  console.log('Ready to donate!');
} else {
  reasons.forEach(reason => console.log(reason));
  console.log(`Next eligible: ${nextEligibleDate}`);
}
```

### Display in UI
```jsx
import EligibilityStatus from '../components/EligibilityStatus';

<EligibilityStatus donor={donorData} />
```

---

## 📊 Donation History

### Record a Donation
```javascript
import { useDonationHistory } from '../hooks/useDonationHistory';

const { recordDonation } = useDonationHistory();

await recordDonation(userId, {
  blood_collected: 450,
  donation_center: 'Red Cross',
  blood_bank_name: 'Central Bank',
  notes: 'Felt great!'
});
```

### Get History
```javascript
const { getDonationHistory, getDonationStats } = useDonationHistory();

// Get last 20 donations
const { data: history } = await getDonationHistory(userId, 20);

// Get statistics
const { data: stats } = await getDonationStats(userId);
console.log(`Total donations: ${stats.total_donations}`);
console.log(`Blood collected: ${stats.total_blood_collected} ml`);
```

### Display in UI
```jsx
import DonationHistory from '../components/DonationHistory';

<DonationHistory userId={userId} />
```

---

## 🏆 Donor Badges

### Get Badges
```javascript
import { getEarnedBadges, getNextBadgeMilestone } from '../lib/badgeSystem';

const stats = { total_donations: 5, total_blood_collected: 2250 };

// Get earned badges
const earned = getEarnedBadges(stats);
console.log(earned); // [ { name: 'First Drop' }, { name: 'Regular Donor' } ]

// Get next badge
const next = getNextBadgeMilestone(stats);
console.log(next.badge.name); // 'Dedicated Hero'
console.log(next.progress.percentage); // 50% towards goal
```

### Display in UI
```jsx
import DonorBadges from '../components/DonorBadges';

<DonorBadges userId={userId} userData={userData} />
```

---

## 🔧 Integration Checklist

### Phase 2 Integration
- [ ] Create `hospitals` table in Supabase
- [ ] Add Hospitals link to Header
- [ ] Test hospital search at `/hospitals`
- [ ] Test map display with sample locations
- [ ] Update Find.jsx is using dynamic radius (already done)

### Phase 3 Integration
- [ ] Install socket.io-client: `npm install socket.io-client`
- [ ] Add `VITE_SOCKET_URL` to `.env`
- [ ] Create `donation_records` table in Supabase
- [ ] Setup Node.js Socket.io server (see SOCKET_IO_SETUP.md)
- [ ] Add NotificationBell to Header
- [ ] Integrate EligibilityStatus in Profile/Donate pages
- [ ] Add DonationHistory to Profile page
- [ ] Add DonorBadges to Profile page

---

## 🧪 Testing Individual Features

### Test Hospital Search
```javascript
// In browser console
import { useHospital } from './src/hooks/useHospital';
const hook = useHospital();
hook.searchHospitals('blood bank', 'New York').then(console.log);
```

### Test Eligibility
```javascript
import { getEligibilityScore } from './src/lib/eligibilityChecker';
const score = getEligibilityScore({ 
  age: 25, 
  weight: 70, 
  gender: 'Male' 
});
console.log(score); // 0-100
```

### Test Badges
```javascript
import { BADGES } from './src/lib/badgeSystem';
console.log(Object.values(BADGES)); // All available badges
```

---

## 📱 Mobile Responsive

All new components are fully responsive:
- ✅ HospitalCard - Works on all screen sizes
- ✅ DonorMap - Responsive map container
- ✅ EligibilityStatus - Mobile-friendly layout
- ✅ DonationHistory - Scrollable table on mobile
- ✅ DonorBadges - Grid adjusts to screen size

---

## ⚡ Performance Tips

1. **Limit Results**: Use `.limit(50)` in Supabase queries
2. **Index Searches**: Add indexes on frequently searched columns
3. **Lazy Load**: Load maps only when needed
4. **Debounce Search**: Debounce hospital search input
5. **Pagination**: Implement pagination for large result sets

---

## 🎨 Customization

### Change Badge Icons
Edit `src/lib/badgeSystem.js`:
```javascript
FIRST_DONATION: {
  icon: "🎉", // Change icon here
  color: "bg-red-100 text-red-800"
}
```

### Change Hospital Filter Options
Edit `src/pages/Hospitals.jsx`:
```javascript
<select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
  <option value="custom">Custom Filter</option>
</select>
```

### Customize Map Tiles
Edit `src/components/DonorMap.jsx`:
```javascript
L.tileLayer("https://tile.opentopomap.org/{z}/{x}/{y}.png", {
  // Use different map style
})
```

---

## 📞 Support & Troubleshooting

### Socket.io Connection Issues
- Check if backend server is running on correct port
- Verify `VITE_SOCKET_URL` is set correctly
- Check browser console for connection errors

### Map Not Loading
- Ensure Leaflet CSS is imported
- Check browser console for errors
- Verify coordinates are valid

### Eligibility Checker Shows Wrong Status
- Verify all required fields are provided
- Check if `last_donation` is ISO format
- Review eligibility criteria in `eligibilityChecker.js`

### Hospital Search Returns No Results
- Ensure hospital table is populated
- Check if city name matches exactly
- Try searching by hospital name instead

---

## 🎯 Next Features to Add

1. **Blood Request Broadcasting** - Let recipients request blood
2. **Donation Scheduling** - Book donation appointments
3. **Welfare Organization Directory** - List NGOs and welfare orgs
4. **Mobile App** - React Native version
5. **Email Notifications** - Send emails for important alerts
6. **Analytics Dashboard** - Stats and reporting
7. **Referral System** - Track donor referrals
8. **Community Features** - Forums, comments, ratings

---

Enjoy building with Bloodzy! 🩸
