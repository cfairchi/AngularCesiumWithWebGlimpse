
import {buildModuleUrl, TileMapServiceImageryProvider, Viewer} from 'cesium';
import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appCesium]',
})

export class CesiumDirective implements OnInit {
  private readonly mainViewer: Viewer;

  constructor(private el: ElementRef) {
    this.mainViewer = new Viewer(this.el.nativeElement, {
      imageryProvider: new TileMapServiceImageryProvider({
        url: buildModuleUrl("Assets/Textures/NaturalEarthII"),
      }),
      baseLayerPicker: false,
      geocoder: false
    });
  }

  ngOnInit(): void {

  }

  get main_viewer(): Viewer {
    return this.mainViewer;
  }

}
