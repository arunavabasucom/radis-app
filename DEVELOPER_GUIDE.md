# RADIS Application Developer Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Development Setup](#development-setup)
4. [Contributing Guidelines](#contributing-guidelines)
5. [Additional Resources](#additional-resources)

## Project Overview

The RADIS Application is a web-based interface for the [RADIS library](https://github.com/radis/radis), which is used for high-resolution infrared molecular spectra calculations. This project provides an intuitive user interface that allows researchers and non-researchers to access powerful spectroscopic calculations without writing code.

### Key Features
- **Spectrum Calculation**: Compute molecular spectra using various databases (HITRAN, HITEMP, GEISA)
- **Spectrum Visualization**: Interactive plotting with Plotly.js
- **Spectrum Fitting**: Fit experimental spectra to theoretical models
- **Data Export**: Download spectra in various formats
- **Non-equilibrium Calculations**: Support for non-equilibrium molecular states

## Architecture

The system follows a client-server architecture where the frontend sends calculation requests to the backend, which performs the spectral calculations using the RADIS library and returns the results for visualization.

![Architecture](/docs/architecture.png)

### Technical Stack

#### Frontend
- **React 18** with TypeScript for type safety
- **Material-UI (MUI)** for consistent UI components
- **React Hook Form** for form management and validation
- **Zustand** for state management
- **Plotly.js** for interactive scientific plotting
- **Vite** for fast development and building

#### Backend
- **FastAPI** for high-performance API endpoints
- **RADIS** library for spectroscopic calculations
- **Pydantic** for data validation and serialization
- **Uvicorn** as ASGI server
- **Pytest** for testing



### Project Structure

```
radis-app/
├── frontend/                # React frontend application
│   ├── __tests__/           # Frontend test files
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── fields/       # Form field components
│   │   │   └── ...           # Other components (Plot, Form, Header, etc.)
│   │   ├── store/           # Zustand state management
│   │   ├── modules/         # Utility modules
│   │   │   ├── form-schema.ts  # Form validation schemas
│   │   │   └── ...           # Other utility modules
│   │   └── constants.ts     # Application constants
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # FastAPI backend application
│   ├── __tests__/           # Backend test files
│   ├── radis_scripts/       # RADIS utility scripts
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Pydantic models
│   │   ├── helpers/         # Utility functions
│   │   └── constants/       # Backend constants
│   ├── requirements.txt
│   └── Dockerfile
└── README.md
```
### Api Docs

After setting up the development environment and running the server locally, you can also refer to the Swagger and Redocly documentation for the backend at:
- http://localhost:8000/docs
- http://localhost:8000/redoc

## Development Setup

### Prerequisites
- **Node.js 18+** and **npm/yarn/pnpm**
- **Python 3.8+** and **pip**
- **Git**

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/arunavabasu-03/radis-app.git
   cd radis-app
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install  # or yarn install or pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev  # or yarn dev or pnpm dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server**
   ```bash
   uvicorn src.main:app --reload
   ```
### Environment Configuration

Create `.env` files for environment-specific configuration:

#### Frontend (`.env`)
```env
VITE_API_ENDPOINT = "http://127.0.0.1:8000/"
VITE_API_ENDPOINT_LOCAL= "http://127.0.0.1:8080/"
```

#### Backend (`.env`)
Since the HITEMP database requires registration, you can create an account [here](https://hitran.org/):
```env
HITRAN_EMAIL=your-email
HITRAN_PASSWORD=your-password
```

### Docker Development
You can run the backend locally using Docker. This is useful if your local machine is powerful and you will have option to use GPU.

#### **Docker deployment**
   ```bash
   cd backend
   docker build -t radis-app-backend .
   docker run -p 8000:8000 radis-app-backend
   ```
You can even mount your existing databases (if you've used the RADIS package) by running the container with the following command:

```bash
   docker run -d -p 8080:8080 \
   -v /home/mohy/.radisdb:/root/.radisdb \
   -v /home/mohy/radis.json:/root/radis.json \
   radis-backend
```

 **Deployment Status**
   - **Vercel**: frontend
   - **Google Cloud Run**: backend


#### MacOS HDF5 Library Issue
If you encounter `library not found for -lhdf5` error on MacOS:

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install HDF5
brew install hdf5

# Fix Homebrew directory bug
export HDF5_DIR=/opt/homebrew/opt/hdf5

# Reinstall requirements
pip install -r requirements.txt
```

## Contributing Guidelines

### 1. Code of Conduct
- Be respectful and inclusive
- Follow the project's coding standards
- Provide constructive feedback

### 2. Pull Request Process
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Write/update tests**
5. **Update documentation**
6. **Submit a pull request**

### 3. Commit Message Convention
Use conventional commit messages:
```
feat: add new spectrum calculation feature
fix: resolve wavenumber range validation issue
docs: update API documentation
test: add unit tests for molecule selector
refactor: improve error handling in backend
```

### 4. Issue Reporting
When reporting issues, include:
- **Description**: Clear description of the problem
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: OS, browser, versions
- **Screenshots**: If applicable

### 1. Feature Development

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards (see below)
   - Write tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Frontend tests and checks
   cd frontend
   yarn lint

   yarn type-check

   yarn test

   # Run tests with coverage
   yarn test:coverage

   # Backend tests
   cd backend
   pytest
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Additional Resources

### Documentation
- [RADIS Library Documentation](https://radis.readthedocs.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)

### Community
- [GitHub Issues](https://github.com/arunavabasu-03/radis-app/issues)
- [Discussions](https://github.com/arunavabasu-03/radis-app/discussions)
- [Open Astronomy Community](https://openastronomy.org/)

---

This developer guide should help you get started with contributing to the RADIS Application project. If you have any questions or need clarification, please don't hesitate to ask in the project's GitHub discussions or issues. 