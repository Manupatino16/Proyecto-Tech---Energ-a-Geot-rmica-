let charts = {};// Almacenar instancias de gráficos

// Función helper para obtener opciones de ejes responsivas
function getResponsiveAxisOptions() {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 640;
    const isTablet = screenWidth >= 640 && screenWidth < 1024;
    
    return {
        xTickFont: isMobile ? 9 : (isTablet ? 10 : 11),
        yTickFont: isMobile ? 8 : (isTablet ? 9 : 10),
        titleFont: isMobile ? 9 : (isTablet ? 10 : 11),
        maxRotation: isMobile ? 45 : (isTablet ? 30 : 0),
        labelPadding: isMobile ? 3 : (isTablet ? 5 : 8)
    };
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Agregar clase para habilitar JavaScript
    document.body.classList.add('js-enabled');// Indica que JS está activo
    
    // Inyectar CSS responsivo para gráficos
    (function(){
        const css = `
        /* Canvas debe ocupar todo su contenedor */
        .chart-container canvas {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
        }
        `;
        const style = document.createElement('style');
        style.setAttribute('data-injected','responsive-charts');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    })();
    
    initializeCharts();
    
    // Listener para redimensionamiento responsivo
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Actualizar gráficos si es necesario
            Object.values(charts).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        }, 250);
    });
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Inicializar gráficos con datos geotérmicos
function initializeCharts() {
    const axisOpts = getResponsiveAxisOptions();
    
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
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        padding: 12,
                        borderColor: 'rgba(210, 105, 30, 1)',
                        borderWidth: 2,
                        titleFont: {
                            size: axisOpts.titleFont + 2,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: axisOpts.titleFont
                        },
                        callbacks: {
                            label: function(context) {
                                return 'Producción: ' + context.parsed.y.toFixed(1) + ' TWh';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: axisOpts.xTickFont,
                                weight: 'bold',
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: 'rgba(242, 235, 226, 1)',
                            maxRotation: axisOpts.maxRotation,
                            minRotation: 0,
                            padding: axisOpts.labelPadding,
                            autoSkip: false,
                            callback: function(value, index, values) {
                                const labels = ['Estados Unidos', 'Indonesia', 'Filipinas', 'Italia', 'Nueva Zelanda', 'Islandia'];
                                const label = labels[index];
                                if (window.innerWidth < 640 && label && label.length > 12) {
                                    return label.substring(0, 9) + '...';
                                } else if (window.innerWidth < 1024 && label && label.length > 14) {
                                    return label.substring(0, 11) + '...';
                                }
                                return label;
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: axisOpts.yTickFont,
                                weight: '500',
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: 'rgba(242, 235, 226, 1)',
                            padding: 10
                        },
                        title: {
                            display: true,
                            text: 'TWh',
                            font: {
                                size: axisOpts.titleFont,
                                weight: 'bold',
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: 'rgba(210, 105, 30, 1)',
                            padding: 10
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
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: window.innerWidth < 640 ? 'bottom' : 'right',
                        labels: {
                            font: {
                                size: axisOpts.xTickFont,
                                weight: 'bold',
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: 'rgba(242, 235, 226, 1)',
                            padding: window.innerWidth < 640 ? 8 : 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        padding: 12,
                        borderColor: 'rgba(210, 105, 30, 1)',
                        borderWidth: 2,
                        titleFont: {
                            size: axisOpts.titleFont + 2,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: axisOpts.titleFont
                        },
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
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
                    tension: 0.4,
                    pointRadius: window.innerWidth < 640 ? 4 : 5,
                    pointBackgroundColor: 'rgba(210, 105, 30, 1)',
                    pointBorderColor: 'rgba(255, 255, 255, 1)',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 900,
                    easing: 'easeInOutQuart'
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        padding: 12,
                        borderColor: 'rgba(210, 105, 30, 1)',
                        borderWidth: 2,
                        titleFont: {
                            size: axisOpts.titleFont + 2,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: axisOpts.titleFont
                        },
                        callbacks: {
                            label: function(context) {
                                return 'Capacidad: ' + context.parsed.y.toFixed(1) + ' GW';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: axisOpts.xTickFont,
                                weight: 'bold',
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: 'rgba(242, 235, 226, 1)',
                            padding: axisOpts.labelPadding
                        },
                        title: {
                            display: true,
                            text: 'Año',
                            font: {
                                size: axisOpts.titleFont,
                                weight: 'bold',
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: 'rgba(210, 105, 30, 1)',
                            padding: 10
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: axisOpts.yTickFont,
                                weight: '500',
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: 'rgba(242, 235, 226, 1)',
                            padding: 10
                        },
                        title: {
                            display: true,
                            text: 'GW',
                            font: {
                                size: axisOpts.titleFont,
                                weight: 'bold',
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: 'rgba(210, 105, 30, 1)',
                            padding: 10
                        }
                    }
                }
            }
        });
    }
}