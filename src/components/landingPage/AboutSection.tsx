const AboutSection = () => {
    return (
        <section id="about" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Sobre Nosotros
                    </h2>
                    <p className="text-lg text-gray-600">
                        Más de 20 años brindando servicios de salud de calidad a nuestra comunidad
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
                        <img
                            src="/images/about_img.jpg"
                            width={500}
                            alt="Imagen 1"
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
                        <img
                            width={500}
                            src="/images/blur-hospital.jpg"
                            alt="Imagen 2"
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
                        <img
                            width={500}
                            src="/images/doctores.jpg"
                            alt="Imagen 3"
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                Nuestra Misión
                            </h3>
                            <p className="text-gray-600">
                                Nos dedicamos a proporcionar atención médica de la más alta calidad,
                                combinando la experiencia de nuestros profesionales con la tecnología
                                más avanzada para el bienestar de nuestros pacientes.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                Nuestra Visión
                            </h3>
                            <p className="text-gray-600">
                                Ser reconocidos como el hospital líder en innovación y excelencia médica,
                                estableciendo nuevos estándares en el cuidado de la salud y la satisfacción
                                del paciente.
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-blue-600">20+</p>
                            <p className="text-gray-600">Años de Experiencia</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-blue-600">50+</p>
                            <p className="text-gray-600">Especialistas</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-blue-600">10k+</p>
                            <p className="text-gray-600">Pacientes Atendidos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-blue-600">24/7</p>
                            <p className="text-gray-600">Atención Disponible</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection