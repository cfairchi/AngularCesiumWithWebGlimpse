import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class AppDataService {

  // Observable string sources
  private timelineSelectedTime = new Subject<Date>();

  // Observable string streams
  timelineSelectedTime$ = this.timelineSelectedTime.asObservable();

  // Service message commands
  announceTimelineSelectTime(dt: Date): void {
    this.timelineSelectedTime.next(dt);
  }
}
