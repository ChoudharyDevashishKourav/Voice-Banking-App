# AI Voice Banking & Loan Assistant (Demo Project)

A minimal **AI-powered banking assistant** that can understand user queries, fetch financial insights using SQL, and respond with text and speech.
The project focuses on **intent detection + database querying + LLM response generation**, while keeping the **frontend simple and backend lightweight for demo purposes**.

---

## Features    

* Voice or text-based user queries
* Intent detection for banking and loan-related queries
* SQL query execution based on detected intent
* AI-generated responses from query results
* Text-to-Speech (TTS) responses
* Monthly summaries and expense analysis
* Loan-related informational queries
* Minimal UI focused on functionality

---

## Example Intents Implemented

### Banking

* Get monthly summary
* Get top expenses
* Transaction search
* Balance-related queries

### Loan

* Company-specific loan queries (example: HDFC policies, charges, etc.)
* Eligibility-related informational queries
* Processing and repayment information

### Utility

* Greeting and conversational intents
* Help / supported commands

---

## Tech Stack

**Frontend**

* React
* Tailwind CSS
* TanStack Query

**Backend (Minimal Demo APIs)**

* Spring Boot
* PostgreSQL

**AI / APIs**

* LLM for:

  * Intent detection
  * SQL response explanation
* Speech-to-Text API (Scaledown or similar)
* Gemini TTS API for speech output

---

## Architecture Flow

1. User speaks or types a query
2. Speech is converted to text (if voice input)
3. Intent detection using LLM
4. Backend maps intent to SQL query
5. Database returns results
6. LLM converts results into natural language
7. Gemini TTS converts text to audio
8. Audio response played in browser

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/ai-banking-assistant.git
cd ai-banking-assistant
```

### 2. Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Configure:

* Database credentials
* API keys in environment variables

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Example:

Frontend:

```
VITE_LLM_API_KEY=
VITE_TTS_API_KEY=
```

Backend:

```
DB_URL=
DB_USERNAME=
DB_PASSWORD=
```

---

## Example Query Flow

User:

> Show my top expenses last month

System:

1. Detect intent
2. Generate SQL
3. Fetch transactions
4. LLM summarizes result
5. Convert to speech

Response:

> Your highest expenses last month were groceries, fuel, and online shopping.

---

## Future Improvements

* Real authentication
* Multi-account support
* Real-time streaming speech
* Better intent classification
* Dashboard analytics
* Mobile-friendly UI

---

## Learning Goals of This Project

This project demonstrates:

* Building AI agents with real databases
* Intent-driven backend logic
* Integrating speech APIs
* Keeping architecture simple for rapid prototyping

