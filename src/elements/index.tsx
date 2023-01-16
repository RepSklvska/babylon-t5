import React from "react";
import {useNavigate} from "react-router-dom";

export default () => {
	const navigate = useNavigate()
	return (
		<div>
			<p>
				<button onClick={() => navigate("/A")}>Scene 1</button>
			</p>
			<p>
				<button onClick={() => navigate("/B")}>Scene 2</button>
			</p>
			<p>
				<button onClick={() => navigate("/C")}>Scene 3</button>
			</p>
			<p>
				<button onClick={() => navigate("/D")}>Scene 4</button>
			</p>
			<p>
				<button onClick={() => navigate("/E")}>Scene 5</button>
			</p>
			<p>
				<button onClick={() => navigate("/F")}>Scene 6</button>
			</p>
		</div>
	)
}