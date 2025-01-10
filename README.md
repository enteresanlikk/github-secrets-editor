# GitHub Secrets Editor

A modern web application built with Next.js that allows you to manage GitHub Actions secrets across your repositories efficiently.

## Features

- **Authentication**: Secure access using GitHub Personal Access Token
- **Repository Management**:
  - View and manage secrets for personal repositories
  - Support for organization repositories
  - Easy repository selection with dropdowns

- **Secrets Management**:
  - View all secrets in a repository
  - Add new secrets individually
  - Bulk import secrets from .env files
  - Edit existing secrets
  - Delete secrets
  - Secure encryption using GitHub's public key system

- **User Interface**:
  - Clean and modern design using shadcn/ui
  - Responsive layout
  - Loading states and error handling

## Technologies Used

- **Frontend**:
  - Next.js (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Lucide React icons

- **API Integration**:
  - Axios for API calls
  - GitHub REST API v3
  - Tweetsodium for secret encryption

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/enteresanlikk/github-secrets-editor.git
cd github-secrets-editor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Authentication**:
   - Generate a GitHub Personal Access Token with `repo` scope
   - Enter the token in the application

2. **Managing Secrets**:
   - Select between personal or organization repositories
   - Choose a repository from the dropdown
   - View existing secrets
   - Click "Edit" to modify secrets

3. **Adding Secrets**:
   - Individual secrets: Click "Add" button and fill in the details
   - Bulk import: Paste your .env file content in the textarea
   ```env
   API_KEY=your-api-key
   SECRET_TOKEN="your-secret-token"
   DB_PASSWORD='your-password'
   ```

4. **Saving Changes**:
   - Review your changes
   - Click "Save" to encrypt and update the secrets
   - Or click "Exit Edit" to discard changes

## Security

- All secret values are encrypted using GitHub's public key system
- No secret values are stored in the browser
- Direct API communication with GitHub
- Token is only stored in memory
