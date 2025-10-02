import p5 from 'p5';
import fragmentShader from './shaders/fragment.glsl?raw';
import vertexShader from './shaders/vertex.glsl?raw';

let shader;
let graphics;

// Temperature-based color palette points for smooth interpolation
const temperaturePalettes = [
  { temp: -20, background: [0.02, 0.05, 0.15], primary: [0.9, 0.95, 1.0], accent1: [0.95, 0.98, 1.0], accent2: [1.0, 1.0, 1.0] }, // Freezing - Icy white
  { temp: -10, background: [0.05, 0.1, 0.2], primary: [0.7, 0.8, 1.0], accent1: [0.85, 0.9, 1.0], accent2: [0.95, 0.97, 1.0] }, // Cold - Light blue
  { temp: 0, background: [0.1, 0.15, 0.3], primary: [0.4, 0.6, 1.0], accent1: [0.6, 0.7, 1.0], accent2: [0.8, 0.85, 1.0] }, // Cool - Blue
  { temp: 10, background: [0.15, 0.2, 0.35], primary: [0.3, 0.5, 0.9], accent1: [0.5, 0.65, 0.95], accent2: [0.7, 0.8, 0.98] }, // Mild-cool - Blue-gray
  { temp: 20, background: [0.25, 0.25, 0.2], primary: [0.8, 0.7, 0.3], accent1: [0.9, 0.8, 0.5], accent2: [1.0, 0.9, 0.7] }, // Mild - Yellow-ish
  { temp: 30, background: [0.3, 0.2, 0.1], primary: [1.0, 0.6, 0.2], accent1: [1.0, 0.75, 0.4], accent2: [1.0, 0.85, 0.6] }, // Warm - Orange
  { temp: 40, background: [0.4, 0.1, 0.1], primary: [1.0, 0.3, 0.2], accent1: [1.0, 0.5, 0.3], accent2: [1.0, 0.7, 0.4] }, // Hot - Red-orange
  { temp: 50, background: [0.5, 0.05, 0.05], primary: [1.0, 0.2, 0.1], accent1: [1.0, 0.35, 0.2], accent2: [1.0, 0.5, 0.3] }  // Scorching - Deep red
];

// Linear interpolation function for colors
function lerpColor(color1, color2, t) {
  return [
    color1[0] + (color2[0] - color1[0]) * t,
    color1[1] + (color2[1] - color1[1]) * t,
    color1[2] + (color2[2] - color1[2]) * t
  ];
}

// Get smoothly interpolated palette based on temperature
function getInterpolatedPalette(tempC) {
  // Clamp temperature to our range
  const clampedTemp = Math.max(-20, Math.min(50, tempC));
  
  // Find the two palette points to interpolate between
  let lowerPalette = temperaturePalettes[0];
  let upperPalette = temperaturePalettes[temperaturePalettes.length - 1];
  
  for (let i = 0; i < temperaturePalettes.length - 1; i++) {
    if (clampedTemp >= temperaturePalettes[i].temp && clampedTemp <= temperaturePalettes[i + 1].temp) {
      lowerPalette = temperaturePalettes[i];
      upperPalette = temperaturePalettes[i + 1];
      break;
    }
  }
  
  // Calculate interpolation factor
  const tempRange = upperPalette.temp - lowerPalette.temp;
  const t = tempRange > 0 ? (clampedTemp - lowerPalette.temp) / tempRange : 0;
  
  // Interpolate each color component
  return {
    background: lerpColor(lowerPalette.background, upperPalette.background, t),
    primary: lerpColor(lowerPalette.primary, upperPalette.primary, t),
    accent1: lerpColor(lowerPalette.accent1, upperPalette.accent1, t),
    accent2: lerpColor(lowerPalette.accent2, upperPalette.accent2, t)
  };
}

export function createThesisSketch(containerId, weatherData = null) {
  console.log('Creating thesis sketch with container:', containerId, 'and weather:', weatherData);
  
  return new p5((p) => {
    let currentWeather = weatherData;
    
    p.setup = () => {
      console.log('p5 setup starting...');
      const container = document.getElementById(containerId);
      console.log('Container found:', container);
      
      if (!container) {
        console.error('Container not found:', containerId);
        return;
      }
      
      console.log('Creating canvas...');
      const canvas = p.createCanvas(300, 300, p.WEBGL);
      canvas.parent(container);
      console.log('Canvas created and parented:', canvas);
      
      try {
        console.log('Creating shader...');
        shader = p.createShader(vertexShader, fragmentShader);
        if (!shader) {
          console.error('Failed to create shader');
          return;
        }
        console.log('Shader created successfully');
      } catch (error) {
        console.error('Shader creation error:', error);
        return;
      }
    };

    // Function to update weather data from React component
    p.updateWeather = (newWeatherData) => {
      currentWeather = newWeatherData;
    };

    p.draw = () => {
      if (!shader) return;
      
      let temperature;
      let palette;
      let humidity;
      let lensCount;
      
      if (currentWeather && currentWeather.main) {
        // Use real weather data
        const tempF = currentWeather.main.temp;
        temperature = (tempF - 32) * 5/9; // Convert to Celsius
        humidity = currentWeather.main.humidity / 100.0; // Normalize to 0-1
        
        // Get smoothly interpolated palette based on temperature
        palette = getInterpolatedPalette(temperature);
        
        // Calculate number of lenses based on humidity
        lensCount = p.map(humidity, 0, 1, 1, 8);
      } else {
        // Fallback to simulated data if no weather data
        temperature = 15 + 10 * Math.sin(p.millis() * 0.0005);
        humidity = 0.5 + 0.3 * Math.sin(p.millis() * 0.0003); // Simulate humidity
        palette = getInterpolatedPalette(temperature);
        lensCount = getLensCountFromHumidity(humidity);
      }
      
      p.shader(shader);
      
      // Set shader uniforms with real weather data
      shader.setUniform('resolution', [800, 800]);
      shader.setUniform('time', p.millis() * 0.001);
      shader.setUniform('patternType', 2.0); // Lissajous curves
      
      // Use smoothly interpolated palette colors
      shader.setUniform('paletteBackground', palette.background);
      shader.setUniform('palettePrimary', palette.primary);
      shader.setUniform('paletteAccent1', palette.accent1);
      shader.setUniform('paletteAccent2', palette.accent2);
      
      shader.setUniform('rectSeed', [0.5, 0.5]);
      shader.setUniform('uvWarp', 0.8);
      
      // Add weather-specific uniforms
      shader.setUniform('temperature', temperature);
      shader.setUniform('humidity', humidity);
      shader.setUniform('lensCount', lensCount); // Number of lenses based on humidity
      
      if (currentWeather && currentWeather.main) {
        shader.setUniform('pressure', currentWeather.main.pressure / 1013.25); // Normalize to sea level
        shader.setUniform('windSpeed', currentWeather.wind ? currentWeather.wind.speed / 50.0 : 0); // Normalize
      }
      
      // Draw a rectangle that fills the screen
      p.rect(-400, -400, 800, 800);
    };
  });
}
