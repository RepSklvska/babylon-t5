import React, {useEffect, useRef} from "react";
import {
	AbstractMesh,
	ArcRotateCamera,
	AxesViewer,
	Color3,
	Engine,
	HemisphericLight,
	MeshBuilder,
	Quaternion,
	Scene,
	StandardMaterial,
	Vector3
} from "@babylonjs/core";
import {AdvancedDynamicTexture, Control, SelectionPanel, SliderGroup} from "@babylonjs/gui";

const SceneC: React.FC = () => {
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
		// Create a box
		const greenBox = MeshBuilder.CreateBox('green-box', {size: 1}, scene)
		greenBox.position.set(3, 2, 0)
		const greenBoxMaterial = new StandardMaterial('green-box-material', scene)
		greenBoxMaterial.diffuseColor = new Color3(0, 1, 0)
		greenBoxMaterial.alpha = 0.5
		greenBox.material = greenBoxMaterial
		const greenBoxAxes = new AxesViewer(scene, 1)
		greenBoxAxes.xAxis.parent = greenBox
		greenBoxAxes.yAxis.parent = greenBox
		greenBoxAxes.zAxis.parent = greenBox
		
		const yellowBox = greenBox.clone('yellow-box')
		yellowBox.position.set(-3, 2, 0)
		const yellowBoxMaterial = greenBoxMaterial.clone('yellow-box-material')
		yellowBoxMaterial.diffuseColor = new Color3(1, 1, 0)
		yellowBox.material = yellowBoxMaterial
		
		const getRotationQuaternion = (mesh: AbstractMesh) => {
			return Quaternion.FromEulerAngles(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z)
		}
		const greenBoxRotationQuaternion = new Quaternion(0, 0, 0, 0)
		
		const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI')
		const rotateGroup = new SliderGroup('四元数')
		// rotateGroup.addSlider('X', v => greenBox.rotation.x = v, "", 0, Math.PI * 2, 0)
		// rotateGroup.addSlider('Y', v => greenBox.rotation.y = v, "", 0, Math.PI * 2, 0)
		// rotateGroup.addSlider('Z', v => greenBox.rotation.z = v, "", 0, Math.PI * 2, 0)
		rotateGroup.addSlider('X', v => greenBoxRotationQuaternion.x = v, "", -1, 1, 0)
		rotateGroup.addSlider('Y', v => greenBoxRotationQuaternion.y = v, "", -1, 1, 0)
		rotateGroup.addSlider('Z', v => greenBoxRotationQuaternion.z = v, "", -1, 1, 0)
		rotateGroup.addSlider('W', v => greenBoxRotationQuaternion.w = v, "", -1, 1, 0)
		
		const selectBox = new SelectionPanel('panel', [rotateGroup])
		selectBox.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
		selectBox.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
		selectBox.width = 0.4
		selectBox.height = 0.4
		advancedTexture.addControl(selectBox)
		
		
		scene.onBeforeRenderObservable.add(() => {
			greenBox.rotationQuaternion = greenBoxRotationQuaternion
			yellowBox.rotation = greenBox.rotationQuaternion.toEulerAngles()
			// yellowBox.rotationQuaternion = Quaternion.FromEulerAngles(greenBox.rotation.x, greenBox.rotation.y, greenBox.rotation.z)
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
		<canvas style={{width: '90vw', height: '90vh'}} ref={reactCanvas}></canvas>
	)
}

export default SceneC