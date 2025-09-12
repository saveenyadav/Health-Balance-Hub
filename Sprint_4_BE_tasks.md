Sprint 4: CRITERIA - Yoga Classes & Booking System
TODO: Tasks:

# Yoga Classes Management
 Create yoga classes with instructor and schedule
 List available classes with filtering
 Update class details (admin only)
 Delete classes (admin only)

# Booking System
 Users can book available classes
 View user's current bookings
 Cancel bookings with policy
 Class capacity management

# Enhanced User Profiles
 Fitness level preferences
 Booking history tracking
 User dashboard with stats
 Profile customization



Sprint 4 Development Phases

Phase 1: Core Models (30 mins)
1. YogaClass.js      → Class schema with instructor, schedule, capacity
2. Booking.js        → User-Class relationship with status
3. UserProfile.js    → Extended user preferences and stats

Phase 2: Controllers (45 mins)
1. yogaClassController.js  → CRUD operations for yoga classes
2. bookingController.js     → Booking management (create, update, cancel)
3. userProfileController.js → User profile features and dashboard logic

Phase 3: Routes  & Middleware (30 mins)
1. yogaClassRoutes.js      → API endpoints for yoga classes
2. bookingRoutes.js        → API endpoints for bookings
3. userProfileRoutes.js    → API endpoints for user profiles


Phase 4: Advanced Middleware & Integration (45 mins)

1. checkCapacity.js        → Validate class capacity before booking
2. validateBooking.js      → Validate booking requests & rules
3. Update server.js        → Connect all new routes
4. Update API_ENDPOINTS.md → Document new endpoints
5. Test all endpoints      → Verify functionality


# checkCapacity.js - ESSENTIAL!
// Prevents overbooking classes
// Checks available spots before allowing booking
// Returns proper error messages when full
// Handles concurrent booking attempts

# validateBooking.js - GAME-CHANGER!
// Validates booking time restrictions (can't book past classes)
// Prevents duplicate bookings for same user/class
// Enforces cancellation policies
// Validates user permissions
// Checks payment status (future feature)




# Middleware Integration Points
// Booking Protection Chain:

router.post('/bookings', 
  protect,              // ✅ Must be authenticated
  validateBooking,      // 🆕 Check booking rules & policies
  checkCapacity,        // 🆕 Verify class capacity
  createBooking         // Create the booking
);

// Admin Protection Chain:

router.post('/yoga-classes', 
  protect,              // ✅ Must be authenticated
  authorize('admin'),   // 🆕 Admin only access
  createYogaClass       // Create yoga class
);



# Production-Ready Features
Capacity Management - No overbooking
Booking Policies - Cancellation rules
Admin Controls - Class management
User Dashboard - Personalized experience
Filtering & Search - Easy class discovery
Booking History - Complete tracking





#   File Structure Tree

backend/
├── models/
│   ├── User.js                     ✅ (existing - enhance for bookings)
│   ├── YogaClass.js               🆕 Phase 1 - Class schema with instructor, schedule, capacity
│   ├── Booking.js                 🆕 Phase 1 - User-Class relationship with status
│   └── UserProfile.js             🆕 Phase 1 - Extended user preferences and stats
│
├── controllers/
│   ├── authController.js          ✅ (existing)
│   ├── yogaClassController.js     🆕 Phase 2 - CRUD operations for yoga classes
│   ├── bookingController.js       🆕 Phase 2 - Booking management (create, update, cancel)
│   └── userProfileController.js   🆕 Phase 2 - User profile features and dashboard logic
│
├── routes/
│   ├── authRoutes.js              ✅ (existing)
│   ├── yogaClassRoutes.js         🆕 Phase 3 - API endpoints for yoga classes
│   ├── bookingRoutes.js           🆕 Phase 3 - API endpoints for bookings
│   └── userProfileRoutes.js       🆕 Phase 3 - API endpoints for user profiles
│
├── middleware/
│   ├── auth.js                    ✅ (existing - JWT protection)
│   ├── checkCapacity.js          🆕 Phase 4 - Validate class capacity before booking
│   └── validateBooking.js        🆕 Phase 4 - Validate booking requests & rules
│
├── utils/
│   ├── jwt.js                     ✅ (existing)
│   ├── dateHelper.js             🆕 Phase 4 - Date/time utilities for schedules
│   └── errorMessages.js          🆕 Phase 4 - Standardized error responses
│
├── config/
│   └── db.js                      ✅ (existing)
│
├── server.js                      🔄 Phase 4 - Update with new routes
├── .env                          ✅ (existing)
├── package.json                  ✅ (existing)
├── API_ENDPOINTS.md              🔄 Phase 4 - Update with new endpoints
└── Sprint_4.md                   ✅ (existing)



# Sprint 4 API Endpoints Structure

# YOGA CLASSES MANAGEMENT

/api/yoga-classes/
├── GET    /                       → List available classes with filtering
├── GET    /:id                    → Get specific class details
├── POST   /                       → Create yoga class (admin only)
├── PUT    /:id                    → Update class details (admin only)
├── DELETE /:id                    → Delete class (admin only)
├── GET    /search                 → Search classes by instructor/type/time
└── GET    /schedule               → Get weekly class schedule


# BOOKING SYSTEM
/api/bookings/
├── GET    /                       → View user's current bookings
├── GET    /history                → Booking history tracking
├── POST   /                       → Book available class
├── PUT    /:id                    → Update booking (reschedule)
├── DELETE /:id                    → Cancel booking with policy
├── GET    /class/:classId         → Get class bookings (admin)
└── GET    /upcoming               → Get user's upcoming bookings

# ENHANCED USER PROFILES
/api/user-profile/
├── GET    /                       → Get user profile
├── PUT    /                       → Profile customization
├── PUT    /preferences            → Fitness level preferences
├── GET    /dashboard              → User dashboard with stats
├── GET    /stats                  → Detailed booking statistics
└── PUT    /fitness-level          → Update fitness level


Authentication:     7 endpoints
Yoga Classes:       6 endpoints
Bookings:           5 endpoints
User Profiles:      5 endpoints
Blog System:        7 endpoints
Contact System:     8 endpoints
──────────────────────────────
Total:             38 API Endpoints! 