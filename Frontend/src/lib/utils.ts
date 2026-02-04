
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getSystemDisplayName(systemUri: string): string {
  if (systemUri.includes('namaste')) return 'NAMASTE';
  if (systemUri.includes('who.int/icd')) return 'ICD-11';
  if (systemUri.includes('snomed')) return 'SNOMED CT';
  if (systemUri.includes('loinc')) return 'LOINC';
  return 'Unknown';
}

export function getSystemColor(systemUri: string): string {
  if (systemUri.includes('namaste')) return 'namaste';
  if (systemUri.includes('who.int/icd')) return 'icd';
  return 'gray';
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}