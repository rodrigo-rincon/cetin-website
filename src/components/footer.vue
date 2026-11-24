<script setup lang="ts">
const currentYear = new Date().getFullYear();
const openCookieSettings = () => window.dispatchEvent(new CustomEvent('open-cetin-cookie-settings'));
const openAppointmentForm = () => window.dispatchEvent(new CustomEvent('open-cetin-appointment'));
</script>


<template>
	<footer class="site-footer text-white">
		<div class="mx-auto max-w-7xl px-6 pb-10 pt-12 lg:px-12 lg:pt-16">
			<section class="footer-cta" aria-labelledby="footer-cta-title">
				<div>
					<p class="footer-kicker">Atención con previa cita</p>
					<h2 id="footer-cta-title">Da el primer paso para cuidar la salud de tu bebé</h2>
					<p>Elige la sucursal y el horario que mejor se adapten a tu familia</p>
				</div>
				<div class="footer-cta-actions">
					<a href="tel:+522223994072" class="footer-phone">222 399 4072</a>
					<button type="button" class="footer-appointment" @click="openAppointmentForm">Agendar cita <span aria-hidden="true">→</span></button>
				</div>
			</section>

			<div class="footer-grid">
				<div class="footer-brand">
					<div class="footer-brand-lockup">
						<img src="../assets/images/cetin_logo.png" alt="Logo CETIN" />
						<div><h3>CETIN</h3><p>Centro de Tamizaje Infantil</p></div>
					</div>
					<p class="footer-brand-copy">Cuidamos la salud de tu bebé con procesos confiables, tecnología especializada y respaldo médico.</p>
					<a href="mailto:cetincorporativo@gmail.com" class="footer-email">cetincorporativo@gmail.com</a>
				</div>

				<div class="footer-column">
					<h4>Explora</h4>
					<nav aria-label="Enlaces del sitio">
						<a href="/#us">Nosotros</a>
						<a href="/#services-info">Servicios</a>
						<a href="/#clients">Testimonios</a>
						<a href="/#contact">Sucursales y contacto</a>
					</nav>
				</div>

				<div class="footer-column footer-hours">
					<h4>Horarios</h4>
					<dl>
						<div><dt>Lunes a viernes</dt><dd>8:00–16:00</dd></div>
						<div><dt>Sábados</dt><dd>9:00–15:00</dd></div>
					</dl>
					<p><span aria-hidden="true"></span> Atención bajo previa cita</p>
				</div>

				<div class="footer-column footer-social-column">
					<h4>Síguenos</h4>
					<div class="social-links">
						<a
							href="https://www.facebook.com/cetinpuebla"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Visitar Facebook de CETIN"
							class="social-link"
						>
							<svg
								class="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M9.602 21.026v-7.274H6.818a.545.545 0 0 1-.545-.545V10.33a.545.545 0 0 1 .545-.545h2.773V7a4.547 4.547 0 0 1 4.86-4.989h2.32a.556.556 0 0 1 .557.546v2.436a.557.557 0 0 1-.557.545h-1.45c-1.566 0-1.867.742-1.867 1.833v2.413h3.723a.533.533 0 0 1 .546.603l-.337 2.888a.545.545 0 0 1-.545.476h-3.364v7.274a.96.96 0 0 1-.975.974h-1.937a.96.96 0 0 1-.963-.974"
								/>
							</svg>
							<span class="social-label">Facebook</span>
							<span class="social-arrow" aria-hidden="true">↗</span>
						</a>
						<a
							href="https://www.instagram.com/cetin.puebla/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Visitar Instagram de CETIN"
							class="social-link"
						>
							<svg
								class="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
								/>
							</svg>
							<span class="social-label">Instagram</span>
							<span class="social-arrow" aria-hidden="true">↗</span>
						</a>
						<a
							href="https://www.tiktok.com/@cetinpuebla"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Visitar TikTok de CETIN"
							class="social-link"
						>
							<svg
								class="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M16 8.245V15.5a6.5 6.5 0 1 1-5-6.326v3.163a3.5 3.5 0 1 0 2 3.163V2h3a5 5 0 0 0 5 5v3a7.97 7.97 0 0 1-5-1.755"
								/>
							</svg>
							<span class="social-label">TikTok</span>
							<span class="social-arrow" aria-hidden="true">↗</span>
						</a>
						<a
							href="https://www.youtube.com/@CETINco"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Visitar YouTube de CETIN"
							class="social-link"
						>
							<svg
								class="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
								/>
							</svg>
							<span class="social-label">YouTube</span>
							<span class="social-arrow" aria-hidden="true">↗</span>
						</a>
					</div>
				</div>
			</div>

			<div class="footer-bottom">
				<p>© {{ currentYear }} CETIN. Todos los derechos reservados.</p>
				<nav aria-label="Enlaces legales">
					<router-link to="/aviso-de-privacidad">Aviso de privacidad</router-link>
					<router-link to="/terminos-y-condiciones">Términos y condiciones</router-link>
					<router-link to="/politica-de-cookies">Política de cookies</router-link>
					<button type="button" @click="openCookieSettings">Preferencias de cookies</button>
				</nav>
			</div>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	position: relative;
	overflow: hidden;
	background: #08152b;
	color: white;
}

.site-footer::before {
	position: absolute;
	inset: 0 0 auto;
	height: 1px;
	background: rgb(255 255 255 / 0.16);
	content: '';
}

.footer-cta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 2rem;
	padding: 2rem;
	border: 1px solid rgb(255 255 255 / 0.14);
	border-radius: 1.5rem;
	background: rgb(255 255 255 / 0.07);
	box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.1);
	backdrop-filter: blur(18px);
}

.footer-kicker { margin-bottom: 0.5rem; color: #f9a8d4; font-size: 0.8rem; font-weight: 600; }
.footer-cta h2 { max-width: 42rem; font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 600; line-height: 1.15; }
.footer-cta p:last-child { margin-top: 0.65rem; color: #94a3b8; }

.footer-cta-actions { display: flex; flex-shrink: 0; align-items: center; gap: 0.75rem; }
.footer-phone,
.footer-appointment { min-height: 3rem; padding: 0.8rem 1rem; border-radius: 0.75rem; font-size: 0.88rem; font-weight: 600; }
.footer-phone { border: 1px solid rgb(255 255 255 / 0.18); background: rgb(255 255 255 / 0.07); color: #e2e8f0; }
.footer-appointment { display: inline-flex; align-items: center; gap: 0.65rem; background: #db2777; color: white; }
.footer-phone:hover { border-color: rgb(255 255 255 / 0.34); background: rgb(255 255 255 / 0.11); }
.footer-appointment:hover { background: #be185d; }

.footer-grid {
	display: grid;
	grid-template-columns: 1.45fr 0.75fr 0.95fr 1fr;
	gap: 3rem;
	padding: 4rem 0 3rem;
}

.footer-brand-lockup { display: flex; align-items: center; gap: 0.9rem; }
.footer-brand-lockup img { width: 3.5rem; height: 3.5rem; object-fit: contain; }
.footer-brand-lockup h3 { font-size: 1.35rem; font-weight: 600; }
.footer-brand-lockup p { color: #94a3b8; font-size: 0.76rem; }
.footer-brand-copy { max-width: 25rem; margin-top: 1.5rem; color: #94a3b8; line-height: 1.7; }
.footer-email { display: inline-block; margin-top: 1.25rem; color: #e2e8f0; font-size: 0.88rem; font-weight: 500; }
.footer-email:hover { color: #f9a8d4; }

.footer-column h4 { margin-bottom: 1.25rem; color: #f8fafc; font-size: 0.92rem; font-weight: 600; }
.footer-column nav { display: grid; gap: 0.8rem; }
.footer-column nav a { color: #94a3b8; font-size: 0.88rem; }
.footer-column nav a:hover { color: #f9a8d4; }

.footer-hours dl { display: grid; gap: 0.85rem; }
.footer-hours dl div { display: flex; justify-content: space-between; gap: 1rem; color: #94a3b8; font-size: 0.84rem; }
.footer-hours dd { color: #e2e8f0; font-variant-numeric: tabular-nums; white-space: nowrap; }
.footer-hours > p { display: flex; align-items: center; gap: 0.55rem; margin-top: 1.15rem; color: #fbcfe8; font-size: 0.78rem; }
.footer-hours > p span { width: 0.42rem; height: 0.42rem; border-radius: 50%; background: #ec4899; }

.social-links {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.6rem;
}

.social-link {
	display: flex;
	align-items: center;
	gap: 0.55rem;
	min-width: 0;
	padding: 0.6rem;
	border: 1px solid rgb(255 255 255 / 0.1);
	border-radius: 0.8rem;
	background: rgb(255 255 255 / 0.05);
	transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
}

.social-link svg {
	width: 1.15rem;
	height: 1.15rem;
	flex: 0 0 auto;
	color: #cbd5e1;
}

.social-label { overflow: hidden; color: #cbd5e1; font-size: 0.72rem; font-weight: 500; text-overflow: ellipsis; }
.social-arrow { display: none; }

.social-link:hover,
.social-link:focus-visible {
	border-color: rgb(244 114 182 / 0.5);
	background: rgb(236 72 153 / 0.1);
	outline: none;
	transform: translateY(-2px);
}

.footer-bottom { display: flex; align-items: center; justify-content: space-between; gap: 2rem; padding-top: 1.5rem; border-top: 1px solid rgb(255 255 255 / 0.1); color: #64748b; font-size: 0.72rem; }
.footer-bottom nav { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.75rem 1.25rem; }
.footer-bottom a:hover,
.footer-bottom button:hover { color: #e2e8f0; }

@media (max-width: 1023px) {
	.footer-cta { align-items: flex-start; flex-direction: column; }
	.footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.5rem; }
}

@media (max-width: 640px) {
	.footer-cta { padding: 1.5rem; }
	.footer-cta-actions { width: 100%; flex-direction: column; align-items: stretch; }
	.footer-phone,
	.footer-appointment { justify-content: center; text-align: center; }
	.footer-grid { grid-template-columns: 1fr; padding: 3rem 0 2rem; }
	.footer-brand-copy { max-width: none; }
	.social-links { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.footer-bottom { align-items: flex-start; flex-direction: column; }
	.footer-bottom nav { justify-content: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
	.social-link { transition: none; }
	.social-link:hover,
	.social-link:focus-visible { transform: none; }
}
</style>
