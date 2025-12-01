import Game from "@/lib/Game";
import Timer from "@/lib/Timer";
import Color from "@/lib/Color";
import Storage from "@/lib/Storage";
import Vector2 from "@/lib/Vector2";
import Rectangle from "@/lib/Rectangle";
import { message_data as data } from "./_data";

type Msg = { text: string; type?: MsgType; callback?: MsgCallback };
type MsgCallback = (result: boolean | number, game: Game) => void;
type MsgState = "write" | "input";
type MsgType = "default" | "yes_no" | "action";

export default class Message {
  private _rect: Rectangle;
  private _storage: Storage;
  private _max_width: number;
  private _input_timer: Timer;
  private _msg_index: number = 0;
  private _page_index: number = 0;
  private _input_index: number = 0;
  private _state: MsgState = "write";
  private _msgs: Msg[] | null = null;

  constructor(messages: Msg[] | null, storage: Storage, timer: Timer, canvas_rect: Rectangle) {
    this._msgs = messages;
    this._storage = storage;
    this._input_timer = timer;
    this._max_width = canvas_rect.w - 6 * 16;
    this._rect = Rectangle.init(0, canvas_rect.h - 7 * 16, canvas_rect.w, 7 * 16);
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (messages: Msg[] | null, storage: Storage, timer: Timer, canvas_rect: Rectangle): Message => {
    return new Message(messages, storage, timer, canvas_rect);
  };

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get state(): MsgState {
    return this._state;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set msg_index(new_index: number) {
    this._msg_index = new_index;
  }

  set msgs(new_content: Msg[] | null) {
    this._msgs = new_content;
  }

  get page_index(): number {
    return this._page_index;
  }

  set state(new_state: MsgState) {
    this._state = new_state;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {
    this._msgs = null;
    this._msg_index = 0;
    this._page_index = 0;
    this._input_index = 0;
    this._state = "write";
  };

  public draw(game: Game): void {
    this.drawBackgroundLayer(game);
    this.drawTextLayer(game);
    if (this._state === "input") this.drawInputLayer(game);
  }

  private drawBackgroundLayer = (game: Game): void => {
    game.canvas.drawRectangle(this._rect, Color.black(0.8));
  };

  private drawInputLayer = (game: Game): void => {
    var options: string[] = [];
    const language = this._storage.settings_data.language;
    if (this.msgs && this.msgs[this._msg_index].type === "yes_no") options = data[language].yes_no_options;
    else return;
    var x_pos = this._rect.x + 3 * 16;
    var y_pos = this._rect.y + 5 * 16;
    options.forEach((option: string, i: number) => {
      const color = i === this._input_index ? Color.white() : Color.grey();
      game.canvas.drawText(option, Vector2.init(x_pos + i * 8 * 16, y_pos), color);
    });
  };

  private drawTextLayer = (game: Game): void => {
    if (!this._msgs) return;
    var x_pos = this._rect.x + 3 * 16;
    var y_pos = this._rect.y + 2 * 16;
    const msg = this._msgs[this._msg_index];
    const pages = this.messagePagesFromString(msg.text, this._max_width, game);
    const page = pages[this._page_index];
    page.forEach((line: string, i: number) => game.canvas.drawText(line, Vector2.init(x_pos, y_pos + i * 16), Color.white()));
  };

  public messagePagesFromString = (text: string, max_width: number, game: Game): string[][] => {
    var page: string[] = [];
    var content: string = "";
    const pages: string[][] = [];
    text.split(" ").forEach((word: string) => {
      if (!word) return;
      if (word === "\n") {
        page.push(content);
        content = "";
        if (page.length >= 3) {
          pages.push(page);
          page = [];
        }
        return;
      }
      const next = `${content} ${word}`.trim();
      const measured_width = game.canvas.measureText(next).w;
      if (measured_width >= max_width) {
        page.push(content);
        if (page.length >= 3) {
          pages.push(page);
          page = [];
        }
        content = word;
        return;
      }
      content = next;
    });
    if (content) page.push(content);
    if (page.length > 0) pages.push(page);
    return pages;
  };

  public update(game: Game, time_step: number): void {
    if (!this._msgs) {
      this.deinit();
      game.state = game.last_state;
      return;
    }

    this._input_timer.update();
    if (this._input_timer.state === "running") return;
    const last_key = game.input_handler.lastKeyPressed();
    switch (last_key) {
      case "a":
      case "A":
      case "KeyA":
      case "ArrowLeft":
        if (this._state === "input") {
        }
        break;

      case "d":
      case "D":
      case "KeyD":
      case "ArrowRight":
        if (this._state === "input") {
        }
        break;

      case " ":
      case "Space":
      case "Enter":
        this._input_timer.reset();
        game.resources.playAudio("menu_move");
        const next_page_index = this._page_index + 1;
        if (this._msgs && next_page_index < this.messagePagesFromString(this._msgs[this._msg_index].text, this._max_width, game).length) {
          this._page_index = next_page_index;
          return;
        }

        const next_msg_index = this._msg_index + 1;
        const msg_type = this._msgs ? this._msgs[this._msg_index].type : "default";
        switch (msg_type) {
          case "action":
            break;

          case "yes_no":
            this._state = "input";
            break;

          default:
            if (this._msgs && next_msg_index < this._msgs.length) {
              this._page_index = 0;
              this._msg_index = next_msg_index;
            } else {
              this.deinit();
              game.state = game.last_state;
            }
            break;
        }
    }
  }
}
