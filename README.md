# Vetly

**Know what you're buying before you hand over cash**

An AI-powered MOT analysis tool for UK used vehicle buyers. Enter a registration number, and Vetly analyzes the vehicle's MOT history using Claude AI to deliver a clear verdict: **Buy**, **Caution**, or **Walk Away**.

## Features

- 🔍 **MOT History Analysis**: Fetches complete MOT records for UK vehicles
- 🤖 **AI-Powered Verdict**: Claude AI analyzes history for mileage rollback, structural rust, recurring failures, and more
- 📊 **Clear Insights**: Red flags, green flags, confidence score, and suggested questions to ask the seller
- 💾 **Shortlist**: Save vehicles locally for later comparison
- 🌙 **Dark Mode**: Clean, modern interface with theme toggle
- 📱 **Mobile Responsive**: Works perfectly on any device

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An Anthropic API key ([get one free](https://console.anthropic.com))
- (Optional) DVLA MOT History API credentials for real data

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vetly.git
cd vetly
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` with your API keys:

```bash
cp .env.example .env.local
```

4. Edit `.env.local`:

```env
ANTHROPIC_API_KEY=your_api_key_here

# DVLA API (optional - app uses mock data by default)
USE_MOCK_MOT_DATA=true
DVLA_MOT_API_KEY=your_key_here
DVLA_CLIENT_ID=your_id_here
DVLA_CLIENT_SECRET=your_secret_here
DVLA_TOKEN_URL=https://your-token-url
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Try the Demo

The app includes mock MOT data for testing:
- **AB12CDE**: Clean Renault Trafic - mostly passing MOTs
- **CD34EFG**: Vauxhall Vivaro - mileage rollback + structural rust
- **EF56GHI**: Mercedes Vito - recurring dangerous defects

## Architecture

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions (no database)
- **AI**: Anthropic Claude 3.5 Sonnet for MOT analysis
- **State**: localStorage for shortlist
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Hero and search page
│   ├── results/            # Results page for analysis
│   ├── shortlist/          # Saved vehicles page
│   ├── actions.ts          # Server action for vehicle check
│   └── globals.css         # Global styles
├── components/
│   └── ui/                 # shadcn/ui components (button, card, etc.)
├── lib/
│   ├── mock-data.ts        # Example MOT data
│   ├── dvla.ts             # MOT fetching logic
│   ├── analysis.ts         # Claude AI integration
│   └── utils.ts            # Utility functions
```

## Using Real MOT Data

To switch from mock data to real DVLA API:

1. Get API credentials from [DVLA MOT History API Documentation](https://documentation.history.mot.api.gov.uk/)

2. Update `.env.local`:

```env
USE_MOCK_MOT_DATA=false
DVLA_MOT_API_KEY=your_dvla_key
DVLA_CLIENT_ID=your_client_id
DVLA_CLIENT_SECRET=your_client_secret
DVLA_TOKEN_URL=https://dvla-token-url
```

3. Restart the dev server

## Deploying to Vercel

### Option 1: Use the Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fvetly&env=ANTHROPIC_API_KEY,DVLA_MOT_API_KEY,DVLA_CLIENT_ID,DVLA_CLIENT_SECRET,DVLA_TOKEN_URL&envDescription=API%20credentials%20for%20Vetly&envLink=https%3A%2F%2Fdocs.anthropic.com%2Fgetting-started%2Fapi-keys)

### Option 2: CLI

```bash
npm i -g vercel
vercel
```

### Option 3: Git Push

1. Push to GitHub:

```bash
git push origin main
```

2. Connect your repo to Vercel at [vercel.com/new](https://vercel.com/new)

3. Add environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `DVLA_MOT_API_KEY` (optional)
   - `DVLA_CLIENT_ID` (optional)
   - `DVLA_CLIENT_SECRET` (optional)
   - `DVLA_TOKEN_URL` (optional)
   - `USE_MOCK_MOT_DATA=true` (to test with mock data)

4. Deploy!

## Building for Production

```bash
npm run build
npm start
```

## Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Anthropic SDK** - Claude AI integration
- **Lucide React** - Icons
- **next-themes** - Dark mode support
- **clsx / tailwind-merge** - Utility functions

## How the Analysis Works

The AI analyzes MOT history for:

- **Mileage Rollback**: Flags any registration with lower mileage than previous test
- **Structural Rust**: Tracks corrosion progression on sill, chassis, subframe
- **Recurring Failures**: Identifies patterns of same faults across multiple tests
- **Dangerous Defects**: Escalates severity for "Do Not Drive" defects
- **Missing MOTs**: Detects unexplained gaps > 13 months
- **Cover-ups**: Identifies sudden underseal applications
- **Chronic Neglect**: Flags 10+ defects in single test

## API Keys Setup

### Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

### DVLA MOT History API

1. Visit [documentation.history.mot.api.gov.uk](https://documentation.history.mot.api.gov.uk/)
2. Apply for credentials (UK-registered business required)
3. Once approved, add credentials to `.env.local`

For development/testing, leave `USE_MOCK_MOT_DATA=true` to use built-in demo data.

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

---

**Made with ❤️ for UK vehicle buyers**
