let charts = {};// Almacenar instancias de gráficos

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Agregar clase para habilitar JavaScript
    document.body.classList.add('js-enabled');// Indica que JS está activo
    // Inyectar CSS responsivo para limitar la altura de los gráficos
    (function(){// Inyectar CSS para gráficos responsivos
        const css = `
        /* Contenedor responsivo para gráficos */
        .chart-container {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            max-height: 480px;
            aspect-ratio: 16/9;
            overflow: hidden;
            display: block;
        }
        /* Forzar canvas a ocupar el contenedor sin estirarse fuera */
        .chart-container canvas {
            width: 100% !important;
            height: 100% !important;
            display: block;
        }
        @media (max-width: 768px) {
            .chart-container {
                max-height: 320px;
                aspect-ratio: 16/10;
                padding: 0 12px;
            }
        }
        `;
        const style = document.createElement('style');// Crear elemento style
        style.setAttribute('data-injected','responsive-charts');// Marcar como inyectado
        style.appendChild(document.createTextNode(css));// Agregar CSS
        document.head.appendChild(style);// Inyectar en head
    })();
    
    initializeCharts();// Inicializar gráficos
});
// Mostrar sección específica
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll suave al inicio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Inicializar gráficos con datos geotérmicos
function initializeCharts() {
    // Gráfico de barras - Producción por país
    const barCtx = document.getElementById('barChart');
    if (barCtx && !charts.barChart) {
        charts.barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Estados Unidos', 'Indonesia', 'Filipinas', 'Italia', 'Nueva Zelanda', 'Islandia'],
                datasets: [{
                    label: 'Producción (TWh)',
                    data: [18.8, 14.2, 10.3, 6.1, 7.9, 5.2],
                    backgroundColor: [
                        'rgba(210, 105, 30, 0.8)',
                        'rgba(255, 99, 71, 0.8)',
                        'rgba(255, 165, 0, 0.8)',
                        'rgba(255, 140, 0, 0.8)',
                        'rgba(139, 69, 19, 0.8)',
                        'rgba(205, 133, 63, 0.8)'
                    ],
                    borderColor: [
                        'rgba(210, 105, 30, 1)',
                        'rgba(255, 99, 71, 1)',
                        'rgba(255, 165, 0, 1)',
                        'rgba(255, 140, 0, 1)',
                        'rgba(139, 69, 19, 1)',
                        'rgba(205, 133, 63, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.8,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'TWh'
                        }
                    }
                }
            }
        });
    }

    // Gráfico de torta - Tipos de sistemas geotérmicos
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx && !charts.pieChart) {
        charts.pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Vapor Seco', 'Vapor Flash', 'Ciclo Binario', 'Sistemas Híbridos', 'Otros'],
                datasets: [{
                    data: [45, 32, 18, 3, 2],
                    backgroundColor: [
                        'rgba(210, 105, 30, 0.8)',
                        'rgba(255, 99, 71, 0.8)',
                        'rgba(255, 165, 0, 0.8)',
                        'rgba(255, 140, 0, 0.8)',
                        'rgba(139, 69, 19, 0.8)'
                    ],
                    borderColor: [
                        'rgba(210, 105, 30, 1)',
                        'rgba(255, 99, 71, 1)',
                        'rgba(255, 165, 0, 1)',
                        'rgba(255, 140, 0, 1)',
                        'rgba(139, 69, 19, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gráfico de líneas - Evolución de capacidad geotérmica
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx && !charts.lineChart) {
        charts.lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Capacidad Instalada (GW)',
                    data: [13.3, 13.9, 14.1, 14.8, 15.2, 15.9, 16.4],
                    borderColor: 'rgba(210, 105, 30, 1)',
                    backgroundColor: 'rgba(210, 105, 30, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.0,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'GW'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Año'
                        }
                    }
                }
            }
        });
    }
}