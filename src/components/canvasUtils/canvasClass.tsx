import { HemisphericLight, ArcRotateCamera, Engine, Scene, Vector3 } from "@babylonjs/core";


export abstract class canvasClass
{
    protected readonly engine: Engine;

    protected readonly scene: Scene;

    public constructor(canvas: HTMLCanvasElement)
    {

        this.engine = this.createEngine(canvas);
        this.scene = this.createScene(this.engine);
        this.createCamera(this.scene);
        this.createLight(this.scene);
        this.addContent();
        window.addEventListener("resize", this.onResize);
        this.engine.runRenderLoop(this.onRender);
    }
    public start(): void
    {
        this.onResize();
    }

    protected createEngine(canvas: HTMLCanvasElement): Engine
    {
        return new Engine(canvas, true, {}, true);
    }
    protected createScene(engine: Engine): Scene
    {
        return new Scene(engine, {});
    }
    protected createCamera(scene: Scene): void
    {
        const camera = new ArcRotateCamera("camera", -Math.PI * 0.5, Math.PI * 0.25, 12, Vector3.Zero(), scene);
        camera.attachControl();
    }
    protected createLight(scene: Scene)
    {
        const lights = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    }
    protected abstract addContent(): void;
    private onRender = () =>
    {
        this.scene.render();
    }
    private onResize = () =>
    {
        this.engine.resize();
    }
}
