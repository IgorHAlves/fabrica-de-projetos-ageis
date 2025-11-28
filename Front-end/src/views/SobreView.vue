<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-extrabold mb-4">Sobre Nós</h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto">
          Conheça a equipe por trás deste projeto de e-commerce
        </p>
      </div>
    </section>

    <!-- Equipe -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Nossa Equipe</h2>
          <p class="text-gray-600 text-lg">Desenvolvedores dedicados em criar soluções incríveis</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Luiz Henrique -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <img 
              src="@/assets/img/luiz.jpg" 
              alt="Luiz Henrique"
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-yellow-400" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">Luiz Henrique</h3>
            <p class="text-gray-600 mb-4">Front-End Developer</p>
            <div class="flex justify-center gap-3">
              <a href="https://github.com/lorocks51987" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-900 transition-all duration-300 group">
                <i class="fa-brands fa-github text-gray-600 group-hover:text-white transition-colors"></i>
              </a>
            </div>
          </div>

          <!-- Igor Henrique -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <img 
              src="@/assets/img/Igor.jpg" 
              alt="Igor Henrique"
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-400" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">Igor Henrique</h3>
            <p class="text-gray-600 mb-4">Full-Stack Developer</p>
            <div class="flex justify-center gap-3">
              <a href="https://github.com/IgorHAlves" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-900 transition-all duration-300 group">
                <i class="fa-brands fa-github text-gray-600 group-hover:text-white transition-colors"></i>
              </a>
            </div>
          </div>

          <!-- César Augusto -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <img 
              src="@/assets/img/cesar.jpg" 
              alt="César Augusto"
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-400" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">César Augusto</h3>
            <p class="text-gray-600 mb-4">Front-End Developer</p>
            <div class="flex justify-center gap-3">
              <a href="https://github.com/CesarAg05" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-900 transition-all duration-300 group">
                <i class="fa-brands fa-github text-gray-600 group-hover:text-white transition-colors"></i>
              </a>
            </div>
          </div>

          <!-- Rafael -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <img 
              src="@/assets/img/Rafa.jpg" 
              alt="Rafael"
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-red-400" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">Rafael</h3>
            <p class="text-gray-600 mb-4">Back-End Developer</p>
            <div class="flex justify-center gap-3">
              <a href="https://github.com/Rtwosantoss" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-900 transition-all duration-300 group">
                <i class="fa-brands fa-github text-gray-600 group-hover:text-white transition-colors"></i>
              </a>
            </div>
          </div>

          <!-- André Luiz -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <img 
              src="@/assets/img/André.png" 
              alt="André Luiz"
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-purple-400" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">André Luiz</h3>
            <p class="text-gray-600 mb-4">Back-End Developer</p>
            <div class="flex justify-center gap-3">
              <a href="https://github.com/oandrecarvalho" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-900 transition-all duration-300 group">
                <i class="fa-brands fa-github text-gray-600 group-hover:text-white transition-colors"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sobre o Projeto -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Sobre o Projeto</h2>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
          <p class="text-gray-700 text-lg leading-relaxed mb-4">
            Este projeto é um sistema completo de e-commerce desenvolvido como parte do curso da UNIMAR.
            Utilizamos as mais modernas tecnologias para criar uma experiência de compra única.
          </p>
          <p class="text-gray-700 text-lg leading-relaxed">
            Nossa missão é proporcionar uma plataforma intuitiva, segura e eficiente para que nossos clientes
            possam encontrar e adquirir os melhores produtos com facilidade.
          </p>
        </div>
      </div>
    </section>

    <!-- Tecnologias -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Tecnologias Utilizadas</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <i class="fa-brands fa-vuejs text-5xl text-green-500 mb-3"></i>
            <p class="font-semibold text-gray-900">Vue.js</p>
            <p class="text-xs text-gray-500 mt-1">Frontend</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <i class="fa-brands fa-microsoft text-5xl text-blue-600 mb-3"></i>
            <p class="font-semibold text-gray-900">C# .NET</p>
            <p class="text-xs text-gray-500 mt-1">Backend</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <i class="fa-solid fa-database text-5xl text-orange-500 mb-3"></i>
            <p class="font-semibold text-gray-900">SQL Server</p>
            <p class="text-xs text-gray-500 mt-1">Database</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <i class="fa-solid fa-shield-halved text-5xl text-red-600 mb-3"></i>
            <p class="font-semibold text-gray-900">Keycloak</p>
            <p class="text-xs text-gray-500 mt-1">Auth</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <i class="fa-brands fa-css3-alt text-5xl text-cyan-500 mb-3"></i>
            <p class="font-semibold text-gray-900">Tailwind CSS</p>
            <p class="text-xs text-gray-500 mt-1">Styling</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Página Sobre - Apresentação da equipe e projeto
</script>