// Formulario de Tratamiento de Datos - JavaScript
// Diseño Gamer con Bootstrap

// Variables globales
let formData = {};
let currentStep = 'consent';

// Datos de planes con precios
const planes = {
    TRIO: [
        { id: 'trio1', name: 'INTERNET FIBRA 900MG TV DIGITAL TV APP 74 CANALES', price: 92393 },
        { id: 'trio2', name: 'INTERNET FIBRA 900MG TV DIGITAL TV APP 74 CANALES + DISNEY PLUS', price: 100093 },
        { id: 'trio3', name: 'INTERNET 900MG TV DIGITAL TV APP + WIN FUTBOL', price: 102893 },
        { id: 'trio4', name: 'INTERNET 900MG TV DIGITAL TV APP + NETFLIX', price: 111293, requiresEstrato6: true }
    ],
    DUOS: [
        { id: 'duos1', name: 'INTERNET FIBRA 900MG TV DIGITAL TV APP 9 CANALES', price: 65093 },
        { id: 'duos2', name: 'INTERNET FIBRA 900MG TV DIGITAL TV APP 9 CANALES + DISNEY PLUS', price: 72793 },
        { id: 'duos3', name: 'INTERNET FIBRA 900MG TV DIGITAL TV APP 9 CANALES + WIN FUTBOL', price: 74193 }
    ],
    NAKED: [
        { id: 'naked1', name: 'INTERNET FIBRA 900MG TV DIGITAL TV APP 9 CANALES', price: 62993 },
        { id: 'naked2', name: 'INTERNET FIBRA 900MG TV DIGITAL TV APP 9 CANALES + DISNEY PLUS', price: 70693 },
        { id: 'naked3', name: 'INTERNET FIBRA 900MG TV DIGITAL TV APP 9 CANALES + WIN FUTBOL', price: 72093 }
    ],
    EXCLUSIVA: [
        { id: 'exclusiva1', name: 'INTERNET FIBRA 900MG + PSTPAGO ILIMITADO + WIN FUTBOL + PERPLEXITY PRO * 12 MESES + TV DIGITAL TV APP 9 CANALES', price: 89990 },
        { id: 'exclusiva2', name: 'INTERNET FIBRA 900MG + PSTPAGO ILIMITADO + DISNEY PLUS + PERPLEXITY PRO * 12 MESES + TV DIGITAL TV APP 9 CANALES', price: 89990 }
    ]
};

// Ciudades de Colombia
const ciudadesColombia = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué',
    'Pasto', 'Manizales', 'Neiva', 'Villavicencio', 'Armenia', 'Valledupar', 'Montería', 'Sincelejo', 'Popayán', 'Tunja',
    'Florencia', 'Riohacha', 'Yopal', 'Quibdó', 'Mocoa', 'San Andrés', 'Leticia', 'Inírida', 'Puerto Carreño', 'Mitú',
    'Arauca', 'Maicao', 'Turbo', 'Apartadó', 'Bello', 'Itagüí', 'Envigado', 'Palmira', 'Buenaventura', 'Tulua',
    'Soacha', 'Soledad', 'Floridablanca', 'Dosquebradas', 'Girardot', 'Barrancas', 'Malambo', 'Rionegro', 'Zipaquirá',
    'Facatativá', 'Chía', 'Fusagasugá', 'Mosquera', 'Madrid', 'Funza', 'Cajicá', 'Sopó', 'La Calera', 'Tocancipá'
];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    populateSelects();
});

// Inicializar la aplicación
function initializeApp() {
    showScreen('consent');
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de consentimiento
    document.getElementById('acceptBtn').addEventListener('click', handleConsentAccept);
    document.getElementById('rejectBtn').addEventListener('click', handleConsentReject);
    
    // Formulario
    document.getElementById('registrationForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancelBtn').addEventListener('click', handleCancel);
    
    // Botones de resumen
    document.getElementById('confirmBtn').addEventListener('click', handleConfirm);
    document.getElementById('correctBtn').addEventListener('click', handleCorrect);
    
    // Modal de cancelación
    document.getElementById('confirmCancelBtn').addEventListener('click', handleCancelConfirm);
    
    // Cambios en estrato y plan
    document.getElementById('estrato').addEventListener('change', updatePlanOptions);
    document.getElementById('plan').addEventListener('change', updatePlanPrice);
}

// Poblar selects con opciones
function populateSelects() {
    // Poblar ciudades
    const ciudadSelect = document.getElementById('ciudadMunicipio');
    ciudadesColombia.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad;
        option.textContent = ciudad;
        ciudadSelect.appendChild(option);
    });
    
    // Poblar planes inicialmente
    updatePlanOptions();
}

// Mostrar pantalla específica
function showScreen(screenName) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen-container').forEach(screen => {
        screen.classList.add('d-none');
    });
    
    // Mostrar la pantalla solicitada
    document.getElementById(screenName + 'Screen').classList.remove('d-none');
    currentStep = screenName;
}

// Manejar aceptación de consentimiento
function handleConsentAccept() {
    showScreen('form');
}

// Manejar rechazo de consentimiento
function handleConsentReject() {
    const modal = new bootstrap.Modal(document.getElementById('rejectModal'));
    modal.show();
}

// Manejar envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        collectFormData();
        generateSummary();
        showScreen('summary');
    }
}

// Validar formulario
function validateForm() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    let firstError = null;
    
    // Limpiar validaciones anteriores
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });
    
    // Validar nombre completo (debe tener al menos nombre y apellido)
    const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
    const nombreParts = nombreCompleto.split(' ').filter(part => part.length > 0);
    
    if (nombreParts.length < 2) {
        showValidationError('El nombre completo debe incluir nombre y apellido');
        document.getElementById('nombreCompleto').classList.add('is-invalid');
        return false;
    }
    
    // Validar campos requeridos
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
            if (!firstError) {
                firstError = getFieldLabel(input.id) + ' es requerido';
            }
        } else {
            input.classList.add('is-valid');
        }
    });
    
    if (!isValid) {
        showValidationError(firstError);
        return false;
    }
    
    // Validar formato de email
    const email = document.getElementById('correoElectronico').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showValidationError('El formato del correo electrónico no es válido');
        document.getElementById('correoElectronico').classList.add('is-invalid');
        return false;
    }
    
    // Validar fechas
    const today = new Date();
    const fechaNacimiento = new Date(document.getElementById('fechaNacimiento').value);
    const fechaExpedicion = new Date(document.getElementById('fechaExpedicion').value);
    
    if (fechaNacimiento >= today) {
        showValidationError('La fecha de nacimiento debe ser anterior a hoy');
        document.getElementById('fechaNacimiento').classList.add('is-invalid');
        return false;
    }
    
    if (fechaExpedicion >= today) {
        showValidationError('La fecha de expedición debe ser anterior a hoy');
        document.getElementById('fechaExpedicion').classList.add('is-invalid');
        return false;
    }
    
    return true;
}

// Obtener etiqueta del campo
function getFieldLabel(fieldId) {
    const labels = {
        'nombreCompleto': 'Nombre Completo',
        'tipoDocumento': 'Tipo de Documento',
        'numeroDocumento': 'Número de Documento',
        'fechaExpedicion': 'Fecha de Expedición',
        'fechaNacimiento': 'Fecha de Nacimiento',
        'correoElectronico': 'Correo Electrónico',
        'direccionCompleta': 'Dirección Completa',
        'ciudadMunicipio': 'Ciudad o Municipio',
        'barrio': 'Barrio',
        'estrato': 'Estrato',
        'celular': 'Celular',
        'plan': 'Plan'
    };
    return labels[fieldId] || fieldId;
}

// Mostrar error de validación
function showValidationError(message) {
    document.getElementById('validationMessage').textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('validationModal'));
    modal.show();
}

// Recopilar datos del formulario
function collectFormData() {
    const form = document.getElementById('registrationForm');
    const formElements = form.elements;
    
    formData = {};
    for (let element of formElements) {
        if (element.name || element.id) {
            const key = element.name || element.id;
            formData[key] = element.value;
        }
    }
}

// Actualizar opciones de planes según el estrato
function updatePlanOptions() {
    const estrato = document.getElementById('estrato').value;
    const planSelect = document.getElementById('plan');
    
    // Limpiar opciones existentes
    planSelect.innerHTML = '<option value="">Seleccione un plan</option>';
    
    // Agregar planes por categoría
    Object.keys(planes).forEach(categoria => {
        planes[categoria].forEach(plan => {
            // Verificar si el plan requiere estrato 6
            if (plan.requiresEstrato6 && estrato !== '6') {
                return; // Saltar este plan
            }
            
            const option = document.createElement('option');
            option.value = plan.id;
            option.textContent = `${categoria} - ${plan.name} - $${plan.price.toLocaleString('es-CO')}`;
            
            if (plan.requiresEstrato6 && estrato !== '6') {
                option.disabled = true;
                option.textContent += ' (Solo Estrato 6)';
            }
            
            planSelect.appendChild(option);
        });
    });
    
    // Actualizar precio si hay un plan seleccionado
    updatePlanPrice();
}

// Actualizar precio del plan
function updatePlanPrice() {
    const planId = document.getElementById('plan').value;
    const valorPlanInput = document.getElementById('valorPlan');
    
    if (!planId) {
        valorPlanInput.value = '';
        return;
    }
    
    // Buscar el plan en todas las categorías
    let selectedPlan = null;
    Object.keys(planes).forEach(categoria => {
        const plan = planes[categoria].find(p => p.id === planId);
        if (plan) {
            selectedPlan = plan;
        }
    });
    
    if (selectedPlan) {
        const estrato = document.getElementById('estrato').value;
        
        if (selectedPlan.requiresEstrato6 && estrato !== '6') {
            valorPlanInput.value = 'No disponible para este estrato';
        } else {
            valorPlanInput.value = `$${selectedPlan.price.toLocaleString('es-CO')}`;
        }
    }
}

// Generar resumen de datos
function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    
    // Obtener nombre del plan seleccionado
    let planName = formData.plan;
    Object.keys(planes).forEach(categoria => {
        const plan = planes[categoria].find(p => p.id === formData.plan);
        if (plan) {
            planName = `${categoria} - ${plan.name}`;
        }
    });
    
    summaryContent.innerHTML = `
        <div class="col-md-6">
            <div class="summary-card glass-effect neon-border animate-pulse-border">
                <h5 class="neon-text">🎮 Datos Personales</h5>
                <p><span class="text-purple">👤 Nombre:</span> ${formData.nombreCompleto}</p>
                <p><span class="text-purple">📄 Documento:</span> ${formData.tipoDocumento} ${formData.numeroDocumento}</p>
                <p><span class="text-purple">📅 Expedición:</span> ${formData.fechaExpedicion}</p>
                <p><span class="text-purple">🎂 Nacimiento:</span> ${formData.fechaNacimiento}</p>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="summary-card glass-effect neon-border animate-pulse-border">
                <h5 class="neon-text">📞 Contacto</h5>
                <p><span class="text-purple">📧 Email:</span> ${formData.correoElectronico}</p>
                <p><span class="text-purple">📱 Celular:</span> ${formData.celular}</p>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="summary-card glass-effect neon-border animate-pulse-border">
                <h5 class="neon-text">🏠 Ubicación</h5>
                <p><span class="text-purple">🏘️ Dirección:</span> ${formData.direccionCompleta}</p>
                <p><span class="text-purple">🌆 Ciudad:</span> ${formData.ciudadMunicipio}</p>
                <p><span class="text-purple">🏘️ Barrio:</span> ${formData.barrio}</p>
                <p><span class="text-purple">🏢 Estrato:</span> ${formData.estrato}</p>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="summary-card glass-effect neon-border animate-pulse-border">
                <h5 class="neon-text">📦 Plan Seleccionado</h5>
                <p><span class="text-purple">🎯 Plan:</span> ${planName}</p>
                <p><span class="text-purple">💰 Valor:</span> ${formData.valorPlan}</p>
            </div>
        </div>
    `;
}

// Manejar confirmación final
function handleConfirm() {
    // Obtener nombre del plan para el mensaje
    let planName = formData.plan;
    Object.keys(planes).forEach(categoria => {
        const plan = planes[categoria].find(p => p.id === formData.plan);
        if (plan) {
            planName = `${categoria} - ${plan.name}`;
        }
    });
    
    const message = `🎮 *NUEVO REGISTRO DE CLIENTE* 🎮

👤 *Datos Personales:*
• Nombre: ${formData.nombreCompleto}
• Documento: ${formData.tipoDocumento} ${formData.numeroDocumento}
• Expedición: ${formData.fechaExpedicion}
• Nacimiento: ${formData.fechaNacimiento}

📧 *Contacto:*
• Email: ${formData.correoElectronico}
• Celular: ${formData.celular}

🏠 *Ubicación:*
• Dirección: ${formData.direccionCompleta}
• Ciudad: ${formData.ciudadMunicipio}
• Barrio: ${formData.barrio}
• Estrato: ${formData.estrato}

📦 *Plan Seleccionado:*
• Plan: ${planName}
• Valor: ${formData.valorPlan}

✅ *Cliente acepta tratamiento de datos personales*`;

    const whatsappUrl = `https://wa.me/573102689105?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Manejar corrección (volver al formulario)
function handleCorrect() {
    showScreen('form');
}

// Manejar cancelación
function handleCancel() {
    const modal = new bootstrap.Modal(document.getElementById('cancelModal'));
    modal.show();
}

// Confirmar cancelación
function handleCancelConfirm() {
    const reason = document.getElementById('cancelReason').value.trim();
    
    if (!reason) {
        alert('Por favor ingrese el motivo de cancelación');
        return;
    }
    
    alert(`Motivo de cancelación registrado: ${reason}`);
    
    // Cerrar modal y limpiar
    const modal = bootstrap.Modal.getInstance(document.getElementById('cancelModal'));
    modal.hide();
    document.getElementById('cancelReason').value = '';
    
    // Opcional: volver al inicio o realizar otra acción
    showScreen('consent');
}

// Funciones de utilidad
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
}

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

// Prevenir envío accidental del formulario
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.type !== 'submit') {
        e.preventDefault();
    }
});

// Animaciones adicionales al cambiar de pantalla
function addScreenTransition(screenName) {
    const screen = document.getElementById(screenName + 'Screen');
    screen.classList.add('fade-in');
    
    setTimeout(() => {
        screen.classList.remove('fade-in');
    }, 500);
}

// Validación en tiempo real
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('gamer-input')) {
        // Remover clases de validación mientras el usuario escribe
        e.target.classList.remove('is-invalid', 'is-valid');
    }
});

// Mejorar accesibilidad
document.addEventListener('keydown', function(e) {
    // Navegación con teclado para modales
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
});

console.log('🎮 Formulario de Tratamiento de Datos - Gamer Style cargado correctamente');
