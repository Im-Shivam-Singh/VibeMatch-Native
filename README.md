# VibeMatch Native 🎉

React Native + Expo app for **VibeMatch** — the party-finding platform that works across UK and India.

Built with **Expo SDK 56**, **Expo Router** (file-based routing), **TypeScript**, and **Zustand** for state management. Connects to the same VibeMatch backend API as the web PWA.

---

## 📱 Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/(auth)/login` | Phone OTP authentication |
| Onboarding | `/(auth)/onboarding` | Select vibe preferences |
| Home / Explore | `/(tabs)/` | Party feed with filters |
| Create Party | `/(tabs)/create` | Host a new party |
| Inbox | `/(tabs)/inbox` | Chat threads list |
| Tickets | `/(tabs)/tickets` | Purchased tickets with QR |
| Profile | `/(tabs)/profile` | User profile & settings |
| Party Detail | `/party/[id]` | Full party info, join, menu, reviews |
| Chat | `/chat/[id]` | 1-on-1 messaging |
| Edit Profile | `/edit-profile` | Update profile info |
| My Parties | `/my-parties` | Hosted parties list |
| Host Dashboard | `/host-dashboard` | Analytics & management |
| Join Requests | `/requests` | Accept/reject join requests |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or bun
- Expo Go app on your phone (for development)
- iOS Simulator (macOS only) or Android Emulator

### Install & Run

```bash
# Clone the repo
git clone https://github.com/Im-Shivam-Singh/vibematch-native.git
cd vibematch-native

# Install dependencies
npm install

# Start development server
npx expo start
```

Then scan the QR code with the **Expo Go** app on your phone, or press:
- `a` to open in Android emulator
- `i` to open in iOS simulator

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=https://vibematch.app
```

For local development against the Next.js backend:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000
```

---

## 📦 EAS Build Setup

EAS Build lets you create standalone APKs, AABs (Android App Bundles), and IPAs in the cloud.

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure the project

```bash
eas build:configure
```

This will create/update the `eas.json` file (already included in this repo).

### 4. Build profiles

| Profile | Android | iOS | Use Case |
|---------|---------|-----|----------|
| `development` | Debug APK | Simulator | Local testing with dev client |
| `preview` | Release APK | Device build | Easy sharing & testing |
| `production` | AAB (Play Store) | IPA (App Store) | Store submission |

### 5. Trigger a build

```bash
# Preview build (APK for easy testing)
eas build --platform android --profile preview

# Production build (AAB for Play Store)
eas build --platform android --profile production

# iOS production build
eas build --platform ios --profile production

# Build for both platforms
eas build --platform all --profile preview
```

### 6. Download & Install APK

After the build completes:

1. Go to [Expo Build Dashboard](https://expo.dev/accounts/vibematch/projects/vibematch-native/builds)
2. Find your build and click **Download**
3. Transfer the APK to your Android phone
4. Enable **Install from unknown sources** in phone settings
5. Open the APK file to install

Or install directly:
```bash
eas build:list  # List builds
eas build:run --platform android --latest  # Install latest on connected device
```

---

## ⚙️ GitHub Actions

The repo includes a GitHub Actions workflow (`.github/workflows/build.yml`) that:

- **Triggers on push to `main`** — builds both Android & iOS with `preview` profile
- **Manual trigger** — choose platform and build profile from the Actions tab

### Required GitHub Secrets

| Secret | Description | Required |
|--------|-------------|----------|
| `EXPO_TOKEN` | Expo access token (from `eas token:create`) | ✅ Yes |
| `SENDGRID_API_KEY` | SendGrid API key for email notifications | ❌ Optional |
| `NOTIFICATION_EMAIL` | Email address for build notifications | ❌ Optional |
| `EXPO_ACCOUNT` | Expo account/organization name | ❌ Optional (default: vibematch) |

### Setting up EXPO_TOKEN

```bash
# Generate a token
eas token:create

# Copy the token and add it to GitHub:
# Repo → Settings → Secrets and variables → Actions → New repository secret
# Name: EXPO_TOKEN
# Value: <your-token>
```

### Email Notifications

To receive email notifications when builds complete:

1. Create a [SendGrid](https://sendgrid.com/) account (free tier: 100 emails/day)
2. Generate an API key with "Mail Send" permission
3. Add `SENDGRID_API_KEY` and `NOTIFICATION_EMAIL` to GitHub secrets
4. Builds will send an email with download link on completion

### WhatsApp Notifications

Direct WhatsApp messaging from GitHub Actions is **not feasible** without the WhatsApp Business API. Here are options if you want to add this later:

| Option | Setup | Cost |
|--------|-------|------|
| **WhatsApp Business API** | Requires Facebook Business account + app review | Pay per message |
| **Twilio WhatsApp API** | Easier setup, official partner | Paid service |
| **CallMeBot** | Free for personal use, limited | Free |

For now, we use email notifications as the primary channel. The phone number `9677026531` is stored in the workflow context for reference.

---

## 🏗️ Project Structure

```
vibematch-native/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout + auth guard
│   ├── (auth)/                 # Auth group
│   │   ├── _layout.tsx
│   │   ├── login.tsx           # Phone OTP login
│   │   └── onboarding.tsx      # Vibe preference selection
│   ├── (tabs)/                 # Main tab navigation
│   │   ├── _layout.tsx         # Bottom tabs + FAB
│   │   ├── index.tsx           # Home / Explore
│   │   ├── inbox.tsx           # Chat threads
│   │   ├── create.tsx          # Create party
│   │   ├── tickets.tsx         # Tickets
│   │   └── profile.tsx         # Profile
│   ├── party/[id].tsx          # Party detail
│   ├── chat/[id].tsx           # 1-on-1 chat
│   ├── edit-profile.tsx        # Edit profile
│   ├── my-parties.tsx          # Hosted parties
│   ├── host-dashboard.tsx      # Analytics
│   └── requests.tsx            # Join requests
├── src/
│   ├── api.ts                  # API client (fetch-based)
│   ├── store.ts                # Zustand store (AsyncStorage)
│   ├── theme.ts                # Dark theme constants
│   ├── types.ts                # Shared types & utilities
│   └── components/             # Reusable components
│       ├── PartyCard.tsx       # Party feed card
│       ├── VibeBadge.tsx       # Vibe tag chip
│       ├── LoadingSpinner.tsx  # Loading indicator
│       └── EmptyState.tsx      # Empty state placeholder
├── .github/workflows/
│   └── build.yml               # EAS Build CI/CD
├── eas.json                    # EAS Build configuration
├── app.json                    # Expo app config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

---

## 🎨 Design System

- **Background**: `#0a0a0f` (deep black)
- **Surface**: `#13131a` → `#1a1a25` (dark card layers)
- **Primary**: `#a855f7` → `#c084fc` (purple/violet)
- **Text**: `#f0f0f5` / `#a0a0b0` / `#6a6a7a`
- **Status**: Green/Amber/Red with tinted backgrounds
- **Font**: System default (SF Pro on iOS, Roboto on Android)

---

## 📋 TODO / Future Enhancements

- [ ] Push notifications (Expo Notifications)
- [ ] Real device location (expo-location)
- [ ] Map view (react-native-maps)
- [ ] Image picker for party covers
- [ ] QR code scanner for ticket validation
- [ ] Deep linking for party sharing
- [ ] Biometric auth
- [ ] Offline support with async storage cache
- [ ] WhatsApp Business API integration for notifications
- [ ] App Store & Play Store submission assets

---

## 📄 License

MIT

---

Built with ❤️ for VibeMatch
