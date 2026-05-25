import React from 'react';
import { IoImageOutline } from 'react-icons/io5';

const ImagePicker = ({ label, name, preview, onChange, aspectHint }) => (
	<div className="space-y-2">
		<label className="block text-sm font-medium text-[#1C1917]">{label}</label>
		<label
			className="relative flex flex-col items-center justify-center w-full border-2 border-accent/20 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-sand transition-all overflow-hidden"
			style={{ minHeight: '7rem' }}
		>
			{preview ? (
				<img src={preview} alt={label} className="w-full h-full object-cover absolute inset-0 rounded-2xl" style={{ maxHeight: '10rem' }} />
			) : (
				<div className="flex flex-col items-center justify-center py-6 pointer-events-none px-4 text-center">
					<IoImageOutline className="w-8 h-8 text-[#78716C] mb-2" />
					<p className="text-sm text-[#78716C]">Clique para seleccionar</p>
					{aspectHint && <p className="text-xs text-[#78716C] mt-1">{aspectHint}</p>}
				</div>
			)}
			<input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
		</label>
		{preview && <p className="text-xs text-green-600 font-medium">✓ Imagem seleccionada</p>}
	</div>
);

export default ImagePicker;
