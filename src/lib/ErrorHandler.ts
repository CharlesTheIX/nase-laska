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

  public static warn = (message: string): void => {
    const p = document.createElement("p");
    const msg = `WARNING: ${message}`.trim();
    const html = document.createElement("div");
    const body = document.getElementsByTagName("body")[0];

    p.innerText = msg;
    html.id = "warning";
    html.appendChild(p);
    body.appendChild(html);
    console.warn(msg);
    setTimeout((): void => {
      html.classList.add("hide");
      setTimeout((): void => {
        body.removeChild(html);
      }, 300);
    }, 3300);
  };
}
