import Game from "@/lib/Game";
import Canvas from "@/lib/Canvas";
import Resources from "@/lib/Resources";
import ErrorHandler from "@/lib/ErrorHandler";

export const restart = (): void => {
  try {
    window.location.reload();
  } catch (err: any) {
    const msg = `Game restart error: ${err.message}`;
    ErrorHandler.fatal(msg);
    throw new Error(msg);
  }
};

const init = (): void => {
  try {
    const canvas_element = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas_element) ErrorHandler.fatal("Canvas element not found");

    const resources: Resources = Resources.init();
    const loading_interval = setInterval(() => {
      var count = 0;
      Object.keys(resources.images).forEach((key: string) => {
        if (!resources.images[key]) count++;
        else if (resources.images[key].loaded) count++;
      });
      resources.progress_elmt.style.width = `${(count / resources.count) * 100}%`;
      if (count < resources.count) return;

      clearInterval(loading_interval);
      resources.clearLoadingScreen();
      const canvas = Canvas.init(canvas_element);
      const game = Game.init(canvas, resources);
      game.start();
    }, 100);
  } catch (err: any) {
    const msg = `Game initialization error: ${err.message}`;
    ErrorHandler.fatal(msg);
    throw new Error(msg);
  }
};

window.addEventListener("load", init);
