import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { dia, util, shapes } from '@clientio/rappid';
import * as joint from 'jointjs';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddShapesService {
  graph: any;

  drawShape: boolean = false;
  linkView!: any;

  remoteChanges = new Map();

  constructor() {}

  getSquare() {
    let square = new shapes.standard.Rectangle({
      name: 'Square',
      position: { x: 200, y: 200 },
      size: { width: 100, height: 100 },

      attrs: {
        label: {
          text: 'square',
          fill: 'yellow',
        },
        body: {
          fill: 'red',
          stroke: 'black',
        },
      },
    });

    return square;
  }

  getRoundedSquare() {
    let roundedSquare = new shapes.standard.Rectangle({
      name: 'RoundedSquare',
      position: { x: 400, y: 200 },
      size: { width: 100, height: 100 },
      attrs: {
        label: {
          text: 'rounded square',
          fill: '#FFB6C1',
          fontSize: '15',
          fontFamily: 'Arial',
          fontStyle: 'bold',
          textDecoration: 'underline',
        },
        body: {
          fill: '#FF1493',
          stroke: 'black',
          strokeWidth: 5,
          strokeOpacity: 0.4,
          rx: 15,
          ry: 15,
        },
      },
    });

    roundedSquare;

    return roundedSquare;
  }

  getCircle() {
    let circle = new shapes.standard.Ellipse({
      name: 'Circle',
      position: { x: 600, y: 200 },
      size: { width: 100, height: 100 },
      attrs: {
        label: {
          text: 'circle',
        },
      },
    });

    return circle;
  }

  getTriangle() {
    let triangle = new shapes.standard.Polygon({
      name: 'Triangle',
      position: { x: 200, y: 200 },
      size: { width: 100, height: 100 },
      attrs: {
        label: {
          text: 'triangle',
        },
      },
    });

    triangle.attr('label/refY', '80%');

    triangle.attr('body/stroke', 'black');
    triangle.attr('body/strokeWidth', 1);
    triangle.attr('body/strokeOpacity', 1);

    // triangle.attr('body/fillOpacity', 0.5);
    triangle.attr('body/refPoints', '50 30, 100 100, 0 100 ');
    return triangle;
  }
}
