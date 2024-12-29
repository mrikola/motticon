import { Application } from 'express';
import cors from 'cors';
import express from 'express';
import { Config } from '../config/config';

export const setupMiddleware = (app: Application, config: Config): void => {
  app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
  }));

  app.use(express.json({ limit: '500kb' }));
  app.use(express.urlencoded({ extended: true }));
}; 