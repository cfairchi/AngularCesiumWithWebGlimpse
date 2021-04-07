import {AfterViewInit, Component, ElementRef, ViewChild, ViewChildren} from '@angular/core';
import {Timeline} from './Timeline';
import {AppDataService} from '../common/AppDataService';
import {GlobalConstants} from '../common/GlobalConstants';
import {JulianDate} from 'cesium';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements AfterViewInit {
  @ViewChild('timelineDiv', {static: false}) timelineDiv: ElementRef;
  private timeline: Timeline;
  private appDataService: AppDataService;

  constructor(appDataService: AppDataService) {
  this.appDataService = appDataService;
  }

  ngAfterViewInit(): void {
    console.log(this.timelineDiv.nativeElement);
    const start: Date = new Date(JulianDate.toIso8601(GlobalConstants.mapControl.getClockStart()));
    const end: Date = new Date(JulianDate.toIso8601(GlobalConstants.mapControl.getClockStop()));
    this.timeline = new Timeline(this.timelineDiv, start, end, this.appDataService);
    GlobalConstants.mapControl.mapViewer.clock.onTick.addEventListener(clock => {
      this.onClockTick(clock);
    });
    this.timeline.updateTimeline(start, end);
   }

   onClockTick(clock: any): void {
     this.timeline.updateTime(new Date(JulianDate.toIso8601(clock.currentTime)));
   }

}
