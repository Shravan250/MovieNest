# 🎬 MovieNest

A mood-aware movie recommendation app that combines weather, time, and AI to suggest the perfect films for your current vibe.

![MovieNest Banner](/images/hero-section.png)

## 🌟 Overview

MovieNest is more than just another movie app – it's your personal film curator that understands context. By analyzing your current weather conditions, time of day, and location, it intelligently recommends movies that match your mood and moment.

**Live Demo:** [https://shravandev.com/movienest](https://shravandev.com/movienest)

## ✨ Features

### 🧠 Smart Mood Detection

- **Weather-Aware**: Analyzes current weather conditions to suggest appropriate genres
- **Time-Sensitive**: Considers time of day for contextual recommendations
- **Location-Based**: Uses geolocation for accurate weather data
- **Graceful Fallbacks**: Works even when location permission is denied

### 🎯 Intelligent Recommendations

- **Contextual Suggestions**:
  - Rainy Night → Romantic Thrillers 🌧️🌙
  - Sunny Morning → Feel-Good Comedies ☀️😂
  - Foggy Afternoon → Mystery Dramas 🕵️‍♀️
- **Mood Explanations**: Transparent logic showing why specific movies are recommended
- **Dynamic Genre Mapping**: Real-time genre fetching based on detected mood

### 🔍 Advanced Search & Discovery

- **Real-Time Search**: Debounced search with instant results
- **Virtual Scrolling**: Optimized performance for large movie lists
- **Lazy Loading**: Efficient image loading for smooth scrolling
- **Manual Override**: Search functionality that respects user intent

### 🎨 Modern UI/UX

- **Glassmorphism Design**: Modern, frosted glass aesthetic
- **Responsive Layout**: Seamless experience across all devices
- **Smooth Animations**: Polished transitions and interactions
- **Dark Theme**: Easy on the eyes for any time of day

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend**: Appwrite
- **Movie Data**: TMDB (The Movie Database) API
- **Weather Data**: OpenWeather API
- **Deployment**: Hostinger

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Appwrite account
- TMDB API key
- OpenWeather API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shravan250/MovieNest.git
   cd MovieNest
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
   VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173/movienest`

## 🔧 Configuration

### API Keys Setup

#### TMDB API

1. Visit [TMDB](https://www.themoviedb.org/settings/api)
2. Create an account and request an API key
3. Add the key to your `.env` file

#### OpenWeather API

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add it to your `.env` file

#### Appwrite Setup

1. Create an [Appwrite](https://appwrite.io/) account
2. Set up a new project
3. Configure database collections for user preferences (optional)
4. Add endpoint and project ID to `.env`

## 🎭 How Mood Detection Works

```javascript
// Simplified mood detection logic
const moodGenreMapping = {
  feelgood: [35, 10751], // Comedy, Family
  cozy: [10749, 18], // Romance, Drama
  adventure: [12, 28], // Adventure, Action
  mystery: [9648, 53], // Mystery, Thriller
  dramatic: [18, 36], // Drama, History
  lighthearted: [35, 16], // Comedy, Animation
};

function getMoodFromContext(weather, timeOfDay) {
  if (weather.includes("rain") && timeOfDay === "night") {
    return "cozy";
  }
  if (weather.includes("sunny") && timeOfDay === "morning") {
    return "feelgood";
  }
  // ... more mood logic
}
```

## 📱 Features in Detail

### Mood-Based Recommendations

The app analyzes multiple factors to determine your current mood:

- **Weather conditions** (sunny, rainy, cloudy, foggy)
- **Time of day** (morning, afternoon, evening, night)
- **Season context** (when available)

### Smart Fallbacks

- **No location permission?** Uses time-based mood detection
- **API failures?** Graceful degradation to cached data
- **Slow connection?** Progressive loading with placeholders

### Performance Optimizations

- **Virtual scrolling** for handling large movie lists
- **Image lazy loading** for faster initial page loads
- **Debounced search** to reduce API calls
- **Caching strategies** for frequently accessed data

## 🗂️ Project Structure

```
MovieNest/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MovieCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── MoodBanner.jsx
│   │   └── VirtualScroll.jsx
│   ├── services/
│   │   ├── tmdbApi.js
│   │   ├── weatherApi.js
│   │   └── appwrite.js
│   ├── utils/
│   │   ├── moodDetection.js
│   │   └── helpers.js
│   ├── hooks/
│   │   ├── useWeather.js
│   │   └── useMovies.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🔮 Upcoming Features

- 🎞️ **Collaborative Watchlists**: Share and plan movie nights with friends
- 🔊 **Voice Search**: Search for movies using voice commands
- 🤖 **Enhanced AI**: More sophisticated mood prediction using GPT integration
- 📊 **Watch History**: Track and analyze your movie preferences
- 🎯 **Personalized Profiles**: Custom recommendation algorithms based on viewing history
- 🌍 **Multi-language Support**: International movie recommendations

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 Blog Series

Follow the development journey:

1. [Building MovieNest: A Chaotic Developer Adventure](https://dev.to/shravan250/building-movienest-a-chaotic-developer-adventure-ft-vpns-proxies-glassmorphism-4lei)
2. [Virtual Scrolling & Lazy Loading: Optimizing My Movie App](https://dev.to/shravan250/virtual-scrolling-lazy-loading-a-little-bit-of-crying-optimizing-my-movie-app-2136)
3. [MovieNest Gets a Mood Ring: Recommending Films with Weather, Time & Tears](https://dev.to/shravan250/movienest-gets-a-mood-ring-recommending-films-with-weather-time-tears-54i0)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing comprehensive movie data
- [OpenWeatherMap](https://openweathermap.org/) for weather API services
- [Appwrite](https://appwrite.io/) for backend services
- The React and Vite communities for excellent tooling

## 📞 Contact

**Shravan** - [@shravan250](https://github.com/Shravan250)

Project Link: [https://github.com/Shravan250/MovieNest](https://github.com/Shravan250/MovieNest)

Live Demo: [https://shravandev.com/movienest](https://shravandev.com/movienest)

---

<div align="center">

**Built with ❤️, ☕, and a lot of `navigator.geolocation` debugging**

_If your app isn't emotional yet... are you even building full-stack?_ 😌

</div>
