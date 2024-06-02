import { CubeDto, cubeToDto } from "../dto/cube.dto";
import { CubeService } from "../service/cube.service";

const cubeService = new CubeService();

export const getAllCubes = async (): Promise<CubeDto[]> => {
  return (await cubeService.getAllCubes()).map(cubeToDto);
};

export const getCube = async (req): Promise<CubeDto> => {
  const { id } = req.params;
  return cubeToDto(await cubeService.getCube(id as number));
};

export const getCubesForTournament = async (req): Promise<CubeDto[]> => {
  const { id } = req.params;
  return (await cubeService.getCubesForTournament(id as number)).map(cubeToDto);
};

export const addCube = async (req) => {
  const { title, description, url, owner, imageUrl, cards, tokens } = req.body;
  return cubeToDto(
    await cubeService.addCube(title, description, url, owner, imageUrl, cards)
  );
};

export const editCube = async (req) => {
  const { cubeId, title, description, url, owner, imageUrl } = req.body;
  return cubeToDto(
    await cubeService.editCube(cubeId, title, description, url, owner, imageUrl)
  );
};
