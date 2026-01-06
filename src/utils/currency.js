/**
 * Formata um número para o formato monetário angolano
 * @param {number} value - O valor a ser formatado
 * @returns {string} - Valor formatado no padrão: 1.234.000,00 akz
 */
export const formatCurrency = (value) => {
	if (value === null || value === undefined || isNaN(value)) {
		return '0,00 akz';
	}

	// Converte para número e formata com 2 casas decimais
	const numValue = Number(value);
	
	// Formata o número com separadores
	const formatted = numValue.toLocaleString('pt-AO', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	return `${formatted} akz`;
};

/**
 * Formata apenas a parte inteira do valor (sem decimais)
 * @param {number} value - O valor a ser formatado
 * @returns {string} - Valor formatado: 1.234.000 akz
 */
export const formatCurrencyWhole = (value) => {
	if (value === null || value === undefined || isNaN(value)) {
		return '0 akz';
	}

	const numValue = Number(value);
	const formatted = Math.floor(numValue).toLocaleString('pt-AO');

	return `${formatted} akz`;
};
