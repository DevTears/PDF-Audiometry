document.getElementById("generatePdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    
    try {
        
        // Mostrar barra de carga
        const buttonText = document.getElementById("buttonText");
        const loadingSpinner = document.getElementById("loadingSpinner");
        buttonText.textContent = "Procesando...";
        loadingSpinner.classList.remove("d-none");

        // Obtener los valores del formulario
        const ciudad = document.getElementById("ciudad").value;
        const fecha = document.getElementById("fecha").value;
        const nombre = document.getElementById("nombre").value;
        const dni = document.getElementById("dni").value;
        const motivoConsulta = document.getElementById("motivoConsulta").value;
        const edad = document.getElementById("edad").value;

        // Validar campos obligatorios
        if (!ciudad || !fecha || !nombre || !dni || !motivoConsulta || !edad) {
            alert("Por favor, complete todos los campos obligatorios.");
            buttonText.textContent = "Generar PDF";
            loadingSpinner.classList.add("d-none");
            return;
        }

        // Formatear la fecha
        const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        // Combinar ciudad y fecha
        const ciudadFecha = `${ciudad} - ${fechaFormateada}`;

        // Obtener los valores seleccionados de los antecedentes auditivos
        const otorrea = document.querySelector('input[name="otorrea"]:checked')?.value || "No";
        const otalgia = document.querySelector('input[name="otalgia"]:checked')?.value || "No";
        const acufenos = document.querySelector('input[name="acufenos"]:checked')?.value || "No";
        const vertigo = document.querySelector('input[name="vertigo"]:checked')?.value || "No";
        const cirugia = document.querySelector('input[name="cirugia"]:checked')?.value || "No";
        const otitis = document.querySelector('input[name="otitis"]:checked')?.value || "No";

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

        // Márgenes personalizados
        const marginX = 20; // Margen izquierdo
        const marginY = 20; // Margen superior ajustado

        // Agregar el logo en la parte superior izquierda
        const logoImg = "src/logo.png"; // Reemplaza con la ruta o base64 de tu logo
        doc.addImage(logoImg, "PNG", marginX, marginY - 10, 30, 20); // Ajusta el tamaño y posición del logo

        // Título del documento
        doc.setFont("times", "bold"); // Cambiar la fuente a 'Times' y el grosor a 'bold'
        doc.setFontSize(16); // Tamaño de la fuente
        doc.text("EXAMEN DE AUDIOMETRÍA", 105, marginY + 15, { align: "center" }); // Ajustar posición del título

        // Sección 1: Datos personales
        doc.setFontSize(12);
        doc.text("1. DATOS PERSONALES", marginX, marginY + 25); // Ajustar posición
        doc.text(`Ciudad y Fecha: ${ciudadFecha}`, marginX, marginY + 35);
        doc.text(`Nombre: ${nombre}`, marginX, marginY + 45);
        doc.text(`DNI: ${dni}`, marginX + 100, marginY + 45);
        doc.text(`Motivo de Consulta: ${motivoConsulta}`, marginX, marginY + 55);
        doc.text(`Edad: ${edad}`, marginX + 100, marginY + 55);

        // Sección 2: Antecedentes auditivos
        doc.setFontSize(12); // Tamaño de la letra para el título
        doc.text("2. ANTECEDENTES AUDITIVOS", marginX, marginY + 65); // Posición del título

        // Opciones de antecedentes auditivos
        const antecedentes = [
            { label: "OTORREA", value: otorrea },
            { label: "OTALGIA", value: otalgia },
            { label: "ACÚFENOS", value: acufenos },
            { label: "VÉRTIGO", value: vertigo },
            { label: "CIRUGÍA DE OÍDO", value: cirugia },
            { label: "OTITIS", value: otitis },
        ];

        // Configuración de columnas
        const colWidth = 50; // Ancho de cada columna
        const colSpacing = 5; // Espaciado entre columnas
        const startXAntecedentes = marginX; // Posición inicial X para antecedentes
        const startYAntecedentes = marginY + 75; // Posición inicial Y para antecedentes (ajustado hacia abajo)
        const rowHeight = 8; // Altura entre filas

        // Dibujar las opciones en el PDF
        antecedentes.forEach((item, index) => {
            const col = Math.floor(index / 2); // Determinar la columna (0, 1, 2)
            const row = index % 2; // Determinar la fila dentro de la columna
            const x = startXAntecedentes + col * (colWidth + colSpacing); // Calcular posición X
            const y = startYAntecedentes + row * rowHeight; // Calcular posición Y

            // Reducir el tamaño de la letra
            doc.setFontSize(10);

            // Dibujar el texto del antecedente con la opción seleccionada
            doc.text(`• ${item.label}: ${item.value.toUpperCase()}`, x, y);
        });

        // Sección 3: Gráfica de audiometría tonal
        doc.setFontSize(12);
        doc.text(
            "3. EVALUACIÓN CAPACIDAD AUDITIVA",
            marginX,
            startYAntecedentes + rowHeight * 3 + 5 // Reducir el espacio entre las secciones
        );

        // Dibujar el gráfico
        const pageWidth = doc.internal.pageSize.getWidth(); // Ancho de la página
        const stepX = 15; // Espaciado entre frecuencias
        const stepY = 8; // Espaciado entre dB
        const tableWidth = stepX * 8; // Ancho total de la tabla
        const startXTabla = (pageWidth - tableWidth) / 2; // Centrar la tabla horizontalmente
        const startY = marginY + 110;

        // Dibujar cuadrícula
        for (let i = 0; i <= 9; i++) {
            const y = startY + stepY * i;
            doc.setDrawColor(200);
            doc.line(startXTabla, y, startXTabla + stepX * 8, y); // Cambié startX por startXTabla
        }
        for (let i = 0; i <= 8; i++) {
            const x = startXTabla + stepX * i; // Cambié startX por startXTabla
            doc.setDrawColor(200);
            doc.line(x, startY, x, startY + stepY * 9);
        }

        // Etiquetas de frecuencias
        const frequencies = ["250", "500", "1000", "2000", "3000", "4000", "6000", "8000"];
        frequencies.forEach((freq, i) => {
            doc.text(freq, startXTabla + stepX * (i + 1), startY + stepY * 10 + 5); // Cambié startX por startXTabla
        });

        // Etiquetas de dB
        for (let i = 0; i <= 90; i += 10) {
            doc.text(`${i}`, startXTabla - 10, startY + stepY * (i / 10)); // Cambié startX por startXTabla
        }

        // Dibujar líneas y puntos para Oído Derecho (círculos rojos)
        doc.setTextColor(255, 0, 0); // Rojo
        doc.setDrawColor(255, 0, 0); // Rojo para las líneas
        odValues.forEach((value, i) => {
            const x = startXTabla + stepX * (i + 1); // Cambié startX por startXTabla
            const y = startY + stepY * (value / 10);
            if (i > 0) {
                const prevX = startXTabla + stepX * i; // Cambié startX por startXTabla
                const prevY = startY + stepY * (odValues[i - 1] / 10);
                doc.line(prevX, prevY, x, y); // Línea entre puntos
            }
            doc.circle(x, y, 2, "S");
        });

        // Dibujar líneas y puntos para Oído Izquierdo (cruces azules)
        doc.setTextColor(0, 0, 255); // Azul
        doc.setDrawColor(0, 0, 255); // Azul para las líneas
        oiValues.forEach((value, i) => {
            const x = startXTabla + stepX * (i + 1); // Cambié startX por startXTabla
            const y = startY + stepY * (value / 10);
            if (i > 0) {
                const prevX = startXTabla + stepX * i; // Cambié startX por startXTabla
                const prevY = startY + stepY * (oiValues[i - 1] / 10);
                doc.line(prevX, prevY, x, y); // Línea entre puntos
            }
            doc.line(x - 2, y - 2, x + 2, y + 2); // Línea diagonal 1
            doc.line(x - 2, y + 2, x + 2, y - 2); // Línea diagonal 2
        });

        // Obtener el valor de las observaciones
        const observaciones = document.getElementById("observaciones").value || "Sin observaciones";

        // Restablecer el color del texto a negro antes de las observaciones
        doc.setTextColor(0, 0, 0);

        // Agregar las observaciones al PDF debajo de la tabla
        doc.setFontSize(12);
        doc.text("5. OBSERVACIONES", marginX, startY + stepY * 10 + 15);

        // Dibujar líneas para simular renglones
        const observacionesStartY = startY + stepY * 10 + 30; // Posición inicial de las líneas (bajadas)
        const lineSpacing = 10; // Espaciado entre líneas (ligeramente mayor)
        for (let i = 0; i < 2; i++) { // Dibujar 2 líneas
            const y = observacionesStartY + i * lineSpacing;
            doc.setDrawColor(200); // Color gris claro para las líneas
            doc.line(marginX, y, pageWidth - marginX, y); // Línea horizontal
        }

        // Agregar el texto de las observaciones por encima de las líneas
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0); // Color negro para el texto
        doc.text(observaciones, marginX, observacionesStartY - 5, { maxWidth: pageWidth - marginX * 2 }); // Texto más arriba

        // Agregar la firma del profesional
        const firmaX = pageWidth - 70; // Posición X (parte derecha)
        const firmaY = doc.internal.pageSize.getHeight() - 60; // Posición Y ajustada para que esté más abajo
        const firmaImg = "src/Firma-contraste.png"; // Reemplaza con tu imagen en base64
        doc.addImage(firmaImg, "PNG", firmaX, firmaY, 60, 35); // Tamaño ajustado de la firma
        doc.setFontSize(12);
        doc.text("FIRMA DEL PROFESIONAL", firmaX, firmaY + 40); // Texto debajo de la firma

        // Agregar el footer
        const footerHeight = 10; // Altura más delgada del footer
        const footerY = doc.internal.pageSize.getHeight(); // Posición Y del footer (abajo de todo)
        doc.setFillColor(200, 230, 200); // Color de fondo (verde claro)
        doc.rect(0, footerY - footerHeight, pageWidth, footerHeight, "F"); // Dibujar el rectángulo del footer

        // Agregar texto al footer
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Color del texto (negro)
        doc.text(
            "Villegas Oeste 97, Malargüe. | +54 9 2604 32-2576 | clinicasur@clinicasur.com.ar",
            pageWidth / 2,
            footerY - 2, // Ajustar el texto para que quede centrado verticalmente en el footer
            { align: "center" }
        );

        // Guardar el PDF
        doc.save("audiometria.pdf");

        // Ocultar barra de carga y restaurar texto del botón
        buttonText.textContent = "Generar PDF";
        loadingSpinner.classList.add("d-none");
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Ocurrió un error al generar el PDF. Por favor, revise los datos ingresados.");
        buttonText.textContent = "Generar PDF";
        loadingSpinner.classList.add("d-none");
    }
});
