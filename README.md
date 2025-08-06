# Tiramulta Revendedor - Frontend Admin Panel

A React-based admin panel for dealers/resellers to manage sales, products, and customer orders. This application provides a comprehensive interface for managing the Tiramulta business operations.

## 🚀 Features

### Core Functionality
- **Authentication System**: Secure login for dealers with session management
- **Dashboard**: Overview of sales metrics and recent orders
- **Sales Management**: 
  - View all sales with filtering and search capabilities
  - Create new sales with dynamic product selection
  - Download PDF documents for completed sales
- **Product Management**: Browse and search available products/resources
- **Responsive Design**: Mobile-friendly interface with adaptive layout

### Technical Features
- **React 18** with TypeScript for type safety
- **Chakra UI** for modern, accessible components
- **React Router** for client-side routing
- **Axios** for API communication with automatic token handling
- **Form handling** with Unform library
- **Date formatting** with date-fns
- **Currency formatting** with proper Brazilian Real (BRL) support
- **PDF generation** and download capabilities

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd revendedor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=https://your-api-backend-url.com
   ```

   **Important**: Replace `https://your-api-backend-url.com` with your actual backend API URL.

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

   The application will be available at `http://localhost:3001`

## 🏗️ Project Structure

```
src/
├── modules/                    # Feature modules
│   ├── auth/                  # Authentication module
│   │   └── pages/
│   │       └── LoginPage/     # Login page component
│   ├── orders/                # Sales/Orders module
│   │   └── page/
│   │       ├── ListPage/      # Sales listing page
│   │       └── RegisterPage/  # New sale registration page
│   └── products/              # Products module
│       └── pages/
│           └── ListPage/      # Products listing page
├── shared/                    # Shared components and utilities
│   ├── apis/                  # API configuration and interceptors
│   ├── components/            # Reusable UI components
│   ├── constants/             # Application constants
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Shared pages (Dashboard)
│   ├── routes/                # Application routing
│   ├── styles/                # Global styles and theme
│   └── utils/                 # Utility functions
└── App.tsx                    # Main application component
```

## 🎯 Usage Guide

### Authentication
1. Navigate to the login page (`/login`)
2. Enter your dealer credentials (login and password)
3. Upon successful authentication, you'll be redirected to the dashboard

### Dashboard
- View sales metrics and statistics
- See recent sales with quick access to PDF downloads
- Navigate to other sections using the sidebar menu

### Sales Management
- **View Sales** (`/vendas`): Browse all sales with search and date filtering
- **Create New Sale** (`/vendas/nova`): 
  - Select a product/resource
  - Fill in customer information
  - Add discounts or additional charges
  - Preview the generated document
  - Save the sale

### Products
- **View Products** (`/produtos`): Browse available products with search functionality

## 🔧 Development

### Available Scripts

- `npm start` - Start development server (port 3001)
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

### Code Style
- **Prettier** for code formatting
- **ESLint** for code linting
- **TypeScript** for type checking

### Key Dependencies
- `@chakra-ui/react` - UI component library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `@unform/core` & `@unform/web` - Form handling
- `date-fns` - Date manipulation
- `react-google-charts` - Charts and graphs
- `zod` - Schema validation

## 🚀 Deployment to Vercel

### Prerequisites for Vercel Deployment
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket**: Connect your repository
3. **Environment Variables**: Prepare your production environment variables

### Deployment Steps

1. **Prepare Environment Variables**
   
   In your Vercel project settings, add the following environment variable:
   ```
   REACT_APP_API_URL=https://your-production-api-url.com
   ```

2. **Deploy via Vercel CLI** (Optional)
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Deploy via Vercel Dashboard** (Recommended)
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Configure the following settings:
     - **Framework Preset**: Create React App
     - **Root Directory**: `./` (or leave empty)
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
     - **Install Command**: `npm install`

4. **Environment Variables Setup**
   - In your Vercel project dashboard, go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL` with your production API URL
   - Deploy to all environments (Production, Preview, Development)

5. **Custom Domain** (Optional)
   - In your Vercel project dashboard, go to Settings → Domains
   - Add your custom domain and follow the DNS configuration instructions

### Vercel Configuration File

Create a `vercel.json` file in your project root for advanced configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/logo.png",
      "dest": "/logo.png"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Post-Deployment Checklist

1. **Test Authentication**: Verify login functionality works with production API
2. **Test API Endpoints**: Ensure all API calls work correctly
3. **Check Responsive Design**: Test on mobile and desktop devices
4. **Verify PDF Downloads**: Test document generation and download
5. **Monitor Performance**: Use Vercel Analytics to monitor performance

## 🔒 Security Considerations

- **Environment Variables**: Never commit sensitive data to version control
- **API Security**: Ensure your backend API has proper CORS configuration
- **Authentication**: Tokens are stored in localStorage (consider more secure alternatives for production)
- **HTTPS**: Vercel automatically provides SSL certificates

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check if all environment variables are set in Vercel
   - Verify TypeScript compilation errors
   - Ensure all dependencies are properly installed

2. **API Connection Issues**
   - Verify `REACT_APP_API_URL` is correctly set
   - Check CORS configuration on your backend
   - Ensure API endpoints are accessible

3. **Authentication Problems**
   - Clear browser localStorage
   - Check if API authentication endpoints are working
   - Verify token format and expiration

## 📞 Support

For technical support or questions about this project, please contact the development team or create an issue in the repository.

## 📄 License

This project is proprietary software. All rights reserved.

---

**Note**: This application is designed specifically for the Tiramulta business model and integrates with their backend API. Make sure your backend API is properly configured and accessible before deployment. 