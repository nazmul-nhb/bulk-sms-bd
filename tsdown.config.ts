import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/index.ts', 'src/types.ts'],
	globalName: 'BulkSmsBD',
	format: ['esm', 'cjs'],
	dts: true,
	minify: false,
	exports: true,
	unbundle: false,
	treeshake: true,
	checks: {
		pluginTimings: false,
	},
	deps: {
		onlyBundle: ['toolbox-x'],
	},
	banner: `/**
 * Copyright 2026 - present Nazmul Hassan
 */
`,
});
