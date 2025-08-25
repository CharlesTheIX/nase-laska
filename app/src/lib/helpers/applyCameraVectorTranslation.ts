import Camera from "@/lib/classes/Camera";
import Vector2 from "@/lib/classes/Vector2";
import { canvas_size } from "@/lib/globals";

type Props = { type: string; v: Vector2; m_size: IRectangle; camera: Camera };

export default (props: Props): void => {
  const { type, v, m_size, camera } = props;
  if (camera.focus === "free") return;
  const diff_s = Vector2.init(m_size.w - canvas_size.x / camera.scale, m_size.h - canvas_size.y / camera.scale);

  switch (type) {
    case "layer":
      var diff = Vector2.init(m_size.w - canvas_size.x, m_size.h - canvas_size.y);
      var v_t = Vector2.scale(canvas_size, 0.5).scale(1 / camera.scale);
      v_t = Vector2.subtract(camera.position, v_t);
      v.x += -diff.x / 2 / camera.scale;
      v.y += -diff.y / 2 / camera.scale;

      if (diff.x < 0) {
        if (diff_s.x < 0) v.x += v_t.x - diff_s.x / 2;
        else {
          if (v_t.x < 0) v.x += v_t.x;
          else if (v_t.x > Math.abs(diff_s.x)) v.x += v_t.x - diff_s.x;
        }
      } else {
        if (v_t.x < 0) v.x += v_t.x;
        else if (v_t.x > Math.abs(diff_s.x)) v.x += v_t.x - diff_s.x;
      }

      if (diff.y < 0) {
        if (diff_s.x < 0) v.y += v_t.y - diff_s.y / 2;
        else {
          if (v_t.y < 0) v.y += v_t.y;
          else if (v_t.y > Math.abs(diff_s.y)) v.y += v_t.y - diff_s.y;
        }
      } else {
        if (v_t.y < 0) v.y += v_t.y;
        else if (v_t.y > Math.abs(diff_s.y)) v.y += v_t.y - diff_s.y;
      }

      return;
    case "background":
      var camera_offset = Vector2.init(canvas_size.x / 2 / camera.scale, canvas_size.y / 2 / camera.scale);
      const camera_world_frame = {
        x: v.x - camera_offset.x,
        y: v.y - camera_offset.y,
        w: canvas_size.x / camera.scale,
        h: canvas_size.y / camera.scale
      };

      if (diff_s.x < 0) camera_world_frame.x = diff_s.x / 2;
      else {
        if (camera_world_frame.x < 0) camera_world_frame.x = 0;
        else if (camera_world_frame.x + camera_world_frame.w > m_size.w) {
          camera_world_frame.x = m_size.w - camera_world_frame.w;
        }
      }

      if (diff_s.y < 0) camera_world_frame.y = diff_s.y / 2;
      else {
        if (camera_world_frame.y < 0) camera_world_frame.y = 0;
        else if (camera_world_frame.y + camera_world_frame.h > m_size.h) {
          camera_world_frame.y = m_size.h - camera_world_frame.h;
        }
      }

      v.x = camera_world_frame.x;
      v.y = camera_world_frame.y;
      return;
  }
};
