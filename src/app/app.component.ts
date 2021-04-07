import {AfterContentInit, AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AppDataService} from './common/AppDataService';
import {SplitAreaDirective, SplitComponent} from 'angular-split';
import {AppState} from './common/AppState';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AppDataService]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('globeSplit') globeSplit: SplitComponent;
  @ViewChild('resultSplit') resultSplit: SplitComponent;
  title = 'AngularCesium';

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.globeSplit.setVisibleAreaSizes(AppState.getGlobeSplit());
    this.resultSplit.setVisibleAreaSizes(AppState.getResultSplit());
    this.globeSplit.dragEnd.subscribe( data => {
      AppState.setGlobeSplit(data.sizes);
    });
    this.resultSplit.dragEnd.subscribe( data => {
      AppState.setResultSplit(data.sizes);
    });
  }


}
