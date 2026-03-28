# Drug Inventory Tracker

A full-stack **Drug Inventory Management System** built with **Angular** and **ASP.NET Core Web API**, designed for pharmacy workflows to manage drugs, inventory, suppliers, and automated stock alerts.

Live Demo: https://orange-wave-021cbcc00.1.azurestaticapps.net
API Docs: https://drug-inventory-api-mukul-a5d0e9b9fhbjbpdd.southindia-01.azurewebsites.net/index.html

## Tech Stack
1. Frontend: Angular 17, TypeScript, SCSS, HTML
2. Backend: ASP.NET Core 10 Web API, Entity Framework Core
3. Database: Azure SQL Database 
4. Authentication: JWT Bearer Tokens 
5. Cloud: Microsoft Azure App Services + Static Web Apps 
6. API Docs: Swagger 

## Features

- JWT Authentication: with role-based access control (Admin / Pharmacist)
- Drug Management: Add, edit, delete and search drugs
- Inventory Tracking: Manage batches, quantities and expiry dates
- Supplier Management: Track suppliers and their contact details
- Automated Alerts: Low stock and expiry alerts within 30 days
- Role Based Access: Admin has full access, Pharmacist has restricted access
- Responsive UI: Works on desktop and mobile

## Setup & Run Locally

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org)
- [Angular CLI](https://angular.io/cli)
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server)

## Azure Deployment

### Architecture
```
┌─────────────────────────────────────────────┐
│         Angular Frontend                    │
│   Azure Static Web Apps (Free tier)         │
│   https://orange-wave-021cbcc00.1...        │
└──────────────────┬──────────────────────────┘
                   │ HTTPS API calls
┌──────────────────▼──────────────────────────┐
│         ASP.NET Core Web API                │
│   Azure App Services (F1 Free tier)         │
│   https://drug-inventory-api-mukul...       │
└──────────────────┬──────────────────────────┘
                   │ Entity Framework
┌──────────────────▼──────────────────────────┐
│         Azure SQL Database                  │
│   drug-inventory-sql-mukul                  │
│   DrugInventoryDB                           │
└─────────────────────────────────────────────┘
