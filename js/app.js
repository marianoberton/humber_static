// HUMBER Landing - JavaScript mínimo
// Funcionalidades: navegación suave, FAB WhatsApp, validación formulario, toasts

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // NAVEGACIÓN MÓVIL
    // ========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a[href^="#"]');

    // Abrir menú móvil
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    // Cerrar menú móvil
    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    mobileMenuClose.addEventListener('click', closeMobileMenu);

    // Cerrar menú al hacer click en un enlace
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cerrar menú con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // ========================================
    // NAVEGACIÓN ACTIVA
    // ========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ========================================
    // DEEP LINK - Scroll a #cotizar si viene en la URL
    // ========================================
    if (window.location.hash === '#cotizar') {
        setTimeout(() => {
            document.getElementById('cotizar').scrollIntoView({
                behavior: 'smooth'
            });
        }, 100);
    }

    // ========================================
    // FAB WHATSAPP
    // ========================================
    const fabBtn = document.getElementById('fab-btn');
    const fabOptions = document.querySelector('.fab-options');
    let fabOpen = false;

    function toggleFab() {
        fabOpen = !fabOpen;
        fabOptions.classList.toggle('open', fabOpen);
        fabBtn.setAttribute('aria-expanded', fabOpen);
    }

    function closeFab() {
        fabOpen = false;
        fabOptions.classList.remove('open');
        fabBtn.setAttribute('aria-expanded', false);
    }

    fabBtn.addEventListener('click', toggleFab);

    // Cerrar FAB al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.fab-whatsapp')) {
            closeFab();
        }
    });

    // Cerrar FAB con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && fabOpen) {
            closeFab();
            fabBtn.focus();
        }
    });

    // Accesibilidad: navegación por teclado en FAB
    fabBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFab();
        }
    });

    // ========================================
    // SISTEMA DE TOASTS
    // ========================================
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast px-6 py-4 rounded-lg shadow-lg text-white ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Ocultar y remover toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    // ========================================
    // VALIDACIÓN DE FORMULARIO
    // ========================================
    const contactForm = document.getElementById('contact-form');
    const formInputs = contactForm.querySelectorAll('input[required], textarea');

    // Validación en tiempo real
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Limpiar error si el usuario está escribiendo
            const errorDiv = this.parentNode.querySelector('.error-message');
            if (errorDiv && !errorDiv.classList.contains('hidden')) {
                errorDiv.classList.add('hidden');
                this.classList.remove('border-red-500');
            }
        });
    });

    function validateField(field) {
        const errorDiv = field.parentNode.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        // Validar campo requerido
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }
        // Validar email
        else if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
        }
        // Validar teléfono
        else if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
            if (!phoneRegex.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Ingresa un teléfono válido';
            }
        }

        // Mostrar/ocultar error
        if (!isValid) {
            errorDiv.textContent = errorMessage;
            errorDiv.classList.remove('hidden');
            field.classList.add('border-red-500');
        } else {
            errorDiv.classList.add('hidden');
            field.classList.remove('border-red-500');
        }

        return isValid;
    }

    // Envío del formulario
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Validar todos los campos
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showToast('Por favor, corrige los errores en el formulario', 'error');
            return;
        }

        // Simular envío (aquí iría la lógica real de envío)
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        // Simular delay de envío
        setTimeout(() => {
            // Resetear formulario
            contactForm.reset();
            
            // Restaurar botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Mostrar toast de éxito
            showToast('¡Gracias! Te contactaremos pronto.');
            
            // Scroll suave al inicio del formulario
            document.getElementById('cotizar').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
        }, 1500);
    });

    // ========================================
    // SCROLL SUAVE PARA TODOS LOS ENLACES ANCLA
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // INICIALIZACIÓN
    // ========================================
    
    // Configurar atributos de accesibilidad
    fabBtn.setAttribute('aria-expanded', 'false');
    fabBtn.setAttribute('aria-haspopup', 'true');
    
    // Actualizar navegación activa al cargar
    updateActiveNav();
    
    console.log('HUMBER Landing - JavaScript cargado correctamente');
});