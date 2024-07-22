'use client';
import { useEffect } from "react";
import Button from "./figma/Button";
import Field from "./figma/Field";


const Components = () => {


	useEffect(() => {
		console.log("Hello, World!");
	}, []);

	return (
		Button({ children: "Get Started", className: "neutral-01 text-bold text-white text-center text-small" }),
		Field({ children: "Select a category"})
	)

}

export default Components;
