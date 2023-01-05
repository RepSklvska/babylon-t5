import React, {useEffect, useRef} from "react";
import {
	AbstractMesh,
	ArcRotateCamera, AxesViewer, Axis, Color3,
	Engine,
	HemisphericLight,
	Material,
	MeshBuilder, Ray, RayHelper,
	Scene, SceneLoader,
	StandardMaterial, TransformNode,
	Vector3
} from "@babylonjs/core";
import createSidePanel from "../../utils/sideButtonUI";
import CryptoJS from 'crypto-js'
// import {webcrypto} from "crypto";
// import {TextEncoder} from "util";

// const crypto = require('crypto')

const AddHeroMeshPlayAnim = async (scene: Scene, animationRange?: string) => {
	
	const result = await SceneLoader.ImportMeshAsync('', '/hero/', 'Boy.babylon', scene, async (event) => {
		console.log("onProgress", event)
		console.log("event.loaded", event.loaded)
		console.log("event.total", event.total)
		console.log("event.lengthComputable", event.lengthComputable)
		
		// @ts-ignore
		if (event.originalTarget && event.originalTarget.response) {
			// @ts-ignore
			const message = event.originalTarget.response
			// console.log("resp:", message)
			// const data = new TextEncoder().encode(message)
			// const hashBuffer = await webcrypto.subtle.digest('SHA-256', data)
			// const hashArray = Array.from(new Uint8Array(hashBuffer));
			// const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
			// console.log(hashHex)
			
			// const hash = crypto.createHash('md5')
			// hash.update(message)
			// console.log(hash.digest('hex'))
			
			
			console.log(CryptoJS.MD5(message).toString())
			if (CryptoJS.MD5(message).toString().toUpperCase() === "03DF00E94343B2075BE470DC0A2299B3") {
				console.log("校验通过")
			}
		}
		
	})
	console.log("加载完成")
	result.meshes.map((mesh, i) => {
		if (i !== 0) {
			mesh.setParent(result.meshes[0])
		}
	})
	result.meshes[0].position.set(Math.ceil(Math.random() * 10) - 5, 0, Math.ceil(Math.random() * 10) - 5)
	if (animationRange) {
		const anim = result.skeletons[0].getAnimationRange(animationRange)
		scene.beginAnimation(result.skeletons[0], anim!.from, anim!.to, true)
	}
	return result.meshes[0]
}

const MeshesList = new Array<AbstractMesh>()
const OnClick1 = (scene: Scene) => {
	return async () => {
		// MeshesList.map(mesh => mesh.dispose())
		MeshesList.push(await AddHeroMeshPlayAnim(scene, 'Walk'))
	}
}
const OnClick2 = (scene: Scene) => {
	return async () => {
		// MeshesList.map(mesh => mesh.dispose())
		MeshesList.push(await AddHeroMeshPlayAnim(scene, 'abc'))
	}
}

const SceneE: React.FC = () => {
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
		const ground = MeshBuilder.CreateGround('', {width: 10, height: 10})
		
		createSidePanel(scene, [
			{text: '"Walk"', onClick: OnClick1(scene)},
			{text: '"abc"', onClick: OnClick2(scene)}
		])
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
		<canvas style={{width: '90vw', height: '90vh'}} ref={reactCanvas}></canvas>
	)
}

export default SceneE