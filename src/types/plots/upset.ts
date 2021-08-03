type SetIntersection = {
  sets: string[]; // e.g. [ 'height', 'weight', 'country' ]
  count: number; // == cardinality in UpSet
};

export type UpSetData = {
  intersections: SetIntersection[];
};
