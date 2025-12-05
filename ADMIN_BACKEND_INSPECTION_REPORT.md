# City Official (Admin) Backend Inspection Report
**Date:** December 5, 2025  
**Status:** Security & Backend Assessment

---

## Executive Summary

After a thorough inspection of the City Official (Admin) features, several **critical backend lapses and security vulnerabilities** have been identified. Below is a detailed breakdown of issues found and recommended fixes.

---

## 🔴 CRITICAL ISSUES

### 1. **Pickup Details Modal - No Backend Authentication or Data Validation**

**Location:** `src/app/dashboard-admin/pickup-details/page.js`

**Issue:**
- ❌ The modal is a **client-side only component** with NO server-side validation
- ❌ Data is passed via **URL query parameters** (XSS vulnerability)
- ❌ No verification that the admin is authorized to view this pickup
- ❌ No check that the pickup belongs to their municipality
- ❌ "Mark as Completed" button has no implementation (code is commented/removed)
- ❌ No database schema for `completed` or `completed_at` columns (error shown in screenshots)
- ❌ No notification system implemented for residents

**Code Example (Current):**
```javascript
// Only uses query params, NO backend validation
const pickup = useMemo(() => ({
  id: params.get('id') || 'demo',
  name: params.get('name') || 'Jane Alice Cruz',
  status: params.get('status') || 'scheduled',
  // ... all data from URL parameters, NO verification
}), [params]);

// Button has no click handler implemented
<button style={{...}}>Mark as Completed</button>
```

**Recommended Fixes:**
1. Make the page a **server-side component** that validates the user's role
2. Fetch pickup data directly from Supabase with proper authorization checks
3. Implement Row-Level Security (RLS) policies for pickups
4. Add `completed` and `completed_at` columns to `pickup_schedule` table
5. Implement proper "Mark as Completed" handler with notifications

---

### 2. **Missing Role-Based Access Control (RBAC) in Pickup Features**

**Location:** 
- `src/app/dashboard-admin/pickups/page.js`
- `src/app/dashboard-admin/pickups/PickupsAdminClient.js`

**Issue:**
- ❌ No verification that the user accessing pickups has "admin" or "city_official" role
- ❌ Client-side component receives `user` but never validates role
- ❌ No server-side role check before rendering the page
- ❌ Any authenticated user could theoretically access admin features if they know the URL

**Code Example (Current):**
```javascript
// PickupsAdminPage - NO role check
export default async function PickupsAdminPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // ❌ MISSING: Check if user.role === 'admin' or 'city_official'
  return <PickupsAdminClient user={user} />;
}
```

**Recommended Fixes:**
```javascript
export default async function PickupsAdminPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (!user) redirect('/signin');
  
  // ✅ ADD: Role validation
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (error || !profile || !['admin', 'city_official'].includes(profile.role)) {
    redirect('/dashboard'); // Redirect non-admins
  }
  
  return <PickupsAdminClient user={user} />;
}
```

---

### 3. **No Middleware Protection for Admin Routes**

**Location:** `my-nextjs-app/middleware.js` (found but not in main src/)

**Issue:**
- ❌ Middleware exists but is in wrong location: `my-nextjs-app/middleware.js` instead of project root
- ❌ Middleware may not be active/loaded properly
- ❌ No enforcement of role checks at the route level
- ❌ Admin routes are unprotected at entry point

**Recommended Fixes:**
1. Move `middleware.js` to project root: `/middleware.js`
2. Ensure middleware is active and logs verify it's running
3. Add comprehensive role/route checks in middleware

---

### 4. **Pickup Database Schema Issues**

**Issue:**
- ❌ `pickup_schedule` table missing `completed` and `completed_at` columns
- ❌ No `status` column (was trying to update this in pickup-details modal)
- ❌ No `admin_notes` or `marked_by` columns to track admin actions
- ❌ No indexes on commonly queried fields

**Required Migration:**
```sql
-- Add missing columns to pickup_schedule
ALTER TABLE pickup_schedule 
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;

ALTER TABLE pickup_schedule 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

ALTER TABLE pickup_schedule 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Scheduled';

ALTER TABLE pickup_schedule 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE pickup_schedule 
ADD COLUMN IF NOT EXISTS marked_by UUID REFERENCES auth.users(id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_pickup_schedule_status 
  ON pickup_schedule(status);

CREATE INDEX IF NOT EXISTS idx_pickup_schedule_completed 
  ON pickup_schedule(completed);

CREATE INDEX IF NOT EXISTS idx_pickup_schedule_user_id 
  ON pickup_schedule(user_id);
```

---

### 5. **Notification System Not Implemented**

**Location:** `src/app/dashboard-admin/pickup-details/page.js`

**Issue:**
- ❌ "Mark as Completed" has no notification logic
- ❌ Residents are not notified when pickups are completed
- ❌ No notification template or system for admin actions

**Recommended Implementation:**
```javascript
// Add to pickup-details page.js
const handleMarkAsCompleted = async () => {
  try {
    // 1. Update pickup status
    const { error: updateError } = await supabase
      .from('pickup_schedule')
      .update({ 
        completed: true,
        completed_at: new Date().toISOString(),
        marked_by: user.id
      })
      .eq('id', pickup.id);

    if (updateError) throw updateError;

    // 2. Create notification for resident
    const { error: notifError } = await supabase
      .from('notifications')
      .insert([{
        user_id: pickup.user_id,
        title: 'Pickup Completed',
        message: `Your ${pickup.type} scheduled on ${pickup.datetime} has been marked as completed.`,
        type: 'pickup_completed',
        created_at: new Date().toISOString(),
        is_read: false
      }]);

    if (notifError) console.error('Notification error:', notifError);
    
    setSuccess(true);
    setTimeout(() => router.back(), 1500);
  } catch (err) {
    setError(err.message);
  }
};
```

---

## 🟡 MODERATE ISSUES

### 6. **SQL Injection Risk in Pickup Filtering**

**Location:** `src/app/dashboard-admin/pickups/PickupsAdminClient.js` (line ~44)

**Issue:**
- ⚠️ Using `.ilike()` with direct string interpolation

**Current Code:**
```javascript
.ilike('address', `%${adminMunicipality}%`)
```

**Status:** ✅ Actually OK because Supabase handles parameterization

---

### 7. **Missing Error Handling in Data Fetching**

**Location:** `src/app/actions/data.js`

**Issue:**
- ⚠️ Generic error returns without proper error codes
- ⚠️ No distinction between auth errors and DB errors
- ⚠️ No logging for debugging

**Current:**
```javascript
if (error) {
  return { error: error.message }
}
```

**Recommended:**
```javascript
if (error) {
  console.error(`[ERROR] ${tableName}:`, error);
  return { 
    error: error.message,
    code: error.code,
    status: 'error'
  }
}
```

---

### 8. **No Audit Trail for Admin Actions**

**Issue:**
- ⚠️ When an admin marks a pickup as completed, there's no audit log
- ⚠️ No tracking of who did what and when
- ⚠️ No way to reverse/undo admin actions

**Recommended Solution:**
Create an `admin_audit_log` table:
```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL, -- 'pickup_completed', 'report_updated', etc.
  table_name TEXT NOT NULL,
  record_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (admin_id) REFERENCES profiles(id)
);
```

---

### 9. **No Rate Limiting on Admin Actions**

**Issue:**
- ⚠️ No rate limiting on bulk operations
- ⚠️ An admin could spam mark all pickups as completed
- ⚠️ No throttling on API calls

---

### 10. **Settings Page - Missing Role Check**

**Location:** `src/app/dashboard-admin/settings/page.js`

**Issue:**
- ⚠️ No verification that only admins can access settings
- ⚠️ Any authenticated user could potentially access

**Fix:**
```javascript
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (!profile || !['admin', 'city_official'].includes(profile.role)) {
  redirect('/dashboard');
}
```

---

## 🟢 POSITIVE FINDINGS

✅ **Authentication Flow:** Supabase auth integration is properly configured  
✅ **Municipality Scoping:** Data is correctly scoped by admin's municipality  
✅ **Session Management:** Server-side session handling is implemented  
✅ **Data Fetching Pattern:** SSR + Client pattern is reasonable  

---

## Priority Action Items

### P0 (Critical - Do Immediately)
1. [ ] Add role-based access control to all admin routes
2. [ ] Implement "Mark as Completed" functionality with notifications
3. [ ] Add missing database columns (`completed`, `completed_at`, `status`)
4. [ ] Fix pickup-details modal to use server-side data fetching
5. [ ] Verify middleware.js is in correct location and active

### P1 (High - Do This Week)
6. [ ] Add audit logging for admin actions
7. [ ] Implement notification system
8. [ ] Add error handling and logging
9. [ ] Add role checks to settings, profile, reports pages

### P2 (Medium - Do Soon)
10. [ ] Add rate limiting
11. [ ] Improve error messages
12. [ ] Add unit tests for role checks

---

## Testing Checklist

- [ ] Try accessing `/dashboard-admin/pickups` as a resident (should redirect)
- [ ] Try accessing `/dashboard-admin/settings` as a resident (should redirect)
- [ ] Test "Mark as Completed" - verify DB is updated and notification is sent
- [ ] Verify admin can only see pickups in their municipality
- [ ] Test all error scenarios (missing user, no role, etc.)

---

## Notes

The City Official dashboard has a good foundation but **lacks critical backend security checks and proper data validation**. The pickup details modal is particularly vulnerable as it relies entirely on URL parameters without server-side verification.

**Estimated Fix Time:** 4-6 hours for critical items
