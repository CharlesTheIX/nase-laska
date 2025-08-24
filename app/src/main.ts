import "./main.scss";
import Game from "@/lib/classes/Game";
import Canvas from "@/lib/classes/Canvas";
import Resources from "@/lib/classes/Resources";
import InputHandler from "@/lib/classes/InputHandler";

const init = (): void => {
  const canvas_element = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas_element) return;

  const resources: Resources = Resources.init();
  const loading_interval = setInterval(() => {
    var count: number = 0;
    Object.keys(resources.images).forEach((key: string) => {
      if (!resources.images[key]) count++;
      else if (resources.images[key].loaded) count++;
    });
    resources.progress_element.style.width = `${(100 * count) / resources.count}%`;
    if (count < resources.count) return;

    const canvas: Canvas = Canvas.init(canvas_element);
    const input_handler: InputHandler = InputHandler.init();
    const game: Game = Game.init({ canvas, resources, input_handler });
    game.start();

    clearInterval(loading_interval);
    resources.clearLoadingScreen();
  }, 100);
};

window.addEventListener("load", init);

function getRefreshRate(samples = 60): Promise<number> {
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
}

getRefreshRate().then((rate) => console.log(`~${rate.toFixed(2)} Hz`));
