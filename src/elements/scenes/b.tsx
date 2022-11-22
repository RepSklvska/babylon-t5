import React, {useEffect, useRef} from "react";
import {ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3} from "@babylonjs/core";

const SceneB: React.FC = () => {
	const reactCanvas = useRef(null)
	const startEngineLoop = (canvas: React.MutableRefObject<null>, engine: Engine, scene: Scene) => {
		// Light
		const light = new HemisphericLight('light', Vector3.Up(), scene);
		light.intensity = 0.5;
		
		// Camera
		const camera: ArcRotateCamera = new ArcRotateCamera(
			'camera',
			Math.PI,
			Math.PI / 4,
			10,
			new Vector3(0, -5, 0),
			scene
		);
		
		scene.activeCamera = camera;
		scene.activeCamera.attachControl(canvas, true);
		camera.attachControl(canvas, true);
		engine.runRenderLoop(() => {
			scene.render();
		});
		
		return {camera};
	}
	
	useEffect(() => {
		const {current: canvas} = reactCanvas
		if (!canvas) return
		
		const engine = new Engine(canvas)
		const scene = new Scene(engine)
		const {camera} = startEngineLoop(canvas, engine, scene)
		
		// Some objects
		const ground = MeshBuilder.CreateGround(
			'ground',
			{height: 20, width: 20, subdivisions: 4},
			scene
		);
		const box = MeshBuilder.CreateBox('box', {size: 2}, scene);
		const ball = MeshBuilder.CreateSphere(
			'ball',
			{segments: 8, diameter: 2},
			scene
		);
		ball.position.set(0, 1, 0);
		camera.setTarget(ball);
		
		
		
		const resize = () => {
			scene.getEngine().resize();
		};
		if (window) {
			window.addEventListener('resize', resize);
		}
		return () => {
			scene.getEngine().dispose();
			if (window) {
				window.removeEventListener('resize', resize);
			}
		};
	}, [])
	return (
		<canvas style={{width: '90vw', height: '90vh'}} ref={reactCanvas}></canvas>
	)
}

export default SceneB