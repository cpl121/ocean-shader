uniform vec3  uDepthColor;
uniform vec3  uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform sampler2D alphaMap;

varying float vElevation;
varying vec2 vUv;

void main() {
  float mixStrength = clamp((vElevation + uColorOffset) * uColorMultiplier, 0.0, 1.0);
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  float alpha = texture2D(alphaMap, vUv).r;

  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}
