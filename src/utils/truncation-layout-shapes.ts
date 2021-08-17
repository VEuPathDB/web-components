import { OrientationDefault, truncationConfig } from '../types/plots';
import { Shape } from 'plotly.js';

//DKDK A function to generate layout.shapes for truncated axis
export function truncationLayoutShapes(
  orientation = OrientationDefault,
  independentAxisLowerExtensionStart: number | string,
  independentAxisLowerExtensionEnd: number | string,
  independentAxisUpperExtensionStart: number | string,
  independentAxisUpperExtensionEnd: number | string,
  dependentAxisUpperExtensionStart: number | undefined,
  dependentAxisUpperExtensionEnd: number | undefined,
  dependentAxisLowerExtensionStart: number | undefined,
  dependentAxisLowerExtensionEnd: number | undefined,
  truncationConfig?: truncationConfig
  // dependentAxisLogScale?: boolean,
) {
  //DKDK this will be used with conditions
  let truncationLayoutShapes: Partial<Shape>[] = [{}];

  //DKDK independent axis min
  if (truncationConfig?.independentAxis.min) {
    truncationLayoutShapes = [
      ...truncationLayoutShapes,
      {
        type: 'rect',
        line: {
          width: 0,
          dash: 'dash',
        },
        fillcolor: '#e6e6e6',
        opacity: 1,
        xref: orientation === 'vertical' ? 'x' : 'paper',
        yref: orientation === 'vertical' ? 'paper' : 'y',
        x0: orientation === 'vertical' ? independentAxisLowerExtensionStart : 0,
        x1: orientation === 'vertical' ? independentAxisLowerExtensionEnd : 1,
        y0: orientation === 'vertical' ? 0 : independentAxisLowerExtensionStart,
        y1: orientation === 'vertical' ? 1 : independentAxisLowerExtensionEnd,
      },
    ];
  }

  //DKDK independent axis max
  if (truncationConfig?.independentAxis.max) {
    truncationLayoutShapes = [
      ...truncationLayoutShapes,
      {
        type: 'rect',
        line: {
          width: 0,
          dash: 'dash',
          color: '#999999',
        },
        fillcolor: '#e6e6e6',
        opacity: 1,
        xref: orientation === 'vertical' ? 'x' : 'paper',
        yref: orientation === 'vertical' ? 'paper' : 'y',
        x0: orientation === 'vertical' ? independentAxisUpperExtensionStart : 0,
        x1: orientation === 'vertical' ? independentAxisUpperExtensionEnd : 1,
        y0: orientation === 'vertical' ? 0 : independentAxisUpperExtensionStart,
        y1: orientation === 'vertical' ? 1 : independentAxisUpperExtensionEnd,
      },
    ];
  }

  //DKDK dependent axis max
  if (truncationConfig?.dependentAxis.max) {
    truncationLayoutShapes = [
      ...truncationLayoutShapes,
      {
        type: 'rect',
        line: {
          width: 0,
          dash: 'dash',
        },
        fillcolor: '#e6e6e6',
        opacity: 1,
        xref: orientation === 'vertical' ? 'paper' : 'x',
        yref: orientation === 'vertical' ? 'y' : 'paper',
        x0: orientation === 'vertical' ? 0 : dependentAxisUpperExtensionStart,
        x1: orientation === 'vertical' ? 1 : dependentAxisUpperExtensionEnd,
        y0: orientation === 'vertical' ? dependentAxisUpperExtensionStart : 0,
        y1: orientation === 'vertical' ? dependentAxisUpperExtensionEnd : 1,
      },
    ];
  }

  //DKDK dependent axis min
  if (truncationConfig?.dependentAxis.min) {
    truncationLayoutShapes = [
      ...truncationLayoutShapes,
      {
        type: 'rect',
        line: {
          width: 0,
          dash: 'dash',
        },
        fillcolor: '#e6e6e6',
        opacity: 1,
        xref: orientation === 'vertical' ? 'paper' : 'x',
        yref: orientation === 'vertical' ? 'y' : 'paper',
        x0: orientation === 'vertical' ? 0 : dependentAxisLowerExtensionStart,
        x1: orientation === 'vertical' ? 1 : dependentAxisLowerExtensionEnd,
        y0: orientation === 'vertical' ? dependentAxisLowerExtensionStart : 0,
        y1: orientation === 'vertical' ? dependentAxisLowerExtensionEnd : 1,
      },
    ];
  }

  console.log('truncationLayoutShapes = ', truncationLayoutShapes);

  //DKDK remove undefined element (e.g., initial empty one)
  const filteredTruncationLayoutShapes = truncationLayoutShapes.filter(
    (shape) => {
      if (
        shape.x0 != null &&
        shape.x1 != null &&
        shape.y0 != null &&
        shape.y1 != null
      ) {
        return shape;
      }
    }
  );

  return filteredTruncationLayoutShapes;
}
