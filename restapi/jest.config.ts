// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './tests/globalSetup.ts', // Ejecutar globalSetup para cargar datos de prueba
  globalTeardown: './tests/globalTeardown.ts', // Ejecutar globalTeardown para limpiar la base de datos
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/models/",
    "/src/scripts/",
    "/src/middlewares/",
    "server.ts",
  ]
};

export default config;
