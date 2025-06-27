"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
	{
		href: "/prompt-styles",
		icon: "/file.svg",
		label: "Prompt Styles",
		alt: "Prompt Styles Icon",
	},
	{
		href: "/prompt-builder",
		icon: "/file.svg",
		label: "Prompt Builder",
		alt: "Prompt Builder Icon",
	},
	{
		href: "/prompts",
		icon: "/file.svg",
		label: "Prompts",
		alt: "Prompts Icon",
	},
	{
		href: "/checkpoints",
		icon: "/globe.svg",
		label: "Checkpoints",
		alt: "Checkpoints Icon",
	},
	{
		href: "/loras",
		icon: "/window.svg",
		label: "Loras",
		alt: "Loras Icon",
	},
];

export default function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<aside
			className={`h-screen fixed left-0 top-0 z-30 bg-gray-900 border-r border-gray-800 shadow transition-all duration-300 flex flex-col ${
				collapsed ? "w-16" : "w-48"
			}`}
		>
			<button
				className="p-2 focus:outline-none hover:bg-gray-800 transition self-end text-gray-400 hover:text-white"
				onClick={() => setCollapsed((c) => !c)}
				aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
			>
				<span className="block w-6 h-6">
					{collapsed ? (
						<svg
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-6 h-6"
						>
							<path d="M7 10l5-5v10l-5-5z" />
						</svg>
					) : (
						<svg
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-6 h-6"
						>
							<path d="M13 10l-5 5V5l5 5z" />
						</svg>
					)}
				</span>
			</button>
			<nav className="flex-1 flex flex-col gap-2 mt-4">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800 transition-colors ${
							collapsed ? "justify-center" : ""
						}`}
					>
						<Image
							src={link.icon}
							alt={link.alt}
							width={28}
							height={28}
							className="w-7 h-7"
							style={{ filter: "invert(1)" }}
						/>
						{!collapsed && (
							<span className="text-base font-medium text-gray-200">
								{link.label}
							</span>
						)}
					</Link>
				))}
			</nav>
		</aside>
	);
}
