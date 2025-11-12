# Authentication Setup Guide

## ✅ Improved Sign-In Experience

The sign-in page now includes **one-click demo user setup** with pre-fill buttons for quick testing!

---

## 🚀 Quick Start (New Users)

### Option 1: One-Click Setup (Recommended) 🎯

1. Navigate to: `http://localhost:3000/auth/signin`
2. Click the **"🔧 Setup Demo Users"** button (only needed once)
3. Wait for "✅ Demo users created successfully!" message
4. Click any demo account button to auto-fill credentials
5. Click **"Sign In"**

### Option 2: Command Line Setup

```bash
npm run seed:users
```

Then sign in with demo credentials.

---

## 🎨 New Features on Sign-In Page

### 1. **Quick Demo Login Buttons**

Three colorful buttons that auto-fill credentials:

- 🔴 **Admin** - admin@example.com / admin123
- 🔵 **Manager** - manager@example.com / manager123
- 🟢 **Viewer** - viewer@example.com / viewer123

Just **click a button** → credentials auto-fill → click "Sign In"!

### 2. **One-Click User Setup**

New button: **"🔧 Setup Demo Users"**
- Creates all 3 demo users in your database
- No terminal commands needed
- Shows success message when done
- Only needs to be clicked once ever

### 3. **Better Error Messages**

Instead of generic "Invalid email or password", you now get:
```
Invalid email or password. 
Note: Demo users need to be seeded first. Run: npm run seed:users
```

---

## 🔐 Demo Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@example.com | admin123 | ✅ Full access + audit logs |
| **Manager** | manager@example.com | manager123 | ✅ Create/edit vendors, scoring |
| **Viewer** | viewer@example.com | viewer123 | 👁️ Read-only access |

---

## 🎯 User Flow

```
1. Visit /auth/signin
   ↓
2. Click "Setup Demo Users" (first time only)
   ↓
3. See "✅ Demo users created successfully!"
   ↓
4. Click any demo account button
   ↓
5. Credentials auto-fill in form
   ↓
6. Click "Sign In"
   ↓
7. Redirect to /dashboard/vendors
```

---

## 🛠️ Technical Implementation

### New Files Added

1. **`app/api/setup/users/route.ts`**
   - API endpoint to create demo users
   - Hashes passwords with bcrypt
   - Upserts users (safe to run multiple times)

### Files Modified

1. **`app/auth/signin/page.tsx`**
   - Added quick-fill buttons
   - Added setup button
   - Better error messages
   - Visual role badges

2. **`middleware.ts`**
   - Added demo mode support
   - Fixed TypeScript errors
   - Better null checks

3. **`lib/auth.ts`**
   - Added try-catch for database errors
   - Better error logging

---

## 🎨 UI Improvements

### Before:
```
[Email Input]
[Password Input]
[Sign In Button]

Demo Credentials:
Admin: admin@example.com / admin123
Manager: manager@example.com / manager123
Viewer: viewer@example.com / viewer123
```

### After:
```
[Email Input]
[Password Input]
[Sign In Button]

━━━━━━━ Quick Demo Login ━━━━━━━

┌──────────────────────────────────┐
│ [ADMIN] admin@example.com        │
│         admin123        Click →  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ [MANAGER] manager@example.com    │
│           manager123    Click →  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ [VIEWER] viewer@example.com      │
│          viewer123      Click →  │
└──────────────────────────────────┘

[🔧 Setup Demo Users (First Time)]
```

---

## 🔧 Setup Methods Comparison

| Method | Speed | Ease | Best For |
|--------|-------|------|----------|
| **One-Click Setup** | ⚡ 2 seconds | 🟢 Easy | First-time users, demos |
| **Command Line** | ⚡ 5 seconds | 🟡 Medium | Developers, automation |
| **Manual via Prisma Studio** | 🐌 2 minutes | 🔴 Hard | Custom setups |

---

## 🐛 Troubleshooting

### "Invalid email or password"

**Solution 1**: Click "Setup Demo Users" button on signin page

**Solution 2**: Run in terminal:
```bash
npm run seed:users
```

**Solution 3**: Check database connection:
```bash
npm run prisma:studio
```

### Setup button not working?

1. Check if database is running:
   ```bash
   docker ps | grep postgres
   ```

2. Check DATABASE_URL in `.env`:
   ```env
   DATABASE_URL=postgresql://vendor_user:vendor_pass@localhost:5432/vendor_db
   ```

3. Push database schema:
   ```bash
   npm run prisma:push
   ```

### Users created but can't sign in?

Check if passwords match:
- Admin: `admin123` (not "password" or anything else)
- Manager: `manager123`
- Viewer: `viewer123`

---

## 🎯 For Vercel/Production Deployment

### Environment Variables Required

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Post-Deployment Setup

After deploying, set up users by:

1. Visit: `https://your-domain.vercel.app/auth/signin`
2. Click "Setup Demo Users" button
3. Users created in production database

Or run in Vercel dashboard:
```bash
npm run seed:users
```

---

## ✨ Benefits

### Before This Update:
- ❌ Users had to manually type credentials
- ❌ Required terminal commands
- ❌ No visual feedback on setup
- ❌ Confusing error messages

### After This Update:
- ✅ One-click credential filling
- ✅ Browser-based user creation
- ✅ Visual success indicators
- ✅ Helpful error messages
- ✅ Role-based color coding

---

## 🎓 Usage Tips

1. **First Time**: Always click "Setup Demo Users" first
2. **Quick Testing**: Use the colored buttons to switch between roles
3. **Demo Presentations**: Show the one-click setup to impress viewers
4. **Development**: No need to remember passwords anymore!

---

## 📸 Visual Guide

### Step 1: Click Setup
```
[🔧 Setup Demo Users (First Time)]
        ↓ (Click here)
```

### Step 2: Success Message
```
✅ Demo users created successfully! You can now sign in.
```

### Step 3: Choose Role
```
Click any colored button:
[ADMIN]   ← Full access
[MANAGER] ← Create/edit
[VIEWER]  ← Read-only
```

### Step 4: Auto-Fill
```
Email: admin@example.com    ← Filled automatically
Password: ••••••••          ← Filled automatically
```

### Step 5: Sign In
```
[Sign In] ← Click here
```

---

## 🚀 What's Next?

After successful sign-in:
- Redirects to `/dashboard/vendors`
- Shows all vendor data (or demo data if database empty)
- Full access based on your role

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Can click "Setup Demo Users" successfully
- [ ] Can see success message
- [ ] Can click any demo account button
- [ ] Credentials auto-fill in form
- [ ] Can sign in without errors
- [ ] Redirects to dashboard
- [ ] Can see vendors page

---

**Status**: ✅ Ready to Use | **Commit**: bbc151d | **Feature**: One-click setup + Auto-fill
