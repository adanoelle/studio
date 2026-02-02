/**
 * Test setup for jsdom environment
 * Mocks browser APIs not implemented in jsdom
 */

// Mock matchMedia for device capability detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock IntersectionObserver
// Does NOT auto-trigger - tests must set isVisible manually or use triggerIntersection
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private targets: Set<Element> = new Set();

  constructor(private callback: IntersectionObserverCallback) {}

  observe(target: Element) {
    this.targets.add(target);
    // Don't auto-trigger - let tests control visibility
  }

  // Helper method for tests to trigger intersection
  triggerIntersection(isIntersecting: boolean) {
    for (const target of this.targets) {
      this.callback(
        [
          {
            isIntersecting,
            target,
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRatio: isIntersecting ? 1 : 0,
            intersectionRect: target.getBoundingClientRect(),
            rootBounds: null,
            time: Date.now(),
          } as IntersectionObserverEntry,
        ],
        this
      );
    }
  }

  unobserve(target: Element) {
    this.targets.delete(target);
  }

  disconnect() {
    this.targets.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock requestAnimationFrame for consistent animation testing
let rafId = 0;
const rafCallbacks: Map<number, FrameRequestCallback> = new Map();

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: (callback: FrameRequestCallback) => {
    const id = ++rafId;
    rafCallbacks.set(id, callback);
    // Execute callback in next microtask
    Promise.resolve().then(() => {
      const cb = rafCallbacks.get(id);
      if (cb) {
        rafCallbacks.delete(id);
        cb(performance.now());
      }
    });
    return id;
  },
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: (id: number) => {
    rafCallbacks.delete(id);
  },
});
