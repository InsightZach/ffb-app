# FFB 2025 – Fantasy Football Top 250 (Expo)

A simple iPhone-friendly app to create your own rankings:
- Drag-and-drop Top 250 list
- Local persistence (Expo Secure Store)
- Will show 2024 stats, 2025 projections, and 2025 ADPs (Underdog, CBS, ESPN) per player

## Live App
- Vercel: https://ffb-app-71ka.vercel.app/

## Run
- Web preview: `npm run web`
- Expo Go (iOS/Android): `npx expo start` and scan the QR code

## Tech
- Expo (React Native, TypeScript)
- `react-native-draggable-flatlist` for drag-and-drop
- `zustand` for state
- `expo-secure-store` for on-device persistence

## Next
- Seed real 2025 Top-250 from FantasyPros/Underdog ADP
- Player detail sheet with 2024 PFR stats and 2025 projections
- Import/export your rankings JSON/CSV