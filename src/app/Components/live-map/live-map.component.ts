import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Hotspot, MapPoint, MapService } from '../../Core/services/map.service';


@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './live-map.component.html',
  styleUrl: './live-map.component.css',
})
export class LiveMapComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private mapService: MapService) {}
  private map!: L.Map;
  private markersLayer!: L.LayerGroup;
  private hotspotsLayer!: L.LayerGroup;

  isLoading = false;
  filterType: 'all' | 'hotspots' | 'tags' = 'all';
  dateRange = {
    from: '',
    to: '',
  };
  ngOnInit(): void {
    
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.dateRange.to = today.toISOString().split('T')[0];
    this.dateRange.from = thirtyDaysAgo.toISOString().split('T')[0];
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadMapData();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [25.0, 35.0], 
      zoom: 4,
      zoomControl: true,
    });

    L.tileLayer
      .wms('https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi', {
        layers: 'BlueMarble_ShadedRelief',
        format: 'image/png',
        transparent: false,
        attribution: 'NASA Blue Marble',
      })
      .addTo(this.map);

    // إنشاء طبقات للماركرز
    this.markersLayer = L.layerGroup().addTo(this.map);
    this.hotspotsLayer = L.layerGroup().addTo(this.map);

    // إصلاح مشكلة أيقونات Leaflet
    this.fixLeafletIcons();
  }

  private fixLeafletIcons(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  private loadMapData(): void {
    this.isLoading = true;

    // جلب البيانات من الـ API
    this.mapService
      .getAllMapData(this.dateRange.from, this.dateRange.to)
      .subscribe({
        next: (points) => {
          this.clearLayers();
          this.drawAllPoints(points);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading map data:', error);
          this.isLoading = false;
          // في حالة الخطأ، نعرض بيانات تجريبية
          this.loadDemoData();
        },
      });

    // جلب Hotspots
    this.mapService.getDashboardSummary().subscribe({
      next: (summary) => {
        this.drawHotspots(summary.topHotspots);
      },
      error: (error) => {
        console.error('Error loading hotspots:', error);
      },
    });
  }

  private drawAllPoints(points: MapPoint[]): void {
    points.forEach((point) => {
      const circle = L.circle([point.lat, point.lng], {
        radius: this.mapService.getCircleRadius(point.intensity),
        color: this.mapService.getCircleColor(point.intensity),
        fillColor: this.mapService.getCircleColor(point.intensity),
        fillOpacity: 0.3,
        weight: 2,
      });

      // إضافة Popup مع المعلومات
      const popupContent = `
        <div class="map-popup">
          <h6>${point.sharkName || 'Shark'}</h6>
          <p><strong>Position:</strong> ${point.lat.toFixed(
            4
          )}, ${point.lng.toFixed(4)}</p>
          ${
            point.temperature
              ? `<p><strong>Temperature:</strong> ${point.temperature}°C</p>`
              : ''
          }
          ${point.depth ? `<p><strong>Depth:</strong> ${point.depth}m</p>` : ''}
          ${
            point.timestamp
              ? `<p><strong>Time:</strong> ${new Date(
                  point.timestamp
                ).toLocaleString()}</p>`
              : ''
          }
          <p><strong>Intensity:</strong> ${point.intensity}</p>
        </div>
      `;

      circle.bindPopup(popupContent);
      circle.addTo(this.markersLayer);
    });
  }

  private drawHotspots(hotspots: Hotspot[]): void {
    hotspots.forEach((hotspot) => {
      // رسم دائرة أكبر للـ Hotspots
      const circle = L.circle([hotspot.lat, hotspot.lng], {
        radius: hotspot.intensity * 1000,
        color: '#E74C3C',
        fillColor: '#E74C3C',
        fillOpacity: 0.2,
        weight: 3,
        dashArray: '10, 10',
      });

      const popupContent = `
        <div class="map-popup hotspot-popup">
          <h6>🔥 Hotspot</h6>
          <p><strong>Shark Count:</strong> ${hotspot.sharkCount}</p>
          <p><strong>Intensity:</strong> ${hotspot.intensity}</p>
          <p><strong>Location:</strong> ${hotspot.lat.toFixed(
            4
          )}, ${hotspot.lng.toFixed(4)}</p>
        </div>
      `;

      circle.bindPopup(popupContent);
      circle.addTo(this.hotspotsLayer);

      // إضافة Marker في المنتصف
      const marker = L.marker([hotspot.lat, hotspot.lng], {
        icon: L.divIcon({
          className: 'hotspot-marker',
          html: `<div class="hotspot-icon">${hotspot.sharkCount}</div>`,
          iconSize: [40, 40],
        }),
      });
      marker.addTo(this.hotspotsLayer);
    });
  }

  private clearLayers(): void {
    this.markersLayer.clearLayers();
    this.hotspotsLayer.clearLayers();
  }

  private loadDemoData(): void {
    // بيانات تجريبية للتجربة
    const demoPoints: MapPoint[] = [
      {
        lat: 31.2,
        lng: 29.9,
        intensity: 8,
        sharkName: 'Jaws',
        temperature: 27.3,
        depth: 67,
      },
      {
        lat: 30.5,
        lng: 32.1,
        intensity: 5,
        sharkName: 'Chomper',
        temperature: 26.8,
        depth: 45,
      },
      {
        lat: 29.8,
        lng: 34.5,
        intensity: 12,
        sharkName: 'Deep Blue',
        temperature: 28.1,
        depth: 89,
      },
      {
        lat: 28.3,
        lng: 33.2,
        intensity: 3,
        sharkName: 'Nemo',
        temperature: 25.5,
        depth: 34,
      },
      {
        lat: 32.1,
        lng: 31.5,
        intensity: 7,
        sharkName: 'Bruce',
        temperature: 27.9,
        depth: 56,
      },
    ];

    const demoHotspots: Hotspot[] = [
      { lat: 30.0, lng: 32.0, intensity: 15, sharkCount: 12 },
      { lat: 29.0, lng: 34.0, intensity: 10, sharkCount: 8 },
    ];

    this.drawAllPoints(demoPoints);
    this.drawHotspots(demoHotspots);
  }

  // Filter Methods
  onFilterChange(filterType: 'all' | 'hotspots' | 'tags'): void {
    this.filterType = filterType;

    switch (filterType) {
      case 'all':
        this.markersLayer.addTo(this.map);
        this.hotspotsLayer.addTo(this.map);
        break;
      case 'hotspots':
        this.map.removeLayer(this.markersLayer);
        this.hotspotsLayer.addTo(this.map);
        break;
      case 'tags':
        this.markersLayer.addTo(this.map);
        this.map.removeLayer(this.hotspotsLayer);
        break;
    }
  }

  onRefresh(): void {
    this.loadMapData();
  }

  onDateRangeChange(): void {
    if (this.dateRange.from && this.dateRange.to) {
      this.loadMapData();
    }
  }
}
