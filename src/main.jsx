import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'
import { createThesisSketch } from './thesis-sketch.js'

// Helper function to calculate lens count from humidity (duplicated from thesis-sketch.js)
function getLensCountFromHumidity(humidity) {
  const minLenses = 1;
  const maxLenses = 8;
  return Math.round(minLenses + humidity * (maxLenses - minLenses));
}

// Helper function to calculate week streak from start date
function calculateWeekStreak(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffInMs = now - start;

  // Convert to weeks (7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const diffInWeeks = Math.floor(diffInMs / (7 * 24 * 60 * 60 * 1000));

  return diffInWeeks;
}

// Navigation Component
const Navigation = () => {
  const toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu')
    menu.classList.toggle('hidden')
  }

  return (
    <nav className="hidden fixed top-0 left-0 right-0 bg-white dark:bg-black border-b border-black dark:border-white z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="font-mono text-sm">
            <a href="#intro" className="hover:no-underline">Home</a>
          </div>
          <div className="hidden md:flex space-x-6 font-mono text-xs">
            <a href="#intro" className="hover:no-underline">Home</a>
            <a href="#about" className="hover:no-underline">About</a>
            <a href="#thesis" className="hover:no-underline">Thesis</a>
            <a href="#media" className="hover:no-underline">Media</a>
            <a href="#projects" className="hover:no-underline">Projects</a>
            <a href="#awards" className="hover:no-underline">Awards</a>
          </div>
          <button className="md:hidden font-mono text-xs" onClick={toggleMobileMenu}>
            Menu
          </button>
        </div>
        <div id="mobile-menu" className="md:hidden hidden border-t border-black dark:border-white bg-white dark:bg-black">
          <div className="px-2 pt-2 pb-3 space-y-1 font-mono text-xs">
            <a href="#intro" className="block px-3 py-2 hover:no-underline">Home</a>
            <a href="#about" className="block px-3 py-2 hover:no-underline">About</a>
            <a href="#thesis" className="block px-3 py-2 hover:no-underline">Thesis</a>
            <a href="#media" className="block px-3 py-2 hover:no-underline">Media</a>
            <a href="#projects" className="block px-3 py-2 hover:no-underline">Projects</a>
            <a href="#awards" className="block px-3 py-2 hover:no-underline">Awards</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Typewriter Hero Component
const TypewriterHero = () => {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const fullText = "hi, i make art with data"

  useEffect(() => {
    let index = 0
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      // Only trigger if we're on the hero section, not typing, and scrolling down
      if (!isTyping && window.scrollY === 0 && e.deltaY > 0) {
        e.preventDefault()
        document.getElementById('about')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchDiff = touchStartY - touchEndY

      // Only trigger if swiping down (positive touchDiff) and on hero section
      if (!isTyping && window.scrollY === 0 && touchDiff > 50) {
        document.getElementById('about')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isTyping])

  return (
    <section id="intro" className="h-screen flex items-center justify-center bg-white dark:bg-black relative">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-mono mb-8 text-black dark:text-white">
          {displayText}
          {isTyping && <span className="animate-pulse">|</span>}
        </h1>
        {!isTyping && (
          <div className="animate-fade-in">
            <p className="text-base font-mono text-gray-600 dark:text-gray-400 mb-6 tracking-wider">
              scroll to explore
            </p>
            <button
              onClick={() => {
                document.getElementById('about')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                })
              }}
              className="animate-bounce cursor-pointer hover:opacity-70 transition-opacity"
            >
              <svg className="w-6 h-6 mx-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
)

const SubstackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
)

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

// About Section Component
const AboutSection = () => (
  <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="text-sm font-mono leading-relaxed space-y-4 animate-fade-in">
        <p>
          nice to meet you, I'm pete. I'm an <span className="highlight-effect">award winning artist</span> making art with data.
        </p>
        <p>
          Currently, I'm fixated on <span className="highlight-effect-slow">building hardware to host living art pieces</span>. Think a piece of art on your wall that changes with the weather outside.
        </p>
        <p>
          I share my progress on <a href="https://www.instagram.com/_re_pete/" className="hover-bounce-link">Instagram</a>
        </p>
        <p>
          I write about it weekly on <a href="https://substack.com/@petecybriwsky" className="hover-bounce-link">Substack</a> (<span className="hover-bounce">{calculateWeekStreak('2024-06-10')}-weeks</span> in a row and counting)
        </p>
        <p>
          I sometimes <a href="https://twitter.com/_re_pete" className="hover-bounce-link">tweet</a>
        </p>
        <p>
          And I respond to <a href="mailto:pete@ngenart.com" className="hover-bounce-link">emails</a>
        </p>
        <p>
          Most recently I shared my work at the <a href="https://data-art.info/schedule" className="hover-bounce-link">Data Art Symposium at Harvard</a> as well as at UVa, where I hopped on <a href="https://open.spotify.com/episode/00Rv9qAg12GJ39mJjPttUP?si=0d98e23614cc4c96" className="hover-bounce-link">the Data Points podcast</a> to share my stuff. <a href="https://datascience.virginia.edu/pages/nebulae-pete-cybriwsky" className="hover-bounce-link">I also won a few awards at the inaguaral Data is Art Competition</a>.
        </p>
        <p>
          I also self-hosted my first gallery, the <a href="https://v1-gallery.vercel.com/" className="hover-bounce-link">v1.0 Gallery</a> in New York City, with <span className="hover-bounce">300+</span> attendees and <span className="hover-bounce">5</span> artists including myself.
        </p>
        <p>
          In the past, I built <a href="https://ngenart.com" className="hover-bounce-link">ngen</a>, a site with <span className="hover-bounce">9M+</span> users that turned Spotify and Strava data into art. People made over <span className="hover-bounce">40M+</span> art pieces. <span className="highlight-effect-fast">It went pretty viral, it was fun.</span>
        </p>
        <p>
          I also made two iOS apps, <a href="https://apps.apple.com/us/app/day-by-data/id6737629704" className="hover-bounce-link">Day by Data</a> and <a href="https://apps.apple.com/us/app/ahoy-distance-tracker/id6742115190" className="hover-bounce-link">Ahoy</a>. <span className="highlight-effect">Both are iOS apps meant to turn health data into art.</span>
        </p>
        <p>
          This site is still under construction, so check back soon for more updates or <a href="mailto:pete@ngenart.com" className="hover-bounce-link">reach out</a> if you have any questions.
        </p>
      </div>
    </div>
  </section>
)

// Accordion Section Component
const AccordionSection = () => {
  const [openSections, setOpenSections] = useState({})
  const [weather, setWeather] = useState(null)
  const [tempC, setTempC] = useState('--')
  const [isManualMode, setIsManualMode] = useState(false)
  const [manualTemp, setManualTemp] = useState(20) // Default to 20°C
  const [manualHumidity, setManualHumidity] = useState(50) // Default to 50%

  // NYC coordinates
  const NY_LAT = 40.7128
  const NY_LNG = -74.0060

  const fetchWeather = async () => {
    const apiKey = '5d07d30b0246f6207ec7888efecc0602'
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${NY_LAT}&lon=${NY_LNG}&appid=${apiKey}&units=imperial`
      )
      const weatherData = await weatherRes.json()
      setWeather(weatherData)

      // Convert Fahrenheit to Celsius for display
      const tempF = weatherData.main.temp
      const tempC = ((tempF - 32) * 5 / 9).toFixed(1)
      setTempC(tempC)
    } catch (err) {
      console.log('Weather fetch error:', err)
    }
  }

  useEffect(() => {
    // Fetch weather data on component mount
    fetchWeather()

    // Fetch weather every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Initialize the thesis sketch after weather data is available
    const thesisContainer = document.getElementById('thesis-sketch-container')
    if (thesisContainer && weather) {
      const sketch = createThesisSketch('thesis-sketch-container', weather)

      // Store sketch reference for updates
      window.thesisSketch = sketch
    }
  }, [weather])

  useEffect(() => {
    // Update sketch when weather data or manual parameters change
    if (window.thesisSketch && window.thesisSketch.updateWeather) {
      if (isManualMode) {
        // Pass manual parameters
        const manualWeatherData = {
          main: {
            temp: (manualTemp * 9 / 5) + 32, // Convert to Fahrenheit for consistency
            humidity: manualHumidity
          }
        }
        window.thesisSketch.updateWeather(manualWeatherData)
      } else if (weather) {
        // Pass real weather data
        window.thesisSketch.updateWeather(weather)
      }
    }
  }, [weather, isManualMode, manualTemp, manualHumidity])

  const toggleSection = (sectionId) => {
    setOpenSections(prev => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId]
      }

      // Initialize sketch when thesis section is opened
      if (sectionId === 'thesis' && !prev[sectionId] && weather) {
        setTimeout(() => {
          const thesisContainer = document.getElementById('thesis-sketch-container')
          console.log('Attempting to create sketch with container:', thesisContainer)

          if (thesisContainer) {
            // Clean up any existing sketch
            if (window.thesisSketch) {
              window.thesisSketch.remove()
            }

            const sketch = createThesisSketch('thesis-sketch-container', weather)

            // Store sketch reference for updates
            window.thesisSketch = sketch
          } else {
            console.error('Thesis container not found when trying to create sketch')
          }
        }, 100)
      }

      return newState
    })
  }

  const sections = [
    {
      id: 'thesis',
      title: 'Thesis',
      content: (
        <div className="space-y-4">
          <div className="text-sm font-mono leading-relaxed space-y-3">
            <p>
              <span className="highlight-effect">I believe data is something beautiful</span>, and we can begin to look at it as an input for art.
            </p>
            <p>
              "Data" is a pretty broad term. But we can look at our personal data as an input for art. For instance, <span className="highlight-effect-slow">imagine going for a run and the art on our wall changes?</span> That's what I set out to do with <a href="https://ngenart.com/strava/receipts" className="hover-bounce-link">Strava Reciepts</a>. The same can be done with our health data, the music we listen to, our messages, etc.
            </p>
            <p>
              We can also observe the world around us and turn it into art. For instance, in New York right now, it is <span className="font-bold">{isManualMode ? `${Math.round((manualTemp * 9 / 5) + 32)}°F ` : `${Math.round((parseFloat(tempC) * 9 / 5) + 32)}°F `}</span> and <span className="font-bold">{isManualMode ? `${manualHumidity}%` : `${weather?.main?.humidity || '--'}%`} humidity. </span> <span className="highlight-effect-fast">This below piece responds to reflect the temperature and humidity in real-time.</span>
            </p>
          </div>

          <div className="mt-6">
            <div id="thesis-sketch-container" className="w-[300px] h-[300px] justify-center items-center">
              {/* p5.js canvas will be inserted here */}
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="mt-4 space-y-4">
            {/* Mode Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsManualMode(!isManualMode)}
                className={`px-3 py-1 text-xs font-mono border border-black transition-colors ${isManualMode
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                  }`}
              >
                {isManualMode ? 'Manual Mode' : 'Real-time Mode'}
              </button>
              <span className="text-xs font-mono text-gray-600">
                {isManualMode ? 'Adjust parameters manually' : 'Using live NYC weather data'}
              </span>
            </div>

            {/* Manual Controls */}
            {isManualMode && (
              <div className="space-y-3 p-3 border border-black">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono">Temperature: {manualTemp}°C</label>
                    <span className="text-xs font-mono text-gray-600">
                      ({Math.round((manualTemp * 9 / 5) + 32)}°F)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="50"
                    value={manualTemp}
                    onChange={(e) => setManualTemp(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-mono text-gray-500">
                    <span>-20°C</span>
                    <span>50°C</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono">Humidity: {manualHumidity}%</label>
                    <span className="text-xs font-mono text-gray-600">
                      ({manualHumidity > 50 ? 'Slow speed modifier' : 'Fast speed modifier'})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={manualHumidity}
                    onChange={(e) => setManualHumidity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-mono text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="text-xs font-mono text-gray-600 mt-2">
            <p>
              {isManualMode
                ? `Manual visualization: Temperature ${Math.round((manualTemp * 9 / 5) + 32)}°F, Humidity ${manualHumidity}%`
                : 'Real-time weather visualization using WebGL shaders and mathematical curves'
              }
            </p>
          </div>

          <div className="text-sm font-mono leading-relaxed space-y-3">
            <p>
              This piece takes a piece of the natural world and turns it into art. The same can be done with so many other things.
            </p>
            <p>
              In a world that's increasingly AI generated and rendered, I believe we can still find beauty in the simple things, and turn our data and the world around us into a beautiful input for art.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'media',
      title: 'Media',
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-mono">Recent Features</h3>
            <div className="space-y-2">
              <div>
                <a href="https://mashable.com/article/ngen-spotify-data-visualizer" className="hover-bounce-link">Viral Spotify Art Project</a>
                <p className="text-xs text-gray-600 font-mono">Mashable features ngenart's Spotify data visualizer.</p>
              </div>
              <div>
                <a href="https://open.spotify.com/episode/00Rv9qAg12GJ39mJjPttUP?si=0d98e23614cc4c96" className="hover-bounce-link">Transforming Spotify Data into Art</a>
                <p className="text-xs text-gray-600 font-mono">Podcast with UVa's School of Data Science covering how I view data as art.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'projects',
      title: 'Projects',
      content: (
        <div className="space-y-6">
          <div className="border border-black dark:border-white p-4">
            <h3 className="text-sm font-mono mb-2">
              <a href="https://ngenart.com" className="hover-bounce-link">ngenart</a>
            </h3>
            <p className="font-mono text-xs mb-3">
              A platform for users to create art from their Spotify and Strava data. <span className="hover-bounce">9M+</span> users and over <span className="hover-bounce">40M+</span> art pieces created.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 border border-black dark:border-white text-xs font-mono">p5.js</span>
              <span className="px-2 py-1 border border-black dark:border-white text-xs font-mono">Firebase</span>
              <span className="px-2 py-1 border border-black dark:border-white text-xs font-mono">APIs</span>
            </div>
          </div>

          <div className="border border-black dark:border-white p-4">
            <h3 className="text-sm font-mono mb-2">
              <a href="https://apps.apple.com/us/app/day-by-data/id6737629704" className="hover-bounce-link">Day by Data</a>
            </h3>
            <p className="font-mono text-xs mb-3">
              iOS app that allows users to create art from their health data. <span className="hover-bounce">1000+</span> users.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 border border-black dark:border-white text-xs font-mono">Swift</span>
              <span className="px-2 py-1 border border-black dark:border-white text-xs font-mono">p5.js</span>
            </div>
          </div>

          <div className="border border-black dark:border-white p-4">
            <h3 className="text-sm font-mono mb-2">
              <a href="https://apps.apple.com/us/app/ahoy-distance-tracker/id6742115190" className="hover-bounce-link">Ahoy</a>
            </h3>
            <p className="font-mono text-xs mb-3">
              iOS app for tracking distances and creating art from movement data.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 border border-black dark:border-white text-xs font-mono">Swift</span>
              <span className="px-2 py-1 border border-black dark:border-white text-xs font-mono">p5.js</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'awards',
      title: 'Awards & Talks',
      content: (
        <div className="space-y-4">
          <div className="border border-black p-4">
            <h3 className="text-sm font-mono mb-1">v1.0 Gallery</h3>
            <p className="font-mono text-xs">Hosted an exhibition at the <a href="https://v1-gallery.vercel.com/" className="hover-bounce-link">v1.0 Gallery</a> in New York City, with <span className="hover-bounce">300+</span> attendees and <span className="hover-bounce">5</span> artists including myself.</p>
          </div>
          <div className="border border-black p-4">
            <h3 className="text-sm font-mono mb-1">Data | Art Symposium</h3>
            <p className="font-mono text-xs">Gave a talk on my work at the <a href="https://data-art.info/schedule" className="hover-bounce-link">Data Art Conference</a> at Harvard Graduate School of Design.</p>
          </div>
          <div className="border border-black p-4">
            <h3 className="text-sm font-mono mb-1">Data is Art Competition</h3>
            <p className="font-mono text-xs">Won the <a href="https://datascience.virginia.edu/pages/nebulae-pete-cybriwsky" className="hover-bounce-link">Data is Art Competition</a>'s People's Choice Award and the Most Innovative with my piece "Nebulae" that reacted to real-time weather data in the building.</p>
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-2">
          {sections.map((section) => (
            <div key={section.id} className="border border-black dark:border-white">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 text-left font-mono text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center"
              >
                <span>{section.title}</span>
                <span className={`transition-transform duration-200 ${openSections[section.id] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openSections[section.id] && (
                <div className="px-4 py-4 border-t border-black dark:border-white animate-fade-in">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Thesis Section Component (keeping for weather functionality)
const ThesisSection = () => {
  const [weather, setWeather] = useState(null)
  const [tempC, setTempC] = useState('--')
  const [isManualMode, setIsManualMode] = useState(false)
  const [manualTemp, setManualTemp] = useState(20) // Default to 20°C
  const [manualHumidity, setManualHumidity] = useState(50) // Default to 50%

  // NYC coordinates
  const NY_LAT = 40.7128
  const NY_LNG = -74.0060

  const fetchWeather = async () => {
    const apiKey = '5d07d30b0246f6207ec7888efecc0602'
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${NY_LAT}&lon=${NY_LNG}&appid=${apiKey}&units=imperial`
      )
      const weatherData = await weatherRes.json()
      setWeather(weatherData)

      // Convert Fahrenheit to Celsius for display
      const tempF = weatherData.main.temp
      const tempC = ((tempF - 32) * 5 / 9).toFixed(1)
      setTempC(tempC)
    } catch (err) {
      console.log('Weather fetch error:', err)
    }
  }

  useEffect(() => {
    // Fetch weather data on component mount
    fetchWeather()

    // Fetch weather every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Initialize the thesis sketch after weather data is available
    const thesisContainer = document.getElementById('thesis-sketch-container')
    if (thesisContainer && weather) {
      const sketch = createThesisSketch('thesis-sketch-container', weather)

      // Store sketch reference for updates
      window.thesisSketch = sketch
    }
  }, [weather])

  useEffect(() => {
    // Update sketch when weather data or manual parameters change
    if (window.thesisSketch && window.thesisSketch.updateWeather) {
      if (isManualMode) {
        // Pass manual parameters
        const manualWeatherData = {
          main: {
            temp: (manualTemp * 9 / 5) + 32, // Convert to Fahrenheit for consistency
            humidity: manualHumidity
          }
        }
        window.thesisSketch.updateWeather(manualWeatherData)
      } else if (weather) {
        // Pass real weather data
        window.thesisSketch.updateWeather(weather)
      }
    }
  }, [weather, isManualMode, manualTemp, manualHumidity])

  return (
    <section id="thesis" className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-mono mb-6">Thesis</h2>
        <div className="space-y-4">
          <div className="text-sm font-mono leading-relaxed space-y-3">
            <p>
              I believe data is something beautiful, and we can begin to look at it as an input for art.
            </p>
            <p>
              "Data" is a pretty broad term. But we can look at our personal data as an input for art. For instance, imagine going for a run and the art on our wall changes? That's what I set out to do with <a href="https://ngenart.com/strava/receipts" className="underline hover:no-underline">Strava Reciepts</a>. The same can be done with our health data, the music we listen to, our messages, etc.
            </p>
            <p>
              We can also observe the world around us and turn it into art. For instance, in New York right now, it is <span className="font-bold">{isManualMode ? `${Math.round((manualTemp * 9 / 5) + 32)}°F ` : `${Math.round((parseFloat(tempC) * 9 / 5) + 32)}°F `}</span> and <span className="font-bold">{isManualMode ? `${manualHumidity}%` : `${parseFloat(tempC)}%`} humidity. </span> This below piece responds to reflect the temperature and humidity in real-time.
            </p>
          </div>

          <div className="mt-6">
            <div id="thesis-sketch-container" className="w-[300px] h-[300px] justify-center items-center">
              {/* p5.js canvas will be inserted here */}
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="mt-4 space-y-4">
            {/* Mode Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsManualMode(!isManualMode)}
                className={`px-3 py-1 text-xs font-mono border border-black transition-colors ${isManualMode
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                  }`}
              >
                {isManualMode ? 'Manual Mode' : 'Real-time Mode'}
              </button>
              <span className="text-xs font-mono text-gray-600">
                {isManualMode ? 'Adjust parameters manually' : 'Using live NYC weather data'}
              </span>
            </div>

            {/* Manual Controls */}
            {isManualMode && (
              <div className="space-y-3 p-3 border border-black">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono">Temperature: {manualTemp}°C</label>
                    <span className="text-xs font-mono text-gray-600">
                      ({Math.round((manualTemp * 9 / 5) + 32)}°F)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="50"
                    value={manualTemp}
                    onChange={(e) => setManualTemp(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-mono text-gray-500">
                    <span>-20°C</span>
                    <span>50°C</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono">Humidity: {manualHumidity}%</label>
                    <span className="text-xs font-mono text-gray-600">
                      ({manualHumidity > 50 ? 'Slow speed modifier' : 'Fast speed modifier'})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={manualHumidity}
                    onChange={(e) => setManualHumidity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-mono text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="text-xs font-mono text-gray-600 mt-2">
            <p>
              {isManualMode
                ? `Manual visualization: Temperature ${Math.round((manualTemp * 9 / 5) + 32)}°F, Humidity ${manualHumidity}%`
                : 'Real-time weather visualization using WebGL shaders and mathematical curves'
              }
            </p>
          </div>

          <div className="text-sm font-mono leading-relaxed space-y-3">
            <p>
              This piece takes a piece of the natural world and turns it into art. The same can be done with so many other things.
            </p>
            <p>
              In a world that's increasingly AI generated and rendered, I believe we can still find beauty in the simple things, and turn our data and the world around us into a beuatiful input for art.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Media Section Component
const MediaSection = () => (
  <section id="media" className="py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-lg font-mono mb-6">Media</h2>
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-mono">Recent Features</h3>
          <div className="space-y-2">
            <div>
              <a href="https://mashable.com/article/ngen-spotify-data-visualizer" className="font-mono text-sm underline hover:no-underline">Viral Spotify Art Project</a>
              <p className="text-xs text-gray-600 font-mono">Mashable features ngenart's Spotify data visualizer.</p>
            </div>
            <div>
              <a href="https://open.spotify.com/episode/00Rv9qAg12GJ39mJjPttUP?si=0d98e23614cc4c96" className="font-mono text-sm underline hover:no-underline">Transforming Spotify Data into Art</a>
              <p className="text-xs text-gray-600 font-mono">Podcast with UVa's School of Data Science covering how I view data as art.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// Simple SVG Icons


// Projects Section Component
const ProjectsSection = () => (
  <section id="projects" className="py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-lg font-mono mb-6">Featured Projects</h2>
      <div className="space-y-6">
        <div className="border border-black p-4">
          <h3 className="text-sm font-mono mb-2">
            <a href="#" className="underline hover:no-underline">ngenart</a>
          </h3>
          <p className="font-mono text-xs mb-3">
            A platform for users to create art from their Spotify and Strava data. 9M+ users and over 40M+ art pieces created.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 border border-black text-xs font-mono">p5.js</span>
            <span className="px-2 py-1 border border-black text-xs font-mono">Firebase</span>
            <span className="px-2 py-1 border border-black text-xs font-mono">APIs</span>
          </div>
        </div>

        <div className="border border-black p-4">
          <h3 className="text-sm font-mono mb-2">
            <a href="#" className="underline hover:no-underline">Day by Data</a>
          </h3>
          <p className="font-mono text-xs mb-3">
            iOS app that allows users to create art from their health data. 1000+ users.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 border border-black text-xs font-mono">Swift</span>
            <span className="px-2 py-1 border border-black text-xs font-mono">p5.js</span>
          </div>
        </div>
        <div className="border border-black p-4">
          <h3 className="text-sm font-mono mb-2">
            <a href="#" className="underline hover:no-underline">Moon Teller</a>
          </h3>
          <p className="font-mono text-xs mb-3">
            Campaign for Warner Music Group to promote new artists alongside their Lunar New Year campaign.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 border border-black text-xs font-mono">React</span>
            <span className="px-2 py-1 border border-black text-xs font-mono">p5.js</span>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// Awards Section Component
const AwardsSection = () => (
  <section id="awards" className="py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-lg font-mono mb-6">Talks & Awards</h2>
      <div className="space-y-4">
        <div href="#" className="border border-black p-4">
          <h3 className="text-sm font-mono mb-1">v1.0 Gallery</h3>
          <p className="font-mono text-xs">Hosted an exhibition at the v1.0 Gallery in New York City, with 500+ attendees and 5 artists including myself.</p>
        </div>
        <div href="#" className="border border-black p-4">
          <h3 className="text-sm font-mono mb-1">Data Art Conference</h3>
          <p className="font-mono text-xs">Gave a talk on my work at the Data Art Conference at Harvard Graduate School of Design.</p>
        </div>
        <div href="#" className="border border-black p-4">
          <h3 className="text-sm font-mono mb-1">Data is Art Competition</h3>
          <p className="font-mono text-xs">Won the Data is Art Competition's People's Choice Award and the Most Innocative with my piece "Nebulae" that reacted to real-time weather data in the building.</p>
        </div>
      </div>
    </div>
  </section>
)

// Footer Component
const Footer = () => (
  <footer className="border-t border-black dark:border-white py-6">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
        © 2025 Pete. Built with &lt;3 and a lot of coffee.
      </p>
    </div>
  </footer>
)

// Dark Mode Toggle Component
const DarkModeToggle = ({ isDark, setIsDark }) => {
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-4 right-4 z-50 p-2 bg-white dark:bg-black border border-black dark:border-white transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <svg
          className={`w-5 h-5 text-black dark:text-white absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg
          className={`w-5 h-5 text-black dark:text-white absolute transition-all duration-300 ${isDark ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
    </button>
  )
}

// Main App Component
const App = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return JSON.parse(saved)
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDark))

    // Update document class
    console.log('Setting dark mode to:', isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
      console.log('Added dark class to document')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('Removed dark class from document')
    }

    console.log('Document classes:', document.documentElement.className)
  }, [isDark])

  useEffect(() => {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]')

    links.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault()

        const targetId = this.getAttribute('href')
        const targetSection = document.querySelector(targetId)

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu')
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden')
        }
      })
    })
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />
      <Navigation />
      <main>
        <TypewriterHero />
        <AboutSection />
        <AccordionSection />
      </main>
      <Footer />
    </div>
  )
}

// Initialize the React app
const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<App />)