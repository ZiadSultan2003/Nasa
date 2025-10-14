import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { LiveMapComponent } from '../live-map/live-map.component';

interface SharkTag {
  id: string;
  sharkName: string;
  location: string;
  feedingActivity: string;
  depth: string;
  battery: string;
  time: string;
  status: string;
}

@Component({
  selector: 'app-over-view',
  standalone: true,
  imports: [CommonModule, SidebarComponent, LiveMapComponent],
  templateUrl: './over-view.component.html',
  styleUrl: './over-view.component.css',
})
export class OverViewComponent {
  sharksTarget = 300;
  activeTags = 13;
  warningCount = 2;
  dangerCount = 4;
  averageDepth = 45.2;
  depthChange = -2.1;
  pacificCoastSharks = 12;

  tagsData = {
    active: 200,
    lastActive: 150,
    inactive: 50,
    total: 400,
  };

  latestTags: SharkTag[] = [
    {
      id: 'SFS-001',
      sharkName: 'Jaws',
      location: 'Pacific Ocean',
      feedingActivity: 'Active',
      depth: '67m',
      battery: '87%',
      time: '5 min ago',
      status: 'Active',
    },
    {
      id: 'SFS-001',
      sharkName: 'Chomper',
      location: 'Gulf Stream',
      feedingActivity: 'Likely',
      depth: '23m',
      battery: '15%',
      time: '12 min ago',
      status: 'Low Battery',
    },
    {
      id: 'SFS-001',
      sharkName: 'Jaws',
      location: 'Pacific Ocean',
      feedingActivity: 'Unknown',
      depth: '67m',
      battery: '87%',
      time: '5 min ago',
      status: 'Active',
    },
    {
      id: 'SFS-003',
      sharkName: 'Nemo',
      location: 'Caribbean Sea',
      feedingActivity: 'Unknown',
      depth: '34m',
      battery: '87%',
      time: '5 min ago',
      status: 'Signal Lost',
    },
    {
      id: 'SFS-001',
      sharkName: 'Chomper',
      location: 'Gulf Stream',
      feedingActivity: 'Likely',
      depth: '23m',
      battery: '15%',
      time: '12 min ago',
      status: 'Low Battery',
    },
    {
      id: 'SFS-001',
      sharkName: 'Chomper',
      location: 'Gulf Stream',
      feedingActivity: 'Likely',
      depth: '23m',
      battery: '15%',
      time: '12 min ago',
      status: 'Low Battery',
    },
    {
      id: 'SFS-001',
      sharkName: 'Jaws',
      location: 'Pacific Ocean',
      feedingActivity: 'Unknown',
      depth: '67m',
      battery: '87%',
      time: '5 min ago',
      status: 'Active',
    },
  ];

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      Active: 'badge-active',
      'Low Battery': 'badge-low-battery',
      'Signal Lost': 'badge-signal-lost',
    };
    return statusMap[status] || 'badge-active';
  }

  getFeedingActivityClass(activity: string): string {
    const activityMap: { [key: string]: string } = {
      Active: 'text-success',
      Likely: 'text-warning',
      Unknown: 'text-danger',
    };
    return activityMap[activity] || '';
  }
}
