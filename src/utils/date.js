const LUANDA_TIMEZONE = 'Africa/Luanda';

export const parseLuanda = (dateValue) => {
	if (!dateValue) return null;

	if (typeof dateValue === 'string' && !dateValue.includes('T')) {
		return new Date(`${dateValue}T23:59:59.999+01:00`);
	}

	const parsed = new Date(dateValue);
	if (Number.isNaN(parsed.getTime())) return null;
	return parsed;
};

export const isPromotionActive = (promotionalEndDate) => {
	if (!promotionalEndDate) return false;
	const endDate = parseLuanda(promotionalEndDate);
	if (!endDate) return false;
	return endDate.getTime() >= Date.now();
};

export const toDateInputValue = (date) => {
	if (!date) return '';
	const d = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(d.getTime())) return '';
	return Intl.DateTimeFormat('fr-CA', { timeZone: LUANDA_TIMEZONE }).format(d);
};

export const minDateLuanda = () => {
	return Intl.DateTimeFormat('fr-CA', { timeZone: LUANDA_TIMEZONE }).format(new Date());
};
