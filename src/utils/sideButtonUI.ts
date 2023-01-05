import {AdvancedDynamicTexture, Button, Control, StackPanel} from '@babylonjs/gui'
import {Scene} from "@babylonjs/core";

type ButtonInfo = { text: string, onClick: () => any }

const createSidePanel = (scene: Scene, buttonInfoList: ButtonInfo[]) => {
	const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
		'sidePanelUI',
		undefined,
		scene
	)
	const panel = new StackPanel()
	panel.width = '100px'
	panel.fontSize = 12
	panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
	panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
	advancedTexture.addControl(panel);
	
	const buttons: Button[] = []
	buttonInfoList.map(buttonInfo => {
		const button = Button.CreateSimpleButton(buttonInfo.text, buttonInfo.text)
		button.onPointerDownObservable.add(buttonInfo.onClick)
		button.paddingTop = '2px';
		button.paddingRight = '2px';
		button.height = '24px';
		button.color = 'white';
		button.background = '#0088FF';
		panel.addControl(button);
		buttons.push(button)
	})
	
	return {buttons, panel, advancedTexture}
}

const addButton = (panel: StackPanel, buttonInfo: ButtonInfo) => {
	const button = Button.CreateSimpleButton(buttonInfo.text, buttonInfo.text)
	button.onPointerDownObservable.add(buttonInfo.onClick)
	button.paddingTop = '2px';
	button.paddingRight = '2px';
	button.height = '24px';
	button.color = 'white';
	button.background = '#0088FF';
	panel.addControl(button);
	
	return button
}

export default createSidePanel
export {addButton}