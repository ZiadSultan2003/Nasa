import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MapPoint {
  lat: number;
  lng: number;
  intensity: number;
  sharkId?: string;
  sharkName?: string;
  temperature?: number;
  depth?: number;
  timestamp?: string;
}

export interface Hotspot {
  lat: number;
  lng: number;
  intensity: number;
  sharkCount: number;
}

export interface SharkAlert {
  sharkId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  predictionType: string;
  alertMessage: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface DashboardSummary {
  totalSharks: number;
  activeTags: number;
  avgSeaSurfaceTemperature: number;
  avgOxygenLevel: number;
  topHotspots: Hotspot[];
  recentAlerts: SharkAlert[];
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}
  private apiUrl = '';
  // /api/dashboard';
  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  // جلب جميع نقاط الخريطة
  getAllMapData(from?: string, to?: string): Observable<MapPoint[]> {
    let url = `${this.apiUrl}/all-map-data`;
    const params = [];
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);
    if (params.length) url += `?${params.join('&')}`;

    return this.http.get<MapPoint[]>(url);
  }

  // جلب بيانات قرش معين
  getSharkDetail(sharkId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/shark/${sharkId}`);
  }

  // جلب أحدث بيانات التاج
  getLatestTags(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/latest-tags`);
  }

  // تحويل intensity لحجم الدائرة
  getCircleRadius(intensity: number): number {
    return Math.max(500, intensity * 100);
  }

  // تحويل intensity للون
  getCircleColor(intensity: number): string {
    if (intensity >= 10) return '#E74C3C'; // أحمر - خطر
    if (intensity >= 5) return '#F39C12'; // برتقالي - تحذير
    return '#2ECC71'; // أخضر - آمن
  }

  // تحويل riskLevel للون
  getRiskColor(riskLevel: string): string {
    const colors: { [key: string]: string } = {
      high: '#E74C3C',
      medium: '#F39C12',
      low: '#2ECC71',
    };
    return colors[riskLevel] || '#00B4D8';
  }
}
