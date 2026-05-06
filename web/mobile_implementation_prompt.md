# FocusPulse Mobile - Jetpack Compose Implementation Prompt

You are an expert Android Developer specializing in Kotlin, Jetpack Compose, and modern Android Architecture. 

We are currently porting our premium "FocusPulse" web application to a native Android app. The web application recently underwent a massive $10,000-tier UI overhaul to feature modern glassmorphism, fluid animations, and a highly premium aesthetic design, along with advanced functional capabilities like admin CSV exports. 

Your objective is to implement the following core features in our native Android app using modern Jetpack Compose standards. You must ensure perfect functional parity with our web app while meticulously replicating our premium design language.

---

## 1. UI/UX: Premium Glassmorphism in Jetpack Compose
The web app utilizes highly refined glassmorphism effects to create a stunning, depth-rich interface. You must replicate this exact look and feel in Jetpack Compose.

*   **Glass Effect Modifier:** Create a reusable custom modifier (e.g., `Modifier.glassmorphism()`). For devices on Android 12+ (API 31+), utilize `RenderEffect.createBlurEffect` applied to a `graphicsLayer` to blur the background behind the composables. Provide a solid or slightly translucent fallback for older Android versions.
*   **Translucent Backgrounds & Borders:** The cards and containers must use semi-transparent background colors (e.g., `Color.White.copy(alpha = 0.05f)` for dark mode or `0.1f` for light mode). Apply a subtle, bright border (e.g., `border(1.dp, Color.White.copy(alpha = 0.2f), RoundedCornerShape(24.dp))`) to simulate the refractive edge of frosted glass.
*   **Shadows and Elevation:** Apply soft, expansive drop shadows underneath the glass layers to lift them off the vibrant background.
*   **Micro-Animations:** The app must feel "alive." Implement smooth scale and alpha transitions using Compose's `animateFloatAsState` and `animateColorAsState` for button presses and list item interactions.

## 2. Dynamic Loading Screen with Motivational Quotes
To maintain user engagement during data fetching and app initialization, we need a premium loading experience.

*   **Implementation:** Build a `DynamicLoadingScreen` Composable.
*   **Visual Elements:** It should feature a smooth, infinitely pulsing or rotating FocusPulse logo in the center of the screen.
*   **Motivational Quotes:** Below the logo, display a `Text` composable that cycles through a predefined list of productivity and focus-oriented quotes. Use a `LaunchedEffect` with a `delay` (e.g., 3500ms) to trigger a crossfade animation (`AnimatedContent` or `animateFloatAsState` for alpha) between the quotes.

## 3. Daily Goal Widget (Home Screen)
Users need a frictionless way to track their daily FocusPulse progress directly from their Android home screen.

*   **Jetpack Glance:** Implement the widget using the Jetpack Glance framework for Compose-like declarative UI.
*   **Functionality:** The widget must display the user's daily Pomodoro session goal versus actual completion (e.g., a sleek circular progress indicator and text like "3 / 5 Sessions Completed").
*   **Premium Aesthetic:** The widget should support dark/light themes and utilize our brand colors. Keep the layout clean, spacious, and highly legible.
*   **Data Synchronization:** Ensure the widget state is updated dynamically. Use `WorkManager` or update the widget locally whenever the user completes a session inside the app, ensuring the Home Screen always reflects real-time data.

## 4. Admin Dashboard: CSV Export Generation
Administrators need the ability to export system reports (user activity, cache logs) directly from the mobile app.

*   **UI Integration:** Add an "Export System Report (CSV)" button with a premium glassmorphic style to the Admin Dashboard screen.
*   **Data Formatting:** Fetch the necessary report data (from the local Room DB or backend API) on the `Dispatchers.IO` thread using Kotlin Coroutines. Format this data cleanly into a standard CSV string format, handling commas and line breaks properly.
*   **Storage Access Framework (SAF):** Do not hardcode file paths. Instead, launch an `ActivityResultContracts.CreateDocument("text/csv")` intent. This allows the admin to choose exactly where they want to save the `focuspulse_system_report.csv` file on their device securely.
*   **Feedback:** Show a customized, non-intrusive `Snackbar` upon successful export or if an error occurs during file writing.

---

**Instructions for the AI:** 
Please begin by outlining the file structure and dependencies needed to support these features (e.g., Accompanist, Glance, Coroutines). Then, provide the implementation code for each of the 4 requirements above, starting with the `Modifier.glassmorphism()` utility.
