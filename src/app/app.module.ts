import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CesiumDirective} from './cesium.directive';
import {MapControlsComponent} from './map-controls/map-controls.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AngularSplitModule} from 'angular-split';
import { TimelineComponent } from './timeline/timeline.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Viewer } from 'cesium';

@NgModule({
  declarations: [
    AppComponent,
    CesiumDirective,
    MapControlsComponent,
    TimelineComponent,
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatListModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatTabsModule,
        MatSlideToggleModule,
        AngularSplitModule,
        MatToolbarModule,

    ],
  providers: [CesiumDirective, MapControlsComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  private readonly appMainViewer: Viewer;

  get app_main_viewer(): Viewer {
    return this.appMainViewer;
  }

  set app_main_viewer(mainViewer: Viewer) {
    this.app_main_viewer = mainViewer;
  }
}
