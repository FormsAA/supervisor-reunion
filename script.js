window.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    document.getElementById('fecha').value = now.toISOString().split('T')[0];
    document.getElementById('hora').value = now.toTimeString().split(':').slice(0, 2).join(':');
});

document.getElementById('supervisorForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const tema = document.getElementById('tema').value;
    const subtemas = document.getElementById('subtemas').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const duracion = document.getElementById('duracion').value;
    const facilitador = document.getElementById('facilitador').value;

    // Generar un ID único para la sesión
    const sessionId = Date.now().toString(36);
    const baseUrl = "https://formsaa.github.io/Asistencias/"; // ¡Asegúrate de que esta URL sea correcta!
    const fullUrl = `${baseUrl}?id=${sessionId}`;

    const sessionData = {
        tipo,
        tema,
        subtemas,
        fecha,
        hora,
        duracion,
        facilitador,
        id: sessionId
    };

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwBremvmpHVKm-jaEJG2Zcw4URz3JtKZJF1bqHslt9u4oFJ4AiARsAMdmKrHFYh5kopEw/exec", {
            method: 'POST',
            body: JSON.stringify(sessionData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.status === 'ok') {
            console.log("✅ Datos del evento guardados correctamente.");

            // Mostrar el código QR
            document.getElementById('qr').style.display = 'block';
            document.getElementById('qr-url').textContent = fullUrl;

            QRCode.toCanvas(document.getElementById('qrcode'), fullUrl, function (error) {
                if (error) console.error("❌ Error al generar el QR:", error);
            });

            // Opcional: Guardar en localStorage (puede ser útil para seguimiento local)
            localStorage.setItem(sessionId, JSON.stringify(sessionData));

        } else {
            console.error("❌ Error al guardar los datos del evento:", result.message);
            alert("Hubo un problema al guardar los datos del evento. Intente nuevamente.");
        }

    } catch (error) {
        console.error("❌ Error al comunicarse con Google Sheets:", error);
        alert("No se pudo enviar la información. Verifica tu conexión o intenta más tarde.");
    }
});