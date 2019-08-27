type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Size = {
  width: number;
  height: number;
};

type Layout = {
  rects: Rect[];
  actualWidth: number;
  height: number;
  columnWidth: number;
};
