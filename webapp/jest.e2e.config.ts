import type { Config } from '@jest/types';
import baseConfig from './jest.config';

const config: Config.InitialOptions = {
    ...baseConfig,
    preset: 'jest-puppeteer',
    testMatch: ["**/steps/*.ts"],
};

export default config;
