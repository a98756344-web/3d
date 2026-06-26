// Obiect de Stare Globală (Toate variabilele aplicației sunt mapate aici)
const engineState = {
    bgOpacity: 20,
    blur: 16,
    radius: 32,
    lightX: 0,
    lightY: 15,
    shadowBlur: 30,
    currentTab: 'css', // css sau tw
    environment: 'grid',
    isAnimated: false
};

// Elemente UI active
const glassObject = document.getElementById('ultimate-glass-object');
const viewport = document.getElementById('preview-viewport');
const codeBox = document.getElementById('code-box');

// Inputs
const sliders = {
    bgOpacity: document.getElementById('input-bg-opacity'),
    blur: document.getElementById('input-blur'),
    radius: document.getElementById('input-radius'),
    lightX: document.getElementById('input-light-x'),
    lightY: document.getElementById('input-light-y'),
    shadowBlur: document.getElementById('input-shadow-blur')
};

// Label-uri Valori
const labels = {
    bgOpacity: document.getElementById('val-bg-opacity'),
    blur: document.getElementById('val-blur'),
    radius: document.getElementById('val-radius'),
    lightX: document.getElementById('val-light-x'),
    lightY: document.getElementById('val-light-y'),
    shadowBlur: document.getElementById('val-shadow-blur')
};

// Actualizează tot ecosistemul vizual bazat pe setările curente
function renderEngine() {
    // 1. Colectăm valorile din inputs
    engineState.bgOpacity = sliders.bgOpacity.value;
    engineState.blur = sliders.blur.value;
    engineState.radius = sliders.radius.value;
    engineState.lightX = sliders.lightX.value;
    engineState.lightY = sliders.lightY.value;
    engineState.shadowBlur = sliders.shadowBlur.value;

    // 2. Sincronizăm textele cu valorile reale
    labels.bgOpacity.innerText = `${engineState.bgOpacity}%`;
    labels.blur.innerText = `${engineState.blur}px`;
    labels.radius.innerText = `${engineState.radius}px`;
    labels.lightX.innerText = `${engineState.lightX}px`;
    labels.lightY.innerText = `${engineState.lightY}px`;
    labels.shadowBlur.innerText = `${engineState.shadowBlur}px`;

    // 3. Calculăm și aplicăm proprietățile CSS pe elementul de sticlă
    const bgString = `rgba(255, 255, 255, ${engineState.bgOpacity / 100})`;
    const blurString = `blur(${engineState.blur}px)`;
    const radiusString = `${engineState.radius}px`;
    const shadowString = `${engineState.lightX}px ${engineState.lightY}px ${engineState.shadowBlur}px rgba(0, 0, 0, 0.55)`;
    const borderString = `1px solid rgba(255, 255, 255, 0.12)`;

    glassObject.style.background = bgString;
    glassObject.style.backdropFilter = blurString;
    glassObject.style.webkitBackdropFilter = blurString;
    glassObject.style.borderRadius = radiusString;
    glassObject.style.boxShadow = shadowString;
    glassObject.style.border = borderString;

    // 4. Generăm output-ul de cod în funcție de tab-ul selectat
    if (engineState.currentTab === 'css') {
        codeBox.innerText = `background: ${bgString};\nbackdrop-filter: ${blurString};\nborder-radius: ${radiusString};\nbox-shadow: ${shadowString};\nborder: ${borderString};`;
    } else {
        // Generare echivalentă de clase Tailwind CSS
        codeBox.innerText = `bg-white/[${engineState.bgOpacity / 100}] backdrop-blur-[${engineState.blur}px] rounded-[${radiusString}] border border-white/12 shadow-[${engineState.lightX}px_${engineState.lightY}px_${engineState.shadowBlur}px_rgba(0,0,0,0.55)]`;
    }
}

// Schimbarea mediului/fundalului din spatele sticlei
function changeEnvironment(env) {
    engineState.environment = env;
    viewport.className = 'preview-viewport flex-grow min-h-[260px] lg:min-h-[380px] flex items-center justify-center relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.8)]';
    viewport.classList.add(`env-${env}`);
    
    // Resetăm și activăm bulina corectă
    document.querySelectorAll('.env-dot').forEach(dot => dot.classList.remove('active'));
    event.target.classList.add('active');
}

// Tab switcher între CSS curat și Clase Tailwind
function switchTab(tab) {
    engineState.currentTab = tab;
    document.getElementById('tab-css').className = tab === 'css' ? 'text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-amber-400' : 'text-[10px] font-bold px-2 py-0.5 rounded text-gray-500';
    document.getElementById('tab-tw').className = tab === 'tw' ? 'text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-amber-400' : 'text-[10px] font-bold px-2 py-0.5 rounded text-gray-500';
    renderEngine();
}

// Activare / Dezactivare Mod de Animare Live (Plutire 3D)
document.getElementById('toggle-animation').addEventListener('change', (e) => {
    if (e.target.checked) {
        glassObject.classList.add('floating-animation');
    } else {
        glassObject.classList.remove('floating-animation');
    }
});

// Sistemul Inteligent de Presetări Rapide
function loadPreset(type) {
    document.querySelectorAll('.btn-preset').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (type === 'glass') {
        sliders.bgOpacity.value = 20; sliders.blur.value = 16; sliders.radius = 32;
        sliders.lightX.value = 0; sliders.lightY.value = 15; sliders.shadowBlur.value = 30;
        changeEnvironment('grid');
    } else if (type === 'cyber') {
        sliders.bgOpacity.value = 8; sliders.blur.value = 25; sliders.radius = 16;
        sliders.lightX.value = -10; sliders.lightY.value = 20; sliders.shadowBlur.value = 40;
        changeEnvironment('neon');
    } else if (type === 'obsidian') {
        sliders.bgOpacity.value = 45; sliders.blur.value = 8; sliders.radius = 48;
        sliders.lightX.value = 15; sliders.lightY.value = 15; sliders.shadowBlur.value = 25;
        changeEnvironment('plasma');
    }
    renderEngine();
}

// Copiere inteligentă în clipboard cu animație pe buton
function copyCompiledCode() {
    navigator.clipboard.writeText(codeBox.innerText);
    const btnSpan = document.querySelector('.btn-primary span');
    btnSpan.innerText = "Specificații Copiate! ✓";
    setTimeout(() => btnSpan.innerText = "Copiază Specificațiile", 1800);
}

// Atașăm ascultători de evenimente pe toate sliderele
Object.values(sliders).forEach(slider => slider.addEventListener('input', renderEngine));

// Pornire inițială a motorului de randare
changeEnvironment('grid');
renderEngine();
