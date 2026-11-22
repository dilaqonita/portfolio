import {
  siJavascript, siTypescript, siPython, siPhp, siReact, siNextdotjs, siLaravel, siFlask,
  siNodedotjs, siTailwindcss, siPostgresql, siMysql, siMongodb, siSqlite, siDocker, siGit,
  siGithub, siPostman, siFigma, siUnity, siBlender, siOpencv, siTensorflow, siLeaflet,
  siPandas, siScikitlearn,
} from 'simple-icons';

const logo = (i) => ({ name: i.title, hex: `#${i.hex}`, path: i.path });

// Logo untuk "rak gantung" di bawah hero (dari CV: Technical Skills)
export const hangingLogos = [
  siJavascript, siTypescript, siPython, siPhp, siReact, siNextdotjs, siLaravel, siFlask,
  siNodedotjs, siTailwindcss, siPostgresql, siMysql, siMongodb, siSqlite, siDocker, siGit,
  siGithub, siPostman, siFigma, siUnity, siBlender, siOpencv, siTensorflow, siLeaflet,
  siPandas, siScikitlearn,
].map(logo);
