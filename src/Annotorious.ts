import type OpenSeadragon from 'openseadragon';
import type { SvelteComponent } from 'svelte';
import { createAnonymousGuest, createBaseAnnotator, createLifecyleObserver, createUndoStack } from '@annotorious/core';
import type { Annotator, DrawingStyle, Filter, PresenceProvider, User } from '@annotorious/core';
import { fillDefaults, createImageAnnotatorState, initKeyboardCommands} from '@annotorious/annotorious/src';
import { listDrawingTools, getTool, registerTool, registerEditor } from '@annotorious/annotorious/src/annotation';
import type { AnnotoriousOpts, DrawingTool, DrawingToolOpts, ImageAnnotation, ShapeType } from '@annotorious/annotorious/src';
import type { PixiLayerClickEvent } from './annotation';
import { PixiLayer, SVGDrawingLayer, SVGPresenceLayer } from './annotation';
import { setTheme } from './themes/setTheme';
import { 
  fitBounds as _fitBounds, 
  fitBoundsWithConstraints as _fitBoundsWithConstraints, 
  type FitboundsOptions 
} from './api';

import '@annotorious/annotorious/annotorious.css';

export interface OpenSeadragonAnnotator<E extends unknown = ImageAnnotation> extends Annotator<ImageAnnotation, E> {

  viewer: OpenSeadragon.Viewer;

  fitBounds(arg: { id: string } | string, opts?: FitboundsOptions): void;

  fitBoundsWithConstraints(arg: { id: string } | string, opts?: FitboundsOptions): void;

  listDrawingTools(): string[];

  registerDrawingTool(name: string, tool: typeof SvelteComponent, opts?: DrawingToolOpts): void;

  registerShapeEditor(shapeType: ShapeType, editor: typeof SvelteComponent): void;

  setDrawingTool(tool: DrawingTool): void;

  setDrawingEnabled(enabled: boolean): void;

}

export const createOSDAnnotator = <E extends unknown = ImageAnnotation>(
  viewer: OpenSeadragon.Viewer, 
  options: AnnotoriousOpts<ImageAnnotation, E> = {}
): OpenSeadragonAnnotator<E> => {

  const opts = fillDefaults(options);

  const state = createImageAnnotatorState(opts);

  const { hover, selection, store } = state;

  const lifecycle = createLifecyleObserver(
    store, selection, hover, undefined, opts.adapter, opts.autoSave);

  const undoStack = createUndoStack(store);

  let currentUser: User = createAnonymousGuest();

  let drawingEnabled = opts.drawingEnabled;

  let drawingMode = opts.drawingMode;

  const keyboardCommands = initKeyboardCommands(undoStack, viewer.element);

  const displayLayer = new PixiLayer({
    target: viewer.element,
    props: { 
      state, 
      viewer, 
      style: opts.style
    }
  });

  const presenceLayer = new SVGPresenceLayer({
    target: viewer.element.querySelector('.openseadragon-canvas'),
    props: { 
      store,
      viewer, 
      provider: null 
    }
  });

  const drawingLayer = new SVGDrawingLayer({
    target: viewer.element.querySelector('.openseadragon-canvas'),
    props: { 
      drawingEnabled,
      preferredDrawingMode: drawingMode,
      state,
      user: currentUser, 
      viewer
    }
  });

  displayLayer.$on('click', (evt: CustomEvent<PixiLayerClickEvent>) => {
    const { originalEvent, annotation } = evt.detail;

    // Ignore click event if drawing is currently active with mode  'click'
    const blockEvent = drawingMode === 'click' && drawingEnabled;

    if (annotation && !blockEvent)
      selection.clickSelect(annotation.id, originalEvent);
    else if (!selection.isEmpty())
      selection.clear();
  });

  viewer.element.addEventListener('pointerdown', (event: PointerEvent) => {
    if (hover.current) {
      const hovered = store.getAnnotation(hover.current);
      lifecycle.emit('clickAnnotation', hovered, event);
    }
  });
  
  setTheme(viewer);

  /*************************/
  /*      External API     */
  /******++++++*************/

  // Most of the external API functions are covered in the base annotator
  const base = createBaseAnnotator<ImageAnnotation, E>(store, undoStack, opts.adapter);

  const destroy = () => {
    // Destroy Svelte layers
    displayLayer.$destroy();
    presenceLayer.$destroy();
    drawingLayer.$destroy();

    // Other cleanup actions
    keyboardCommands.destroy();
    undoStack.destroy();
  }

  const fitBounds = _fitBounds(viewer, store);

  const fitBoundsWithConstraints = _fitBoundsWithConstraints(viewer, store);

  const getUser = () => currentUser;

  const registerDrawingTool = (name: string, tool: typeof SvelteComponent, opts?: DrawingToolOpts) =>
    registerTool(name, tool, opts);

  const registerShapeEditor = (shapeType: ShapeType, editor: typeof SvelteComponent) =>
    registerEditor(shapeType, editor);

  const setDrawingTool = (t: DrawingTool) => {
    const toolSpec = getTool(t);
    if (!toolSpec)
      throw `Tool not found: ${t}`;

    const { tool, opts } = toolSpec;
    drawingMode = opts?.drawingMode || drawingMode;
    drawingLayer.$set({ tool, opts });
  }

  const setDrawingEnabled = (enabled: boolean) => {
    drawingEnabled = enabled;
    drawingLayer.$set({ drawingEnabled });
  }

  const setFilter = (filter: Filter) =>
    displayLayer.$set({ filter });

  const setSelected = (arg?: string | string[]) => {
    if (arg) {
      selection.setSelected(arg);
    } else {
      selection.clear();
    }
  }

  const setStyle = (style: DrawingStyle | ((annotation: ImageAnnotation) => DrawingStyle) | undefined) =>
    displayLayer.$set({ style });

  const setPresenceProvider = (provider: PresenceProvider) =>
    presenceLayer.$set({ provider });

  const setUser = (user: User) => {
    currentUser = user;
    drawingLayer.$set({ user });
  }

  return {
    ...base,
    destroy,
    fitBounds,
    fitBoundsWithConstraints,
    getUser,
    listDrawingTools,
    on: lifecycle.on,
    off: lifecycle.off,
    registerDrawingTool,
    registerShapeEditor,
    setDrawingEnabled,
    setDrawingTool,
    setFilter,
    setPresenceProvider,
    setSelected,
    setStyle,
    setUser,
    state,
    viewer
  }

}
