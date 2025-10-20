FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Install system dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm and AI CLIs
RUN npm install -g pnpm@9.15.1 @anthropic-ai/claude-code @google/gemini-cli @openai/codex

# Set working directory
WORKDIR /workspaces/agor

# Run as root for simplified sandbox
# Docker access works out of the box in Codespaces
