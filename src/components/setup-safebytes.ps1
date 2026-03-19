# SafeBytes - Complete Project Setup Script
# Run this in PowerShell to build the entire cybersecurity education platform

Write-Host "🛡️ SafeBytes - Complete Project Setup" -ForegroundColor Cyan
Write-Host "Building your cybersecurity education platform..." -ForegroundColor Green
Write-Host ""

# Check Node.js version
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ and try again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green

# Clean up existing project if it exists
if (Test-Path "safebytes") {
    Write-Host "🗑️ Removing existing SafeBytes project..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "safebytes" -ErrorAction SilentlyContinue
}

# Create project structure
Write-Host "📁 Creating project structure..." -ForegroundColor Blue
New-Item -ItemType Directory -Force -Path "safebytes" | Out-Null
Set-Location "safebytes"

# Create all directories
$directories = @(
    "frontend", "backend", "shared", "docs", "assets",
    "frontend/src/components", "frontend/src/components/ui", "frontend/src/components/layout",
    "frontend/src/components/simulators", "frontend/src/components/gamification",
    "frontend/src/pages", "frontend/src/pages/auth", "frontend/src/pages/lessons",
    "frontend/src/pages/dashboard", "frontend/src/hooks", "frontend/src/utils",
    "frontend/src/types", "frontend/src/stores", "frontend/src/lib",
    "backend/src", "backend/src/routes", "backend/src/controllers",
    "backend/src/middleware", "backend/src/services", "backend/src/utils"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "✅ Project structure created" -ForegroundColor Green

# Setup Frontend
Write-Host "⚛️ Setting up React frontend..." -ForegroundColor Blue
Set-Location "frontend"

# Initialize Vite React TypeScript project
npm create vite@latest . -- --template react-ts --yes 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating Vite project manually..." -ForegroundColor Yellow
    npm init -y | Out-Null
    npm install vite @vitejs/plugin-react typescript react react-dom @types/react @types/react-dom --save-dev | Out-Null
}

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow

# Core React dependencies
npm install | Out-Null

# UI and styling
npm install tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography | Out-Null
npm install framer-motion lucide-react react-router-dom | Out-Null
npm install clsx tailwind-merge class-variance-authority | Out-Null

# State management and utilities
npm install zustand react-hook-form @hookform/resolvers zod | Out-Null
npm install axios @tanstack/react-query | Out-Null

# Visualization and charts
npm install d3 @types/d3 recharts | Out-Null

# PWA capabilities
npm install vite-plugin-pwa workbox-window | Out-Null

# Dev dependencies
npm install -D @types/node eslint-plugin-tailwindcss prettier prettier-plugin-tailwindcss | Out-Null

# Initialize Tailwind
npx tailwindcss init -p | Out-Null

Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Setup Backend
Write-Host "🔧 Setting up Node.js backend..." -ForegroundColor Blue
Set-Location "../backend"

# Initialize package.json
npm init -y | Out-Null

Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow

# Core backend dependencies
npm install express cors helmet morgan compression | Out-Null
npm install jsonwebtoken bcryptjs dotenv | Out-Null
npm install prisma @prisma/client | Out-Null
npm install socket.io joi express-rate-limit | Out-Null

# TypeScript and development dependencies
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken | Out-Null
npm install -D ts-node nodemon concurrently | Out-Null

# Initialize TypeScript
npx tsc --init | Out-Null

# Initialize Prisma
npx prisma init | Out-Null

Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Go back to root
Set-Location ".."

Write-Host "📝 Creating configuration files..." -ForegroundColor Blue

# Frontend Tailwind Config
@"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        cyber: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        warning: { 500: '#f59e0b', 600: '#d97706' },
        danger: { 500: '#ef4444', 600: '#dc2626' }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
"@ | Out-File -FilePath "frontend/tailwind.config.js" -Encoding UTF8

# Frontend package.json scripts update
$frontendPackage = Get-Content "frontend/package.json" | ConvertFrom-Json
$frontendPackage.scripts.dev = "vite"
$frontendPackage.scripts.build = "tsc && vite build"
$frontendPackage.scripts.preview = "vite preview"
$frontendPackage | ConvertTo-Json -Depth 10 | Out-File -FilePath "frontend/package.json" -Encoding UTF8

# Backend package.json update
@"
{
  "name": "safebytes-backend",
  "version": "1.0.0",
  "description": "SafeBytes Cybersecurity Education Platform API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "keywords": ["cybersecurity", "education", "api"],
  "author": "SafeBytes Team",
  "license": "MIT"
}
"@ | Out-File -FilePath "backend/package.json" -Encoding UTF8

# Backend .env file
@"
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="safebytes-super-secret-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
"@ | Out-File -FilePath "backend/.env" -Encoding UTF8

# Prisma Schema
@"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  password    String
  level       Int      @default(1)
  xp          Int      @default(0)
  streakDays  Int      @default(0)
  lastLogin   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  progress    UserProgress[]
  badges      UserBadge[]
  simulations UserSimulation[]

  @@map("users")
}

model Module {
  id           String   @id @default(cuid())
  name         String
  description  String
  unlockLevel  Int      @default(1)
  difficulty   String   @default("beginner")
  order        Int
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  lessons      Lesson[]

  @@map("modules")
}

model Lesson {
  id          String   @id @default(cuid())
  moduleId    String
  title       String
  content     String
  xpReward    Int      @default(10)
  order       Int
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  module      Module @relation(fields: [moduleId], references: [id])
  progress    UserProgress[]

  @@map("lessons")
}

model UserProgress {
  id          String   @id @default(cuid())
  userId      String
  lessonId    String
  completed   Boolean  @default(false)
  score       Int?
  attempts    Int      @default(0)
  completedAt DateTime?
  createdAt   DateTime @default(now())

  user        User   @relation(fields: [userId], references: [id])
  lesson      Lesson @relation(fields: [lessonId], references: [id])

  @@unique([userId, lessonId])
  @@map("user_progress")
}

model Badge {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  icon        String
  xpReward    Int      @default(50)
  rarity      String   @default("common")
  createdAt   DateTime @default(now())

  userBadges  UserBadge[]

  @@map("badges")
}

model UserBadge {
  id       String   @id @default(cuid())
  userId   String
  badgeId  String
  earnedAt DateTime @default(now())

  user     User  @relation(fields: [userId], references: [id])
  badge    Badge @relation(fields: [badgeId], references: [id])

  @@unique([userId, badgeId])
  @@map("user_badges")
}

model Simulation {
  id         String   @id @default(cuid())
  type       String
  name       String
  data       String
  difficulty String   @default("beginner")
  xpReward   Int      @default(20)
  createdAt  DateTime @default(now())

  userSims   UserSimulation[]

  @@map("simulations")
}

model UserSimulation {
  id           String   @id @default(cuid())
  userId       String
  simulationId String
  score        Int
  timeSpent    Int
  completedAt  DateTime @default(now())

  user         User       @relation(fields: [userId], references: [id])
  simulation   Simulation @relation(fields: [simulationId], references: [id])

  @@map("user_simulations")
}
"@ | Out-File -FilePath "backend/prisma/schema.prisma" -Encoding UTF8

Write-Host "📱 Creating React components..." -ForegroundColor Blue

# Main App.tsx
@"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/dashboard/DashboardPage'
import SimulatorPage from './pages/SimulatorPage'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
            </Routes>
          </motion.div>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App
"@ | Out-File -FilePath "frontend/src/App.tsx" -Encoding UTF8

# Layout Component
@"
import { ReactNode } from 'react'
import { Shield, Home, Target, Zap } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: Target, label: 'Dashboard' },
    { path: '/simulator', icon: Zap, label: 'Simulator' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <h1 className="text-xl font-bold text-white">SafeBytes</h1>
            </div>
            <nav className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors $${
                    location.pathname === item.path
                      ? 'text-blue-300 bg-blue-500/20'
                      : 'text-gray-300 hover:text-blue-300 hover:bg-blue-500/10'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
"@ | Out-File -FilePath "frontend/src/components/layout/Layout.tsx" -Encoding UTF8

# HomePage
@"
import { motion } from 'framer-motion'
import { Shield, Zap, Users, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Interactive Learning',
      description: 'Learn cybersecurity through hands-on simulations and real scenarios'
    },
    {
      icon: Zap,
      title: 'Gamified Experience',
      description: 'Earn XP, unlock badges, and level up your security skills'
    },
    {
      icon: Users,
      title: 'Safe Environment',
      description: 'Practice identifying threats in a controlled setting'
    },
    {
      icon: Award,
      title: 'Track Progress',
      description: 'Monitor your learning journey and achievements'
    }
  ]

  return (
    <div className="space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-white mb-6">
          Learn Cybersecurity the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Fun Way
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Master cybersecurity fundamentals through interactive lessons, 
          gamified challenges, and hands-on simulations. No technical background required!
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center gap-2"
          >
            Start Learning
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/simulator"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
          >
            Try Simulator
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
          >
            <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-sm rounded-xl p-8 text-center border border-blue-500/20"
      >
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to Become a Cyber Hero?</h2>
        <p className="text-xl mb-6 text-gray-300">
          Join thousands of learners protecting themselves and others online
        </p>
        <Link
          to="/dashboard"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Begin Your Journey
        </Link>
      </motion.div>
    </div>
  )
}

export default HomePage
"@ | Out-File -FilePath "frontend/src/pages/HomePage.tsx" -Encoding UTF8

# Dashboard Page
@"
import { motion } from 'framer-motion'
import { Trophy, Target, Zap, Shield, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const DashboardPage = () => {
  const stats = [
    { icon: Trophy, label: 'Level', value: '1', color: 'text-yellow-400' },
    { icon: Zap, label: 'XP Points', value: '0', color: 'text-blue-400' },
    { icon: Target, label: 'Lessons', value: '0/20', color: 'text-green-400' },
    { icon: Shield, label: 'Badges', value: '0', color: 'text-purple-400' },
  ]

  const modules = [
    {
      title: 'Phishing Detection',
      description: 'Learn to identify suspicious emails and messages',
      icon: Mail,
      progress: 0,
      lessons: 8,
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Password Security',
      description: 'Master password creation and management',
      icon: Shield,
      progress: 0,
      lessons: 6,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Privacy & Tracking',
      description: 'Understand online privacy and data protection',
      icon: Target,
      progress: 0,
      lessons: 5,
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Your Cyber Journey! 🚀
        </h1>
        <p className="text-gray-300">
          Track your progress and continue learning cybersecurity
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
          >
            <stat.icon className={`h-8 w-8 $${stat.color} mb-2`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r $${module.color} flex items-center justify-center mb-4`}>
              <module.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
            <p className="text-gray-400 mb-4">{module.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
              <span>{module.progress}/{module.lessons} lessons</span>
              <span>{Math.round((module.progress / module.lessons) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r $${module.color}`}
                style={{ width: `$${(module.progress / module.lessons) * 100}%` }}
              ></div>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all group-hover:scale-105">
              {module.progress === 0 ? 'Start Module' : 'Continue'}
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-8 text-center border border-green-500/20"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Try Our Phishing Simulator</h2>
        <p className="mb-6 text-gray-300">Test your skills with realistic phishing scenarios</p>
        <Link
          to="/simulator"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
        >
          Launch Simulator
        </Link>
      </motion.div>
    </div>
  )
}

export default DashboardPage
"@ | Out-File -FilePath "frontend/src/pages/dashboard/DashboardPage.tsx" -Encoding UTF8

# Simulator Page
@"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react'

const SimulatorPage = () => {
  const [currentEmail, setCurrentEmail] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [userChoice, setUserChoice] = useState<'safe' | 'phishing' | null>(null)

  const phishingEmails = [
    {
      from: 'security@amazone-support.com',
      subject: 'URGENT: Verify your account or it will be suspended',
      body: 'Dear Customer, Your account has suspicious activity. Click here to verify immediately or your account will be locked within 24 hours. Verify Now: http://amazon-verify-security.com/verify',
      isPhishing: true,
      explanation: 'This is phishing! Notice the misspelled domain (amazone instead of amazon), urgent language, and suspicious link.'
    },
    {
      from: 'notifications@linkedin.com',
      subject: 'You have 3 new profile views',
      body: 'Hi there! You have new profile views from professionals in your network. View your profile analytics to see who has been checking out your profile.',
      isPhishing: false,
      explanation: 'This appears to be a legitimate LinkedIn notification. The domain is correct and the content is normal.'
    },
    {
      from: 'noreply@paypal-security.net',
      subject: 'PayPal Payment Hold - Action Required',
      body: 'Your recent payment of $299.99 has been put on hold. To release this payment, please verify your information by clicking the link below. If you did not make this payment, click here to dispute: http://paypal-resolve.net/dispute',
      isPhishing: true,
      explanation: 'This is phishing! PayPal uses @paypal.com, not @paypal-security.net. The urgent tone and suspicious link are red flags.'
    }
  ]

  const currentEmailData = phishingEmails[currentEmail]

  const handleChoice = (choice: 'safe' | 'phishing') => {
    setUserChoice(choice)
    const correct = (choice === 'phishing') === currentEmailData.isPhishing
    if (correct) {
      setScore(score + 10)
    }
    setShowResult(true)
  }

  const nextEmail = () => {
    if (currentEmail < phishingEmails.length - 1) {
      setCurrentEmail(currentEmail + 1)
      setShowResult(false)
      setUserChoice(null)
    } else {
      // End of simulation
      alert(`Simulation complete! Final score: $${score}/$${phishingEmails.length * 10}`)
    }
  }

  const resetSimulation = () => {
    setCurrentEmail(0)
    setScore(0)
    setShowResult(false)
    setUserChoice(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          🎯 Phishing Email Simulator
        </h1>
        <p className="text-gray-300">
          Can you spot the phishing emails? Test your cybersecurity skills!
        </p>
      </motion.div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-white font-semibold">
              Email {currentEmail + 1} of {phishingEmails.length}
            </span>
          </div>
          <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
            <span className="text-blue-300 font-semibold">Score: {score}</span>
          </div>