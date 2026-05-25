import React from 'react';

const StorySection = () => {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-24 md:py-32">
      <div className="max-w-3xl mx-auto text-center opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
        <span className="inline-block text-accent font-display text-sm tracking-widest uppercase mb-4">
          — Nossa História
        </span>
        <h2 className="font-display text-3xl md:text-5xl text-[#1C1917] leading-[1.15] mb-8">
          Nasceu uma pequena startup<br />
          <span className="text-accent">com grandes sonhos</span>
        </h2>
        <div className="w-16 h-1 bg-accent/30 mx-auto mb-8 rounded-full" />
        <p className="font-body text-lg md:text-xl text-[#78716C] leading-relaxed">
          Fundada com a visão de simplificar o comércio eletrónico, a Double E começou como uma pequena startup com grandes sonhos.
          Hoje, somos referência em qualidade e atendimento, conectando milhares de clientes a produtos que fazem a diferença nas suas vidas.
          Acreditamos que comprar online deve ser uma experiência prazerosa, segura e transparente.
        </p>
      </div>
    </section>
  );
};

export default StorySection;
