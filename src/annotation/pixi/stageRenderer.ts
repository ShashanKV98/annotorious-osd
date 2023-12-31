import * as PIXI from 'pixi.js';
import type OpenSeadragon from 'openseadragon';
import { ShapeType } from '@annotorious/annotorious/src';
import type { DrawingStyle, Filter, Selection } from '@annotorious/core';
import type { Ellipse, ImageAnnotation, Polygon, Rectangle, Shape, Freehand } from '@annotorious/annotorious/src';
import parse from 'parse-svg-path'
import { getSmoothPathData, options } from '../utils/path'

const DEFAULT_FILL = 0x1a73e8;
const DEFAULT_ALPHA = 0.25;

// Fast redraws skip counter-scaling operations
let fastRedraw = false;

// Likewise, if scale has not changed, counter-scaling is also skipped
let lastScale: number;

interface AnnotationShape {

  annotation: ImageAnnotation;

  fill: PIXI.Graphics;

  stroke: PIXI.Graphics;

  strokeWidth: number;

}

const getGraphicsStyle = (style?: DrawingStyle) => {
  const fillStyle = {
    tint: style?.fill ? PIXI.utils.string2hex(style.fill) : DEFAULT_FILL,
    alpha: style?.fillOpacity === undefined ? DEFAULT_ALPHA : Math.min(style.fillOpacity, 1)
  };

  const strokeStyle = {
    tint: style?.stroke && PIXI.utils.string2hex(style.stroke),
    alpha: style?.strokeOpacity === undefined ? (style.stroke ? 1 : 0) : Math.min(style.strokeOpacity, 1),
    lineWidth: style?.stroke ? style?.strokeWidth || 1 : 0
  }

  return { fillStyle, strokeStyle };
}

const drawShape = <T extends Shape>(fn: (s: T, g: PIXI.Graphics) => void) => (container: PIXI.Graphics, shape: T, style?: DrawingStyle) => {
  const { fillStyle, strokeStyle } = getGraphicsStyle(style);

  const fillGraphics = new PIXI.Graphics();
  fillGraphics.beginFill(0xffffff);
  fn(shape, fillGraphics); 
  fillGraphics.endFill();
  fillGraphics.tint = fillStyle.tint;
  fillGraphics.alpha = fillStyle.alpha;

  container.addChild(fillGraphics);
    
  const strokeGraphics = new PIXI.Graphics();
  strokeGraphics.lineStyle(strokeStyle.lineWidth / lastScale, 0xffffff, 1, 0.5, strokeStyle.lineWidth === 1);
  fn(shape, strokeGraphics); 
  strokeGraphics.tint = strokeStyle.tint;
  strokeGraphics.alpha = strokeStyle.alpha;

  container.addChild(strokeGraphics);
    
  return { fill: fillGraphics, stroke: strokeGraphics, strokeWidth: strokeStyle.lineWidth };
}

const drawFreehand = drawShape((freehand: Freehand, g: PIXI.Graphics) => {
  const pathData = getSmoothPathData(freehand.geometry.points, options, true)
  const commands = parse(pathData)

  commands.forEach((cmd) => {
    switch (cmd[0]) {
      case 'M': // MoveTo
        g.moveTo(cmd[1], cmd[2])
        break
      case 'L': // LineTo
        g.lineTo(cmd[1], cmd[2])
        break
      case 'Q':
        if (cmd.points.length === 4) {
          g.quadraticCurveTo(cmd[1], cmd[2], cmd[3], cmd[4])
        }
        break
      case 'C':
        if (cmd.points.length === 6) {
          g.bezierCurveTo(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6])
        }
        break
      case 'Z':
        g.closePath()
        break
      default:
        console.warn(`Unhandled path command: ${cmd[0]}`)
    }
  })
})


const drawEllipse = drawShape((ellipse: Ellipse, g: PIXI.Graphics) => {
  const { cx, cy, rx, ry } = ellipse.geometry;
  g.drawEllipse(cx, cy, rx, ry)
});

const drawPolygon = drawShape((polygon: Polygon, g: PIXI.Graphics) => {
  const flattend = polygon.geometry.points.reduce((flat, xy) => ([...flat, ...xy]), []);   
  g.drawPolygon(flattend);
});


const drawRectangle = drawShape((rectangle: Rectangle, g: PIXI.Graphics) => {
  const { x, y, w, h } = rectangle.geometry;
  g.drawRect(x, y, w, h);
});

const redrawStage = (
  viewer: OpenSeadragon.Viewer, 
  graphics: PIXI.Graphics,
  shapes: Map<String, AnnotationShape>,
  renderer: PIXI.AbstractRenderer
) => () => {
  const viewportBounds = viewer.viewport.viewportToImageRectangle(viewer.viewport.getBounds(true));

  const containerWidth = viewer.viewport.getContainerSize().x;
  const zoom = viewer.viewport.getZoom(true);
  const scale = zoom * containerWidth / viewer.world.getContentFactor();

  if (scale !== lastScale && !fastRedraw) {
    fastRedraw = true;

    shapes.forEach(({ stroke, strokeWidth }) => {
      const { lineStyle } = stroke.geometry.graphicsData[0];

      if (strokeWidth > 1) {
        // Disable fast redraws if at least one shape
        // has non-native stroke
        fastRedraw = false;

        // Counter scale stroke
        lineStyle.width = strokeWidth / scale;

        // @ts-ignore
        stroke.geometry.invalidate();
      } else if (strokeWidth === 1 && !lineStyle.native) {
        // Set native stroke if necessary
        lineStyle.width = 1;
        lineStyle.native = true;

        // @ts-ignore
        stroke.geometry.invalidate();
      }
    });
  }

  lastScale = scale;

  const rotation = Math.PI * viewer.viewport.getRotation() / 180;

  const dx = - viewportBounds.x * scale;
  const dy = - viewportBounds.y * scale;

  let offsetX: number, offsetY: number;

  if (rotation > 0 && rotation <= Math.PI / 2) {
    offsetX = viewportBounds.height * scale;
    offsetY = 0;
  } else if (rotation > Math.PI / 2 && rotation <= Math.PI) {
    offsetX = viewportBounds.width * scale;
    offsetY = viewportBounds.height * scale;
  } else if (rotation > Math.PI && rotation <= Math.PI * 1.5) {
    offsetX = 0;
    offsetY = viewportBounds.width * scale;
  } else {
    offsetX = 0;
    offsetY = 0;
  }
    
  graphics.position.x = offsetX + dx * Math.cos(rotation) - dy * Math.sin(rotation);
  graphics.position.y = offsetY + dx * Math.sin(rotation) + dy * Math.cos(rotation);
  graphics.scale.set(scale, scale);
  graphics.rotation = rotation;
  
  renderer.render(graphics);
}

export const createStage = (viewer: OpenSeadragon.Viewer, canvas: HTMLCanvasElement) => {

  const graphics = new PIXI.Graphics();

  const renderer = PIXI.autoDetectRenderer({ 
    width: canvas.width, 
    height: canvas.height,
    backgroundAlpha: 0,
    view: canvas,
    antialias: true,
    resolution: 2
  });

  // Lookup table: shapes and annotations by annotation ID
  const annotationShapes = new Map<string, AnnotationShape>(); 

  // Current selection (if any)
  let selectedIds = new Set<string>();

  // Current style (if any)
  let style: DrawingStyle | ((a: ImageAnnotation) => DrawingStyle) | undefined = undefined;

  const addAnnotation = (annotation: ImageAnnotation) => {
    // In case this annotation adds stroke > 1
    fastRedraw = false; 

    const { selector } = annotation.target;

    const s = typeof style == 'function' ? style(annotation) : style;

    let rendered: { fill: PIXI.Graphics, stroke: PIXI.Graphics, strokeWidth: number };

    if (selector.type === ShapeType.RECTANGLE) {
      rendered = drawRectangle(graphics, selector as Rectangle, s);
    } else if (selector.type === ShapeType.POLYGON) {
      rendered = drawPolygon(graphics, selector as Polygon, s)
    } else if (selector.type === ShapeType.FREEHAND) {
      rendered = drawFreehand(graphics, selector as Freehand, s)
    } else if (selector.type === ShapeType.ELLIPSE) {
      rendered = drawEllipse(graphics, selector as Ellipse, s)
    } else {
      console.warn(`Unsupported shape type: ${selector.type}`)
    }

    if (rendered)
      annotationShapes.set(annotation.id, { annotation, ...rendered });
  }

  const removeAnnotation = (annotation: ImageAnnotation) => {
    const rendered = annotationShapes.get(annotation.id);
    if (rendered) {
      annotationShapes.delete(annotation.id); 
      rendered.fill.destroy();
      rendered.stroke.destroy(); 
    }
  }

  const updateAnnotation = (oldValue: ImageAnnotation, newValue: ImageAnnotation) => {
    // In case this annotation adds stroke > 1
    fastRedraw = false; 
    
    const rendered = annotationShapes.get(oldValue.id);

    if (rendered) {
      annotationShapes.delete(oldValue.id);
      rendered.fill.destroy();
      rendered.stroke.destroy();

      addAnnotation(newValue)
    }
  }

  const resize = (width: number, height: number) => {
    renderer.resize(width, height);
    renderer.render(graphics);
  }

  const setFilter = (filter: Filter) => {
    // In case this filter adds annotations with stroke > 1
    fastRedraw = false; 

    const { children } = graphics;

    annotationShapes.forEach(({ fill, stroke , annotation }) => {
      // Note: selected annotation always remains visible
      const visible = filter ? 
        selectedIds.has(annotation.id) || filter(annotation) : 
        true;
      
      if (visible && !(children.includes(fill))) {
        graphics.addChild(fill);
        graphics.addChild(stroke);
      } else if (!visible && children.includes(fill)) {
        graphics.removeChild(fill);
        graphics.removeChild(stroke)
      }
    });

    renderer.render(graphics);
  }

  const setSelected = (selection: Selection) => {
    const { selected } = selection;
    selectedIds = new Set(selected.map(t => t.id));
  }

  const setStyle = (s: DrawingStyle | ((a: ImageAnnotation) => DrawingStyle) | undefined) => {
    if (typeof s === 'function') {
      annotationShapes.forEach(({ annotation, fill, stroke, strokeWidth }, _) => {
        if (strokeWidth > 1)
          fastRedraw = false;

        const { fillStyle, strokeStyle } = getGraphicsStyle(s(annotation));

        fill.tint = fillStyle.tint;
        fill.alpha = fillStyle.alpha;

        stroke.tint = strokeStyle.tint;
        stroke.alpha = strokeStyle.alpha;

        annotationShapes.set(annotation.id, { annotation, fill, stroke, strokeWidth });
      });
    } else {
      const { fillStyle, strokeStyle } = getGraphicsStyle(s);

      if (strokeStyle.lineWidth > 1)
        fastRedraw = false;

      annotationShapes.forEach(({ annotation, fill, stroke, strokeWidth }, _) => {
        fill.tint = fillStyle.tint;
        fill.alpha = fillStyle.alpha;

        stroke.tint = strokeStyle.tint;
        stroke.alpha = strokeStyle.alpha;

        annotationShapes.set(annotation.id, { annotation, fill, stroke, strokeWidth });
      });
    }
  
    style = s;

    renderer.render(graphics);
  }
  
  const destroy = () => renderer.destroy();

  return {
    addAnnotation,
    destroy,
    redraw: redrawStage(viewer, graphics, annotationShapes, renderer),
    removeAnnotation,
    resize,
    setFilter,
    setSelected,
    setStyle,
    updateAnnotation
  }
  
}
