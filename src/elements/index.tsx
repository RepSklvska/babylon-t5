import React from "react";
import {useNavigate} from "react-router-dom";

export default () => {
	const navigate = useNavigate()
	return (
		<div>
			<p>
				<button onClick={() => navigate("/scene1")}>Scene 1</button>
			</p>
			<p>
				<button onClick={() => navigate("/scene2")}>Scene 2</button>
			</p>
		</div>
	)
}