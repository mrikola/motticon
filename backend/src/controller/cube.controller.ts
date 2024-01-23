import { CubeService } from "../service/cube.service";

const cubeService = new CubeService();

export const getAllCubes = async () => {
  return await cubeService.getAllCubes();
};

export const getCube = async (req) => {
  const { id } = req.params;
  return await cubeService.getCube(id as number);
};

export const getCubesForTournament = async (req) => {
  const { id } = req.params;
  return await cubeService.getCubesForTournament(id as number);
};

export const addCube = async (req) => {
  const { title, description, url, owner, imageUrl } = req.body;
  return await cubeService.addCube(title, description, url, owner, imageUrl);
};
