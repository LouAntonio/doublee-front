import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export const notyf = new Notyf({
	duration: 3000,
	position: {
		x: 'right',
		y: 'top',
	},
	types: [
		{
			type: 'success',
			background: '#00a650', // Mercado Livre green
			dismissible: true
		},
		{
			type: 'error',
			background: '#ef4444', // Red
			dismissible: true
		}
	]
});

// ── Dismiss watchdog ──
// O notyf só remove o toast do DOM quando a animação CSS dispara o evento
// `animationend`. Em alguns dispositivos móveis/browsers (reduce-motion,
// modo poupança, ecrã bloqueado durante a saída) esse evento nunca corre
// e o toast fica preso no ecrã. Este watchdog garante a remoção em força.
const toastSelector = '.notyf__toast--disappear';
const fallbackDismissMs = 1000; // 300ms animação + 250ms delay + margem
const scheduledNodes = new WeakSet();

function forceRemoveNodes(container) {
	const root = container || document;
	root.querySelectorAll(toastSelector).forEach((node) => {
		scheduledNodes.add(node);
		node.remove();
	});
}

function scheduleFallbackDismiss(node) {
	scheduledNodes.add(node);
	setTimeout(() => {
		if (node.isConnected) {
			node.remove();
		}
	}, fallbackDismissMs);
}

if (typeof document !== 'undefined') {
	const container = document.querySelector('.notyf');
	if (container) {
		const observer = new MutationObserver(() => {
			container.querySelectorAll(toastSelector).forEach((node) => {
				if (!scheduledNodes.has(node)) {
					scheduleFallbackDismiss(node);
				}
			});
		});
		observer.observe(container, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class'],
		});
	}

	// Telefone bloqueado / separador em segundo plano durante a saída:
	// ao voltar a ficar visível, remove qualquer toast ainda preso.
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') {
			forceRemoveNodes();
		}
	});
}