'use client'

import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
	XMarkIcon,
} from '@heroicons/react/24/outline'
import { ArrowLeftIcon, ArrowLongLeftIcon, Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { BsAirplane, BsHeart, BsPerson, BsSliders, BsSuitcase } from 'react-icons/bs'
import { MdPayments } from 'react-icons/md'
import Image from 'next/image'

const navigation = [
	{ name: 'Account', href: '#', icon: BsPerson, current: false },
	{ name: 'My Bookings', href: '#', icon: BsSuitcase, current: false },
	{ name: 'Favorites', href: '#', icon: BsHeart, current: false },
	{ name: 'Payments', href: '#', icon: MdPayments, current: false },
	{ name: 'Preferences', href: '#', icon: BsSliders, current: false },
	{ name: 'My Itineraries', href: '#', icon: BsAirplane, current: false },
]
const teams = [
	{ id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
	{ id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
	{ id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
]
const secondaryNavigation = [
	{ name: 'Account', href: '#', current: true },
	{ name: 'Notifications', href: '#', current: false },
	{ name: 'Billing', href: '#', current: false },
	{ name: 'Teams', href: '#', current: false },
	{ name: 'Integrations', href: '#', current: false },
]

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

export default function AccountPage() {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	const navigateHome = () => {
		window.location.href = '/'
	}

	return (
		<>
			<div className='pt-16'>
				<Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-40 xl:hidden">
					<Dialog.Backdrop
						className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
					/>

					<div className="fixed inset-0 flex">
						<Dialog.Panel
							className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
						>
							<Transition.Child>
								<div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
									<button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
										<span className="sr-only">Close sidebar</span>
										<XMarkIcon aria-hidden="true" className="size-6 text-white" />
									</button>
								</div>
							</Transition.Child>
							{/* Sidebar component, swap this element with another sidebar if you like */}
							<div className="pt-16 flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10 justify-center">
								<nav className="flex flex-1 flex-col">
									<ul role="list" className="flex flex-1 flex-col gap-y-7">
										<li>
											<ul role="list" className="-mx-2 space-y-1">
												{navigation.map((item) => (
													<li key={item.name}>
														<a
															href={item.href}
															className={classNames(
																item.current
																	? 'bg-gray-800 text-white'
																	: 'text-gray-400 hover:bg-gray-800 hover:text-white',
																'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
															)}
														>
															<item.icon aria-hidden="true" className="size-6 shrink-0" />
															{item.name}
														</a>
													</li>
												))}
											</ul>
										</li>
										<li>
											<div className="text-xs/6 font-semibold text-gray-400">Your teams</div>
											<ul role="list" className="-mx-2 mt-2 space-y-1">
												{teams.map((team) => (
													<li key={team.name}>
														<a
															href={team.href}
															className={classNames(
																team.current
																	? 'bg-gray-800 text-white'
																	: 'text-gray-400 hover:bg-gray-800 hover:text-white',
																'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
															)}
														>
															<span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
																{team.initial}
															</span>
															<span className="truncate">{team.name}</span>
														</a>
													</li>
												))}
											</ul>
										</li>
										<li className="-mx-6 mt-auto">
											<a
												href="#"
												className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800"
											>
												<img
													alt=""
													src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
													className="size-8 rounded-full bg-gray-800"
												/>
												<span className="sr-only">Your profile</span>
												<span aria-hidden="true">Tom Cook</span>
											</a>
										</li>
									</ul>
								</nav>
							</div>
						</Dialog.Panel>
					</div>
				</Dialog>

				{/* Static sidebar for desktop */}
				<div className="pt-16 hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-96 xl:flex-col xl:px-16 xl:gap-6">
					<div className='flex items-center gap-4 text-white py-4'>
						<ArrowLeftIcon className="h-6 w-6 hover:cursor-pointer"
							onClick={navigateHome} />
						<p className='text-neutral-04'>Back to Home</p>
					</div>
					<div className='flex justify-center gap-4'>
						<Image src="/images/default-avatar.svg" alt="Profile Picture" className="rounded-full" width={64} height={64} />
						<div className='text-white flex flex-col gap-2 w-full'>
							<h3>Name Here</h3>
							<div className='flex gap-2'>
								<Image src="/images/actota-points.svg" alt="Actota Points" width={16} height={16} />
								<p className='text-sm'><b>220 Points</b> ($22)</p>
							</div>
						</div>
					</div>
					<div className='h-10' />
					<ul role="list" className="flex flex-col gap-4">
						{navigation.map((item) => (
							<li key={item.name}>
								<a
									href={item.href}
									className={classNames(
										item.current
											? 'bg-gray-800 text-white'
											: 'text-gray-400 hover:bg-gray-800 hover:text-white',
										'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
									)}
								>
									<item.icon aria-hidden="true" className="size-6 shrink-0" />
									{item.name}
								</a>
							</li>
						))}
					</ul>

				</div>

				<div className="xl:pl-96">
					<main>
						<h1 className="sr-only">Account Settings</h1>

						<header className="border-b border-white/5">
							{/* Secondary navigation */}
							<nav className="flex overflow-x-auto py-4">
								<ul
									role="list"
									className="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-400 sm:px-6 lg:px-8"
								>
									{secondaryNavigation.map((item) => (
										<li key={item.name}>
											<a href={item.href} className={item.current ? 'text-indigo-400' : ''}>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</nav>
						</header>

						{/* Settings forms */}
						<div className="divide-y divide-white/5">
							<div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
								<div>
									<h2 className="text-base/7 font-semibold text-white">Personal Information</h2>
									<p className="mt-1 text-sm/6 text-gray-400">Use a permanent address where you can receive mail.</p>
								</div>

								<form className="md:col-span-2">
									<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
										<div className="col-span-full flex items-center gap-x-8">
											<Image
												alt="Profile Picture"
												src="/images/default-avatar.svg"
												width={64}
												height={64}
												className="size-24 object-cover"
											/>
											<div>
												<button
													type="button"
													className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-white/20"
												>
													Change avatar
												</button>
												<p className="mt-2 text-xs/5 text-gray-400">JPG, GIF or PNG. 1MB max.</p>
											</div>
										</div>

										<div className="sm:col-span-3">
											<label htmlFor="first-name" className="block text-sm/6 font-medium text-white">
												First name
											</label>
											<div className="mt-2">
												<input
													id="first-name"
													name="first-name"
													type="text"
													autoComplete="given-name"
													className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
												/>
											</div>
										</div>

										<div className="sm:col-span-3">
											<label htmlFor="last-name" className="block text-sm/6 font-medium text-white">
												Last name
											</label>
											<div className="mt-2">
												<input
													id="last-name"
													name="last-name"
													type="text"
													autoComplete="family-name"
													className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
												/>
											</div>
										</div>

										<div className="col-span-full">
											<label htmlFor="email" className="block text-sm/6 font-medium text-white">
												Email address
											</label>
											<div className="mt-2">
												<input
													id="email"
													name="email"
													type="email"
													autoComplete="email"
													className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
												/>
											</div>
										</div>
										<div className="col-span-full">
											<label htmlFor="username" className="block text-sm/6 font-medium text-white">
												Email address
											</label>
											<div className="mt-2">
												<input
													id="username"
													name="username"
													type="text"
													placeholder="janesmith"
													className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
												/>
											</div>
										</div>


										<div className="col-span-full">
											<label htmlFor="timezone" className="block text-sm/6 font-medium text-white">
												Timezone
											</label>
											<div className="mt-2 grid grid-cols-1">
												<select
													id="timezone"
													name="timezone"
													className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pr-8 pl-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
												>
													<option>Pacific Standard Time</option>
													<option>Eastern Standard Time</option>
													<option>Greenwich Mean Time</option>
												</select>
												<ChevronDownIcon
													aria-hidden="true"
													className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
												/>
											</div>
										</div>
									</div>

									<div className="mt-8 flex">
										<button
											type="submit"
											className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
										>
											Save
										</button>
									</div>
								</form>
							</div>

							<div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
								<div>
									<h2 className="text-base/7 font-semibold text-white">Change password</h2>
									<p className="mt-1 text-sm/6 text-gray-400">Update your password associated with your account.</p>
								</div>

								<form className="md:col-span-2">
									<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
										<div className="col-span-full">
											<label htmlFor="current-password" className="block text-sm/6 font-medium text-white">
												Current password
											</label>
											<div className="mt-2">
												<input
													id="current-password"
													name="current_password"
													type="password"
													autoComplete="current-password"
													className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
												/>
											</div>
										</div>

										<div className="col-span-full">
											<label htmlFor="new-password" className="block text-sm/6 font-medium text-white">
												New password
											</label>
											<div className="mt-2">
												<input
													id="new-password"
													name="new_password"
													type="password"
													autoComplete="new-password"
													className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
												/>
											</div>
										</div>

										<div className="col-span-full">
											<label htmlFor="confirm-password" className="block text-sm/6 font-medium text-white">
												Confirm password
											</label>
											<div className="mt-2">
												<input
													id="confirm-password"
													name="confirm_password"
													type="password"
													autoComplete="new-password"
													className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
												/>
											</div>
										</div>
									</div>

									<div className="mt-8 flex">
										<button
											type="submit"
											className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
										>
											Save
										</button>
									</div>
								</form>
							</div>

							<div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
								<div>
									<h2 className="text-base/7 font-semibold text-white">Log out other sessions</h2>
									<p className="mt-1 text-sm/6 text-gray-400">
										Please enter your password to confirm you would like to log out of your other sessions across all of
										your devices.
									</p>
								</div>

								<form className="md:col-span-2">
									<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
										<div className="col-span-full">
											<label htmlFor="logout-password" className="block text-sm/6 font-medium text-white">
												Your password
											</label>
											<div className="mt-2">
												<input
													id="logout-password"
													name="password"
													type="password"
													autoComplete="current-password"
													className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
												/>
											</div>
										</div>
									</div>

									<div className="mt-8 flex">
										<button
											type="submit"
											className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
										>
											Log out other sessions
										</button>
									</div>
								</form>
							</div>

							<div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
								<div>
									<h2 className="text-base/7 font-semibold text-white">Delete account</h2>
									<p className="mt-1 text-sm/6 text-gray-400">
										No longer want to use our service? You can delete your account here. This action is not reversible.
										All information related to this account will be deleted permanently.
									</p>
								</div>

								<form className="flex items-start md:col-span-2">
									<button
										type="submit"
										className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-400"
									>
										Yes, delete my account
									</button>
								</form>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	)
}