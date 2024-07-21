'use client';
import { useEffect } from "react";
import Button from "./figma/Button";


const Components = () => {


	useEffect(() => {
		console.log("Hello, World!");
	}, []);

	return (
		Button({ children: "Get Started" , className: "neutral-01 text-bold text-white text-center text-small"})
	)

}

export default Components;
