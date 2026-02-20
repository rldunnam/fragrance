A Next.js application for exploring and selecting fragrances. Built with React, TypeScript, and modern Next.js conventions.

Overview

Fragrance Selector is a web application designed to help users browse, evaluate, and compare fragrances through an interactive UI. The project uses the Next.js App Router architecture and is optimized for modern deployment platforms.

Tech Stack

Framework: Next.js

Language: TypeScript

UI: React

Package Manager: pnpm

Prerequisites

Install the following before running the project:

Node.js (LTS recommended)

pnpm

Check versions:

node -v
pnpm -v

If pnpm is not installed:

npm install -g pnpm
Installation

Clone or extract the project, then install dependencies:

pnpm install
Running the Development Server

Start the local development environment:

pnpm dev

Default URL:

http://localhost:3000
Production Build

To create and run an optimized production build:

pnpm build
pnpm start
Project Structure

Typical Next.js App Router layout:

/app            → Application routes & pages
/public         → Static assets
/styles         → Global styles (if present)
/components     → Reusable UI components
next.config.js  → Next.js configuration
package.json    → Dependencies & scripts
Deployment

This project can be deployed on any Node-compatible hosting provider.

Common choices:

Vercel (native Next.js support)

Netlify

AWS / containers

VPS / self-hosted Node server

Basic flow:

pnpm build
pnpm start
Configuration

Environment variables (if used) should be defined in:

.env.local

Example:

NEXT_PUBLIC_API_URL=...
Troubleshooting
Dependency Issues

Clear modules and reinstall:

rm -rf node_modules
pnpm install
Port Conflicts

Run on a different port:

pnpm dev -- -p 3001
Node Version Problems

Use Node LTS. Version mismatches are a common source of errors.

Notes

Designed for modern React / Next.js environments

Uses pnpm lockfile for deterministic installs

Optimized for server-side rendering and static generation
