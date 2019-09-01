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

type TransitionType = 'appear' | 'appeared' | 'enter' | 'entered' | 'leaved';
