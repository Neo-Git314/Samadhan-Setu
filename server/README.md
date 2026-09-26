# Samadhan Setu Backend API Documentation

**Platform:** National Civic Grievance & Collaborative Problem Solving Platform  
**SIH 2026 Problem Statement:** 26043  
**Architecture:** Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary, Nodemailer, Google Gemini API

---

## 1. Environment Variables & Setup

Copy `.env.example` to `.env` in the `server` directory and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/samadhan_setu
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@samadhansetu.in
```

### Safety and Graceful Fallbacks:
- If `GEMINI_API_KEY` is omitted, the AI service uses heuristic rule-based classification, default civic vision analysis, and deterministic 768-dim normalized embedding vectors without crashing.
- If `CLOUDINARY_*` is omitted, uploaded media files fallback safely to base64 data URIs so that complaint submission never fails.
- If `SMTP_*` is omitted, project invitations log `[emailService] SMTP not configured — email skipped` while in-app notifications are still generated.

---

## 2. MongoDB Atlas Vector Search Configuration

For production deployment with MongoDB Atlas Vector Search:

1. In MongoDB Atlas, navigate to your Cluster -> **Atlas Search**.
2. Click **Create Search Index** -> select **JSON Editor**.
3. Choose Database: `samadhan_setu` and Collection: `complaints`.
4. Name the index: `complaint_vector_index`.
5. Enter the following JSON configuration:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    }
  ]
}
```

> **Note on Dimensions:** Google Gemini's `text-embedding-004` generates numeric vectors with exactly **768 dimensions**. The index dimensions must match 768.

### Development Fallback:
If Atlas Vector Search is not enabled or index `complaint_vector_index` is not present, `server/services/dedupService.js` automatically executes an application-layer cosine similarity check across complaints within a 5 km radius, comparing embeddings against the 0.85 threshold.

---

## 3. API Endpoints Reference

### Health & Information
- **`GET /api/health`**
  - **Auth:** Public
  - **Response:**
    ```json
    { "status": "ok" }
    ```

---

### Authentication (`/api/auth`)

#### `POST /api/auth/register`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "name": "Citizen User",
    "email": "citizen@example.com",
    "password": "Password123",
    "role": "citizen",
    "phone": "9876543210",
    "organization": "Jharkhand Resident"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "67...",
      "name": "Citizen User",
      "email": "citizen@example.com",
      "role": "citizen"
    }
  }
  ```

#### `POST /api/auth/login`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "email": "citizen@example.com",
    "password": "Password123"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "67...",
      "name": "Citizen User",
      "email": "citizen@example.com",
      "role": "citizen"
    }
  }
  ```

#### `GET /api/auth/me`
- **Auth:** Bearer Token (Any logged-in user)
- **Response (200):**
  ```json
  {
    "success": true,
    "user": {
      "_id": "67...",
      "name": "Citizen User",
      "email": "citizen@example.com",
      "role": "citizen"
    }
  }
  ```

---

### Complaints (`/api/complaints`)

#### `POST /api/complaints`
- **Auth:** Bearer Token (`citizen` only)
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `title` (string, required)
  - `description` (string, required)
  - `district` (string, required)
  - `location` (stringified JSON: `{"lat": 23.37, "lng": 85.33, "address": "Morabadi, Ranchi"}`)
  - `images` (file list, max 5, up to 10MB each)
- **Response (201 - Immediate, async AI triggered):**
  ```json
  {
    "success": true,
    "complaintId": "67...",
    "complaint": {
      "_id": "67...",
      "title": "Broken water pipeline",
      "status": "pending",
      "urgency": "medium",
      "mediaUrls": ["https://res.cloudinary.com/..."]
    }
  }
  ```

#### `GET /api/complaints`
- **Auth:** Bearer Token
- **Query Parameters:**
  - `submittedBy=me` (Citizen viewing their complaints)
  - `status=pending|reviewed|assigned|in_progress|resolved|duplicate`
  - `category=water_resources|education|...`
  - `district=Ranchi|Dhanbad|...`
  - `page=1&limit=10`
- **Response (200):**
  ```json
  {
    "success": true,
    "complaints": [ ... ],
    "pagination": { "page": 1, "limit": 10, "total": 14, "pages": 2 }
  }
  ```

#### `GET /api/complaints/:id`
- **Auth:** Bearer Token
- **Response (200):** Complete complaint details, image analysis, suggested universities, status timeline.

#### `GET /api/complaints/:id/duplicates`
- **Auth:** Bearer Token
- **Response (200):**
  ```json
  {
    "success": true,
    "complaintId": "67...",
    "duplicateOf": null,
    "duplicates": [ ... ]
  }
  ```

#### `PATCH /api/complaints/:id/status`
- **Auth:** Bearer Token (`admin` only)
- **Request Body:**
  ```json
  {
    "status": "resolved"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "complaint": { ... }
  }
  ```

---

### Universities (`/api/universities`)

#### `GET /api/universities`
- **Auth:** Bearer Token
- **Response (200):** List of university profiles, disciplines, and research keywords.

#### `POST /api/universities`
- **Auth:** Bearer Token (`admin` only)
- **Request Body:**
  ```json
  {
    "name": "Birla Institute of Technology, Mesra",
    "disciplines": ["water_resources", "environment", "energy"],
    "researchKeywords": ["water filtration", "renewable energy", "sensor systems"],
    "location": { "lat": 23.4123, "lng": 85.4399 },
    "contactEmail": "research@bitmesra.ac.in",
    "incubationFacility": "BIT TBI"
  }
  ```

#### `GET /api/universities/:id/challenges`
- **Auth:** Bearer Token (`university` or `admin`)
- **Response (200):** Matched complaints where university is in `suggestedUniversities` and status is not yet assigned.

#### `POST /api/universities/:id/accept/:complaintId`
- **Auth:** Bearer Token (`university` or `admin`)
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Challenge accepted and project initiated",
    "project": {
      "_id": "67...",
      "complaintId": "...",
      "universityId": "...",
      "status": "proposed"
    }
  }
  ```

---

### Projects (`/api/projects`)

#### `GET /api/projects`
- **Auth:** Bearer Token
- **Query:** `?industryPartnerId=me` (filtered for logged in industry user)
- **Response (200):** List of collaborative projects.

#### `GET /api/projects/:id`
- **Auth:** Bearer Token
- **Response (200):** Project with populated complaint, university, and industry partner details.

#### `PATCH /api/projects/:id/milestones`
- **Auth:** Bearer Token (`university` only)
- **Request Body:**
  ```json
  {
    "action": "add",
    "milestone": {
      "title": "Site Inspection and Water Quality Sampling",
      "dueDate": "2026-10-15T00:00:00.000Z",
      "status": "pending"
    }
  }
  ```
  *(Or `action: "update", "milestoneId": "...", "status": "done"`)*

#### `PATCH /api/projects/:id/team`
- **Auth:** Bearer Token (`university` only)
- **Request Body:**
  ```json
  {
    "action": "add",
    "member": {
      "name": "Dr. Ramesh Verma",
      "role": "faculty_mentor"
    }
  }
  ```

#### `POST /api/projects/:id/invite-industry`
- **Auth:** Bearer Token (`university` only)
- **Request Body:**
  ```json
  {
    "industryPartnerId": "67..."
  }
  ```
- **Response (200):** Invitation sent, in-app notification created, Nodemailer email sent (or logged if unconfigured).

#### `PATCH /api/projects/:id/industry-response`
- **Auth:** Bearer Token (`industry` only)
- **Request Body:**
  ```json
  {
    "accepted": true
  }
  ```
- **Response (200):** Project status updated to `approved` (or partner cleared if declined).

---

### Industry Partners (`/api/industry-partners` / `/api/industry`)

#### `GET /api/industry-partners`
- **Auth:** Bearer Token
- **Response (200):** List of registered startups, MSMEs, CSR units, and research labs.

#### `POST /api/industry-partners`
- **Auth:** Bearer Token (`admin` only)
- **Request Body:**
  ```json
  {
    "name": "Tata Steel CSR",
    "type": "CSR",
    "sectorFocus": ["water_resources", "healthcare", "rural_livelihoods"],
    "contactEmail": "csr@tatasteel.com"
  }
  ```

---

### Analytics (`/api/analytics`)

#### `GET /api/analytics/summary`
- **Auth:** Bearer Token (`admin` only)
- **Response (200):**
  ```json
  {
    "success": true,
    "totalComplaints": 14,
    "byCategory": [ { "_id": "water_resources", "count": 6 }, ... ],
    "byStatus": [ { "_id": "pending", "count": 6 }, ... ],
    "byDistrict": [ { "_id": "Ranchi", "count": 11 }, ... ],
    "totalUniversitiesParticipating": 3,
    "totalIndustryPartnersEngaged": 2,
    "totalProjectsCompleted": 1
  }
  ```

#### `GET /api/analytics/trends`
- **Auth:** Bearer Token (`admin` only)
- **Response (200):**
  ```json
  {
    "success": true,
    "trends": [
      { "date": "2026-09-01", "count": 2 },
      { "date": "2026-09-02", "count": 1 }
    ]
  }
  ```

#### `GET /api/analytics/public-summary`
- **Auth:** Public
- **Response (200):** Platform statistics for citizen landing view.

---

### Notifications (`/api/notifications`)

#### `GET /api/notifications`
- **Auth:** Bearer Token (Current user)
- **Query:** `?unreadOnly=true`
- **Response (200):** List of notifications sorted newest first.

#### `PATCH /api/notifications/:id/read`
- **Auth:** Bearer Token (Current user can only mark own notification)
- **Response (200):**
  ```json
  {
    "success": true,
    "notification": { ... }
  }
  ```
