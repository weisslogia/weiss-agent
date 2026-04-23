import * as fs from 'fs';
import * as path from 'path';
import { AppConfig } from '../types/config.js';

export function saveConfig(config: AppConfig, filePath: string = 'config.json'): void {
  const absolutePath = path.resolve(filePath);
  fs.writeFileSync(absolutePath, JSON.stringify(config, null, 2), 'utf-8');
}

export function loadConfig(filePath: string = 'config.json'): AppConfig | null {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    return null;
  }
  const data = fs.readFileSync(absolutePath, 'utf-8');
  if (data.length === 0) {
    return null
  }
  return JSON.parse(data);
}

export function ensureFileExists(filePath: string, defaultContent: string = ''): void {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    fs.writeFileSync(absolutePath, defaultContent, 'utf-8');
  }
}

export function updateConfig(path: string, config: Partial<AppConfig>) {
  const stored = loadConfig(path)
  if(!stored) {
    return saveConfig(config as AppConfig, path)
  }
  if(config.API_KEY) {
    stored.API_KEY = config.API_KEY
  }
  if(config.EXA_API_KEY) {
    stored.EXA_API_KEY = config.EXA_API_KEY
  }
  if(config.MODEL) {
    stored.MODEL = config.MODEL
  }
  if(config.PROVIDER_URL) {
    stored.PROVIDER_URL = config.PROVIDER_URL
  }
  if(config.EDITOR) {
    stored.EDITOR = config.EDITOR
  }
  return saveConfig(stored, path)
}
