import React from 'react';

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent to-accent-dark">
      <div className="geo-pattern absolute inset-0 opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="relative max-w-[1200px] mx-auto px-4 py-24 md:py-32 text-center">
        <div className="opacity-0 animate-fade-in-up max-w-3xl mx-auto" style={{ animationFillMode: 'forwards' }}>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
            Pronto para começar?
          </h2>
          <p className="font-body text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto">
            Junte-se a milhares de clientes satisfeitos e descubra as melhores promoções do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/produtos"
              className="inline-flex items-center gap-2 bg-white text-accent px-8 py-4 rounded-full font-display text-base font-bold hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              Ver Produtos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/contato"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 text-white px-8 py-4 rounded-full font-display text-base hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              Entrar em Contacto
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
