# EcoCash (Smart Cities) — Ionic React

> **HackMTY 2025 — Proyecto Banorte Smart Cities**  
> **Stack:** Ionic React + Vite + Capacitor + FastAPI + Snowflake

---

## 🧭 Descripción General
**EcoCash** es una aplicación móvil diseñada para **incentivar el pago puntual de servicios básicos** (luz, agua, gas) mientras promueve la **educación financiera y el ahorro sustentable**.

La app permite pagar servicios, escanear recibos, consultar históricos de consumo y participar en un **programa de CashBack verde** que recompensa a los usuarios que reducen su consumo respecto al promedio municipal.

---

## 💡 Funcionamiento del Programa EcoCash
1. **Promedio municipal:**  
   Se calcula el promedio mensual de consumo de los servicios básicos por municipio.

2. **Comparación individual:**  
   Si el usuario reduce su consumo respecto al promedio municipal del mismo mes del año anterior y paga a tiempo con su tarjeta de débito Banorte, califica para el programa.

3. **CashBack verde:**  
   El usuario recibe un **5% del monto del recibo** como incentivo, que se deposita en el **Fondo EcoCash Banorte**.

4. **Fondo EcoCash:**  
   - Permanece invertido por 1 año.  
   - Genera un **interés anual del 5%**.  
   - Luego puede retirarse o reinvertirse.

5. **Impacto:**  
   - Promueve pagos digitales.  
   - Incentiva el ahorro energético.  
   - Mejora la recaudación y digitalización de ingresos municipales.

---

## 📱 Flujo de la Aplicación

1️⃣ **Inicio** — Pantalla principal con saludo y accesos rápidos (Pagar, Escanear, Historial).  
2️⃣ **Pagos** — Selección del servicio (CFE, Agua, Gas, etc.).  
3️⃣ **Escanear código** — Captura del código de barras o QR del recibo.  
4️⃣ **Confirmar pago** — Visualización de monto, referencia y envío del pago.  
5️⃣ **Operación exitosa** — Pantalla verde de confirmación.  
6️⃣ **Activar EcoCash** — Mensaje informando la elegibilidad y activación del programa.  
7️⃣ **Historial** — Resumen de consumos, ahorros y rendimiento del fondo.

---

## 🧩 Endpoints del Backend (FastAPI)

| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| **GET** | `/health` | Estado general del API. |
| **GET** | `/health/config` | Verifica variables de entorno y conexión con Snowflake. |
| **POST** | `/registros` | Crear un nuevo registro de consumo o pago. |
| **GET** | `/registros` | Listar registros (filtros opcionales: zona, cuenta, periodo). |
| **GET** | `/registros/{numero_cuenta}/{periodo}` | Obtener un registro específico. |
| **PUT** | `/registros/{numero_cuenta}/{periodo}` | Actualizar un registro existente. |
| **DELETE** | `/registros/{numero_cuenta}/{periodo}` | Eliminar un registro. |

---

## 🧠 Lógica de Evaluación EcoCash

| Condición | Resultado |
|------------|------------|
| Consumo < Promedio municipal del mes anterior | ✅ Apto para CashBack |
| Pago puntual | ✅ |
| Pago con tarjeta Banorte | ✅ |
| Cumple todas | 5% del monto → Fondo EcoCash (5% anual) |

---

## 💵 Beneficios

### Para el usuario:
- Recompensa por ahorro energético.  
- Inversión automática y sin fricción.  
- Acceso a educación financiera.

### Para Banorte:
- Incremento en pagos digitales.  
- Fidelización por incentivos verdes.  
- Captación de nuevos clientes sostenibles.

### Para el gobierno:
- Mejora en la recaudación en tiempo real.  
- Información de consumo energético por municipio.  
- Impulso a la digitalización de servicios públicos.

---
