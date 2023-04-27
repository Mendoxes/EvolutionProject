import { Scene, SceneLoader, Vector3 } from "babylonjs";
import { getChipsFromTokens } from "./canvas";


export function a()
{


}



// interface InstanceMap
// {
//     [loaderType: string]: any[];
// }

// // const [instances, setInstances] = useState<InstanceMap>({});
// // const [sceneInstance, setSceneInstance] = useState<Scene | null>(null);

// function createInstance(
//     loaderType: string,
//     modelPath: string,
//     scene: Scene | null,
//     setInstances: React.Dispatch<React.SetStateAction<InstanceMap>>,
//     instances: InstanceMap,
//     sceneInstance: Scene | null,
//     setSceneInstance: React.Dispatch<React.SetStateAction<Scene | null>>,
//     position?: Vector3 | null,
//     scaling?: Vector3 | null
// ): void
// {
//     if (!instances[loaderType])
//     {
//         setInstances((prevInstances) => ({
//             ...prevInstances,
//             [loaderType]: [], // create empty array if no instances yet
//         }));
//     }

//     SceneLoader.ImportMesh("", "./assets/", modelPath, scene, (newMeshes) =>
//     {
//         const instance = newMeshes[1];
//         instance.scaling = scaling ?? new Vector3(0.6, 0.6, 0.6);
//         instance.position = position ?? new Vector3(0, 0, -13);

//         setInstances((prevInstances) => ({
//             ...prevInstances,
//             [loaderType]: [...prevInstances[loaderType], instance], // add instance to instances array
//         }));

//         if (!sceneInstance)
//         {
//             setSceneInstance(scene);
//         }
//     });
// }

// function disposeInstances(instances:InstanceMap,setInstances:React.Dispatch<React.SetStateAction<InstanceMap>>)
// {
//     for (const loaderType in instances)
//     {
//         const loaderInstances = instances[loaderType];
//         for (const instance of loaderInstances)
//         {
//             instance.dispose();
//         }
//     }
//     setInstances({});
// }



// function createAllInstances(scene: Scene | null,counterStore:any, sceneInstance:Scene | null): void
// {
//     //what type is tokenNumbers?

//     //TO CONSTS


//     const tokenNumbers: { [key: string]: number } = getChipsFromTokens(counterStore.tokentsFromHand[0])

//     for (const [key, value] of Object.entries(tokenNumbers))
//     {
//         // const ten = { xpos: -2, zpos: -1 };
//         // const fifty = { xpos: -1.7, zpos: 0.5 };
//         // const hung = { xpos: -1.9, zpos: -1.5 };
//         // const fivehung = { xpos: -0.7, zpos: 0.8 };


//         const ten = { xpos: 2, zpos: -1 };
//         const fifty = { xpos: 1.7, zpos: 0.5 };
//         const hung = { xpos: 1.9, zpos: -1.5 };
//         const fivehung = { xpos: 0.7, zpos: 0.8 };

//         for (let i = 0; i < value; i++)
//         {

//             if (key === "ten")
//             {


//                 createInstance(key, `${key}.glb`, scene, new Vector3(ten.xpos, -4 + tokenNumbers[key] / 5 - i / 10, ten.zpos), null);

//             } else if (key === "fifty")
//             {
//                 createInstance(key, `${key}.glb`, scene, new Vector3(fifty.xpos, -3.5 + tokenNumbers[key] / 5 - i / 10, fifty.zpos), null);

//             }

//             else if (key === "hung")
//             {
//                 createInstance(key, `${key}.glb`, scene, new Vector3(hung.xpos, -4 + tokenNumbers[key] / 5 - i / 10, hung.zpos), null);

//             }



//             else
//             {



//                 createInstance(key, `${key}.glb`, scene, new Vector3(fivehung.xpos, -3.5 + tokenNumbers[key] / 5 - i / 10, fivehung.zpos), null);
//             }
//         }
//     }
// }