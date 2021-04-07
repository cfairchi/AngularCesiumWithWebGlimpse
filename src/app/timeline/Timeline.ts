import * as Webglimpse from 'webglimpse';
import * as $ from 'jquery';
import {ElementRef} from '@angular/core';
import * as moment from 'moment';
import {AppDataService} from '../common/AppDataService';

export class Timeline {
  private timelineCanvas: HTMLCanvasElement = document.createElement( 'canvas' ) as HTMLCanvasElement;
  private parentContainer: Node;
  private drawable;
  private timelineModel: Webglimpse.TimelineModel;
  private timelineUI: Webglimpse.TimelineUi;
  private timeAxis: Webglimpse.TimeAxis1D;
  private timelineSelection: Webglimpse.TimelineSelectionModel;
  private currentTimeline: Webglimpse.Timeline;
  private currentTime: Date;
  private startDt: Date;
  private endDt: Date;
  private appDataService: AppDataService;

  private timelineOptions: Webglimpse.TimelinePaneOptions = {
    selectedIntervalMode: 'single',
    topTimeZone: '-0500',
    fgColor: Webglimpse.white,
    rowLabelColor: Webglimpse.white,
    groupLabelColor: Webglimpse.white,
    axisLabelColor: Webglimpse.white,
    bgColor: Webglimpse.rgb( 0.098, 0.165, 0.243 ),
    rowBgColor: Webglimpse.rgb( 0.020, 0.086, 0.165 ),
    rowAltBgColor: Webglimpse.rgb( 0.020, 0.086, 0.165 ),
    gridColor: Webglimpse.gray( 0.5 ),
    selectedIntervalFillColor: Webglimpse.rgba( 0, 0.6, 0.8, 0.157 ),
    selectedIntervalBorderColor: Webglimpse.rgb( 0, 0.2, 1.0 ),
    allowEventMultiSelection: true,
    rowPaneFactoryChooser: Webglimpse.rowPaneFactoryChooser_THIN
  };

  private paneOptions: Webglimpse.TimelinePaneOptions = {
    selectedIntervalMode: 'single',
    topTimeZone: '-0000',
    fgColor: Webglimpse.white,
    rowLabelColor: Webglimpse.white,
    groupLabelColor: Webglimpse.white,
    axisLabelColor: Webglimpse.white,
    bgColor: Webglimpse.rgb(.098, .165, .243),
    rowBgColor: Webglimpse.rgb(.02, .086, .165),
    rowAltBgColor: Webglimpse.rgb(.02, .086, .165),
    gridColor: Webglimpse.gray(.5),
    selectedIntervalFillColor: Webglimpse.rgba(0, .6, .8, .157),
    selectedIntervalBorderColor: Webglimpse.rgb(0, .2, 1),
    allowEventMultiSelection: true,
    rowPaneFactoryChooser: Webglimpse.rowPaneFactoryChooser_THIN
  };

  constructor(container: ElementRef, startDt: Date, endDt: Date, appDataService: AppDataService) {
    this.parentContainer = container.nativeElement;
    this.appDataService = appDataService;
    this.startDt = startDt;
    this.endDt = endDt;
    this.setupCanvas();
    this.setupTimeline();
  }

  setupTimeline(): void {
    this.timelineModel = new Webglimpse.TimelineModel( );
    this.timelineUI = new Webglimpse.TimelineUi( this.timelineModel , { allowEventMultiSelection : true } );
    this.timeAxis = new Webglimpse.TimeAxis1D(
      Webglimpse.parseTime_PMILLIS(this.startDt.toISOString()),
      Webglimpse.parseTime_PMILLIS(this.endDt.toISOString())
    );

    const timelinePane = Webglimpse.newTimelinePane(
      this.drawable, this.timeAxis, this.timelineModel, this.timelineOptions, this.timelineUI);

    this.timeAxis.limitsChanged.on(this.drawable.redraw);
    this.timelineSelection = this.timelineUI.selection;
    this.timelineSelection.selectedInterval.setInterval(
        Webglimpse.parseTime_PMILLIS(this.startDt.toISOString()),
        Webglimpse.parseTime_PMILLIS(this.startDt.toISOString()));

    const contentPane = new Webglimpse.Pane(Webglimpse.newCornerLayout(Webglimpse.Side.LEFT, Webglimpse.Side.TOP));
    contentPane.addPane(timelinePane);
    this.drawable.setContentPane(
      Webglimpse.newInsetPane(contentPane, Webglimpse.newInsets( 12, 10, 2), this.timelineOptions.bgColor));

    this.timelineSelection.selectedInterval.changed.on(() => {
      const iso8601Time = Webglimpse.formatTime_ISO8601(this.timelineSelection.selectedInterval.end_PMILLIS);
      this.currentTime = new Date(iso8601Time);
      this.appDataService.announceTimelineSelectTime(this.currentTime);
      console.log(this.currentTime.toISOString());
    });

    this.currentTimeline = this.generateDefaultTimeline();
    this.drawable.redraw();
  }

  setupCanvas(): void {
    this.timelineCanvas.id = 'timelineCanvas';
    this.timelineCanvas.className = 'timelineCanvas';
    this.timelineCanvas.style.padding = '0';
    this.parentContainer.appendChild(this.timelineCanvas);
    this.drawable = Webglimpse.newDrawable(this.timelineCanvas);
    $(window).resize(this.updateCanvasSize);
    this.updateCanvasSize();
  }

  updateTime(newTime: Date) {
    this.timelineSelection.selectedInterval.setInterval(
      Webglimpse.parseTime_PMILLIS(newTime.toISOString()),
      Webglimpse.parseTime_PMILLIS(newTime.toISOString()));
  }

  updateCanvasSize(): void {
    // Make the canvas extend to the bottom of the browser viewport
    // (can't just set CSS height to 100%, because of the toolbar)
     $( this.timelineCanvas ).height( $( window ).height( ) - this.timelineCanvas.getBoundingClientRect( ).top );
     $( this.timelineCanvas ).width( $( window ).width( ) );
    //
     this.timelineCanvas.width = $( this.timelineCanvas ).width( );
     this.timelineCanvas.height = $( this.timelineCanvas ).height( );
     this.drawable.redraw( );
  }

  updateTimeline(startDt: Date, stopDt: Date): void {
    const sliceStart = moment.utc(startDt).toISOString();
    const sliceEnd = moment.utc(stopDt).toISOString();

    this.timelineModel.replace(this.currentTimeline);

    // Weird jumping thing happening with cursor at the start, need to slightly increase the available interval or timeaxis1d
    this.timelineSelection.selectedInterval.setInterval(
      Webglimpse.parseTime_PMILLIS(sliceStart),
      Webglimpse.parseTime_PMILLIS(sliceStart),
      Webglimpse.parseTime_PMILLIS(sliceStart)
    );

    this.timelineSelection.selectedInterval.changed.on(() => {
      const iso8601Time = Webglimpse.formatTime_ISO8601(this.timelineSelection.selectedInterval.end_PMILLIS);
      this.currentTime = new Date(iso8601Time);
      // this.store.dispatch(new AppActions.SetCurrentTime({ iso8601Time }));
    });

    this.timeAxis = new Webglimpse.TimeAxis1D(
      Webglimpse.parseTime_PMILLIS(sliceStart),
      Webglimpse.parseTime_PMILLIS(sliceEnd)
    );

    this.timeAxis.limitsChanged.on(this.drawable.redraw);

    const timelinePane = Webglimpse.newTimelinePane(this.drawable, this.timeAxis, this.timelineModel, this.paneOptions, this.timelineUI);
    const contentPane = new Webglimpse.Pane(Webglimpse.newCornerLayout(3, 0));
    contentPane.addPane(timelinePane);
    this.drawable.setContentPane(Webglimpse.newInsetPane(contentPane, Webglimpse.newInsets(12, 10, 2), this.paneOptions.bgColor));
    this.timelineSelection.selectedInterval.cursor_PMILLIS = Webglimpse.parseTime_PMILLIS(startDt.toISOString());
    this.updateCanvasSize();

    this.timelineSelection.selectedInterval.setInterval(
      Webglimpse.parseTime_PMILLIS(startDt.toISOString()),
      Webglimpse.parseTime_PMILLIS(stopDt.toISOString()));

    this.drawable.redraw();

  }

  generateDefaultTimeline(): Webglimpse.Timeline {
    // const { charts, labels, events, rows, groups } = timeline;
    const defaultCursorId = 'default_cursor';

    // TODO: if there are no groups or rows, attach the default group/row
    const defaultRow = {
      rowGuid: 'timeline1',
      label: 'Default',
      timeseriesGuids: [],
      annotationGuids: [],
      eventGuids: [],
      cursorGuid: defaultCursorId
    };
    const defaultGroup = { groupGuid: 'timeline1', label: 'Timeline', rowGuids: [defaultRow.rowGuid] };

    const timeline: Webglimpse.Timeline = {
      cursors: [{
        cursorGuid: defaultCursorId,
        labeledTimeseriesGuids: ['chart1'],
        lineColor: 'white',
        textColor: 'white',
        showCursorText: true,
        showVerticalLine: true,
        showHorizontalLine: true
      }],
      annotations: [],
      timeseriesFragments: [],
      timeseries: [
        {
          timeseriesGuid: 'metsci.timelineExample.timeseries01',
          uiHint: 'lines',
          lineThickness : 1,
          lineColor : '#C0C0C0',
          fragmentGuids: [
          ]
        }],
      events: [],
      rows: [ {
        rowGuid: 'metsci.timelineExample.row01a',
        label: 'Row #1A',
        bgColor : '#C0C0C0',
        eventGuids: [
          'metsci.timelineExample.event01',
          'metsci.timelineExample.event02',
          'metsci.timelineExample.event03',
          'metsci.timelineExample.event12'
        ]
      }],
      groups: [ {
        groupGuid: 'metsci.timelineExample.group01',
        label: 'Time',
        rowGuids: [
          'metsci.timelineExample.row01a',
        ]
      }],
      root: {
        groupGuids: [
          'metsci.timelineExample.group01',
        ],
        topPinnedRowGuids: [],
        bottomPinnedRowGuids: [],
        maximizedRowGuids: []
      },
    };

    if (timeline.rows.length < 1 && timeline.groups.length < 1 && timeline.root.groupGuids.length < 1) {
      timeline.rows.push(defaultRow);
      timeline.groups.push(defaultGroup);
      timeline.root.groupGuids.push(defaultGroup.groupGuid);
    }

    return timeline;
  }
}
