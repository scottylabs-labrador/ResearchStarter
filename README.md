# CMU_Research

## Overview
CMU_Research is an advanced web-based platform designed to centralize and streamline research opportunities at Carnegie Mellon University. By leveraging automated web scraping and structured data integration, the platform dynamically aggregates research postings from CMU department websites, spreadsheets, and other faculty-curated repositories. This ensures that students have access to the most up-to-date opportunities while minimizing the manual effort required from faculty and administrators.

## Contributors
Team Leads: Rishi Prabhu, Jarret Huang, Jennifer Zhu, Lily Qin, Bryan Huang
CMU Scotty Labs Labrador Software Engineers


## How to Run the Code

### **Step 1: Get the Code**
1. Consult with the Team (**Rishi, Jarret, or Jennifer**) on the status of the Git codebase.
2. Pull the latest code from the GitHub repository to your local machine.

### Pulling from Github Main Branch
Run this command in your terminal while being in the ResearchStarter Folder
```sh
git pull origin main
```

### **Step 2: Setup and Run the Development Server**
Open a terminal in **VS Code** or your system terminal and execute the following commands:

```sh
# Navigate to the project directory
cd ResearchStarter

# Install dependencies
npm install

# Start JSON server for student data
npx json-server src/studentdata.json --port 5000

# Start JSON server for research data
npm run server

# Start development server
npm run dev

Step 3: Start the Application Server
Open another terminal and run:

# Start the application server
npm run server

```

## Core Features
- **Automated Web Scraping & Data Aggregation**
  - Crawls department websites, research databases, and spreadsheets for real-time updates.
  - Parses and structures data for seamless presentation within the platform.
  
- **Research Opportunity Portal**
  - Enables professors to post research openings with specific requirements.
  - Students can browse, filter, and apply to opportunities based on interest and qualifications.
  
- **Seamless Student-Professor Interaction**
  - Direct messaging system for streamlined communication.
  - Professors can manage applications and connect with potential candidates.

- **Data Synchronization & Validation**
  - Incorporates input from 62 department heads to ensure comprehensive research listings.
  - Merges faculty-managed spreadsheets with automatically scraped content.

## Technical Architecture
### **Frontend**
- **Framework:** React with TypeScript for type safety and scalable UI components.
- **Styling:** Tailwind CSS for modern, responsive, and efficient styling.
- **State Management:** Context API for lightweight global state handling.
- **UI Enhancements:** Dynamic filtering, real-time search, and accessibility-focused design.

### **Backend & Data Processing**
- **Web Scraper:** JavaScript-based scraping pipeline with structured JSON output.
- **Data Processing:** Intelligent parsing and deduplication to merge multiple sources.
- **API Layer:** RESTful API endpoints for fetching, updating, and managing research listings.

### **Storage & Integration**
- **JSON Data Layer:** Storing structured data for fast and lightweight retrieval.
- **Cloud Deployment (Planned):** Future scalability with cloud-based hosting and database integration.

## Roadmap & Future Enhancements
- **AI-Powered Matching System** – Implementing machine learning models to recommend research opportunities based on student profiles and interests.
- **Professor Dashboard Enhancements** – Improved analytics and opportunity management tools.
- **Expanded Data Sources** – Incorporating additional research databases and funding opportunities.

## Tech Stack
- **Frontend:** JavaScript, TypeScript, React, Tailwind CSS, HTML, CSS
- **Backend:** Node.js (Planned API Development)
- **Data Handling:** JSON, Web Scraping with JavaScript

## Contributors
Developed by a team dedicated to making research opportunities more accessible and efficient at Carnegie Mellon University.

---
**CMU_Research: Empowering students and faculty through seamless research discovery.**
