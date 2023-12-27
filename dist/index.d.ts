export * from './Annotorious';
export type { Annotation, AnnotationBody, AnnotationTarget, Annotator, AnnotatorState, Color, DrawingStyle, FormatAdapter, HoverState, Selection, SelectionState, Store, StoreChangeEvent, StoreObserver, ParseResult, User, W3CAnnotation, W3CAnnotationBody, W3CAnnotationTarget, W3CSelector } from '@annotorious/core';
import { PointerSelectAction as _PointerSelectAction } from '@annotorious/core';
export declare const defaultColorProvider: () => {
    assignRandomColor: () => string;
    releaseColor: (color: string) => number;
};
export declare const PointerSelectAction: typeof _PointerSelectAction;
export declare const createBody: (annotation: import("@annotorious/core").Annotation, payload: {
    [key: string]: any;
}, created?: Date, creator?: import("@annotorious/core").User) => import("@annotorious/core").AnnotationBody;
export type { AnnotoriousOpts, DrawingMode, DrawingTool, ImageAnnotator as AnnotoriousImageAnnotator, ImageAnnotation, ImageAnnotator, ImageAnnotatorState, Polygon, PolygonGeometry, Rectangle, RectangleGeometry, Shape } from '@annotorious/annotorious';
import { ShapeType as _ShapeType } from '@annotorious/annotorious';
export declare const createImageAnnotator: <E extends unknown = import("@annotorious/annotorious").ImageAnnotation>(image: string | HTMLCanvasElement | HTMLImageElement, options?: import("@annotorious/annotorious").AnnotoriousOpts<import("@annotorious/annotorious").ImageAnnotation, E>) => import("@annotorious/annotorious").ImageAnnotator<E>;
export declare const ShapeType: typeof _ShapeType;
export declare const W3CImageFormat: (source: string, invertY?: boolean) => import("@annotorious/annotorious").W3CImageFormatAdapter;
//# sourceMappingURL=index.d.ts.map