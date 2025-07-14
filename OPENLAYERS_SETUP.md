# OpenLayers Map Integration

## Overview

The AIDecisionPage now uses OpenLayers (free and open-source) instead of Google Maps for displaying nearby processing centers and user location.

## Features Implemented

### Interactive Map
- **Free and Open Source**: No API keys required
- **OpenStreetMap Tiles**: Uses OSM as the base map layer
- **User Location Marker**: Red circle showing current position
- **Nearby Entities**: Colored markers for different facility types:
  - 🔵 Walmart Warehouses (Blue - #0066CC)
  - 🔴 Donation Centers (Red - #FF6B6B)
  - 🟢 Second-hand Markets (Teal - #4ECDC4)
  - 🔵 Recycling Centers (Light Blue - #45B7D1)
  - ⚪ Disposal Sites (Gray - #95A5A6)

### Map Controls
- **Zoom Controls**: Built-in zoom in/out buttons
- **Pan/Drag**: Click and drag to move around the map
- **Legend**: Shows what each marker color represents

### Responsive Design
- **Mobile Friendly**: Works on all screen sizes
- **Loading States**: Shows loading spinner while map initializes
- **Error Handling**: Graceful fallback when location is not available

## Dependencies

- `ol` - OpenLayers library for map functionality
- Uses OpenStreetMap (OSM) tiles for the base map layer

## Implementation Details

- Map centers on user location from ReturnFormPage
- Nearby entities are mock data with realistic coordinates
- Vector layers used for custom markers
- Styled with custom CSS for better integration with the design
- Cleanup function prevents memory leaks when component unmounts

## Advantages over Google Maps

1. **Free**: No API keys or usage limits
2. **Open Source**: Community-driven development
3. **Privacy**: No data tracking by third parties
4. **Offline Capable**: Can work with cached tiles
5. **Customizable**: Full control over map appearance and behavior
