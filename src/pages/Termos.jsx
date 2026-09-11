import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';

const CONTACT_EMAIL = 'kuvanganalda@gmail.com';

const Section = ({ title, children }) => (
	<section className="mb-10">
		<h2 className="font-display text-xl font-bold text-[#1C1917] mb-4">{title}</h2>
		<div className="text-[#57534E] font-body leading-relaxed space-y-3">{children}</div>
	</section>
);

const SectionList = ({ items }) => (
	<ul className="list-disc pl-6 space-y-2">
		{items.map((item) => (
			<li key={item}>{item}</li>
		))}
	</ul>
);

const Termos = () => {
	useDocumentTitle('Termos de Uso - Kuvangana');

	return (
		<div className="min-h-screen bg-sand flex flex-col">
			<Header />
			<main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 md:py-16">
				<div className="bg-white rounded-2xl shadow-md p-6 md:p-10">
					<div className="mb-10">
						<h1 className="font-display text-3xl md:text-4xl text-[#1C1917] mb-2">Termos de Uso</h1>
						<p className="text-sm text-[#78716C] font-body">Última atualização: 11 de setembro de 2026</p>
					</div>

					<Section title="1. Aceitação dos termos">
						<p>
							Estes Termos de Uso ("Termos") regem a utilização da plataforma Kuvangana, um marketplace
							angolano que liga compradores e vendedores, acessível em kuvangana.com e na aplicação.
						</p>
						<p>
							Ao criar uma conta, comprar, vender ou utilizar qualquer funcionalidade da plataforma, concordas
							em cumprir estes Termos, a Política de Privacidade e a legislação aplicável. Se não concordares
							com estes Termos, não deverás utilizar a plataforma.
						</p>
					</Section>

					<Section title="2. Descrição do serviço">
						<p>
							A Kuvangana disponibiliza uma plataforma onde:
						</p>
						<SectionList items={[
							'compradores podem pesquisar, ver e comprar produtos de diversas lojas;',
							'vendedores podem registar lojas, publicar produtos, gerir pedidos e receber pagamentos;',
							'ambas as partes podem acompanhar pedidos e comunicações realizados na plataforma.',
						]} />
						<p>
							A Kuvangana atua como intermediário de transações. Os produtos, preços, descrições e condições
							de venda são da responsabilidade de cada loja. A Kuvangana não é, salvo indicação em contrário,
							a vendedora ou a compradora dos produtos anunciados.
						</p>
					</Section>

					<Section title="3. Contas de utilizador">
						<SectionList items={[
							'É necessário criar uma conta para comprar e vender. Os dados fornecidos devem ser verdadeiros, completos e atualizados.',
							'Só podem utilizar a plataforma pessoas com mais de 18 anos ou menores devidamente autorizados por um adulto responsável.',
							'O utilizador é responsável pela confidencialidade das suas credenciais e por todas as atividades realizadas na sua conta.',
							'É proibido criar contas falsas, falsificar a identidade ou utilizar contas de terceiros sem autorização.',
							'A Kuvangana pode suspender ou encerrar contas que violem estes Termos.',
						]} />
					</Section>

					<Section title="4. Compradores">
						<SectionList items={[
							'As compras são vinculativas após a confirmação do pedido e, quando exigido, após o envio do comprovativo de pagamento.',
							'O comprador deve fornecer dados de contacto e endereço de entrega corretos para permitir o acompanhamento do pedido.',
							'O comprador é responsável por verificar a disponibilidade, prazo e condições de entrega antes de confirmar o pedido.',
							'São proibidas compras fraudulentas, o uso de meios de pagamento de terceiros sem autorização e a recusa injustificada de recebimento dos produtos encomendados.',
						]} />
					</Section>

					<Section title="5. Vendedores e lojas">
						<SectionList items={[
							'A abertura de loja está sujeita à verificação e aprovação pela Kuvangana.',
							'Os vendedores são responsáveis pela veracidade das informações, imagens, preços e stock dos produtos publicados.',
							'Produtos proibidos ou ilegítimos (ver secção 6) são removidos e podem implicar suspensão da loja.',
							'As vendas realizadas na plataforma estão sujeitas a uma taxa da plataforma (comissão), sendo aplicada uma percentagem de retenção sobre o valor de cada venda conforme configurado administrativamente.',
							'Os valores devidos aos vendedores são pagos após o período de retenção definido (dias de payout) e de acordo com as regras em vigor na plataforma.',
							'A Kuvangana pode reter pagamentos em caso de suspeita de fraude ou violação destes Termos, até à esclarecimento da situação.',
						]} />
					</Section>

					<Section title="6. Produtos e condutas proibidas">
						<p>
							É proibido publicar, comprar ou vender na plataforma:
						</p>
						<SectionList items={[
							'produtos ilegais, contrafações ou que violem direitos de propriedade intelectual de terceiros;',
							'armas, munições, explosivos ou substâncias perigosas;',
							'drogas ilícitas, medicamentos sem autorização ou substâncias controladas;',
							'conteúdo ofensivo, discriminatório ou que incite ao ódio;',
							'serviços ou produtos que visem burlar ou enganar outros utilizadores.',
						]} />
						<p>
							É igualmente proibido usar a plataforma para assédio, spam, fraude, recolha não autorizada de
							dados de outros utilizadores ou qualquer atividade que comprometa o funcionamento e a segurança
							da plataforma.
						</p>
					</Section>

					<Section title="7. Pedidos, pagamentos e entregas">
						<SectionList items={[
							'O pagamento dos pedidos pode ser efetuado por Multicaixa Express ou transferência bancária, conforme as coordenadas indicadas no checkout.',
							'Após a confirmação do pagamento, o comprador pode enviar o comprovativo na plataforma para validação.',
							'A entrega pode ser feita por correio/transportadora com entrega ao endereço indicado ou por recolha na sede, conforme a opção selecionada.',
							'Os prazos e custos de entrega dependem da zona de entrega selecionada e das condições de cada loja.',
							'A Kuvangana notificará o comprador sobre o estado do pedido através da plataforma.',
						]} />
					</Section>

					<Section title="8. Devoluções e cancelamentos">
						<SectionList items={[
							'O comprador pode contactar a loja para situações de produto não recebido, danificado ou não conforme o anunciado.',
							'Cancelamentos de pedidos pagos estão sujeitos ao acordo com a loja e às condições de reembolso aplicáveis.',
							'A Kuvangana pode intervir para resolver litígios de compra e venda, decidindo de forma razoável com base nas informações disponíveis.',
						]} />
					</Section>

					<Section title="9. Propriedade intelectual">
						<p>
							As marcas, logótipos, textos, imagens, código e demais conteúdos da plataforma pertencem à
							Kuvangana ou aos respetivos titulares e estão protegidos. É proibida a reprodução, modificação
							ou utilização não autorizada destes conteúdos. Os conteúdos publicados pelas lojas permanecem
							da responsabilidade dos respetivos vendedores.
						</p>
					</Section>

					<Section title="10. Limitação de responsabilidade">
						<SectionList items={[
							'A Kuvangana age com diligência na manutenção da plataforma, mas não pode garantir a indisponibilidade absoluta do serviço, podendo haver interrupções pontuais por manutenção ou causas técnicas alheias.',
							'A plataforma é fornecida "tal como está". A Kuvangana não se responsabiliza por atos dos vendedores ou compradores, nomeadamente a qualidade, entrega ou devolução de produtos negociados entre as partes.',
							'Na medida do permitido pela lei, a responsabilidade da Kuvangana decorrente do uso da plataforma limita-se ao valor da transação em causa ou, sendo aplicável, ao montante das comissões recebidas.',
							'Nada nesta cláusula exclui responsabilidade que não possa ser legalmente limitada ou excluída.',
						]} />
					</Section>

					<Section title="11. Suspensão e rescisão">
						<p>
							A Kuvangana pode suspender ou encerrar contas e lojas, sem prejuízo de direitos legais, quando
							verifique violação destes Termos, indícios de fraude ou uso indevido. O utilizador pode encerrar a
							sua conta quando quiser, devendo cumprir os pedidos em curso. A rescisão não afeta as obrigações
							já assumidas nem o que a lei exigir preservar.
						</p>
					</Section>

					<Section title="12. Lei aplicável">
						<p>
							Estes Termos regem-se pelas leis da República de Angola. As eventuais disputas serão resolvidas,
							preferencialmente por acordo, ou submetidas aos tribunais competentes de Luanda, salvo disposição
							legal imperativa em contrário.
						</p>
					</Section>

					<Section title="13. Alterações aos termos">
						<p>
							Podemos alterar estes Termos periodicamente. A versão em vigor estará sempre disponível nesta
							página. Alterações relevantes serão, sempre que possível, comunicadas atempadamente na plataforma.
							A continuação do uso da plataforma após a alteração implica a aceitação dos termos revistos.
						</p>
					</Section>

					<Section title="14. Contacto">
						<p>
							Para dúvidas sobre estes Termos, contacta-nos:
						</p>
						<p>
							<strong>Kuvangana</strong>
							<br />
							E-mail: <a className="text-accent hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
						</p>
					</Section>
				</div>
			</main>
		</div>
	);
};

export default Termos;