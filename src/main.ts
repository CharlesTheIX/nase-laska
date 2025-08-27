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
    clearInterval(loading_interval);
    resources.clearLoadingScreen();
    const canvas: Canvas = Canvas.init(canvas_element);
    const input_handler: InputHandler = InputHandler.init();
    const game: Game = Game.init({ canvas, resources, input_handler });
    game.start();
  }, 100);
};

window.addEventListener("load", init);
