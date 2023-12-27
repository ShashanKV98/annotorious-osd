import type OpenSeadragon from 'openseadragon';
import type { SvelteComponent } from 'svelte';
import type { Annotator } from '@annotorious/core';
import type { AnnotoriousOpts, DrawingTool, DrawingToolOpts, ImageAnnotation, ShapeType } from '@annotorious/annotorious';
import { type FitboundsOptions } from './api';
export interface OpenSeadragonAnnotator<E extends unknown = ImageAnnotation> extends Annotator<ImageAnnotation, E> {
    viewer: OpenSeadragon.Viewer;
    fitBounds(arg: {
        id: string;
    } | string, opts?: FitboundsOptions): void;
    fitBoundsWithConstraints(arg: {
        id: string;
    } | string, opts?: FitboundsOptions): void;
    listDrawingTools(): string[];
    registerDrawingTool(name: string, tool: typeof SvelteComponent, opts?: DrawingToolOpts): void;
    registerShapeEditor(shapeType: ShapeType, editor: typeof SvelteComponent): void;
    setDrawingTool(name: DrawingTool): void;
    setDrawingEnabled(enabled: boolean): void;
    setTheme(theme: 'light' | 'dark' | 'auto'): void;
}
export declare const createOSDAnnotator: <E extends unknown = ImageAnnotation>(viewer: OpenSeadragon.Viewer, options?: AnnotoriousOpts<ImageAnnotation, E>) => OpenSeadragonAnnotator<E>;
//# sourceMappingURL=Annotorious.d.ts.map