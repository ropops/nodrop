import * as THREE from 'three'
import { periodicNoiseGLSL } from './utils'

// Function to generate equally distributed points on a plane
function getPlane(count: number, components: number, size: number = 512, scale: number = 1.0) {
  const length = count * components
  const data = new Float32Array(length)

  for (let i = 0; i < count; i++) {
    const i4 = i * components

    // Calculate grid position
    const x = (i % size) / (size - 1) // Normalize to [0, 1]
    const z = Math.floor(i / size) / (size - 1) // Normalize to [0, 1]

    // Convert to centered coordinates [-0.5, 0.5] and apply scale
    data[i4 + 0] = (x - 0.5) * 2 * scale // X position: scaled range
    data[i4 + 1] = 0 // Y position: flat plane at y=0
    data[i4 + 2] = (z - 0.5) * 2 * scale // Z position: scaled range
    data[i4 + 3] = 1.0 // W component (for RGBA texture)
  }

  return data
}

export class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(scale: number = 10.0) {
    const positionsTexture = new THREE.DataTexture(getPlane(512 * 512, 4, 512, scale), 512, 512, THREE.RGBAFormat, THREE.FloatType)
    positionsTexture.needsUpdate = true

    super({
      vertexShader: /* glsl */`varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
      fragmentShader: /* glsl */`uniform sampler2D positions;
      uniform float uTime;
      uniform float uNoiseScale;
      uniform float uNoiseIntensity;
      uniform float uTimeScale;
      uniform float uLoopPeriod;
      uniform float uMorphProgress;
      varying vec2 vUv;

      ${periodicNoiseGLSL}

      // SDF for rounded box
      float sdRoundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }

      // Phone dimensions for wireframe
      const float PHONE_WIDTH = 0.9;
      const float PHONE_HEIGHT = 1.8;
      const float PHONE_CORNER = 0.12;
      const float PHONE_DEPTH = 0.08; // Thickness of the phone
      const float EDGE_THICKNESS = 0.025; // Thickness of the wireframe edges

      // Get phone wireframe - returns: x=X coord, y=Y coord, z=Z coord (depth), w=visibility (1=on frame, 0=hide)
      vec4 getPhonePosition(vec2 normalizedUV) {
        // Map UV to phone surface coordinates
        // Use UV to sample different parts of the phone wireframe

        // Decide which part of the phone this particle belongs to based on UV
        float section = normalizedUV.x; // 0-1 determines which section
        float t = normalizedUV.y; // 0-1 position along that section

        vec3 pos = vec3(0.0);
        float visible = 0.0;

        // Front face outline (section 0.0 - 0.3)
        if (section < 0.3) {
          float edgeT = section / 0.3; // Which edge (0-1 maps to 4 edges)
          float posT = t; // Position along edge

          float hw = PHONE_WIDTH * 0.5;
          float hh = PHONE_HEIGHT * 0.5;
          float r = PHONE_CORNER;

          // Parameterize the rounded rectangle
          float perimeter = 2.0 * (PHONE_WIDTH + PHONE_HEIGHT - 4.0 * r) + 2.0 * 3.14159 * r;
          float dist = edgeT * 4.0 + posT; // Combined parameter
          dist = fract(dist) * perimeter;

          // Bottom edge
          float bottomLen = PHONE_WIDTH - 2.0 * r;
          if (dist < bottomLen) {
            pos = vec3(-hw + r + dist, -hh, PHONE_DEPTH * 0.5);
            visible = 1.0;
          }
          // Bottom-right corner
          else if (dist < bottomLen + 0.5 * 3.14159 * r) {
            float angle = (dist - bottomLen) / r - 1.5708;
            pos = vec3(hw - r + cos(angle) * r, -hh + r + sin(angle) * r, PHONE_DEPTH * 0.5);
            visible = 1.0;
          }
          // Right edge
          else if (dist < bottomLen + 0.5 * 3.14159 * r + PHONE_HEIGHT - 2.0 * r) {
            float d = dist - bottomLen - 0.5 * 3.14159 * r;
            pos = vec3(hw, -hh + r + d, PHONE_DEPTH * 0.5);
            visible = 1.0;
          }
          // Top-right corner
          else if (dist < bottomLen + 3.14159 * r + PHONE_HEIGHT - 2.0 * r) {
            float d = dist - bottomLen - 0.5 * 3.14159 * r - (PHONE_HEIGHT - 2.0 * r);
            float angle = d / r;
            pos = vec3(hw - r + cos(angle) * r, hh - r + sin(angle) * r, PHONE_DEPTH * 0.5);
            visible = 1.0;
          }
          // Top edge
          else if (dist < 2.0 * bottomLen + 3.14159 * r + PHONE_HEIGHT - 2.0 * r) {
            float d = dist - bottomLen - 3.14159 * r - (PHONE_HEIGHT - 2.0 * r);
            pos = vec3(hw - r - d, hh, PHONE_DEPTH * 0.5);
            visible = 1.0;
          }
          else {
            // Continue around... simplified for remaining edges
            pos = vec3(0.0, hh, PHONE_DEPTH * 0.5);
            visible = 1.0;
          }
        }
        // Back face outline (section 0.3 - 0.6)
        else if (section < 0.6) {
          float localSection = (section - 0.3) / 0.3;
          float hw = PHONE_WIDTH * 0.5;
          float hh = PHONE_HEIGHT * 0.5;

          // Simple rectangle outline for back
          float edge = localSection * 4.0;
          if (edge < 1.0) {
            pos = vec3(mix(-hw, hw, t), -hh, -PHONE_DEPTH * 0.5);
          } else if (edge < 2.0) {
            pos = vec3(hw, mix(-hh, hh, t), -PHONE_DEPTH * 0.5);
          } else if (edge < 3.0) {
            pos = vec3(mix(hw, -hw, t), hh, -PHONE_DEPTH * 0.5);
          } else {
            pos = vec3(-hw, mix(hh, -hh, t), -PHONE_DEPTH * 0.5);
          }
          visible = 1.0;
        }
        // Connecting edges (section 0.6 - 0.8)
        else if (section < 0.8) {
          float localSection = (section - 0.6) / 0.2;
          float hw = PHONE_WIDTH * 0.5;
          float hh = PHONE_HEIGHT * 0.5;

          // Four corner depth edges
          int corner = int(localSection * 4.0);
          float z = mix(-PHONE_DEPTH * 0.5, PHONE_DEPTH * 0.5, t);

          if (corner == 0) pos = vec3(-hw, -hh, z);
          else if (corner == 1) pos = vec3(hw, -hh, z);
          else if (corner == 2) pos = vec3(hw, hh, z);
          else pos = vec3(-hw, hh, z);

          visible = 1.0;
        }
        // Screen outline inside front face (section 0.8 - 1.0)
        else {
          float localSection = (section - 0.8) / 0.2;
          float hw = (PHONE_WIDTH - 0.06) * 0.5;
          float hh = (PHONE_HEIGHT - 0.06) * 0.5;

          float edge = localSection * 4.0;
          if (edge < 1.0) {
            pos = vec3(mix(-hw, hw, t), -hh, PHONE_DEPTH * 0.5 + 0.01);
          } else if (edge < 2.0) {
            pos = vec3(hw, mix(-hh, hh, t), PHONE_DEPTH * 0.5 + 0.01);
          } else if (edge < 3.0) {
            pos = vec3(mix(hw, -hw, t), hh, PHONE_DEPTH * 0.5 + 0.01);
          } else {
            pos = vec3(-hw, mix(hh, -hh, t), PHONE_DEPTH * 0.5 + 0.01);
          }
          visible = 1.0;
        }

        return vec4(pos, visible);
      }

      void main() {
        // Get the original particle position
        vec3 originalPos = texture2D(positions, vUv).rgb;

        // Use continuous time that naturally loops through sine/cosine periodicity
        float continuousTime = uTime * uTimeScale * (6.28318530718 / uLoopPeriod);

        // Scale position for noise input
        vec3 noiseInput = originalPos * uNoiseScale;

        // Generate periodic displacement for each axis using different phase offsets
        float displacementX = periodicNoise(noiseInput + vec3(0.0, 0.0, 0.0), continuousTime);
        float displacementY = periodicNoise(noiseInput + vec3(50.0, 0.0, 0.0), continuousTime + 2.094);
        float displacementZ = periodicNoise(noiseInput + vec3(0.0, 50.0, 0.0), continuousTime + 4.188);

        // Apply distortion to original position
        vec3 distortion = vec3(displacementX, displacementY, displacementZ) * uNoiseIntensity;
        vec3 wavePos = originalPos + distortion;

        // Default: wave position, fully visible
        vec3 finalPos = wavePos;
        float visibility = 1.0;

        // Morph to phone wireframe when uMorphProgress > 0
        if (uMorphProgress > 0.001) {
          // Use vUv (normalized 0-1) to get phone wireframe position
          vec4 phoneData = getPhonePosition(vUv);
          vec3 phonePos = phoneData.xyz;
          float phoneVisible = phoneData.w;

          // Add subtle shimmer to phone shape
          phonePos += distortion * 0.008;

          // Smooth morph interpolation
          float smoothMorph = smoothstep(0.0, 1.0, uMorphProgress);
          smoothMorph = smoothMorph * smoothMorph * (3.0 - 2.0 * smoothMorph);

          // Interpolate position
          finalPos = mix(wavePos, phonePos, smoothMorph);

          // Fade out particles that aren't on the wireframe
          // When morphing, particles not on frame fade to 0 visibility
          visibility = mix(1.0, phoneVisible, smoothMorph);
        }

        // Store visibility in alpha channel (w component)
        gl_FragColor = vec4(finalPos, visibility);
      }`,
      uniforms: {
        positions: { value: positionsTexture },
        uTime: { value: 0 },
        uNoiseScale: { value: 1.0 },
        uNoiseIntensity: { value: 0.5 },
        uTimeScale: { value: 1 },
        uLoopPeriod: { value: 24.0 },
        uMorphProgress: { value: 0 }
      }
    })
  }
}
