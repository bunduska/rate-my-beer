import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getItem(item: string): string | null {
    return localStorage.getItem(item);
  }
  setItem(item: string, obj: string): void {
    localStorage.setItem(item, obj);
  }
  removeItem(item: string): void {
    localStorage.removeItem(item);
  }
  clear(): void {
    localStorage.clear();
  }
}
