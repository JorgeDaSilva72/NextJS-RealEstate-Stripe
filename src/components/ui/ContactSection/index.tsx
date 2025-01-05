const ContactSection: React.FC = () => (
  <section className="bg-primary text-white py-16">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-6">
        Besoin d&apos;aide pour votre projet immobilier ?
      </h2>
      <p className="text-xl mb-8 leading-relaxed">
        Nos conseillers sont là pour vous accompagner dans votre recherche
      </p>
      <button
        className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
        aria-label="Contactez-nous"
      >
        Contactez-nous
      </button>
    </div>
  </section>
);

export default ContactSection;
