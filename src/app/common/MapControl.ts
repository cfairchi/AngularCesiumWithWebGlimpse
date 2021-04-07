import {
  AnimationViewModel,
  buildModuleUrl,
  Cartesian3,
  Cesium3DTileset,
  CesiumTerrainProvider,
  ConstantProperty, createWorldImagery,
  CzmlDataSource,
  Entity,
  EntityCollection,
  IonResource, IonWorldImageryStyle,
  JulianDate, TileMapServiceImageryProvider,
  Viewer,
  viewerDragDropMixin
} from 'cesium';
import {IanaTimezone} from './TimeZones';

export class MapControl {
  public mapViewer: Viewer;
  private defaultEntityCollection: EntityCollection;
  private czmlDataSource: CzmlDataSource = new CzmlDataSource();

  public init(viewer: Viewer): void {
    this.mapViewer = viewer;
    this.mapViewer.extend(viewerDragDropMixin);

    this.mapViewer.imageryLayers.addImageryProvider(createWorldImagery({
       style: IonWorldImageryStyle.AERIAL_WITH_LABELS}));

    // this.mapViewer.terrainProvider = new CesiumTerrainProvider({
    //   url: IonResource.fromAssetId(1),
    // });
    //
    // this.mapViewer.scene.primitives.add(
    //   new Cesium3DTileset({
    //     url: IonResource.fromAssetId(16820),
    //   })
    // );
    // this.mapViewer.scene.primitives.add(
    //   new Cesium3DTileset({
    //     url: IonResource.fromAssetId(96188),
    //   })
    // );
    this.defaultEntityCollection = this.mapViewer.entities;
    this.mapViewer.dataSources.add(this.czmlDataSource);
  }

  public loadCzml(czmlData: string): void {
    this.czmlDataSource.entities.removeAll();
    this.czmlDataSource.load(czmlData);
  }

  public removeAllDataSources(): void {
    this.czmlDataSource.entities.removeAll();
  }

  public setClock(start: JulianDate, stop: JulianDate, current: JulianDate): void {
    this.mapViewer.clock.startTime = start;
    this.mapViewer.clock.stopTime = stop;
    this.mapViewer.clock.currentTime = start;
  }

  public getClockStart(): JulianDate {
    return this.mapViewer.clock.startTime;
  }

  public getClockStop(): JulianDate {
    return this.mapViewer.clock.stopTime;
  }

  public setClockMultiplier(seconds: number): void {
    this.mapViewer.clock.multiplier = seconds;
  }

  public setCurrentTime(current: Date): void {
    this.mapViewer.clock.currentTime = JulianDate.fromDate(current);
  }

  public setCurrentTimeFromString(current: string): void {
    this.mapViewer.clock.currentTime = JulianDate.fromIso8601(current.replace('  ', 'T') + 'Z');
  }

  public zoomToSatelliteEntity(entityId: string): void {
    const selectedEntity: Entity = this.czmlDataSource.entities.getById('Satellite/tle_' + entityId);
    if (selectedEntity) {
      this.mapViewer.trackedEntity = selectedEntity;
      this.mapViewer.trackedEntity.viewFrom = new ConstantProperty(Cartesian3.fromDegrees(180, 80, 10000));
      this.setClockMultiplier(10);
    }

  }

  public flyHome(): void {
    this.mapViewer.scene.camera.flyHome();
  }

  public zoomToSiteEntity(entityId: string): void {
    let selectedEntity: Entity = this.czmlDataSource.entities.getById('Target/' + entityId);
    if (!selectedEntity) {
      selectedEntity = this.czmlDataSource.entities.getById('AreaTarget/' + entityId);
    }
    if (selectedEntity) {
      this.mapViewer.trackedEntity = selectedEntity;
      this.mapViewer.trackedEntity.viewFrom = new ConstantProperty(Cartesian3.fromDegrees(180, 80, 1000));
      this.setClockMultiplier(10);
    }
  }

  public updateTimeZone(tz: IanaTimezone): void {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'];
    this.mapViewer.animation.viewModel.dateFormatter = (jDate: JulianDate) => {
      const date = JulianDate.toDate(jDate);
      return `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    };
  }

}
