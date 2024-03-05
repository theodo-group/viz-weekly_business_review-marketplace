// API Globals
export interface Looker<Config> {
  plugins: {
    visualizations: {
      add: (visualization: VisualizationDefinition<Config>) => void;
    };
  };
}

export interface LookerChartUtils {
  Utils: {
    openDrillMenu: (options: { links: Link[]; event: object }) => void;
    openUrl: (url: string, event: { pageX: number; pageY: number }) => void;
    textForCell: (cell: Cell) => string;
    filterableValueForCell: (cell: Cell) => string;
    htmlForCell: (
      cell: Cell,
      context?: string,
      fieldDefinitionForCell?: unknown,
      customHtml?: string
    ) => string;
  };
}

// Looker visualization types
export interface VisualizationDefinition<Config> {
  id?: string;
  label?: string;
  options: TransformConfigToOptions<Config>;
  addError?: (error: VisualizationError) => void;
  clearErrors?: (errorName?: string) => void;
  create: VisCreate;
  trigger?: (event: string, config: object[]) => void;
  updateAsync?: (
    data: VisData,
    element: HTMLElement,
    config: Config,
    queryResponse: VisQueryResponse,
    details: VisUpdateDetails | undefined,
    updateComplete: () => void
  ) => void;
  destroy?: () => void;
}

export interface VisOptions {
  [optionName: string]: VisOption;
}

export interface VisOptionValue {
  [label: string]: string;
}

export interface VisCreate {
  (element: HTMLElement, config: VisConfig): void;
}

export interface VisQueryResponse {
  [key: string]: unknown;
  data: VisData;
  fields: {
    measures: { type: string; name: string }[];
    dimensions: { type: string; name: string }[];
    [key: string]: unknown[];
  };
  pivots: Pivot[];
  applied_filters?: QueryResponseAppliedFilters;
}

export interface QueryResponseAppliedFilters {
  [key: string]: {
    value: unknown;
  };
}

export interface Pivot {
  key: string;
  is_total: boolean;
  data: { [key: string]: string };
  metadata: { [key: string]: { [key: string]: string } };
}

export interface Link {
  label: string;
  type: string;
  type_label: string;
  url: string;
}

export interface Cell {
  [key: string]: unknown;
  value: unknown;
  rendered?: string;
  html?: string;
  links?: Link[];
}

export interface FilterData {
  add: string;
  field: string;
  rendered: string;
}

export interface PivotCell {
  [pivotKey: string]: Cell;
}

export interface Row {
  [fieldName: string]: PivotCell | Cell;
}

export type VisData = Row[];

export interface VisConfig {
  [key: string]: VisConfigValue;
}

export type VisConfigValue = unknown;

export interface VisUpdateDetails {
  changed: {
    config?: string[];
    data?: boolean;
    queryResponse?: boolean;
    size?: boolean;
  };
}

export interface VisOption {
  type: string;
  values?: VisOptionValue[];
  display?: string;
  default?: unknown;
  label: string;
  section?: string;
  placeholder?: string;
  display_size?: "half" | "third" | "normal";
  order?: number;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  supports?: string[];
}

export interface VisualizationError {
  group?: string;
  message?: string;
  title?: string;
  retryable?: boolean;
  warning?: boolean;
}

type SharedVisOption<T> = {
  display?: string;
  label: string;
  default?: T;
  required: undefined extends T ? false : true;
  placeholder?: string;
  display_size?: "half" | "third" | "normal";
  order?: number;
  min?: number;
  max?: number;
  step?: number;
  supports?: string[];
};

export type TransformConfigToOptions<T> = {
  [K in keyof T]: string extends T[K]
    ? {
        type: "string";
      } & SharedVisOption<T[K]>
    : number extends T[K]
      ? {
          type: "number";
        } & SharedVisOption<T[K]>
      : T[K] extends string
        ? {
            type: "string";
            values: { [key: string]: T[K] }[];
          } & SharedVisOption<T[K]>
        : T[K] extends number
          ? {
              type: "number";
              values: { key: string; value: T[K] }[];
            } & SharedVisOption<T[K]>
          : T[K] extends boolean
            ? {
                type: "boolean";
              } & SharedVisOption<T[K]>
            : unknown;
};

export type OpenDrillFn = (
  link: Link,
  event: { pageX: number; pageY: number }
) => void;
