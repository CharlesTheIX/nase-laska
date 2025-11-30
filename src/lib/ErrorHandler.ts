import Game from "./Game";

export default class ErrorHandler {
  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static fatal = (message?: string, game?: Game): void => {
    const html = document.createElement("div");
    const button = document.createElement("p");
    const main = document.getElementsByTagName("main")[0];
    const msg = `
      ERROR: fatal\n
      MESSAGE: ${message ? message : ""}\n
      GAME_SAVED: false\n
      Click "Restart Game" below to reload the game. If the problem persists, call David!
    `.trim();
    html.id = "fatal-error";
    msg.split("\n").forEach((line) => {
      const p = document.createElement("p");
      p.innerText = line;
      html.appendChild(p);
    });
    button.id = "restart";
    button.innerText = "Restart Game";
    button.onclick = (): void => {
      window.location.reload();
    };
    main.innerHTML = "";
    html.appendChild(button);
    main.appendChild(html);
    button.focus();
    if (game) game.deinit();
  };
}
