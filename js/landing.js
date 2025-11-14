// HUMBER Landing - JavaScript para Laravel
document.addEventListener('DOMContentLoaded', function() {
    // Configurar CSRF token para todas las peticiones AJAX
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
        window.axios = window.axios || {};
        window.axios.defaults = window.axios.defaults || {};
        window.axios.defaults.headers = window.axios.defaults.headers || {};
        window.axios.defaults.headers.common = window.axios.defaults.headers.common || {};
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.getAttribute('content');
    }

    // Navegación suave
    initSmoothNavigation();
    
    // WhatsApp FAB
    initWhatsAppFAB();
    
    // Formulario de contacto con AJAX
    initContactForm();
    
    // Navegación activa
    initActiveNavigation();
    
    // Menú móvil
    initMobileMenu();
});

/**
 * Navegación suave entre secciones
 */
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                closeMobileMenu();
            }
        });
    });
}

/**
 * WhatsApp Floating Action Button
 */
function initWhatsAppFAB() {
    const fabBtn = document.getElementById('fab-btn');
    const fabOptions = document.querySelector('.fab-options');
    
    if (fabBtn && fabOptions) {
        fabBtn.addEventListener('click', function() {
            fabOptions.classList.toggle('open');
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!fabBtn.contains(e.target) && !fabOptions.contains(e.target)) {
                fabOptions.classList.remove('open');
            }
        });
    }
}

/**
 * Formulario de contacto con AJAX y validación
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Limpiar errores previos
            clearFormErrors();
            
            // Obtener datos del formulario
            const formData = new FormData(form);
            
            // Mostrar estado de carga
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Enviar via AJAX
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Éxito
                    showToast(data.message, 'success');
                    form.reset();
                } else {
                    // Errores de validación
                    if (data.errors) {
                        displayFormErrors(data.errors);
                    }
                    showToast(data.message || 'Hubo un error al enviar el formulario.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.', 'error');
            })
            .finally(() => {
                // Restaurar botón
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

/**
 * Limpiar errores del formulario
 */
function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.classList.add('hidden');
    });
    
    const inputs = document.querySelectorAll('.border-red-500');
    inputs.forEach(input => {
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-300');
    });
}

/**
 * Mostrar errores de validación
 */
function displayFormErrors(errors) {
    Object.keys(errors).forEach(field => {
        const input = document.getElementById(field);
        const errorDiv = input ? input.parentNode.querySelector('.error-message') : null;
        
        if (input && errorDiv) {
            // Marcar input como error
            input.classList.remove('border-gray-300');
            input.classList.add('border-red-500');
            
            // Mostrar mensaje de error
            errorDiv.textContent = errors[field][0];
            errorDiv.classList.remove('hidden');
        }
    });
}

/**
 * Sistema de toasts/notificaciones
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast p-4 rounded-lg shadow-lg max-w-sm ${getToastClasses(type)}`;
    
    toast.innerHTML = `
        <div class="flex items-center">
            <div class="flex-shrink-0">
                ${getToastIcon(type)}
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
                <button class="toast-close inline-flex text-gray-400 hover:text-gray-600 focus:outline-none">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Cerrar automáticamente
    const autoCloseTimeout = setTimeout(() => {
        closeToast(toast);
    }, 5000);
    
    // Cerrar manualmente
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoCloseTimeout);
        closeToast(toast);
    });
}

/**
 * Cerrar toast
 */
function closeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Obtener clases CSS para el tipo de toast
 */
function getToastClasses(type) {
    const classes = {
        success: 'bg-green-50 text-green-800 border border-green-200',
        error: 'bg-red-50 text-red-800 border border-red-200',
        warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
        info: 'bg-blue-50 text-blue-800 border border-blue-200'
    };
    
    return classes[type] || classes.info;
}

/**
 * Obtener icono para el tipo de toast
 */
function getToastIcon(type) {
    const icons = {
        success: `<svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>`,
        error: `<svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>`,
        warning: `<svg class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>`,
        info: `<svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>`
    };
    
    return icons[type] || icons.info;
}

/**
 * Navegación activa basada en scroll
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Ejecutar al cargar
}

/**
 * Menú móvil
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('open');
        });
    }
    
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // Cerrar al hacer clic en un enlace del menú móvil
    const mobileNavLinks = mobileMenu?.querySelectorAll('a');
    mobileNavLinks?.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
}

/**
 * Cerrar menú móvil
 */
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('open');
    }
}

/**
 * Función global para mostrar toasts (disponible para uso desde Blade)
 */
window.showToast = showToast;