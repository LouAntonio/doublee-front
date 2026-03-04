import {
	IoTimeOutline,
	IoRefreshOutline,
	IoCarOutline,
	IoCheckmarkDoneOutline,
	IoCloseCircleOutline,
} from 'react-icons/io5';
import apiRequest from '../../../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────
export const ANGOLA_PROVINCES = [
	'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
	'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
	'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
	'Namibe', 'Uíge', 'Zaire',
];

export const ORDER_STATUS_MAP = {
	pending: { label: 'Pendente', color: 'amber', Icon: IoTimeOutline },
	processing: { label: 'Em processo', color: 'blue', Icon: IoRefreshOutline },
	shipped: { label: 'Enviado', color: 'purple', Icon: IoCarOutline },
	delivered: { label: 'Entregue', color: 'green', Icon: IoCheckmarkDoneOutline },
	cancelled: { label: 'Cancelado', color: 'red', Icon: IoCloseCircleOutline },
};

export const STATUS_COLOR = {
	amber: 'bg-amber-50 text-amber-700 border border-amber-200',
	blue: 'bg-blue-50 text-blue-700 border border-blue-200',
	purple: 'bg-purple-50 text-purple-700 border border-purple-200',
	green: 'bg-green-50 text-green-700 border border-green-200',
	red: 'bg-red-50 text-red-700 border border-red-200',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const uploadToCloudinary = async (file, folder) => {
	const auth = await apiRequest(`/cloudinary/authorize-upload?folder=${folder}`);
	if (!auth.success) throw new Error(auth.message || 'Falha ao autorizar upload.');
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
