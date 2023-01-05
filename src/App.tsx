import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Index from './elements/index'
import SceneA from "./elements/scenes/a";
import SceneB from "./elements/scenes/b";
import SceneD from "./elements/scenes/d";
import SceneE from "./elements/scenes/e";
import SceneF from "./elements/scenes/f";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Index/>}></Route>
				<Route path="/A" element={<SceneA/>}></Route>
				<Route path="/B" element={<SceneB/>}></Route>
				<Route path="/D" element={<SceneD/>}></Route>
				<Route path="/E" element={<SceneE/>}></Route>
				<Route path="/F" element={<SceneF/>}></Route>
			</Routes>
		</div>
	);
}

export default App;
