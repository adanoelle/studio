import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: 'src/**/*.test.ts',
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'es2020',
      // Use tsc for decorator handling - esbuild doesn't support experimental decorators
      // The tsconfig must have experimentalDecorators: true
    }),
  ],
  testFramework: {
    config: {
      timeout: 5000,
    },
  },
};
