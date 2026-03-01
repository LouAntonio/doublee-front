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
