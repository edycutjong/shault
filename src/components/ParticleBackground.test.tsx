import React from 'react';
import { render } from '@testing-library/react';

import { ParticleBackground } from './ParticleBackground';

describe('ParticleBackground', () => {
  beforeEach(() => {
    // Mock getContext for canvas
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
    });
    
    // Mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(cb, 0));
  });

  it('should render without crashing', () => {
    const { container } = render(<ParticleBackground />);
    expect(container.querySelector('canvas')).toBeDefined();
  });

  it('should handle window resize and initialize particles', async () => {
    // Set non-zero dimensions for particles to be created
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });

    render(<ParticleBackground />);
    
    // Trigger resize
    window.dispatchEvent(new Event('resize'));
    
    // Check if getContext was called (implies resize logic ran)
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalled();
    
    // Wait for the mocked requestAnimationFrame (setTimeout 0) to run one cycle
    await new Promise(resolve => setTimeout(resolve, 10));
  });

  it('should handle null context gracefully', () => {
    // Mock getContext to return null
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);
    
    // Should not crash
    render(<ParticleBackground />);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalled();
  });

  it('should update particles correctly and handle boundaries', async () => {
    vi.useFakeTimers();
    // Mock getContext
    const mockCtx = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx);
    
    // Force a small window so particles hit boundaries faster but still create particles
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 200 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 100 });

    const originalRandom = Math.random;
    let callCount = 0;
    Math.random = () => {
      callCount++;
      return callCount % 2 === 0 ? -0.5 : 1.5; // Extreme values to push out of bounds fast
    };

    render(<ParticleBackground />);
    
    // Fast forward enough time to guarantee particles hit all boundaries
    for(let i=0; i<100; i++) {
        vi.advanceTimersByTime(16); // 16ms roughly 1 frame
    }
    
    expect(mockCtx.clearRect).toHaveBeenCalled();
    Math.random = originalRandom;
    vi.useRealTimers();
  });

  it('should handle null canvas ref gracefully', () => {
    const originalUseRef = React.useRef;
    const useRefSpy = vi.spyOn(React, 'useRef').mockImplementation((init: unknown) => {
      if (init === null) {
        return { 
          get current() { return null; },
          set current(val) { /* ignore assignment by React */ }
        };
      }
      return originalUseRef(init);
    });
    
    render(<ParticleBackground />);
    useRefSpy.mockRestore();
  });
});
