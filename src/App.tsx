import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Index from './elements/index'
import SceneA from "./elements/scenes/a";
import SceneB from "./elements/scenes/b";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Index/>}></Route>
				<Route path="/A" element={<SceneA/>}></Route>
				<Route path="/B" element={<SceneB/>}></Route>
			</Routes>
		</div>
	);
}

export default App;
