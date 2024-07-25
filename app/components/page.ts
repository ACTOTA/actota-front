'use client';
import { useEffect } from "react";
import Button from "./figma/Button";
import Field from "./figma/Field";
import Checkbox from "./figma/Checkbox";
import FavButton from "./figma/FavButton";
import React from "react";


const Components = () => {


	useEffect(() => {
		console.log("Hello, World!");
	}, []);

	return (
		React.createElement("div", { className: "flex flex-col items-center justify-center h-screen" }, [Button({ children: "Button" }),
		Field({ children: "Field" }),
		FavButton(),
		Checkbox({ children: "Checkbox" })])
	)

}

export default Components;
