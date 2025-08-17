import { Router, Request, Response } from "express";
import { defaultError } from "../constants/defaultResponses";
import getCharacters from "../library/characters/getCharacters";
import createCharacter from "../library/characters/createCharacter";
import getCharacterById from "../library/characters/getCharacterById";
import getCharacterByName from "../library/characters/getCharacterByName";
import updateCharacterById from "../library/characters/updateCharacterById";
import deleteCharacterById from "../library/characters/deleteCharacterById";

const router = Router();

router.route("/").post(async (request: Request, response: Response) => {
  const { select } = request.body;
  try {
    const res = await getCharacters({ select });
    return response.status(res.status || 200).json(res);
  } catch (error: any) {
    return response.status(500).json({
      ...defaultError,
      message: `Get all characters error: ${error.message}`
    });
  }
});

router.route("/create").post(async (request: Request, response: Response) => {
  const { name, width, height, frame_sets } = request.body;
  if (!name || !frame_sets) {
    return response.status(400).json({
      ...defaultError,
      status: 400,
      message: "Create character error: name and frame_sets are required"
    });
  }

  try {
    const res = await createCharacter({ name, width, height, frame_sets });
    return response.status(res.status || 200).json(res);
  } catch (error: any) {
    return response.status(500).json({
      ...defaultError,
      message: `Create character error: ${error.message}`
    });
  }
});

router.route("/by-id").post(async (request: Request, response: Response) => {
  const { _id, select } = request.body;
  if (!_id) {
    return response.status(400).json({
      ...defaultError,
      status: 400,
      message: "Get character by id error: _id is required"
    });
  }

  try {
    const res = await getCharacterById({ _id, select });
    return response.status(res.status || 200).json(res);
  } catch (error: any) {
    return response.status(500).json({
      ...defaultError,
      message: `Get character by id error: ${error.message}`
    });
  }
});

router.route("/by-name").post(async (request: Request, response: Response) => {
  const { name, select } = request.body;
  if (!name) {
    return response.status(400).json({
      ...defaultError,
      status: 400,
      message: "Get character by name error: name is required"
    });
  }

  try {
    const res = await getCharacterByName({ name, select });
    return response.status(res.status || 200).json(res);
  } catch (error: any) {
    return response.status(500).json({
      ...defaultError,
      message: `Get character by ame error: ${error.message}`
    });
  }
});

router.route("/by-id").patch(async (request: Request, response: Response) => {
  const { _id, update } = request.body;
  if (!_id || !update) {
    return response.status(400).json({
      ...defaultError,
      status: 400,
      message: "Update character by id error: _id and update are required"
    });
  }

  try {
    const res = await updateCharacterById({ _id, update });
    return response.status(res.status || 200).json(res);
  } catch (error: any) {
    return response.status(500).json({
      ...defaultError,
      message: `Update character by id error: ${error.message}`
    });
  }
});

router.route("/by-id").delete(async (request: Request, response: Response) => {
  const { _id } = request.body;
  if (!_id) {
    return response.status(400).json({
      ...defaultError,
      status: 400,
      message: "Delete character error: _id is required"
    });
  }

  try {
    const res = await deleteCharacterById(_id);
    return response.status(res.status || 200).json(res);
  } catch (error: any) {
    return response.status(500).json({
      ...defaultError,
      message: `Delete character error: ${error.message}`
    });
  }
});

export default router;
