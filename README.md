# Will It Rain On My Pride? - AI Weather Safety Planner

This repository contains the source code for "Will It Rain On My Pride?", a Next.js application that serves as a Proof-of-Concept (POC) for an AI-powered weather safety planner.

---

### 1. Product Vision & Problem Statement

**Vision:** To provide anyone planning an outdoor event or journey with a simple, intelligent tool to assess weather-related risks, ensuring their safety and peace of mind.

**Problem Statement:** Individuals planning outdoor activities (like a Pride march, a vacation, or a hike) need a personalized way to understand the likelihood of adverse weather conditions such as extreme heat, cold, wind, or rain for a specific location and time. This tool solves that by offering a customized query interface and an intelligent, AI-driven analysis.

### 2. Core Features

The application is centered around two main functionalities:

*   **Location Analysis:** For stationary events. A user inputs a single location, and the AI provides a detailed weather safety assessment, including a safety badge (`Safe`, `Risky`, `Postpone`), a confidence score, and the reasoning behind it.
*   **Route Planner:** For journeys between two points. The user inputs a start and end location. The AI analyzes the weather at both points and delivers a high-level route suggestion. Crucially, this feature breaks down the journey by major districts, using its geographical knowledge to infer weather conditions along the entire route.

### 3. Data Flow and Management

The application's intelligence is driven by a clear data pipeline:

1.  **User Input Data:**
    *   The process begins with user-submitted form data: `location`, `date`, and `time`.

2.  **Data Source - Simulated for POC:**
    *   **Crucially, this POC does not connect to a live satellite feed or weather API.** Instead, it uses a client-side function (`getSimulatedWeatherData`) to generate random but plausible weather data (`temperature`, `rainProbability`, `windSpeed`, `forecast`).
    *   **Why Simulation?** This approach allows us to develop and test the application's core AI logic and user interface without the cost and complexity of integrating a real-time data feed, which is ideal for a proof-of-concept.
    *   **Production Implementation:** In a real-world application, this simulation would be replaced with a robust backend service that calls a commercial or governmental weather API. Examples include:
        *   [OpenWeatherMap API](https://openweathermap.org/api)
        *   [AccuWeather API](https://developer.accuweather.com/)
        *   [National Weather Service API (for the US)](https://www.weather.gov/documentation/services-web-api)
        These APIs provide the necessary Earth observation data, including forecasts derived from satellite imagery and ground-based sensors.

3.  **AI Analysis (Genkit & Gemini):**
    *   The weather data (currently simulated) is passed to our AI backend, which is orchestrated by **Genkit**.
    *   The `generateSafetyAssessment` flow uses the **Gemini model** to analyze the data and output a structured safety report.
    *   The `generateRouteSuggestion` flow uses Gemini's geographical knowledge to infer conditions along a route and provide a district-by-district travel advisory.

4.  **Data Visualization:**
    *   The final structured data from the AI is returned to the frontend and visualized using clear, intuitive components, including weather icons, colored safety badges, and progress bars.

### 4. Full Tech Stack

*   **Framework**: **Next.js 14+ (App Router)** for its hybrid rendering model.
*   **Language**: **TypeScript** for robust, type-safe code.
*   **AI Orchestration**: **Genkit (from Firebase)** to define and manage AI workflows.
*   **Generative AI Model**: **Google Gemini** for reasoning and structured data generation.
*   **UI Components**: **shadcn/ui** for a set of accessible and composable components.
*   **Styling**: **Tailwind CSS** for rapid, utility-first UI development.
*   **Server Logic**: **Next.js Server Actions** for secure and simplified backend calls.
*   **Animations**: **Framer Motion** for a polished and fluid user experience.
