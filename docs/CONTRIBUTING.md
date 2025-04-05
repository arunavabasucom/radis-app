# Contributing to RADIS App

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Git
- Any IDE or text editor that supports TypeScript and Python

## Setup
```bash
git clone https://github.com/arunavabasucom/radis-app.git
cd radis-app/
```

### Frontend Setup
1. change to frontend directory
```bash
cd frontend
```

2. Install dependencies:
```bash
yarn install
```

3. Environment Setup:
   - Create a `.env` file in the frontend directory:
   ```bash
   touch .env
   ```
   - Add the following configuration:
   ```
   VITE_API_ENDPOINT="http://127.0.0.1:8000/"
   ```
   - This endpoint must match your backend server address
   - If you change the backend port, update this accordingly

4. Start development server:
```bash
yarn dev
```
- The frontend will run on `http://localhost:5173` by default
- Make sure your backend is running before starting the frontend

### Backend Setup
1. Navigate to backend directory:
```bash
cd ../backend
```

2. Create and activate virtual environment:
```bash
# Create virtual environment
python -m venv radis-env

# Activate virtual environment
# On Windows:
radis-env\Scripts\activate
# On Unix/MacOS:
source radis-env/bin/activate

# Verify activation (you should see (radis-env) at the start of your prompt)
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Environment Setup:
   - Create a `.env` file in the backend directory:
   ```bash
   touch .env
   ```
   - Add the following configuration:
   ```
   HITRAN_DB_PATH="path/to/your/hitran.db"
   DEBUG=True
   ```
   - Make sure to set the correct path to your HITRAN database
   - To download the HITRAN database:
     ```bash
     # Run the database download script
     python scripts/download_hitran.py
     ```
   - The database will be downloaded to the specified path in your `.env` file

5. Start the backend server:
```bash
cd src
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- The backend will run on `http://localhost:8000` by default
- The `--reload` flag enables auto-reload on code changes
- The `--host 0.0.0.0` allows external connections (if needed)

### Common Setup Issues
1. **Virtual Environment Issues**
   - If you get "command not found" errors, ensure the virtual environment is activated
   - On Windows, if activation fails, try: `.\radis-env\Scripts\activate`
   - If you get permission errors, try: `python -m venv radis-env --clear`

2. **API Connection Issues**
   - Ensure both frontend and backend are running
   - Check if the ports match in your frontend `.env` file
   - Verify no firewall is blocking the connection
   - Test the API endpoint in your browser: `http://localhost:8000/docs`

3. **Dependency Issues**
   - If pip install fails, try: `pip install --upgrade pip`
   - For specific package issues, try: `pip install package_name --no-cache-dir`
   - If you get version conflicts, try: `pip install -r requirements.txt --no-cache-dir`

4. **HITRAN Database Issues**
   - Ensure the HITRAN database path in `.env` is correct
   - The database file should be accessible by the application
   - If the database is missing, you'll need to download it first
   - To download the HITRAN database:
     ```bash
     # Navigate to backend directory
     cd backend
     # Run the database download script
     python scripts/download_hitran.py
     ```
   - The database will be downloaded to the specified path in your `.env` file

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```
3. If you've added code that should be tested, add tests.
4. If you've changed APIs, update the documentation.
5. Ensure the test suite passes.
6. Make sure your code lints.
7. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```
8. Create a pull request to the `main` branch.

## 📝 Pull Request Guidelines

### PR Description Template
```markdown
## What type of PR is this? (check all applicable)
- [ ] 🍕 Feature
- [ ] ⚙️ Chore
- [ ] 🐛 Bug Fix
- [ ] 🎨 Style
- [ ] 🧑‍💻 Refactor
- [ ] 📕 Documentation
- [ ] 🏎️ Optimization

## Description
[Detailed description of changes]

## Checklist
- [ ] I have read the contribution guidelines
- [ ] I have tested these changes locally
- [ ] I have updated the documentation (if applicable)
- [ ] The code follows the project's coding standards
- [ ] I have added/updated tests (if applicable)

## Screenshots/GIFs/Screen Recordings (if applicable)
[Add relevant media]
```

## 🧪 Testing Guidelines

1. **Frontend Testing**
   - Run unit tests: `yarn test`
   - Run coverage: `yarn test:coverage`
   - Run type checking: `yarn type-check`
   - Run linting: `yarn lint`
   - Run format check: `yarn format:check`

2. **Backend Testing**
   - Run tests: `pytest`
   - Run with coverage: `pytest --cov`
   - Run specific test file: `pytest tests/test_file.py`
   - Run with verbose output: `pytest -v`

## 📚 Documentation Guidelines

1. **Code Documentation**
   - Add JSDoc comments for frontend functions:
     ```typescript
     /**
      * Calculates the absorption spectrum for a given molecule
      * @param {string} molecule - The molecule name
      * @param {number[]} wavelengthRange - The wavelength range [min, max]
      * @returns {Promise<SpectrumData>} The calculated spectrum data
      */
     ```
   - Add docstrings for Python functions:
     ```python
     def calculate_spectrum(molecule: str, wavelength_range: List[float]) -> Dict:
         """
         Calculate the absorption spectrum for a given molecule.
         
         Args:
             molecule: The molecule name
             wavelength_range: The wavelength range [min, max]
             
         Returns:
             Dictionary containing the spectrum data
         """
     ```
   - Update API documentation for new endpoints
   - Add usage examples for new features

2. **User Documentation**
   - Update README.md for new features
   - Add usage examples with screenshots
   - Document configuration changes
   - Add troubleshooting guides

## 🎨 Code Style Guidelines

### Frontend (TypeScript/React)
- Use TypeScript for all new code
- Follow the existing code style
- Use functional components with hooks
- Write meaningful component and function names
- Add proper TypeScript types
- Use proper error handling

### Backend (Python/FastAPI)
- Follow PEP 8 style guide
- Use type hints
- Write meaningful function names
- Add proper error handling
- Document API endpoints

## Performance Considerations

When contributing, please keep in mind:

1. **Frontend Performance**
   - Minimize unnecessary re-renders
   - Use proper memoization with `useMemo` and `useCallback`
   - Optimize large data handling with pagination or virtualization
   - Consider loading states and skeleton screens
   - Use React.memo for pure components
   - Implement proper error boundaries

2. **Backend Performance**
   - Optimize database queries with proper indexing
   - Use proper caching with Redis or similar
   - Handle large calculations efficiently with background tasks
   - Consider memory usage and implement proper garbage collection
   - Use connection pooling for database connections
   - Implement rate limiting for API endpoints

## 🔍 Review Process

1. **Code Review**
   - PRs require at least one review
   - Address all review comments
   - Keep PRs focused and small

2. **Merge Process**
   - Squash commits when merging
   - Use conventional commit messages
   - Update documentation if needed

## 🤝 Questions?

Feel free to:
- Open an issue for questions
- Join our discussions in the GitHub Discussions section
- Contact maintainers through GitHub
- Check existing documentation
- Join our community chat (if applicable)

Before asking questions:
1. Check the existing documentation
2. Search through existing issues
3. Try to reproduce the issue locally
4. Provide detailed information about your setup

Thank you for contributing to RADIS App! 🎉 