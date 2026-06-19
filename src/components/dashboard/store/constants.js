import {
	IoTimeOutline,
	IoRefreshOutline,
	IoCarOutline,
	IoCheckmarkDoneOutline,
	IoCloseCircleOutline,
	IoBusinessOutline,
	IoLocateOutline,
	IoHomeOutline,
	IoFlagOutline,
	IoHandLeftOutline,
} from 'react-icons/io5';
import http from '../../../services/http';

// ─── Constants ────────────────────────────────────────────────────────────────
export const ANGOLA_PROVINCES = [
	'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
	'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
	'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
	'Namibe', 'Uíge', 'Zaire',
];

export const ORDER_STATUS_MAP = {
	pending: { label: 'Pendente', color: 'amber', Icon: IoTimeOutline },
	processing: { label: 'Em Preparação', color: 'blue', Icon: IoRefreshOutline },
	shipped: { label: 'Enviado para Sede', color: 'purple', Icon: IoCarOutline },
	delivered: { label: 'Recebido na Sede', color: 'green', Icon: IoCheckmarkDoneOutline },
	received_at_sede: { label: 'Conferido na Sede', color: 'teal', Icon: IoBusinessOutline },
	out_for_delivery: { label: 'Em Transporte', color: 'indigo', Icon: IoLocateOutline },
	delivered_to_customer: { label: 'Entregue ao Cliente', color: 'green', Icon: IoHomeOutline },
	ready_for_pickup: { label: 'Pronto p/ Levantar', color: 'cyan', Icon: IoFlagOutline },
	picked_up: { label: 'Levantado', color: 'emerald', Icon: IoHandLeftOutline },
	cancelled: { label: 'Cancelado', color: 'red', Icon: IoCloseCircleOutline },
};

export const STATUS_COLOR = {
	amber: 'bg-amber-50 text-amber-700 border border-amber-200',
	blue: 'bg-blue-50 text-blue-700 border border-blue-200',
	purple: 'bg-purple-50 text-purple-700 border border-purple-200',
	green: 'bg-green-50 text-green-700 border border-green-200',
	red: 'bg-red-50 text-red-700 border border-red-200',
	teal: 'bg-teal-50 text-teal-700 border border-teal-200',
	indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
	cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
	emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const uploadToCloudinary = async (file, folder) => {
	const auth = await http.get(`/cloudinary/authorize-upload?folder=${folder}`);
	if (!auth?.success) throw new Error(auth?.message || 'Falha ao autorizar upload.');
	const formData = new FormData();
	formData.append('file', file);
	formData.append('api_key', auth.apikey);
	formData.append('timestamp', auth.timestamp);
	formData.append('signature', auth.signature);
	formData.append('folder', auth.folder);
	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${auth.cloudname}/image/upload`,
		{ method: 'POST', body: formData }
	);
	const result = await response.json();
	if (!response.ok) throw new Error(result?.error?.message || `Cloudinary error ${response.status}`);
	return result.secure_url;
};
