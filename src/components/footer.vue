<script setup lang="ts"></script>

<template>
	<footer class="bg-gray-900 text-white">
		<!-- Main Footer -->
		<div class="max-w-7xl mx-auto px-6 lg:px-12 py-16">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
				<!-- Brand -->
				<div class="lg:col-span-1 text-center md:text-left">
					<div
						class="flex items-center gap-3 mb-6 justify-center md:justify-start"
					>
						<div
							class="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center"
						>
							<span class="text-white font-bold text-xl">C</span>
						</div>
						<div>
							<h3 class="text-xl font-bold">CETIN</h3>
							<p class="text-sm text-gray-400">
								Centro de Tamizaje Infantil
							</p>
						</div>
					</div>
					<p class="text-gray-400 leading-relaxed">
						Cuidamos la salud de tu bebé con los más altos
						estándares de calidad y tecnología de punta.
					</p>
				</div>

				<!-- Schedule -->
				<div class="text-center md:text-left">
					<h4
						class="text-lg font-bold mb-6 flex items-center gap-2 justify-center md:justify-start"
					>
						<span class="relative flex h-3 w-3">
							<span
								class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
							></span>
							<span
								class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
							></span>
						</span>
						Horarios
					</h4>
					<ul class="space-y-3 text-gray-400">
						<li
							class="flex items-center gap-3 justify-center md:justify-start"
						>
							<svg
								class="w-5 h-5 text-pink-500 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Lun - Vie: 8:00 - 16:00</span>
						</li>
						<li
							class="flex items-center gap-3 justify-center md:justify-start"
						>
							<svg
								class="w-5 h-5 text-pink-500 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Sábados: 9:00 - 15:00</span>
						</li>
						<li
							class="flex items-center gap-3 text-yellow-500 justify-center md:justify-start"
						>
							<svg
								class="w-5 h-5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Bajo previa cita</span>
						</li>
					</ul>
				</div>

				<!-- Quick Links -->
				<div class="text-center md:text-left">
					<h4
						class="text-lg font-bold mb-6 flex items-center gap-2 justify-center md:justify-start"
					>
						<span class="relative flex h-3 w-3">
							<span
								class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
							></span>
							<span
								class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"
							></span>
						</span>
						Enlaces Rápidos
					</h4>
					<ul class="space-y-3">
						<li>
							<a
								href="#us"
								class="text-gray-400 hover:text-pink-500 transition-colors"
								>Nosotros</a
							>
						</li>
						<li>
							<a
								href="#services"
								class="text-gray-400 hover:text-pink-500 transition-colors"
								>Servicios</a
							>
						</li>
						<li>
							<a
								href="#clients"
								class="text-gray-400 hover:text-pink-500 transition-colors"
								>Testimonios</a
							>
						</li>
						<li>
							<a
								href="#contact"
								class="text-gray-400 hover:text-pink-500 transition-colors"
								>Contacto</a
							>
						</li>
					</ul>
				</div>

				<!-- Social -->
				<div class="text-center md:text-left">
					<h4
						class="text-lg font-bold mb-6 flex items-center gap-2 justify-center md:justify-start"
					>
						<span class="relative flex h-3 w-3">
							<span
								class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"
							></span>
							<span
								class="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"
							></span>
						</span>
						Contáctanos al
					</h4>
					<div class="flex gap-3 justify-center md:justify-start">
						<a
							href="https://www.facebook.com/cetinpuebla"
							target="_blank"
							class="w-14 h-14 bg-gray-800 hover:bg-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30"
						>
							<svg
								class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M9.602 21.026v-7.274H6.818a.545.545 0 0 1-.545-.545V10.33a.545.545 0 0 1 .545-.545h2.773V7a4.547 4.547 0 0 1 4.86-4.989h2.32a.556.556 0 0 1 .557.546v2.436a.557.557 0 0 1-.557.545h-1.45c-1.566 0-1.867.742-1.867 1.833v2.413h3.723a.533.533 0 0 1 .546.603l-.337 2.888a.545.545 0 0 1-.545.476h-3.364v7.274a.96.96 0 0 1-.975.974h-1.937a.96.96 0 0 1-.963-.974"
								/>
							</svg>
						</a>
						<a
							href="https://www.instagram.com/cetin.puebla/"
							target="_blank"
							class="w-14 h-14 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 rounded-2xl flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30"
						>
							<svg
								class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
								/>
							</svg>
						</a>
						<a
							href="https://www.tiktok.com/@cetinpuebla"
							target="_blank"
							class="w-14 h-14 bg-gray-800 hover:bg-black rounded-2xl flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-500/30"
						>
							<svg
								class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M16 8.245V15.5a6.5 6.5 0 1 1-5-6.326v3.163a3.5 3.5 0 1 0 2 3.163V2h3a5 5 0 0 0 5 5v3a7.97 7.97 0 0 1-5-1.755"
								/>
							</svg>
						</a>
						<a
							href="https://www.youtube.com/@CETINPuebla"
							target="_blank"
							class="w-14 h-14 bg-gray-800 hover:bg-red-600 rounded-2xl flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30"
						>
							<svg
								class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-gray-800">
			<div class="max-w-7xl mx-auto px-6 lg:px-12 py-6">
				<div
					class="flex flex-col md:flex-row justify-between items-center gap-4"
				>
					<p class="text-gray-400 text-sm text-center md:text-left">
						© 2024 CETIN - Centro de Tamizaje Infantil. Todos los
						derechos reservados.
					</p>
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 bg-pink-500 rounded-full"></span>
						<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
						<span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
						<span class="w-2 h-2 bg-red-500 rounded-full"></span>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>
