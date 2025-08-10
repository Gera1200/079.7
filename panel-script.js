// Variables globales
let currentSection = 'perfil';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let sidebarOpen = false;

// Datos del agente (simulados)
const agentData = {
    nombre: 'María Elena Rodríguez García',
    seudonimo: 'Elena_079',
    id: 'SI-AG-2024-0157',
    nivel: 'Nivel 3 - Especialista',
    turno: 'Matutino',
    horario: '08:00 - 16:00 hrs',
    posicion: 'Cubículo 15 - Piso 3',
    correo: 'elena.rodriguez@gob.mx',
    grupo: 'Servicios Integrales',
    rol: 'Agente'
};

// Datos de asistencia (simulados)
const attendanceData = {
    2025: {
        7: { // Agosto (0-indexed)
            1: 'present', 2: 'present', 3: 'absent', 4: 'present',
            5: 'late', 6: 'present', 7: 'present', 8: 'present',
            9: 'present', 10: 'absent', 11: 'present', 12: 'present',
            13: 'present', 14: 'late', 15: 'present', 16: 'present',
            17: 'present', 18: 'present', 19: 'late', 20: 'present',
            21: 'present', 22: 'present', 23: 'present'
        }
    }
};

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializePanel();
    generateCalendar();
    showWelcomeMessage();
    setupEventListeners();
    setupResponsiveHandlers();
});

// Función de inicialización
function initializePanel() {
    // Mostrar sección por defecto
    showSection('perfil');
    
    // Establecer navegación activa
    updateActiveNavigation('perfil');
    
    // Generar calendario
    generateCalendar();
    
    console.log('Panel de agente inicializado correctamente');
}

// Mostrar mensaje de bienvenida
function showWelcomeMessage() {
    const welcomeElement = document.getElementById('welcomeMessage');
    if (welcomeElement) {
        const firstName = agentData.nombre.split(' ')[0];
        welcomeElement.innerHTML = `Es un placer tenerte de vuelta, <span class="user-name">${firstName}</span>`;
    }
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        showNotification(`¡Bienvenido de vuelta, ${agentData.nombre.split(' ')[0]}!`, 'success');
    }, 1000);
}

// Función para mostrar secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Actualizar navegación
        updateActiveNavigation(sectionId);
        
        // Cerrar sidebar en móvil
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
        
        // Acciones específicas por sección
        handleSectionSpecificActions(sectionId);
    }
}

// Actualizar navegación activa
function updateActiveNavigation(sectionId) {
    // Remover clase activa de todos los elementos
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Encontrar y activar el elemento correspondiente
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(link => {
        const href = link.getAttribute('onclick');
        if (href && href.includes(sectionId)) {
            link.closest('.nav-item').classList.add('active');
        }
    });
    
    // Manejar submenús
    const submenuItems = document.querySelectorAll('.nav-submenu a');
    submenuItems.forEach(link => {
        const href = link.getAttribute('onclick');
        if (href && href.includes(sectionId)) {
            link.closest('.has-submenu').classList.add('active');
            link.closest('.has-submenu').classList.add('open');
        }
    });
}

// Manejar acciones específicas por sección
function handleSectionSpecificActions(sectionId) {
    switch(sectionId) {
        case 'perfil':
            // Animar las tarjetas de información
            animateInfoCards();
            break;
        case 'asistencias':
            // Regenerar calendario si es necesario
            generateCalendar();
            break;
        case 'plataformas':
            // Verificar estado de plataformas
            checkPlatformStatus();
            break;
        default:
            break;
    }
}

// Función para alternar submenús
function toggleSubmenu(element) {
    const submenu = element.parentElement;
    submenu.classList.toggle('open');
    
    // Cerrar otros submenús
    document.querySelectorAll('.has-submenu').forEach(item => {
        if (item !== submenu) {
            item.classList.remove('open');
        }
    });
}

// Función para toggle del sidebar en móvil
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebarOpen = !sidebarOpen;
    
    if (sidebarOpen) {
        sidebar.classList.add('open');
    } else {
        sidebar.classList.remove('open');
    }
}

// Cerrar sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
    sidebarOpen = false;
}

// Generar calendario
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    const date = new Date(currentYear, currentMonth, 1);
    const firstDay = date.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    
    // Limpiar grid
    calendarGrid.innerHTML = '';
    
    // Headers de días
    const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayHeaders.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day header';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });
    
    // Días del mes anterior (espacios vacíos)
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Marcar día actual
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Agregar estado de asistencia
        const attendanceStatus = getAttendanceStatus(currentYear, currentMonth, day);
        if (attendanceStatus) {
            dayElement.classList.add(attendanceStatus);
        }
        
        // Agregar evento de click
        dayElement.addEventListener('click', () => {
            showDayDetails(currentYear, currentMonth, day);
        });
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Actualizar título del calendario
    updateCalendarTitle();
}

// Obtener estado de asistencia
function getAttendanceStatus(year, month, day) {
    if (attendanceData[year] && attendanceData[year][month]) {
        return attendanceData[year][month][day] || null;
    }
    return null;
}

// Actualizar título del calendario
function updateCalendarTitle() {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const calendarHeader = document.querySelector('.calendar-header h3');
    if (calendarHeader) {
        calendarHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
}

// Cambiar mes del calendario
function changeMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    generateCalendar();
    showNotification(`Navegando a ${getMonthName(currentMonth)} ${currentYear}`, 'info');
}

// Obtener nombre del mes
function getMonthName(monthIndex) {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[monthIndex];
}

// Mostrar detalles del día
function showDayDetails(year, month, day) {
    const status = getAttendanceStatus(year, month, day);
    const statusText = {
        'present': 'Presente',
        'absent': 'Falta',
        'late': 'Retardo'
    };
    
    if (status) {
        showNotification(
            `${day}/${month + 1}/${year}: ${statusText[status]}`, 
            status === 'present' ? 'success' : status === 'late' ? 'warning' : 'error'
        );
    } else {
        showNotification(`${day}/${month + 1}/${year}: Sin registro`, 'info');
    }
}

// Animar tarjetas de información
function animateInfoCards() {
    const cards = document.querySelectorAll('.info-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Verificar estado de plataformas
function checkPlatformStatus() {
    const platforms = document.querySelectorAll('.platform-card');
    platforms.forEach(platform => {
        const status = platform.querySelector('.platform-status');
        if (status.classList.contains('maintenance')) {
            const button = platform.querySelector('.btn-access');
            button.disabled = true;
            button.classList.add('disabled');
        }
    });
}

// Acceder a plataforma
function accessPlatform(platformId) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        const platformNames = {
            'adtt': 'Sistema ADTT',
            'reportes': 'Portal de Reportes',
            'comunicacion': 'Sistema de Comunicación'
        };
        
        showNotification(
            `Accediendo a ${platformNames[platformId]}...`, 
            'info'
        );
        
        // Simular redirección
        setTimeout(() => {
            console.log(`Redirigiendo a plataforma: ${platformId}`);
            // window.open(`/plataforma/${platformId}`, '_blank');
        }, 1500);
    }, 2000);
}

// Mostrar sección de reglamento
function showRegulationSection(sectionId) {
    // Ocultar todas las secciones de reglamento
    document.querySelectorAll('.regulation-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`regulation-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Actualizar botones
    document.querySelectorAll('.btn-regulation').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

// Función de logout
function logout() {
    showNotification('Cerrando sesión...', 'info');
    
    setTimeout(() => {
        // Limpiar datos de sesión
        sessionStorage.clear();
        
        // Redireccionar al login
        window.location.href = 'index.html';
    }, 1500);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    // Limpiar clases anteriores
    notification.classList.remove('success', 'error', 'info', 'warning');
    
    // Aplicar clase según tipo
    notification.classList.add(type);
    
    // Establecer mensaje y mostrar
    notification.textContent = message;
    notification.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Mostrar loading overlay
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('show');
}

// Ocultar loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('show');
}

// Configurar event listeners
function setupEventListeners() {
    // Toggle sidebar en móvil
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Cerrar sidebar al hacer click fuera
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        
        if (window.innerWidth <= 768 && sidebarOpen && 
            !sidebar.contains(event.target) && 
            event.target !== sidebarToggle) {
            closeSidebar();
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', function(event) {
        // Escape para cerrar sidebar
        if (event.key === 'Escape' && sidebarOpen) {
            closeSidebar();
        }
        
        // Escape para cerrar notificaciones
        if (event.key === 'Escape') {
            const notification = document.getElementById('notification');
            notification.classList.remove('show');
        }
    });
    
    // Prevenir zoom en iOS
    document.addEventListener('gesturestart', function(event) {
        event.preventDefault();
    });
}

// Configurar manejadores responsivos
function setupResponsiveHandlers() {
    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && sidebarOpen) {
            closeSidebar();
        }
        
        // Ajustar notificaciones
        adjustNotificationPosition();
    });
    
    // Ajustar posición inicial
    adjustNotificationPosition();
}

// Ajustar posición de notificaciones
function adjustNotificationPosition() {
    const notification = document.getElementById('notification');
    if (window.innerWidth <= 768) {
        notification.style.right = '10px';
        notification.style.left = '10px';
        notification.style.top = '90px';
    } else {
        notification.style.right = '20px';
        notification.style.left = 'auto';
        notification.style.top = '100px';
    }
}

// Función para exportar datos de sesión (debugging)
function getSessionData() {
    return {
        agente: agentData,
        seccionActual: currentSection,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenSize: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
}

// Función para simular datos de prueba
function loadTestData() {
    console.log('Cargando datos de prueba...');
    
    // Simular más datos de asistencia
    if (!attendanceData[2025]) {
        attendanceData[2025] = {};
    }
    
    // Generar datos aleatorios para meses anteriores
    for (let month = 0; month < 12; month++) {
        if (!attendanceData[2025][month]) {
            attendanceData[2025][month] = {};
            
            const daysInMonth = new Date(2025, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const random = Math.random();
                if (random > 0.85) {
                    attendanceData[2025][month][day] = 'absent';
                } else if (random > 0.75) {
                    attendanceData[2025][month][day] = 'late';
                } else {
                    attendanceData[2025][month][day] = 'present';
                }
            }
        }
    }
    
    showNotification('Datos de prueba cargados', 'success');
}

// Funciones de utilidad
function formatTime(hours, minutes) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function formatDate(date) {
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function isWeekend(year, month, day) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Domingo o Sábado
}

// Función para actualizar estadísticas en tiempo real
function updateStats() {
    const currentMonthData = attendanceData[currentYear] && attendanceData[currentYear][currentMonth];
    if (!currentMonthData) return;
    
    let present = 0, absent = 0, late = 0;
    
    Object.values(currentMonthData).forEach(status => {
        switch(status) {
            case 'present': present++; break;
            case 'absent': absent++; break;
            case 'late': late++; break;
        }
    });
    
    // Actualizar elementos en el DOM
    const presentElement = document.querySelector('.summary-card.present .summary-number');
    const absentElement = document.querySelector('.summary-card.absent .summary-number');
    const lateElement = document.querySelector('.summary-card.late .summary-number');
    
    if (presentElement) presentElement.textContent = present;
    if (absentElement) absentElement.textContent = absent;
    if (lateElement) lateElement.textContent = late;
}

// Hacer funciones disponibles globalmente
window.showSection = showSection;
window.toggleSubmenu = toggleSubmenu;
window.toggleSidebar = toggleSidebar;
window.changeMonth = changeMonth;
window.accessPlatform = accessPlatform;
window.showRegulationSection = showRegulationSection;
window.logout = logout;
window.showNotification = showNotification;
window.getSessionData = getSessionData;
window.loadTestData = loadTestData;

// Auto-actualizar estadísticas cuando cambia el mes
document.addEventListener('DOMContentLoaded', function() {
    // Observar cambios en el calendario
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.target.id === 'calendarGrid') {
                updateStats();
            }
        });
    });
    
    const calendarGrid = document.getElementById('calendarGrid');
    if (calendarGrid) {
        observer.observe(calendarGrid, { childList: true });
    }
});

// Inicializar datos de prueba en desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(() => {
        loadTestData();
    }, 2000);
}
