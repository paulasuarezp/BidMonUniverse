import type { Config } from '@jest/types';
import baseConfig from './jest.config';

const config: Config.InitialOptions = {
    ...baseConfig,
    testEnvironment: 'jsdom',
    testMatch: ["**/src/__test__/unitTest/*.test.tsx"],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};

export default config;
