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

const Privacidade = () => {
	useDocumentTitle('Política de Privacidade - Kuvangana');

	return (
		<div className="min-h-screen bg-sand flex flex-col">
			<Header />
			<main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 md:py-16">
				<div className="bg-white rounded-2xl shadow-md p-6 md:p-10">
					<div className="mb-10">
						<h1 className="font-display text-3xl md:text-4xl text-[#1C1917] mb-2">Política de Privacidade</h1>
						<p className="text-sm text-[#78716C] font-body">Última atualização: 11 de setembro de 2026</p>
					</div>

					<Section title="1. Introdução">
						<p>
							A Kuvangana ("nós", "nosso" ou "plataforma") é um marketplace angolano que liga compradores
							e vendedores. Esta Política de Privacidade explica como recolhemos, utilizamos, partilhamos e
							protegemos os dados pessoais dos utilizadores (compradores e vendedores) da nossa plataforma,
							bem como os direitos que assistem a cada titular.
						</p>
						Ao criar uma conta, comprar, vender ou utilizar qualquer serviço da Kuvangana, confirmas que leste
						e compreendeste esta política.
					</Section>

					<Section title="2. Controlador de dados e contacto">
						<p>O responsável pelo tratamento dos dados pessoais recolhidos na plataforma é:</p>
						<p>
							<strong>Kuvangana</strong>
							<br />
							E-mail: <a className="text-accent hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
						</p>
						<p>
							Para qualquer questão sobre esta política ou sobre os teus dados, contacta-nos através do e-mail acima.
						</p>
					</Section>

					<Section title="3. Dados que recolhemos">
						<p>Podemos recolher as seguintes categorias de dados pessoais:</p>
						<SectionList items={[
							'Dados de conta: nome, apelido, endereço de e-mail, número de telefone e senha (guardada de forma encriptada);',
							'Dados adicionais de perfil quando fornecidos: morada, NIF/BI e dados da conta de loja;',
							'Dados de compra e navegação: produtos no carrinho, favoritos, histórico de pedidos, endereços de entrega e zona de entrega selecionada;',
							'Dados de pagamento: comprovativos de pagamento enviados pelo utilizador (o processamento do pagamento é feito através de prestadores externos, como Multicaixa Express ou transferência bancária, fora da nossa plataforma);',
							'Dados de vendedor: informações da loja, número Multicaixa, dados bancários (IBAN), valores de vendas, comissões e pagamentos efetuados;',
							'Dados de autenticação com Google: quando utilizas o login social, recebemos o nome e o e-mail da tua conta Google;',
							'Dados técnicos: endereço IP, tipo de dispositivo e navegador, utilizados apenas para segurança e funcionamento do serviço.',
						]} />
					</Section>

					<Section title="4. Como e com que finalidade utilizamos os dados">
						<SectionList items={[
							'Criar, gerir e autenticar contas de compradores e vendedores;',
							'Processar pedidos, pagamentos e entregas, incluindo o contacto para acompanhamento da entrega;',
							'Gerir o carrinho, favoritos e histórico de compras dos utilizadores;',
							'Calcular e processar comissões e pagamentos aos vendedores;',
							'Prestar apoio ao cliente e responder a pedidos, reclamações e dúvidas;',
							'Enviar comunicações essenciais ao serviço (estado de pedidos, pagamentos e notificações de segurança), que não podem ser dispensadas;',
							'Prevenir fraude, uso indevido e proteger a segurança da plataforma;',
							'Cumprir obrigações legais e fiscais aplicáveis;',
							'Melhorar o funcionamento da plataforma, a qualidade do serviço e a experiência dos utilizadores.',
						]} />
						<p>
							Não utilizamos os teus dados para fins publicitários não solicitados (`spam`). Quaisquer
							comunicações promocionais, a existirem no futuro, exigirão o teu consentimento prévio.
						</p>
					</Section>

					<Section title="5. Base legal do tratamento">
						<p>O tratamento dos teus dados assenta nas seguintes bases:</p>
						<SectionList items={[
							'Consentimento: quando crias conta ou forneces dados voluntariamente;',
							'Execução do contrato: para processar pedidos, pagamentos e entregas;',
							'Interesse legítimo: para segurança, prevenção de fraude e melhoria do serviço;',
							'Cumprimento de obrigação legal: nomeadamente obrigações fiscais e de conservação de registos comerciais.',
						]} />
					</Section>

					<Section title="6. Partilha de dados">
						<p>
							Não vendemos, alugamos nem partilhamos dados pessoais com terceiros para fins de marketing.
							Podemos partilhar dados apenas nas seguintes circunstâncias:
						</p>
						<SectionList items={[
							'Prestadores de serviços: entidades que nos apoiam na operação, como serviços de entrega, armazenamento de ficheiros (ex.: Cloudinary para comprovativos e imagens) e processamento de pagamentos;',
							'Google: quando utilizas o login social via Google OAuth;',
							'Autoridades: quando exigido por lei, ordem judicial ou autoridade competente;',
							'Em caso de operações societárias (fusão, aquisição ou venda), os dados poderão ser transferidos no âmbito dessa operação, mantendo esta política aplicável.',
						]} />
						<p>
							Os dados partilhados com prestadores ficam limitados ao necessário para a prestação do serviço
							em causa e sujeitos a obrigações de confidencialidade e segurança.
						</p>
					</Section>

					<Section title="7. Conservação dos dados">
						<p>
							Mantemos os teus dados apenas pelo tempo necessário às finalidades descritas nesta política e
							para cumprimento das obrigações legais aplicáveis. Sempre que a conta for encerrada, os dados
							que deixarem de ser necessários serão eliminados ou anonimizados, salvaguardando os registos
							que a lei exige conservar (ex.: registos fiscais e comerciais).
						</p>
					</Section>

					<Section title="8. Segurança">
						<SectionList items={[
							'Acesso à plataforma protegido por HTTPS (comunicação encriptada);',
							'Senhas guardadas de forma encriptada e nunca armazenadas em texto simples;',
							'Acesso restrito aos dados aos colaboradores e prestadores autorizados;',
							'Medidas administrativas e técnicas adequadas à proteção contra acesso não autorizado, perda ou alteração de dados.',
						]} />
					</Section>

					<Section title="9. Cookies e tecnologias semelhantes">
						<p>
							A plataforma utiliza cookies e armazenamento local para manter a sessão iniciada e recordar o
							conteúdo do carrinho e preferências da utilização. Não utilizamos, neste momento, cookies de
							terceiros para rastreio publicitário. Se instalarmos ferramentas de análise ou publicidade no
							futuro, esta secção será atualizada e, quando exigido, será pedido o teu consentimento.
						</p>
					</Section>

					<Section title="10. Direitos dos titulares">
						<p>Nos termos da legislação aplicável, tens os seguintes direitos sobre os teus dados:</p>
						<SectionList items={[
							'Acesso: pedir uma cópia dos dados pessoais que tratamos sobre ti;',
							'Correção: pedir a retificação de dados incorretos ou incompletos;',
							'Eliminação: pedir a eliminação dos dados quando já não forem necessários;',
							'Portabilidade: pedir a transferência dos teus dados para outro prestador;',
							'Restrição e oposição: limitar ou opor-te a determinados tratamentos;',
							'Revogação de consentimento: retirar o consentimento quando o tratamento nele se basear;',
							'Reclamação: apresentar reclamação junto da autoridade de proteção de dados competente.',
						]} />
						<p>
							Para exercer qualquer um destes direitos, contacta-nos por e-mail ({CONTACT_EMAIL}). Responderemos
							no prazo legal aplicável (normalmente até 30 dias).
						</p>
					</Section>

					<Section title="11. Menores">
						<p>
							A plataforma destina-se a utilizadores com mais de 18 anos. Não recolhemos intencionalmente
							dados de menores de idade. Se tivermos conhecimento de que um menor nos forneceu dados, estes
							serão eliminados logo que possível.
						</p>
					</Section>

					<Section title="12. Alterações a esta política">
						<p>
							Podemos atualizar esta política periodicamente. Sempre que existirem alterações relevantes,
							atualizaremos a data no topo da página e, quando necessário, notificaremos os utilizadores
							através da plataforma. O uso continuado da plataforma após a alteração implica a aceitação
							dos termos revistos.
						</p>
					</Section>

					<Section title="13. Contacto">
						<p>
							Para qualquer questão relativa à tua privacidade ou aos teus dados pessoais, contacta-nos:
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

export default Privacidade;