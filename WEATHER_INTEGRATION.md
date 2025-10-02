# Weather Integration Setup

## 🌤️ WeatherAPI.com Integration

This app includes a beautiful weather widget that appears automatically next to the date input in the booking schedule step.

### Setup Instructions

1. **Get your free API key:**
   - Visit: https://www.weatherapi.com/
   - Sign up for a free account
   - Get your API key (1 million calls/month free!)

2. **Add to environment variables:**
   ```bash
   # Add to your .env.local file
   NEXT_PUBLIC_WEATHERAPI_KEY=your_api_key_here
   ```

3. **That's it!** The weather widget will automatically appear when:
   - A date is selected (today + next 3 days)
   - API key is configured
   - Weather data is available

### Features

✅ **Smart Display**: Only shows for dates within 3 days
✅ **Automatic Caching**: 30-minute cache to minimize API calls
✅ **Photoshoot Recommendations**: AI-powered suggestions based on weather
✅ **Beautiful UI**: Gradient design matching your app theme
✅ **Mobile Optimized**: Responsive design for all devices
✅ **Internationalized**: Supports English and Chinese
✅ **Graceful Fallback**: Silently hides if API unavailable

### Weather Recommendations

- **🟢 Excellent**: Perfect clear conditions, ideal lighting
- **🔵 Good**: Clear/partly cloudy, suitable for outdoor shoots
- **🟡 Fair**: Manageable conditions with preparation
- **🔴 Poor**: Challenging weather, indoor recommended

### Technical Details

- **Service**: `utils/weather/weatherService.ts` - Clean, modular weather service
- **Component**: `components/weather/WeatherWidget.tsx` - Beautiful weather display
- **Integration**: Seamlessly integrated into Step3Schedule
- **Performance**: Cached responses, minimal API calls
- **Error Handling**: Graceful degradation if service unavailable

### API Usage

The integration is designed to be very efficient:
- Caches responses for 30 minutes
- Only fetches for dates within 3 days
- Uses WeatherAPI.com's 3-day forecast endpoint (free tier)
- Handles errors gracefully without breaking the app
- 1 million free API calls per month (much more generous than OpenWeatherMap!)

Perfect for photoshoot planning! 📸
