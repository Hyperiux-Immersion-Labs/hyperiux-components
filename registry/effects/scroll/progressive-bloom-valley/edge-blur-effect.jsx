import { useMemo, useEffect } from "react";
import { Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const fragmentShader = /* glsl */ `
uniform float uBlurStrength;
uniform float uBlurStart;
uniform vec2 uResolution;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 center = uv - 0.5;
  float dist = length(center);

  float blurAmount = smoothstep(uBlurStart, 0.75, dist) * uBlurStrength;

  if (blurAmount < 0.001) {
    outputColor = inputColor;
    return;
  }

  float aspect = uResolution.x / uResolution.y;
  vec2 texelSize = vec2(1.0 / uResolution.x, 1.0 / uResolution.y);

  vec4 sum = inputColor;
  float totalWeight = 1.0;

  const int TAPS = 12;
  vec2 offsets[12];
  offsets[0]  = vec2(-0.326, -0.406);
  offsets[1]  = vec2(-0.840, -0.074);
  offsets[2]  = vec2(-0.696,  0.457);
  offsets[3]  = vec2(-0.203,  0.621);
  offsets[4]  = vec2( 0.962, -0.195);
  offsets[5]  = vec2( 0.473, -0.480);
  offsets[6]  = vec2( 0.519,  0.767);
  offsets[7]  = vec2( 0.185, -0.893);
  offsets[8]  = vec2( 0.507,  0.064);
  offsets[9]  = vec2( 0.896,  0.412);
  offsets[10] = vec2(-0.322, -0.933);
  offsets[11] = vec2(-0.792, -0.598);

  float radius = blurAmount * 12.0;

  for (int i = 0; i < TAPS; i++) {
    vec2 offset = offsets[i] * radius * texelSize;
    vec4 s = texture2D(inputBuffer, uv + offset);
    sum += s;
    totalWeight += 1.0;
  }

  outputColor = sum / totalWeight;
}
`;

class EdgeBlurEffectImpl extends Effect {
  constructor({ blurStrength = 1.0, blurStart = 0.25, resolution = [1280, 720] } = {}) {
    const uniforms = new Map([
      ["uBlurStrength", new Uniform(blurStrength)],
      ["uBlurStart", new Uniform(blurStart)],
      ["uResolution", new Uniform(new Vector2(resolution[0], resolution[1]))],
    ]);
    super("EdgeBlurEffect", fragmentShader, { uniforms });
  }

  setResolution(width, height) {
    const uRes = this.uniforms.get("uResolution");
    if (uRes) uRes.value.set(width, height);
  }

  update(renderer) {
    if (renderer && renderer.getSize) {
      const size = renderer.getSize(new Vector2());
      this.setResolution(size.x, size.y);
    }
  }
}

export default function EdgeBlurEffect({ blurStrength = 1.0, blurStart = 0.25 }) {
  const effect = useMemo(() => {
    let width = 1280,
      height = 720;
    if (typeof window !== "undefined") {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    return new EdgeBlurEffectImpl({ blurStrength, blurStart, resolution: [width, height] });
  }, [blurStrength, blurStart]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => effect.setResolution(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, [effect]);

  return <primitive object={effect} dispose={null} />;
}
