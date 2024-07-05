import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testTimeout: 60000,
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};

export default config;
