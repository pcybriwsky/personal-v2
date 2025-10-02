precision highp float;

uniform vec2 resolution;
uniform float time;
uniform float patternType;
uniform vec3 paletteBackground;
uniform vec3 palettePrimary;
uniform vec3 paletteAccent1;
uniform vec3 paletteAccent2;
// Per-rectangle UV seed/strength
uniform vec2 rectSeed;      // unique per rect (0-1)
uniform float uvWarp;       // strength per rect (0-1)
// Weather data uniforms
uniform float temperature;
uniform float humidity;
uniform float lensCount;    // Number of lenses based on humidity (1-8)
varying vec2 vTexCoord;

float atan2(float y, float x) {
    if (x > 0.0) return atan(y / x);
    if (x < 0.0 && y >= 0.0) return atan(y / x) + 3.14159265359;
    if (x < 0.0 && y < 0.0) return atan(y / x) - 3.14159265359;
    if (x == 0.0 && y > 0.0) return 1.57079632679;
    if (x == 0.0 && y < 0.0) return -1.57079632679;
    return 0.0; // undefined case
}

mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
} 

#define PI 3.14159265359
#define TWO_PI 6.28318530718

void main() {
  // Get a float from 0.0 to 1.0 based on the pixel position
  vec2 uv = gl_FragCoord.xy / resolution;
  
  // Animated lens ripples at seeded center(s)
  vec2 ripplePoint = vec2(0.5) + (rectSeed - 0.5) * 0.25; // nudge center per rect
  float distFromRipplePoint = distance(uv, ripplePoint);
  float rr = 0.88 + 0.02 * uvWarp + lensCount;
  if (distFromRipplePoint < rr) {
    vec2 d = uv - ripplePoint;
    float lens = 1.0 + uvWarp * 0.3;
    d *= lens * (1.0 + 0.1 * sin(time * 1.2 + rectSeed.x * 1.0));
    uv = ripplePoint + d;
  }

  // Optional moving micro-lenses (disabled heavy scaling; keep light)
  for (int i = 0; i < 10; i++) {
    // if (float(i)/10. - 10. >= (lensCount-20.)/10. - 5.) break; // break out of the loop when we reach nPts
    float ii = float(i);
    float x = 0.5 + 0.4 * sin(ii * 1.13 + time * (0.3 + rectSeed.x));
    float y = 0.5 + 0.4 * cos(ii * 2.34 + time * (0.3 + rectSeed.y));
    vec2 rp = vec2(x, y);
    float d = distance(uv, rp);
    float r = 0.4;
    if (d < r) {
      float k = smoothstep(r, 0.0, d) * 0.4 * uvWarp;
      vec2 dir = normalize(uv - rp + 1e-5);
      uv += dir * k;
    }
  }
  
  // accumulate color and strength for moving points
  float nPts = lensCount; // Use dynamic lens count based on humidity
  float totalStrength = 0.0;
  vec3 totalColor = vec3(0.0);
  
  for (int i = 0; i < 10; i++){
    //   if (float(i) >= nPts) break; // break out of the loop when we reach nPts

      float ii = float(i);
      float t = time * 0.25 + ii * lensCount;
      vec2 pt;
     
      float k = 1.0 + ii * 0.5 * lensCount;
      float r = 0.8 * cos(k * t);
      pt = vec2(r * cos(t), r * sin(t)) * 0.5 + 0.5;
      float dist = distance(uv, pt);
     
      float strength =  5. / pow(dist, 2.) * lensCount;
      
      // Use palette colors based on point index
      vec3 color;
      if (i == 0) {
        color = palettePrimary;
      } else if (i == 1) {
        color = paletteAccent1;
      } else if (i == 2) {
        color = paletteAccent2;
      } else {
        // Mix palette colors for additional points
        float mixFactor = sin(ii * 0.7) * 0.5 + 0.5;
        color = mix(palettePrimary, paletteAccent1, mixFactor);
      }
      
      totalStrength += strength;
      totalColor += color * strength;
  }
  totalColor /= totalStrength;

  // Global ring overlay (neutral, multiplicative), enabled for all patterns
  // Center follows a per-rectangle Lissajous path so the ripple origin moves over time
  float ax = 1.0 + rectSeed.x * 2.0;   // per-rect x frequency
  float by = 1.0 + rectSeed.y * 2.0;   // per-rect y frequency
  vec2 center = vec2(0.5, 0.4);
  float ringDist = distance(uv, center);
  float ring = 0.5 + 0.5 * sin(ringDist * 20.0 - time * 10.0 * (1./lensCount)); // freq=18, speed=3
  ring = pow(ring, nPts); // gentle softening of bands

  // Subtle palette pull toward your primaries on ring crests
  vec3 paletteTarget = mix(palettePrimary, paletteAccent1, 0.5);
  float tint = 0.12 * ring; // up to 12% toward palette on crests
  totalColor = mix(totalColor, paletteTarget, tint);

  // Brighten at ring crests (no dimming)
  float brightness = 1.0 + 0.25 * ring; // 1.0..1.25
  totalColor *= brightness;

  gl_FragColor = vec4(totalColor, 1.0);
}