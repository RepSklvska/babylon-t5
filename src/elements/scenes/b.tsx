import React, {useEffect, useRef, useState} from "react";
import {
	ArcRotateCamera,
	AxesViewer,
	Axis,
	Color3,
	Engine,
	HemisphericLight,
	MeshBuilder,
	Ray,
	RayHelper,
	Scene,
	StandardMaterial,
	Vector3
} from "@babylonjs/core";

const SceneB: React.FC = () => {
	const [intersected, setIntersected] = useState(false)
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
	const setUpScene = (scene: Scene) => {
		// Create a box that always spinning
		const spinBox = MeshBuilder.CreateBox('spin-box', {size: 1}, scene)
		spinBox.position.set(3, 2, 0)
		const spinBoxMaterial = new StandardMaterial('spin-box-material', scene)
		spinBoxMaterial.diffuseColor = new Color3(0.24, 1, 0)
		spinBoxMaterial.alpha = 0.5
		spinBox.material = spinBoxMaterial
		const spinBoxAxes = new AxesViewer(scene, 1)
		spinBoxAxes.xAxis.parent = spinBox
		spinBoxAxes.yAxis.parent = spinBox
		spinBoxAxes.zAxis.parent = spinBox
		scene.registerBeforeRender(() => {
			spinBox.rotate(Axis.Y, 0.02)
		})
		
		//
		const targetCylinder = MeshBuilder.CreateCylinder('target-cylinder', {height: 1, diameter: 3}, scene)
		targetCylinder.position.set(-3, 2, 0)
		targetCylinder.material = spinBoxMaterial
		
		// Add a ray to the box, and detect
		scene.registerBeforeRender(() => {
			const ray = new Ray(Vector3.Zero(), Vector3.Zero(), 3.5)
			const rayHelper = new RayHelper(ray)
			rayHelper.attachToMesh(spinBox, new Vector3(1, 0, 1))
			rayHelper.show(scene)
			
			const interval = setInterval(() => {
				rayHelper.dispose()
				clearInterval(interval)
			}, 100)
			
			console.log(ray.intersectsMesh(targetCylinder).hit)
			setIntersected(ray.intersectsMesh(targetCylinder).hit)
		})
		
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
		// const box = MeshBuilder.CreateBox('box', {size: 2}, scene);
		// const ball = MeshBuilder.CreateSphere(
		// 	'ball',
		// 	{segments: 8, diameter: 2},
		// 	scene
		// );
		// ball.position.set(0, 1, 0);
		camera.setTarget(Vector3.Zero());
		
		setUpScene(scene)
		
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
		<div>
			<canvas style={{width: '90vw', height: '90vh'}} ref={reactCanvas}></canvas>
			<div>
				<p>Ray intersects with cylinder: {intersected + ""}</p>
			</div>
		</div>
	)
}

export default SceneB