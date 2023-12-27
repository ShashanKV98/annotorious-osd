import type OpenSeadragon from 'openseadragon';
import type { DrawingStyle, Filter, Selection } from '@annotorious/core';
import type { ImageAnnotation } from '@annotorious/annotorious/src';
export declare const createStage: (viewer: OpenSeadragon.Viewer, canvas: HTMLCanvasElement) => {
    addAnnotation: (annotation: ImageAnnotation) => void;
    destroy: () => void;
    redraw: () => void;
    removeAnnotation: (annotation: ImageAnnotation) => void;
    resize: (width: number, height: number) => void;
    setFilter: (filter: Filter) => void;
    setSelected: (selection: Selection) => void;
    setStyle: (s: DrawingStyle | ((a: ImageAnnotation) => DrawingStyle)) => void;
    updateAnnotation: (oldValue: ImageAnnotation, newValue: ImageAnnotation) => void;
};
//# sourceMappingURL=stageRenderer.d.ts.map