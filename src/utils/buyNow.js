const KUV_BUYNOW_KEY = 'kuv_buynow';

export const hasBuyNowIntent = () => Boolean(sessionStorage.getItem(KUV_BUYNOW_KEY));

export const setBuyNowIntent = (items) => {
	sessionStorage.setItem(KUV_BUYNOW_KEY, JSON.stringify(items));
};

export const takeBuyNowItems = () => {
	try {
		const raw = sessionStorage.getItem(KUV_BUYNOW_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed : [parsed];
		}
	} catch {
		// ignore payload corrompido
	}
	return null;
};

export const clearBuyNowIntent = () => {
	sessionStorage.removeItem(KUV_BUYNOW_KEY);
};

let authRedirectLocked = false;

export const lockAuthRedirect = () => {
	authRedirectLocked = true;
};

export const unlockAuthRedirect = () => {
	authRedirectLocked = false;
};

export const isAuthRedirectLocked = () => authRedirectLocked;