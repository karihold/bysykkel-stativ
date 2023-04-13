export type Filters = {
  hasAvailableBikes: boolean;
  hasAvailableDocks: boolean;
};

export type FilterAction = "bikes" | "docks";

export function filterReducer(state: Filters, action: FilterAction) {
  if (action === "bikes") {
    return { ...state, hasAvailableBikes: !state.hasAvailableBikes } as Filters;
  }

  if (action === "docks") {
    return { ...state, hasAvailableDocks: !state.hasAvailableDocks } as Filters;
  }

  throw new Error("Invalid filter choice");
}
