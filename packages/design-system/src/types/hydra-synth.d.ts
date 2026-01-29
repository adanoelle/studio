declare module 'hydra-synth' {
  interface HydraOptions {
    canvas?: HTMLCanvasElement;
    width?: number;
    height?: number;
    autoLoop?: boolean;
    makeGlobal?: boolean;
    detectAudio?: boolean;
    enableStreamCapture?: boolean;
    pb?: any;
    precision?: 'highp' | 'mediump' | 'lowp';
    extendTransforms?: any[];
  }

  class Hydra {
    constructor(options?: HydraOptions);

    setResolution(width: number, height: number): void;
    tick(dt: number): void;

    // Output buffers
    o0: any;
    o1: any;
    o2: any;
    o3: any;

    // Source buffers
    s0: any;
    s1: any;
    s2: any;
    s3: any;

    synth: any;
  }

  export default Hydra;
}
