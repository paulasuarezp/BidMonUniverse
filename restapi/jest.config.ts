import type { Config } from '@jest/types';

// Configuración de Jest
const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }]
    },
    testMatch: ['**/*.test.ts'],
    forceExit: true,
    testTimeout: 7000,
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/src/middlewares/',  // Ignora todo dentro de middlewares
        '/src/models/',       // Ignora todo dentro de models
        '/src/controllers/',       // Ignora todo dentro de controllers
        'app.ts',
        'server.ts',
    ]
};

export default config;
