import {createLogger} from './logger'
import { test, expect } from '@jest/globals';
import { Logger } from 'winston';
import { spyOn } from 'jest-mock';

test("create logger", () => {
  const logger = createLogger("test-service");
  expect(logger).toBeInstanceOf(Logger);
});

test("creates logger for correct service", () => {
  let testService = "test-service";
  expect(createLogger(testService).defaultMeta.serviceName).toBe(testService);
});

test("logger logs messages", () => {
  const logger = createLogger("test-service");

  // Spy on the 'info' method
  const infoSpy = spyOn(logger, 'info');

  // Log a message
  const message = "This is a test message";
  logger.info(message);

  // Check if 'info' was called with the correct message
  expect(infoSpy).toHaveBeenCalledWith(message);

  // Restore the original method
  infoSpy.mockRestore();
});