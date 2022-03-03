export const range = (start, stop, step) => Array.from(
    { length: (stop - start) / step +  1},
    (_, i) => start + (i * step)
)

// use：
// range(0, 4, 1)      [0, 1, 2, 3, 4]
// range(0, 9, 3);     [0, 3, 6, 9]
// range(0, 8, 2.5)    [0, 2.5, 5, 7.5]