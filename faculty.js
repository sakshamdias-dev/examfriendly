/**
 * Renders a Faculty Card into a target container
 * @param {Object} data - Faculty details
 * @param {string} containerId - The ID of the HTML element to inject into
 */
function renderFacultyCard(data, containerId) {
    const container = document.getElementById(containerId);
    
    const cardHTML = `
    <div class="faculty-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center transition-all hover:border-[#00bfff]/50 group mb-8">
      
      <div class="w-full md:w-1/3 p-6 flex justify-center">
        <div class="relative">
          <div class="absolute -inset-2 bg-gradient-to-tr from-orange-500 to-[#00bfff] rounded-full blur opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
          <img 
            src="${data.image}" 
            alt="${data.name}" 
            class="relative w-48 h-48 md:w-56 md:h-56 object-cover rounded-full border-4 border-[#1a1a1a] shadow-xl"
          />
        </div>
      </div>

      <div class="w-full md:w-2/3 p-8">
        <div class="flex flex-col space-y-4">
          <div>
            <h3 class="text-3xl font-bold text-white mb-1">${data.name}</h3>
            <p class="text-orange-400 font-semibold flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">school</span>
              ${data.qualification}
            </p>
          </div>

          <div class="h-px bg-white/10 w-full"></div>

          <p class="text-gray-300 leading-relaxed italic">
            "${data.bio}"
          </p>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="bg-white/5 p-3 rounded-xl border border-white/5">
              <span class="block text-[#00bfff] text-xl font-bold">${data.experience}</span>
              <span class="text-xs text-gray-400 uppercase tracking-tighter">Experience</span>
            </div>
            <div class="bg-white/5 p-3 rounded-xl border border-white/5">
              <span class="block text-[#00bfff] text-xl font-bold">${data.specialty}</span>
              <span class="text-xs text-gray-400 uppercase tracking-tighter">Specialty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    container.innerHTML += cardHTML;
}