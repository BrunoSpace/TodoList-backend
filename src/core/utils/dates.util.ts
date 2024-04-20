// want some simple function (but also can use some libs like Moment.js or dare-fns )
export function areDatesDifferent(date1: Date, date2: Date): boolean {
  return date1.getTime() !== date2.getTime();
}
