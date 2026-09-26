# SAMADHAN SETU — End-to-End Demonstration Guide

**Project Name:** SAMADHAN SETU  
**National Civic Grievance & Collaborative Problem Solving Platform**  
**SIH 2026 Problem Statement:** 26043  

This guide provides a step-by-step walkthrough to demonstrate the full end-to-end civic innovation pipeline: Citizen → AI Enrichment → Duplicate Detection → University Match → Project Creation → Milestones & Team → Industry Collaboration → Admin Resolution → Notifications.

---

## Pre-requisites & Seed Credentials

Start the system using:
```bash
# In project root:
npm run dev
```

The database is pre-seeded (`npm run seed`) with the following test credentials:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@samadhansetu.gov.in` | `Citizen@2026` | Resident in Ranchi, Jharkhand |
| **University** | `bitmesra@edu.in` | `Uni@2026` | Birla Institute of Technology, Mesra |
| **Industry Partner** | `contact@tatasteelcsr.com` | `Industry@2026` | Tata Steel Rural Development & CSR |
| **Admin** | `admin@samadhansetu.gov.in` | `Admin@2026` | Platform State Administrator |

---

## 19-Step Complete Demonstration Flow

### STEP 1: Login as Citizen
1. Navigate to `http://localhost:5173/auth`.
2. Choose **Citizen** role tab.
3. Enter email: `citizen@samadhansetu.gov.in` and password: `Citizen@2026`.
4. Click **Sign In**. You will be directed to the portal with citizen navigation.

### STEP 2: Report a Societal Grievance
1. Click **Report Grievance** in the top navigation or go to `http://localhost:5173/submit`.
2. Enter the grievance details:
   - **Title:** `Broken water pipeline causing drinking water shortage in Morabadi`
   - **Description:** `The main drinking water supply pipeline on Morabadi Road has burst near Tagore Hill. Severe water wastage and supply cut to 400 households for 4 days.`
   - **District:** `Ranchi`
3. Click the interactive Leaflet map to set the location pin near Morabadi, Ranchi (coordinates auto-populate).

### STEP 3: Upload an Image
1. Under **Upload Media / Evidence**, drag & drop or select an image (or sample photo).
2. Click **Submit Grievance**.
3. **Observation:** The backend immediately creates the complaint record and returns success without blocking your browser, while initiating the asynchronous AI pipeline in the background.

### STEP 4: Inspect AI Pipeline Results
1. Navigate to **My Complaints** (`/my-complaints`).
2. Click on the newly submitted complaint.
3. View the AI enrichment fields:
   - **AI Category:** `water_resources`
   - **Confidence Score:** High confidence (e.g., `0.92`)
   - **Urgency Level:** `high` (automatically identified from disruption context)
   - **Vision Analysis:** Detected civic infrastructure issue, descriptive tags, and relevance score.

### STEP 5: Demonstrate Duplicate Detection
1. Notice how complaints submitted within 5km with high semantic similarity are cross-referenced.
2. If another complaint regarding the same burst pipeline in Morabadi was previously reported, the system flags it as `duplicate` or lists it under `duplicates`, notifying the citizen that an active grievance is already in progress.

### STEP 6: AI University Matching
1. In the complaint detail, observe **Suggested Academic Institutions**.
2. The AI matching algorithm combines category alignment (60%) and semantic research embedding similarity (40%) to rank:
   - `Birla Institute of Technology, Mesra` (Score > 0.85)

### STEP 7: Login as University
1. Click **Logout** in the navigation bar.
2. Go to `/auth`, select **University / HEI** tab.
3. Enter email: `bitmesra@edu.in` and password: `Uni@2026`.
4. Click **Sign In**.

### STEP 8: Accept Societal Challenge
1. You are automatically navigated to **Challenges** (`/university/challenges`).
2. Review the list of matched challenges.
3. Click **Accept Challenge** on the Morabadi water pipeline complaint.

### STEP 9: View Automatically Created Project
1. Acceptance automatically transitions the complaint to `assigned` and generates a collaborative research project with status `proposed`.
2. Click into the project details (`/university/projects/:id` or from the Projects page).

### STEP 10: Add Student & Faculty Team Members
1. Under the **Project Team** section:
   - Add student: `Sneha Roy` (Role: `Student Lead - Civil Engineering`)
   - Add faculty mentor: `Dr. Ramesh Verma` (Role: `Faculty Mentor`)
2. Click **Add Member**. The team updates in real-time.

### STEP 11: Add Project Milestones
1. Under the **Milestones & Deliverables** section:
   - Milestone 1: `Site inspection and pressure leak acoustic audit` (Due: In 7 days)
   - Milestone 2: `Smart IoT pressure sensor valve prototype deployment` (Due: In 21 days)
2. As work progresses, mark Milestone 1 as **Done**.

### STEP 12: Invite Industry Partner
1. In the project sidebar, select **Invite Industry Partner**.
2. Select **Tata Steel CSR** from the registered partner list.
3. Click **Send Invitation**.
4. The system updates the project, creates an in-app notification for the partner, and attempts to send an official invitation email.

### STEP 13: Login as Industry Partner
1. Logout and return to `/auth`.
2. Select **Industry / Startup** tab.
3. Enter email: `contact@tatasteelcsr.com` and password: `Industry@2026`.
4. Click **Sign In**.

### STEP 14: Accept Project Collaboration Invitation
1. Go to **Invitations** (`/industry/invitations`).
2. Inspect the project brief and research proposal from BIT Mesra.
3. Click **Accept Invitation**.
4. Project status automatically updates to `approved`.

### STEP 15: Login as Administrator
1. Logout and return to `/auth`.
2. Select **Government Admin** tab.
3. Enter email: `admin@samadhansetu.gov.in` and password: `Admin@2026`.
4. Click **Sign In**.

### STEP 16: View Real-Time Analytics Dashboard
1. You are redirected to `/admin/dashboard`.
2. Observe 100% real MongoDB aggregation analytics:
   - **Total Complaints registered**
   - **Universities participating**
   - **Industry partners engaged**
   - **Completed / Active projects**
   - **Complaints by Category (Pie Chart)**
   - **Complaints by Status (Bar Chart)**
   - **District-wise Distribution (Bar Chart)**
   - **30-Day Complaint Trend (Line Chart)**

### STEP 17: Mark Complaint as Resolved
1. Go to **Admin Complaints** (`/admin/complaints`).
2. Locate the Morabadi pipeline grievance.
3. In the status action dropdown, select **Resolved** and confirm.
4. The complaint status updates to `resolved`.

### STEP 18: Login Back as Citizen
1. Logout and log back in as `citizen@samadhansetu.gov.in`.
2. Check the **Notification Bell** in the top navigation bar.

### STEP 19: View Citizen Resolution Notification
1. The notification badge displays an unread count.
2. Click the bell to view:
   - *"Your grievance regarding Broken water pipeline... has been marked as RESOLVED."*
3. Click the notification to mark it as read.
4. The complete collaborative problem-solving loop is complete!
