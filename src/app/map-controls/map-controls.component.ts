import {Component, OnInit} from '@angular/core';
import {Cartesian3, Color, EntityCollection, Math, Viewer} from 'cesium';
import {CesiumDirective} from '../cesium.directive';
import {GlobalConstants} from '../common/GlobalConstants';
import {AppDataService} from '../common/AppDataService';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.css']
})

export class MapControlsComponent implements OnInit {
  private cesiumDirective: CesiumDirective;
  private mainViewer: Viewer;
  private defaultEntityCollection: EntityCollection;

  private appDataService: AppDataService;

  constructor(private cd: CesiumDirective, appDataService: AppDataService) {
    this.cesiumDirective = cd;

    this.appDataService = appDataService;
  }

  ngOnInit(): void {
    GlobalConstants.mapControl.init(this.cesiumDirective.main_viewer);

    this.appDataService.timelineSelectedTime$.subscribe(selectedTime => {
      GlobalConstants.mapControl.setCurrentTime(selectedTime);
    });
  }

  zoomToAGI(): void {
    this.defaultEntityCollection.add(
      {
        position: Cartesian3.fromDegrees(-75.59661251236878, 40.0385638082054, 0),
        point: {
          color: Color.RED
        }
      });

    this.mainViewer.zoomTo(this.mainViewer.entities, {
      heading: Math.toRadians(90),
      pitch: Math.toRadians(-45),
      range: 500
    });
  }


}
