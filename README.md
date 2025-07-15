# VulnGuard AI - Intelligent Vulnerability Management Platform

<div align="center">
  <img src="public/placeholder-logo.svg" alt="VulnGuard AI Logo" width="120" height="120">
  
  **Enterprise-grade security scanning and vulnerability management powered by AI**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
  [![AI SDK](https://img.shields.io/badge/AI%20SDK-Latest-purple)](https://sdk.vercel.ai/)
</div>

## 🎯 Overview

VulnGuard AI is a comprehensive cybersecurity platform designed specifically for Small and Medium Enterprises (SMEs). It combines advanced AI-powered vulnerability scanning with intelligent threat analysis to provide enterprise-grade security solutions that are accessible, affordable, and easy to manage.

### 🚀 Key Features

- **🤖 AI-Powered Security Assistant** - Real-time guidance and threat analysis
- **🔍 Multi-Layer Scanning** - Comprehensive security assessment across all infrastructure layers
- **📊 Real-Time Dashboards** - Live security metrics and vulnerability tracking
- **🛡️ Intelligent Threat Detection** - AI-driven vulnerability classification and prioritization
- **📈 Security Scoring** - Automated security posture assessment
- **🔄 Continuous Monitoring** - 24/7 security surveillance and alerting
- **📱 Responsive Design** - Full mobile and desktop compatibility
- **🔐 Enterprise Authentication** - Secure multi-tenant architecture

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **AI Integration**: Vercel AI SDK with multiple provider support
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with JWT tokens
- **Real-time**: Supabase Realtime for live updates

### Multi-Layer Scanning Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    VulnGuard AI Platform                    │
├─────────────────────────────────────────────────────────────┤
│  Network Layer    │  Web App Layer  │  Cloud Layer         │
│  • Port Scanning  │  • OWASP Top 10 │  • AWS/Azure/GCP    │
│  • Intrusion Det. │  • SQL Injection│  • Config Analysis  │
│  • Firewall Audit │  • XSS Detection│  • IAM Assessment   │
├─────────────────────────────────────────────────────────────┤
│  Database Layer   │  Infrastructure │  AI Analysis Engine │
│  • Access Control │  • OS Vulnerab. │  • Threat Intel     │
│  • Data Leakage   │  • Patch Status │  • Risk Scoring     │
│  • Encryption     │  • Compliance   │  • Remediation AI   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Git

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/vulnguard-ai-prototype.git
cd vulnguard-ai-prototype
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Supabase Setup

#### Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: VulnGuard AI
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Wait for the project to be created (2-3 minutes)

#### Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon Public Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **Service Role Key** (for admin operations)

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URLs (automatically provided by Supabase)
POSTGRES_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres

# Additional Supabase Configuration
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_ANON_KEY=your-anon-key-here
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-database-password
POSTGRES_DATABASE=postgres
POSTGRES_HOST=db.your-project.supabase.co

# AI Configuration (Optional - for enhanced AI features)
OPENAI_API_KEY=your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
\`\`\`

### 5. Database Initialization

Execute the SQL scripts in the Supabase SQL Editor in this exact order:

#### Step 1: Create Tables and Types
\`\`\`sql
-- Copy and paste the contents of scripts/01-create-tables.sql
-- This creates all database tables, custom types, and indexes
\`\`\`

#### Step 2: Create Functions and Triggers
\`\`\`sql
-- Copy and paste the contents of scripts/02-create-functions.sql
-- This creates database functions and automated triggers
\`\`\`

#### Step 3: Set Up Security Policies
\`\`\`sql
-- Copy and paste the contents of scripts/03-create-policies.sql
-- This configures Row Level Security (RLS) policies
\`\`\`

#### Step 4: Seed Sample Data
\`\`\`sql
-- Copy and paste the contents of scripts/04-seed-data.sql
-- This adds sample threat intelligence and test data
\`\`\`

### 6. Configure Authentication

In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. Configure **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Enable **Email confirmations** (optional for development)

### 7. Run the Application

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

\`\`\`
vulnguard-ai-prototype/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── chat/                 # AI chat endpoints
│   │   ├── scans/                # Scanning API endpoints
│   │   └── vulnerabilities/      # Vulnerability management
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/                # Main dashboard
│   ├── scans/                    # Scanning interface
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard components
│   │   ├── ai-assistant.tsx      # AI chat interface
│   │   ├── vulnerability-list.tsx # Vulnerability management
│   │   ├── scanning-progress.tsx # Real-time scan progress
│   │   └── security-overview.tsx # Security metrics
│   ├── scanning/                 # Scanning components
│   │   ├── scan-wizard.tsx       # Multi-step scan setup
│   │   ├── scan-results.tsx      # Scan result display
│   │   └── layer-selection.tsx   # Scan layer configuration
│   └── ui/                       # Reusable UI components
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase configuration
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── types.ts              # Database types
│   ├── scanning/                 # Scanning engines
│   │   ├── network-scanner.ts    # Network layer scanning
│   │   ├── web-scanner.ts        # Web application scanning
│   │   ├── cloud-scanner.ts      # Cloud infrastructure scanning
│   │   ├── database-scanner.ts   # Database security scanning
│   │   └── infrastructure-scanner.ts # Infrastructure scanning
│   └── utils.ts                  # General utilities
├── scripts/                      # Database scripts
│   ├── 01-create-tables.sql      # Table creation
│   ├── 02-create-functions.sql   # Database functions
│   ├── 03-create-policies.sql    # Security policies
│   └── 04-seed-data.sql          # Sample data
├── public/                       # Static assets
└── types/                        # TypeScript type definitions
\`\`\`

## 🔍 Core Features

### 1. Multi-Layer Security Scanning

#### Network Layer Scanning
- **Port Discovery**: Comprehensive port scanning and service detection
- **Vulnerability Assessment**: Network-level vulnerability identification
- **Intrusion Detection**: Real-time monitoring for suspicious activities
- **Firewall Analysis**: Configuration assessment and rule optimization

#### Web Application Scanning
- **OWASP Top 10**: Complete coverage of web application vulnerabilities
- **SQL Injection Detection**: Advanced SQLi pattern recognition
- **XSS Prevention**: Cross-site scripting vulnerability identification
- **Authentication Testing**: Session management and access control analysis

#### Cloud Infrastructure Scanning
- **Multi-Cloud Support**: AWS, Azure, Google Cloud Platform
- **Configuration Assessment**: Security misconfigurations detection
- **IAM Analysis**: Identity and access management review
- **Compliance Checking**: Industry standard compliance verification

#### Database Security Scanning
- **Access Control Audit**: User permissions and privilege escalation
- **Data Leakage Detection**: Sensitive data exposure identification
- **Encryption Assessment**: Data-at-rest and in-transit encryption
- **Backup Security**: Backup integrity and access control

#### Infrastructure Scanning
- **Operating System Vulnerabilities**: OS-level security assessment
- **Patch Management**: Missing updates and security patches
- **Configuration Hardening**: System configuration optimization
- **Compliance Monitoring**: Regulatory compliance verification

### 2. AI-Powered Security Assistant

The AI assistant provides:
- **Real-time Threat Analysis**: Contextual security insights
- **Remediation Guidance**: Step-by-step vulnerability fixes
- **Best Practice Recommendations**: Proactive security improvements
- **Risk Prioritization**: AI-driven vulnerability scoring

### 3. Real-time Dashboard

- **Security Metrics**: Live security posture visualization
- **Vulnerability Tracking**: Real-time vulnerability status updates
- **Scan Progress**: Live scanning progress and results
- **Threat Intelligence**: Latest security threats and indicators

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `POSTGRES_URL` | PostgreSQL connection string | Yes | `postgresql://postgres:pass@host:5432/db` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Optional | `sk-...` |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | Optional | `sk-ant-...` |

### Database Schema

The application uses a multi-tenant PostgreSQL database with the following key tables:

- **profiles**: User account information
- **organizations**: Multi-tenant organization structure
- **assets**: Scannable assets and targets
- **scans**: Scan configurations and results
- **vulnerabilities**: Identified security vulnerabilities
- **threat_intelligence**: Global threat intelligence data
- **ai_chat_sessions**: AI assistant conversation history

## 🚀 Development

### Running in Development Mode

\`\`\`bash
npm run dev
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Database Migrations

When making database changes:

1. Create a new migration file in `scripts/`
2. Test the migration in development
3. Apply to production using Supabase dashboard

### Adding New Scan Types

1. Create scanner implementation in `lib/scanning/`
2. Add database schema updates if needed
3. Update the scan wizard UI
4. Add result processing logic

## 🧪 Testing

### Running Tests

\`\`\`bash
npm test
\`\`\`

### Testing Database Functions

\`\`\`sql
-- Test user organization function
SELECT get_user_organization('user-uuid-here');

-- Test security score calculation
SELECT calculate_security_score('org-uuid-here');
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Setup for Production

Ensure all environment variables are configured in your production environment, especially:
- Database connection strings
- Supabase keys
- AI API keys (if using enhanced features)

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (Prettier)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Database Changes

- Always create migration scripts
- Test migrations thoroughly
- Document schema changes
- Consider backward compatibility

## 📋 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Scanning Endpoints

- `POST /api/scans` - Create new scan
- `GET /api/scans/:id` - Get scan details
- `PUT /api/scans/:id` - Update scan status
- `DELETE /api/scans/:id` - Delete scan

### Vulnerability Endpoints

- `GET /api/vulnerabilities` - List vulnerabilities
- `PUT /api/vulnerabilities/:id` - Update vulnerability status
- `POST /api/vulnerabilities/:id/comments` - Add comment

### AI Assistant Endpoints

- `POST /api/chat` - Send message to AI assistant
- `GET /api/chat/sessions` - Get chat history

## ⚠️ Known Issues & Limitations

### Current Limitations

1. **Scanning Scope**: Currently supports basic vulnerability scanning patterns
2. **AI Features**: Requires API keys for full AI functionality
3. **Real-time Updates**: Limited to Supabase real-time capabilities
4. **Mobile Experience**: Some advanced features are desktop-optimized

### Planned Improvements

- [ ] Advanced network scanning capabilities
- [ ] Integration with external security tools
- [ ] Enhanced mobile experience
- [ ] Custom vulnerability rules
- [ ] Advanced reporting features
- [ ] SSO integration
- [ ] API rate limiting
- [ ] Automated remediation workflows

### Performance Considerations

- Database queries are optimized with proper indexing
- Real-time updates may impact performance with large datasets
- AI features require external API calls which may introduce latency

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Reporting Security Issues

Please report security vulnerabilities privately to: security@vulnguard.ai

### Community

- **GitHub Discussions**: General questions and community support
- **Discord**: Real-time community chat (coming soon)
- **Blog**: Latest updates and security insights (coming soon)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend-as-a-service platform
- **Vercel** for hosting and AI SDK
- **shadcn/ui** for the beautiful UI components
- **Next.js** team for the amazing React framework
- **Open Source Community** for the countless libraries and tools

---

<div align="center">
  <p><strong>Built with ❤️ for SME cybersecurity</strong></p>
  <p>Making enterprise-grade security accessible to everyone</p>
</div>
