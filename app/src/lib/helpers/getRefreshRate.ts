export default (samples = 60): Promise<number> => {
  return new Promise((resolve) => {
    let last = performance.now();
    const intervals: number[] = [];

    function step(now: number) {
      intervals.push(now - last);
      last = now;

      if (intervals.length >= samples) {
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        resolve(1000 / avg);
      } else {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  });
};
