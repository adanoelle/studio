declare module 'hydra-synth' {
  interface HydraOptions {
    canvas?: HTMLCanvasElement;
    width?: number;
    height?: number;
    autoLoop?: boolean;
    makeGlobal?: boolean;
    detectAudio?: boolean;
    enableStreamCapture?: boolean;
    pb?: unknown;
    precision?: 'highp' | 'mediump' | 'lowp';
    extendTransforms?: unknown[];
  }

  /**
   * Hydra's output/source buffers are dynamic objects used in feedback loops
   * (e.g., src(o0)) and have a complex, untyped API from the upstream library.
   * Using `any` is intentional here as these are passed directly to Hydra's
   * eval-based code execution.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type HydraBuffer = any;

  class Hydra {
    constructor(options?: HydraOptions);

    setResolution(width: number, height: number): void;
    tick(dt: number): void;

    // Output buffers (used in feedback loops like src(o0))
    o0: HydraBuffer;
    o1: HydraBuffer;
    o2: HydraBuffer;
    o3: HydraBuffer;

    // Source buffers
    s0: HydraBuffer;
    s1: HydraBuffer;
    s2: HydraBuffer;
    s3: HydraBuffer;

    synth: HydraBuffer;
  }

  export default Hydra;
}
