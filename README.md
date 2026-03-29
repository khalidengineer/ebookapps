# Digital E-Book Store (Expo App)

A production-ready React Native Expo application for a digital ebook store, powered by Google Sheets.

## Features
- **Dynamic Content**: Products, banners, and config are fetched in real-time from Google Sheets.
- **Expo Router**: Modern file-based navigation.
- **Offline Storage**: Download PDFs to local storage for offline reading.
- **Screenshot Protection**: Prevents screen capture on the PDF viewer.
- **Multi-level Filtering**: Search and category-based product discovery.
- **Recently Viewed**: History tracking of viewed ebooks.
- **App Update Logic**: Automatic version check from the Google Sheet.

## Setup Instructions

1. **Prerequisites**: Ensure you have Node.js and the Expo Go app installed on your phone.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the App**:
   ```bash
   npx expo start
   ```
4. **Run on Device**: Scan the QR code with the Expo Go app (Android) or Camera app (iOS).

## Admin Panel (Google Sheet)
The app fetches data from:
[Google Sheet Admin Panel](https://docs.google.com/spreadsheets/d/1P6aL26noUdb9G_we8vvcOXpulTlVZKMIpXMi8-hOo6c/edit?usp=sharing)

### Sheet Structure:
- **PRODUCTS**: `id`, `product_name`, `category`, `subcategory`, `description`, `price`, `thumbnail_url`, `pdf_link`, `featured`, `status`.
- **BANNERS**: `banner_id`, `title`, `image_url`, `status`.
- **CONFIG**: `key`, `value` (e.g., `app_version`, `force_update`, `update_url`).

## Technical Stack
- Expo SDK 51
- Expo Router
- React Native Reanimated
- React Native Gesture Handler
- Lucide React Native (Icons)
- Axios (API)
- AsyncStorage (Persistence)
- Expo FileSystem (Offline Storage)
- React Native PDF (PDF Viewer)
- @shopify/flash-list (High-performance lists)
