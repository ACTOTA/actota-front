'use client'

import { useEffect, useRef } from 'react'

export default function GradientBackground() {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			container.style.setProperty('--x', `${x}px`)
			container.style.setProperty('--y', `${y}px`)
		}

		const handleMouseLeave = () => {
			const width = container.offsetWidth
			const height = container.offsetHeight
			container.style.setProperty('--x', `${width / 2}px`)
			container.style.setProperty('--y', `${height / 2}px`)
		}

		container.addEventListener('mousemove', handleMouseMove)
		container.addEventListener('mouseleave', handleMouseLeave)

		return () => {
			container.removeEventListener('mousemove', handleMouseMove)
			container.removeEventListener('mouseleave', handleMouseLeave)
		}
	}, [])

	return (
		<div
			ref={containerRef}
			className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-950"
			style={{
				'--x': '50%',
				'--y': '50%'
			} as React.CSSProperties}
		>
			{/* Base gradients */}
			<div
				className="absolute inset-0 opacity-50"
				style={{
					background: 'linear-gradient(45deg, rgba(0, 0, 139, 0.15), transparent 40%, rgba(139, 0, 0, 0.1) 60%, rgba(0, 100, 0, 0.15))'
				}}
			/>

			{/* Interactive gradient */}
			<div
				className="absolute transition-all duration-700 ease-out"
				style={{
					left: 'var(--x)',
					top: 'var(--y)',
					width: '150%',
					height: '150%',
					transform: 'translate(-50%, -50%)',
					background: `radial-gradient(
            circle at var(--x) var(--y),
            rgba(29, 78, 216, 0.15) 0%,
            rgba(220, 38, 38, 0.12) 25%,
            rgba(0, 100, 0, 0.1) 50%,
            transparent 70%
          )`,
					filter: 'blur(80px)'
				}}
			/>

			<section className="flex flex-col justify-center items-center text-white h-[100vh] px-4">
				<div className="inline-flex px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8">
					ACTOTA for Suppliers
				</div>
				<div className="flex flex-col items-center max-w-4xl text-center">
					<h1 className="text-6xl font-normal mb-8">
						<span className="text-gray-400">Your</span> Adventure,
						<br />
						<span className="text-gray-400">Your</span> Business,{' '}
						<span className="text-gray-400">Our</span> Tech
					</h1>
					<p className="text-lg text-gray-300 max-w-3xl">
						A platform that brings together every part of the travel experience, helping you grow your business,
						create meaningful connections, and thrive in a sustainable and tech-driven world.
					</p>
					<button className="mt-6 bg-white text-black font-bold rounded-full py-3 px-4 
						transform transition-transform duration-200 hover:scale-105">
						Join Now for Free!
					</button>
				</div>
			</section>
		</div>
	)
}


















