// Variables globales
let selectedGroup = null;
let selectedRole = null;

// Nombres de grupos y roles para mostrar
const groupNames = {
    'servicios-generales': 'Servicios Generales',
    'servicios-integrales': 'Servicios Integrales'
};

const roleNames = {
    'agente': 'AGENTE',
    'supervisor': 'SUPERVISOR',
    'administrativo': 'ADMINISTRATIVO'
};

const roleNamesDisplay = {
    'agente': 'Agente',
    'supervisor': 'Supervisor',
    'administrativo': 'Administrativo'
};

// Función para seleccionar grupo
function selectGroup(group, element) {
    // Quitar activos anteriores
    document.querySelectorAll('.group-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Activar el elemento seleccionado
    element.classList.add('active');
    selectedGroup = group;

    // Habilitar grid de roles
    const rolesGrid = document.getElementById('rolesGrid');
    rolesGrid.classList.remove('disabled');

    // Mostrar badge con selección
    const badge = document.getElementById('selectionBadge');
    badge.textContent = `Grupo seleccionado: ${groupNames[group]}`;
    badge.classList.add('show');

    // Reiniciar selección de rol y formulario
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('active');
    });
    selectedRole = null;
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('btnText').textContent = 'INICIAR SESIÓN';

    // Mostrar notificación
    showNotification(`Grupo ${groupNames[group]} seleccionado`, 'info');
}

// Función para seleccionar rol
function selectRole(role, element) {
    // Verificar que se haya seleccionado un grupo primero
    if (!selectedGroup) {
        showNotification('Primero seleccione un grupo', 'error');
        return;
    }

    // Quitar activos anteriores
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Activar el elemento seleccionado
    element.classList.add('active');
    selectedRole = role;

    // Mostrar formulario de login
    const loginForm = document.getElementById('loginForm');
    loginForm.classList.add('active');

    // Actualizar texto del botón
    const btnText = document.getElementById('btnText');
    btnText.textContent = `ACCEDER COMO ${roleNames[role]}`;

    // Mostrar notificación
    showNotification(`Rol ${roleNamesDisplay[role]} seleccionado`, 'info');

    // Scroll suave hacia el formulario
    setTimeout(() => {
        loginForm.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 100);
}

// Función para manejar el envío del formulario
function handleLogin(event) {
    event.preventDefault();

    // Validar que se hayan seleccionado grupo y rol
    if (!selectedGroup) {
        showNotification('Por favor, seleccione un grupo', 'error');
        return;
    }
    
    if (!selectedRole) {
        showNotification('Por favor, seleccione un rol', 'error');
        return;
    }

    // Obtener valores del formulario
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Validar campos
    if (!username || !password) {
        showNotification('Por favor, complete todos los campos', 'error');
        return;
    }

    // Validar formato de usuario
    if (username.length < 3) {
        showNotification('El usuario debe tener al menos 3 caracteres', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    // Simular validación de credenciales
    showNotification('Validando credenciales...', 'info');

    // Deshabilitar botón durante validación
    const btnLogin = document.querySelector('.btn-login');
    const originalText = btnLogin.innerHTML;
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<span>Validando...</span>';

    setTimeout(() => {
        // Restaurar botón
        btnLogin.disabled = false;
        btnLogin.innerHTML = originalText;

        // Mostrar mensaje de éxito
        const successMessage = `Bienvenido - ${groupNames[selectedGroup]} / ${roleNamesDisplay[selectedRole]}`;
        showNotification(successMessage, 'success');

        // En una aplicación real, aquí redirigiríamos:
        console.log(`Redirigiendo a: /panel/${selectedGroup}/${selectedRole}`);
        console.log('Datos de login:', {
            grupo: selectedGroup,
            rol: selectedRole,
            usuario: username,
            timestamp: new Date().toISOString()
        });
        
        // Simular redirección después de 2 segundos
        //setTimeout(() => {
            // window.location.href = `/panel/${selectedGroup}/${selectedRole}`;
            //console.log('Redirección simulada completada');
      // }, 2000);
    //}, 1500);
//}

setTimeout(() => {
    const successMessage = `Bienvenido - ${groupNames[selectedGroup]} / ${roleNamesDisplay[selectedRole]}`;
    showNotification(successMessage, 'success');
    
    // Redirección real según grupo y rol
    if (selectedGroup === 'servicios-integrales' && selectedRole === 'agente') {
        window.location.href = 'panel-agente.html';
    } else {
        // Para otros roles/grupos (por ahora)
        showNotification('Panel no disponible aún para este rol', 'info');
    }
}, 1500);


// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    // Limpiar clases anteriores
    notification.classList.remove('success', 'error');
    
    // Aplicar clase según tipo
    if (type === 'success') {
        notification.classList.add('success');
    } else if (type === 'error') {
        notification.classList.add('error');
    }
    
    // Establecer mensaje y mostrar
    notification.textContent = message;
    notification.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Función para validar entrada del campo usuario
function validateUsernameInput(event) {
    // Permitir solo letras, números, puntos, guiones y guiones bajos
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9._-]/g, '');
}

// Función para prevenir pegado en campo de contraseña
function preventPasswordPaste(event) {
    event.preventDefault();
    showNotification('Por seguridad, no se permite pegar en el campo de contraseña', 'error');
}

// Función para animar las tarjetas al cargar
function animateCards() {
    const cards = document.querySelectorAll('.role-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
}

// Función para manejar redimensionamiento de ventana
function handleResize() {
    // Ajustar altura de notificaciones en móvil
    const notification = document.getElementById('notification');
    if (window.innerWidth <= 768) {
        notification.style.position = 'fixed';
        notification.style.left = '10px';
        notification.style.right = '10px';
        notification.style.top = '10px';
    } else {
        notification.style.position = 'fixed';
        notification.style.left = 'auto';
        notification.style.right = '20px';
        notification.style.top = '20px';
    }
}

// Función para detectar dispositivos táctiles
function detectTouch() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
        
        // Ajustar efectos hover para dispositivos táctiles
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) and (pointer: coarse) {
                .group-card:hover,
                .role-card:hover {
                    transform: none;
                }
                
                .btn-login:hover {
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Función para manejar el enfoque con teclado
function handleKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Navegación con Tab mejorada
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Enter para seleccionar tarjetas
        if (event.key === 'Enter' && event.target.classList.contains('group-card')) {
            event.target.click();
        }
        
        if (event.key === 'Enter' && event.target.classList.contains('role-card')) {
            event.target.click();
        }
        
        // Escape para cerrar notificaciones
        if (event.key === 'Escape') {
            const notification = document.getElementById('notification');
            notification.classList.remove('show');
        }
    });
    
    // Remover clase al usar mouse
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Función para hacer las tarjetas accesibles con teclado
function makeCardsAccessible() {
    // Hacer group cards accesibles
    document.querySelectorAll('.group-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Seleccionar grupo: ${card.querySelector('.group-name').textContent}`);
    });
    
    // Hacer role cards accesibles
    document.querySelectorAll('.role-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Seleccionar rol: ${card.querySelector('h3').textContent}`);
    });
}

// Función para validar accesibilidad del formulario
function validateFormAccessibility() {
    const form = document.querySelector('.login-form form');
    
    // Agregar atributos ARIA
    form.setAttribute('aria-label', 'Formulario de inicio de sesión');
    
    // Mejorar etiquetas de campos
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    usernameInput.setAttribute('aria-describedby', 'username-help');
    passwordInput.setAttribute('aria-describedby', 'password-help');
    
    // Agregar mensajes de ayuda (invisibles pero accesibles)
    const usernameHelp = document.createElement('div');
    usernameHelp.id = 'username-help';
    usernameHelp.className = 'sr-only';
    usernameHelp.textContent = 'Ingrese su usuario institucional';
    usernameInput.parentNode.appendChild(usernameHelp);
    
    const passwordHelp = document.createElement('div');
    passwordHelp.id = 'password-help';
    passwordHelp.className = 'sr-only';
    passwordHelp.textContent = 'Ingrese su contraseña de al menos 6 caracteres';
    passwordInput.parentNode.appendChild(passwordHelp);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funciones
    animateCards();
    detectTouch();
    handleKeyboardNavigation();
    makeCardsAccessible();
    validateFormAccessibility();
    
    // Agregar event listeners
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) {
        usernameInput.addEventListener('input', validateUsernameInput);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('paste', preventPasswordPaste);
    }
    
    // Event listener para redimensionamiento
    window.addEventListener('resize', handleResize);
    
    // Llamar una vez al cargar
    handleResize();
    
    // Agregar estilos para screen readers
    const srOnlyStyle = document.createElement('style');
    srOnlyStyle.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid var(--guinda-principal);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(srOnlyStyle);
});

// Función para limpiar el formulario
function resetForm() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('remember').checked = false;
}

// Función para exportar datos de sesión (para debugging)
function getSessionData() {
    return {
        selectedGroup,
        selectedRole,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenSize: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
}

// Hacer funciones disponibles globalmente para el HTML inline
window.selectGroup = selectGroup;
window.selectRole = selectRole;
window.handleLogin = handleLogin;
window.showNotification = showNotification;
window.resetForm = resetForm;

window.getSessionData = getSessionData;
