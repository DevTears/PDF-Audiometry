document.getElementById("generatePdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;

    // Mostrar barra de carga
    const buttonText = document.getElementById("buttonText");
    const loadingSpinner = document.getElementById("loadingSpinner");
    buttonText.textContent = "Procesando...";
    loadingSpinner.classList.remove("d-none");

    setTimeout(() => {
        // Obtener los valores del formulario
        const ciudadFecha = document.getElementById("ciudadFecha").value;
        const nombre = document.getElementById("nombre").value;
        const dni = document.getElementById("dni").value;
        const motivoConsulta = document.getElementById("motivoConsulta").value;
        const edad = document.getElementById("edad").value;

        const otorrea = document.querySelector('input[name="otorrea"]:checked')?.value || "No especificado";
        const acufenos = document.querySelector('input[name="acufenos"]:checked')?.value || "No especificado";
        const cirugia = document.querySelector('input[name="cirugia"]:checked')?.value || "No especificado";

        const odValues = [
            document.getElementById("od250").value || 0,
            document.getElementById("od500").value || 0,
            document.getElementById("od1000").value || 0,
            document.getElementById("od2000").value || 0,
            document.getElementById("od3000").value || 0,
            document.getElementById("od4000").value || 0,
            document.getElementById("od6000").value || 0,
            document.getElementById("od8000").value || 0,
        ];

        const oiValues = [
            document.getElementById("oi250").value || 0,
            document.getElementById("oi500").value || 0,
            document.getElementById("oi1000").value || 0,
            document.getElementById("oi2000").value || 0,
            document.getElementById("oi3000").value || 0,
            document.getElementById("oi4000").value || 0,
            document.getElementById("oi6000").value || 0,
            document.getElementById("oi8000").value || 0,
        ];

        // Crear una instancia de jsPDF
        const doc = new jsPDF();

        // Título del documento
        doc.setFontSize(16);
        doc.text("EXAMEN DE AUDIOMETRÍA", 105, 20, { align: "center" });

        // Sección 1: Datos personales
        doc.setFontSize(12);
        doc.text("1. DATOS PERSONALES", 10, 30);
        doc.text(`Ciudad y Fecha: ${ciudadFecha}`, 10, 40);
        doc.text(`Nombre: ${nombre}`, 10, 50);
        doc.text(`DNI: ${dni}`, 120, 50);
        doc.text(`Motivo de Consulta: ${motivoConsulta}`, 10, 60);
        doc.text(`Edad: ${edad}`, 120, 60);

        // Sección 2: Antecedentes auditivos
        doc.text("2. ANTECEDENTES AUDITIVOS", 10, 70);
        doc.text(`OTORREA/OTALGIA: ${otorrea}`, 10, 80);
        doc.text(`ACÚFENOS/VÉRTIGO: ${acufenos}`, 10, 90);
        doc.text(`CIRUGÍA DE OÍDO/OTITIS: ${cirugia}`, 10, 100);

        // Sección 3: Gráfica de audiometría tonal
        doc.text("4. EVALUACIÓN CAPACIDAD AUDITIVA", 10, 110);

        // Dibujar el gráfico
        const startX = 20;
        const startY = 120; // Ajustado para que la tabla comience más arriba
        const stepX = 20; // Espaciado entre frecuencias
        const stepY = 10; // Espaciado entre dB

        // Dibujar cuadrícula
        for (let i = 0; i <= 9; i++) {
            const y = startY + stepY * i;
            doc.setDrawColor(200); // Color gris para las líneas de la cuadrícula
            doc.line(startX, y, startX + stepX * 8, y); // Líneas horizontales
        }
        for (let i = 0; i <= 8; i++) {
            const x = startX + stepX * i;
            doc.setDrawColor(200); // Color gris para las líneas de la cuadrícula
            doc.line(x, startY, x, startY + stepY * 9); // Líneas verticales
        }

        // Etiquetas de frecuencias
        const frequencies = ["250", "500", "1000", "2000", "3000", "4000", "6000", "8000"];
        frequencies.forEach((freq, i) => {
            doc.text(freq, startX + stepX * (i + 1), startY + stepY * 10 + 5);
        });

        // Etiquetas de dB
        for (let i = 0; i <= 90; i += 10) {
            doc.text(`${i}`, startX - 10, startY + stepY * (i / 10));
        }

        // Dibujar líneas y puntos para Oído Derecho (círculos rojos)
        doc.setTextColor(255, 0, 0); // Rojo
        doc.setDrawColor(255, 0, 0); // Rojo para las líneas
        odValues.forEach((value, i) => {
            const x = startX + stepX * (i + 1);
            const y = startY + stepY * (value / 10);
            if (i > 0) {
                const prevX = startX + stepX * i;
                const prevY = startY + stepY * (odValues[i - 1] / 10);
                doc.line(prevX, prevY, x, y); // Línea entre puntos
            }
            doc.circle(x, y, 2, "S");
        });

        // Dibujar líneas y puntos para Oído Izquierdo (cruces azules)
        doc.setTextColor(0, 0, 255); // Azul
        doc.setDrawColor(0, 0, 255); // Azul para las líneas
        oiValues.forEach((value, i) => {
            const x = startX + stepX * (i + 1);
            const y = startY + stepY * (value / 10);
            if (i > 0) {
                const prevX = startX + stepX * i;
                const prevY = startY + stepY * (oiValues[i - 1] / 10);
                doc.line(prevX, prevY, x, y); // Línea entre puntos
            }
            doc.line(x - 2, y - 2, x + 2, y + 2); // Línea diagonal 1
            doc.line(x - 2, y + 2, x + 2, y - 2); // Línea diagonal 2
        });

        // Guardar el PDF
        doc.save("audiometria.pdf");

        // Ocultar barra de carga y restaurar texto del botón
        buttonText.textContent = "Descargar PDF";
        loadingSpinner.classList.add("d-none");
    }, 2000); // Simula un tiempo de procesamiento de 2 segundos
});