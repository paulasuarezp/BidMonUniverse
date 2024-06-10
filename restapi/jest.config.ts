// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setupTests.ts'], // Ejecutar setupTests.ts después de la inicialización de Jest
  globalSetup: './tests/globalSetup.ts', // Ejecutar globalSetup para cargar datos de prueba
  globalTeardown: './tests/globalTeardown.ts', // Ejecutar globalTeardown para limpiar la base de datos
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};

export default config;
