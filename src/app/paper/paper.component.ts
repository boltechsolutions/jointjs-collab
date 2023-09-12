import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { dia, ui, shapes } from '@clientio/rappid';
import Convergence from '@convergence/convergence';
import * as joint from 'jointjs';
import * as ConvergenceJointUtils from '@convergence/jointjs-utils';
import { AddShapesService } from '../services/add-shapes.service';
@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss'],
})
export class PaperComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef;
  title = 'convergence_test_project';
  DOMAIN_URL =
    // 'https://ec2-52-203-126-126.compute-1.amazonaws.com/realtime/convergence/default';
    'http://localhost:8000/api/realtime/convergence/default';
  private graph: any;
  private paper: dia.Paper;
  private scroller: ui.PaperScroller;
  chatService: any;
  activityService: any;
  diagramId: any = '1';
  domain: any;
  model: any;
  activity: any;
  graphAdapter: any;
  activityName: any = 'diagram-collab';
  modelService: any;
  clipboard: ui.Clipboard = new ui.Clipboard();
  selection: ui.Selection;
  totalShapes: any = 0;
  constructor(private addShapesService: AddShapesService) {}
  public ngOnInit(): void {
    this.graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
    const paper: any = new joint.dia.Paper({
      width: window.innerWidth,
      height: 500,
      gridSize: 10,
      model: this.graph,
      drawGrid: {
        name: 'doubleMesh',
        args: [
          { color: '#E0DEDE', scaleFactor: 5, thickness: 1 },
          { color: '#E5E5E5', scaleFactor: 25, thickness: 2.5 },
        ],
      },
      background: {
        color: '#F2F2F2',
      },
      snapLinks: true,
      linkPinning: false,
      embeddingMode: true,
      highlighting: {
        default: { name: 'stroke', options: { padding: 6 } },
        embedding: {
          name: 'addClass',
          options: { className: 'highlighted-parent' },
        },
      },
      validateEmbedding: function (childView, parentView) {
        return parentView.model instanceof joint.shapes.devs.Coupled;
      },
      validateConnection: function (
        sourceView,
        sourceMagnet,
        targetView,
        targetMagnet
      ) {
        return sourceMagnet !== targetMagnet;
      },
    });

    const scroller = (this.scroller = new ui.PaperScroller({
      paper,
      borderless: true,
      inertia: true,
    }));

    this.selection = new ui.Selection({
      paper: paper,
    });

    paper.on('blank:pointerdown', (event: any) => {
      this.selection.collection.reset([]);
      this.selection.startSelecting(event);
    });

    paper.on('blank:pointerup', (event: any) => {
      this.selection.stopListening(event);
    });

    // this.loadData();
    scroller.render();
    this.totalShapes = this.graph.getCells().length;
  }

  public ngAfterViewInit(): void {
    const { scroller, paper, canvas } = this;
    canvas.nativeElement.appendChild(this.scroller.el);
    scroller.center();
    // paper.unfreeze();
    // this.joinConvergence();
  }

  joinConvergence() {
    console.log('graph size is', JSON.stringify(this.graph.toJSON()));
    Convergence.connectAnonymously(this.DOMAIN_URL, 'UT', {
      protocol: {
        defaultRequestTimeout: 50,
        // heartbeat: { enabled: true, pingInterval: 5, pongTimeout: 30 },
      },
      // connection: { connectionRequestTimeout: 30, timeout: 30 },
    })
      .then((domain) => {
        console.log(
          'domain apply model and activity creation',
          `Time : ${new Date().toLocaleTimeString()}`
        );
        // Now open the model, creating it using the initial data if it does not exist.
        this.activityService = domain.activities();
        this.modelService = domain.models();
        const modelPromise = domain.models().openAutoCreate({
          collection: 'example',
          id: this.diagramId,
          ephemeral: true,
          data: () => {
            return ConvergenceJointUtils.DataConverter.graphJsonToModelData(
              this.graph.toJSON()
            );
          },
        });

        const activityPromise = this.activityService.join(
          this.activityName,
          this.diagramId,
          {
            autoCreate: {
              ephemeral: true,
              worldPermissions: ['join', 'view_state', 'set_state', 'remove'],
            },
          }
        );
        return Promise.all([modelPromise, activityPromise]);
      })
      .then((results) => {
        console.log(
          'model and activity resolved',
          `Time : ${new Date().toLocaleTimeString()}`
        );

        this.model = results[0];
        this.activity = results[1];
        this.activity.on('session_left', (e: any) => {
          alert(`activity leave`);
          console.log(`activity leave`);
        });

        const graphAdapter = new ConvergenceJointUtils.GraphAdapter(
          this.graph,
          this.model
        );
        graphAdapter.bind();
        alert(`Convergence Join SuccessFully`);
        // const colorManager = new ConvergenceJointUtils.ActivityColorManager(
        //   this.activity
        // );
        // const pointerManager = new ConvergenceJointUtils.PointerManager(
        //   this.paper,
        //   activity,
        //   colorManager,
        //   '../dist/img/cursor.svg'
        // );
        // const selectionManager = new ConvergenceJointUtils.SelectionManager(
        //   this.paper,
        //   graphAdapter,
        //   colorManager
        // );
      })
      .catch((error) => {
        alert(`Error in Joining Convergence ${error}`);
        console.log(
          'Could not open model',
          `Time : ${new Date().toLocaleTimeString()}`
        );
        throw error;
      });
  }

  loadData() {
    //  circle is simplest
    //  roundedSquare has max data
    //  square has medium level

    for (let i = 1; i <= 10; i++) {
      // const rect: any = new shapes.standard.Rectangle({
      //   position: { x: 100, y: 100 },
      //   size: { width: 100, height: 50 },
      //   attrs: {
      //     label: {
      //       text: 'Hello World',
      //     },
      //   },
      // });
      const square = this.addShapesService.getSquare();
      const roundedSquare = this.addShapesService.getRoundedSquare();
      const circle = this.addShapesService.getCircle();
      this.graph.addCell(square);
      this.graph.addCell(roundedSquare);
      // this.graph.addCell(circle);
    }
    this.totalShapes = this.graph.getCells().length;
  }

  copyData() {
    const copiedElements = this.graph.getCells();

    console.log('copy data size is', JSON.stringify(copiedElements));
    this.selection.collection.reset(copiedElements);

    this.clipboard.copyElements(this.selection.collection, this.graph, {
      useLocalStorage: true,
    });
  }

  pasteData() {
    this.clipboard.pasteCells(this.graph, { useLocalStorage: false });
    this.selection.collection.reset([]);
    this.totalShapes = this.graph.getCells().length;
  }

  ngOnDestroy() {
    this.activity?.leave().then(() => {
      console.log('Left the activity');
      this.activity
        .participantsAsObservable()
        .subscribe((participants: any) => {
          console.log('participants', participants.length);
          if (participants.length === 1) {
            this.modelService.remove(this.diagramId).then(() => {
              console.log('John was canned :(');
            });
          }
        });
    });
  }
}
