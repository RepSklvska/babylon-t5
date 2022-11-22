import {Scene} from "@babylonjs/core";
import {AdvancedDynamicTexture, Control, TextBlock} from "@babylonjs/gui";

const createDebugUI = (scene: Scene) => {
	const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
		'textUI',
		undefined,
		scene
	);
	const uiText = new TextBlock('instructions');
	uiText.text = '';
	uiText.color = '#f0ff00';
	uiText.fontFamily = 'Roboto';
	uiText.fontSize = 48;
	uiText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
	uiText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
	uiText.paddingBottom = '10px';
	advancedTexture.addControl(uiText);
	
	return {uiText, advancedTexture}
}

export default createDebugUI
