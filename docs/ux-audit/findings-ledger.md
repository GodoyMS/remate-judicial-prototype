# Ledger de hallazgos — 124 ítems

Registro completo de los hallazgos de las hojas **Login Usuario**, **Usuario Estándar** y
**Usuario Premium**, con su estado verificado contra el código actual y el paquete de
trabajo que lo cierra.

El plan de ejecución está en [`README.md`](./README.md).

## Prefijos de ID

| Prefijo | Hoja de origen |
|---|---|
| `L-0xx` | Login Usuario (40 hallazgos) |
| `E-0xx` | Usuario Estándar (52 hallazgos) |
| `P-0xx` | Usuario Premium (32 hallazgos) |

Los números conservan el `RM-0xx` original de cada hoja. Como las tres hojas reinician la
numeración, el prefijo es obligatorio para desambiguar: `RM-001` existe tres veces.

## Estados

| Estado | Significado |
|---|---|
| `ABIERTO` | Verificado en código: el problema existe tal como lo describe la auditoría |
| `PARCIAL` | Una ronda previa lo atacó; queda trabajo descrito en el paquete |
| `YA RESUELTO` | El código actual ya cumple. Solo requiere verificación de no regresión |
| `NO ROMPER` | La auditoría lo marcó como acierto. Guarda de regresión |

> **Sobre la columna *Evidencia* de la hoja original:** contiene capturas en varias filas
> que **no fue posible recuperar** (la exportación de texto de Google Sheets omite las
> imágenes incrustadas y la exportación `.xlsx` falla por tamaño). El estado de cada
> hallazgo se determinó leyendo el código. Ver la nota de alcance en `README.md` §2.

---

# Parte 1 — Vista por hoja

## Login Usuario

| # | Prioridad | Dimensión | Hallazgo | Estado verificado | Paquete |
|---|---|---|---|---|---|
| L-001 | Crítica | UX | No existe una vía inmediata de ayuda relacionada con la verificación | ABIERTO | WP-1.3 |
| L-002 | Alta | UX | Cuentas demo reciben demasiado protagonismo antes del formulario real | ABIERTO | WP-1.1 |
| L-003 | Alta | UX | Falta indicar qué ocurre si la verificación es observada o rechazada | ABIERTO | WP-1.3 |
| L-004 | Media | UX | El plazo “2–4 horas” debe corresponder al tiempo real del proceso | ABIERTO | WP-1.3 |
| L-005 | Baja | UX | El formulario tiene una jerarquía básica clara | NO ROMPER | WP-1.1 |
| L-006 | Crítica | UI | Login y Registro reutilizan exactamente el mismo panel comercial | ABIERTO | WP-1.2 |
| L-007 | Alta | UI | El panel promocional puede competir visualmente con el formulario | PARCIAL | WP-1.1 |
| L-008 | Media | UI | Exceso de mensajes en una pantalla de una sola tarea | PARCIAL | WP-1.1 |
| L-009 | Media | UI | La pantalla de verificación pierde casi completamente la identidad visual de Rematto | PARCIAL | WP-1.3 |
| L-010 | Media | UI | Los cuatro estados internos no siguen exactamente el mismo sistema que el stepper superior | ABIERTO | WP-1.3 |
| L-011 | Baja | UI | Los textos legales inferiores pueden quedar demasiado desconectados del formulario | ABIERTO | WP-1.1 |
| L-012 | Baja | UI | La iconografía del stepper no mantiene colores completamente uniforme | PARCIAL | WP-1.3 |
| L-013 | Crítica | Propuesta comercial | No se comunica de forma suficientemente concreta qué obtiene una persona al registrarse | PARCIAL | WP-1.2 |
| L-014 | Crítica | Propuesta comercial | El contenido no está pensado específicamente para un usuario recurrente | ABIERTO | WP-1.1 |
| L-015 | Alta | Propuesta comercial | El momento de solicitar DNI tiene una barrera comercial alta. | PARCIAL | WP-1.3 |
| L-016 | Alta | Propuesta comercial | El testimonio financiero utiliza un resultado muy concreto como argumento de acceso | YA RESUELTO | WP-1.1 |
| L-017 | Alta | Propuesta comercial | Puede interpretarse que registrarse implica comprometerse inmediatamente a invertir | YA RESUELTO | WP-1.2 |
| L-018 | Alta | Propuesta comercial | La acción “Crear cuenta” podría comunicar mejor que es el inicio y no el final del proceso | PARCIAL | WP-1.2 |
| L-019 | Alta | Propuesta comercial | El mismo tipo de mensaje comercial se utiliza en etapas con objetivos muy distintos | ABIERTO | WP-1.2 |
| L-020 | Alta | Propuesta comercial | La rentabilidad tiene demasiado protagonismo dentro de una pantalla de autenticación | YA RESUELTO | WP-1.1 |
| L-021 | Media | Propuesta comercial | “Sin comisiones de apertura” comunica solo una parte de la estructura de costos | YA RESUELTO | WP-1.1 |
| L-022 | Media | Propuesta comercial | La pantalla de acceso vuelve a vender el producto a un usuario que ya decidió ingresar | PARCIAL | WP-1.1 |
| L-023 | Media | Propuesta comercial | El registro podría reforzar mejor el beneficio final. | PARCIAL | WP-1.2 |
| L-024 | Baja | Propuesta comercial | Falta una alternativa para el usuario que todavía tenga dudas | PARCIAL | WP-1.3 |
| L-025 | Crítica | Confianza | La marca aparece como “Remata" en lugar de Rematto. | PARCIAL | WP-0.3 |
| L-026 | Alta | Confianza | Los documentos legales deben ser fácilmente verificables desde el punto de acceso | YA RESUELTO | WP-1.1 |
| L-027 | Alta | Confianza | El resultado financiero del testimonio puede interpretarse como promesa implícita | YA RESUELTO | WP-1.1 |
| L-028 | Media | Confianza | La pantalla no presenta señales específicas de seguridad asociadas al inicio de sesión | ABIERTO | WP-1.1 |
| L-029 | Baja | Confianza | “Ir al dashboard” puede generar una falsa percepción de que la cuenta ya está habilitada | ABIERTO | WP-1.3 |
| L-030 | Alta | Funcionalidad | Debe impedirse el registro con correo ya existente | ABIERTO | WP-1.4 |
| L-031 | Alta | Funcionalidad | "Ir al dashboard” puede generar dudas mientras la cuenta aún no está activada | ABIERTO | WP-1.3 |
| L-032 | Alta | Funcionalidad | Enlaces a Términos y Privacidad no están correctamente redireccionados. | YA RESUELTO | WP-1.1 |
| L-033 | Alta | Funcionalidad | Debe validarse limitación de intentos repetidos | ABIERTO | WP-1.4 |
| L-034 | Media | Funcionalidad | Debe definirse qué ocurre cuando la sesión expira | ABIERTO | WP-1.4 |
| L-035 | Media | Funcionalidad | Registro con Google y Login deben ser coherentes entre sí | ABIERTO | WP-1.4 |
| L-036 | Media | Funcionalidad | Debe existir un límite de tamaño controlado antes de subir el archivo | ABIERTO | WP-1.4 |
| L-037 | Baja | Funcionalidad | Recuperación de contraseña sí dispone de ruta independiente | NO ROMPER | WP-1.4 |
| L-038 | Baja | Funcionalidad | Validar formato de correo antes de autenticar | PARCIAL | WP-1.4 |
| L-039 | Media | Responsive | Formulario de registro puede volverse excesivamente largo en móvil | ABIERTO | WP-7.2 |
| L-040 | Baja | Responsive | La pantalla final presenta una adaptación móvil correcta en sus elementos principales | NO ROMPER | WP-7.2 |

_40 hallazgos._

## Usuario Estándar

| # | Prioridad | Dimensión | Hallazgo | Estado verificado | Paquete |
|---|---|---|---|---|---|
| E-001 | Crítica | UX | “Nueva inversión” e “Invertir” representan prácticamente la misma intención | ABIERTO | WP-2.1 |
| E-002 | Alta | UX/ FUNCIONALIDAD | En el resumen, "Ver todas” pasa desapercibido. | ABIERTO | WP-2.2 |
| E-003 | Alta | UX | Falta una visión global del ciclo de cada inversión | ABIERTO | WP-2.3 |
| E-004 | Alta | UX | No existe una sección explícita de “Pendientes” o “Requiere tu atención” | ABIERTO | WP-2.2 |
| E-005 | Alta | UX | “Inversiones activas” agrupa estados conceptualmente distintos | ABIERTO | WP-2.2 |
| E-006 | Alta | UX | Las cards de inversiones no muestran una acción explícita para consultar el detalle | ABIERTO | WP-2.3 |
| E-007 | Alta | UX | El incremento mensual de S/ 2,300 no está claramente etiquetado | ABIERTO | WP-4.1 |
| E-008 | Media | UX | La promoción Premium aparece antes que la información principal del portafolio | ABIERTO | WP-2.2 |
| E-009 | Media | UX | No se evidencia una fecha de última actualización de las cifras del portafolio | ABIERTO | WP-2.2 |
| E-010 | Media | UX | Las cards no muestran cuánto se ha ganado o se espera ganar en dinero | ABIERTO | WP-2.3 |
| E-011 | Baja | UX | Los días mostrados en las inversiones son ambiguos | ABIERTO | WP-2.3 |
| E-012 | Baja | UX | “Dashboard” puede ser un término innecesariamente técnico para público general | ABIERTO | WP-2.1 |
| E-013 | Baja | UX | No existe un siguiente paso claramente personalizado | ABIERTO | WP-2.2 |
| E-014 | Crítica | UI | Demasiados elementos compiten en la zona superior. Ningun CTA es mas grande que el otro. El tamaño es prácticamente el mismo. | ABIERTO | WP-2.2 |
| E-015 | Alta | UI | El bloque Premium tiene demasiado peso visual frente al contenido personal | ABIERTO | WP-2.2 |
| E-016 | Alta | UI | Notificaciones solo accesibles mediante un pequeño icono superior y no desde navegación principal | ABIERTO | WP-2.1 |
| E-017 | Alta | UI | Siete entradas principales producen una sidebar visualmente cargada | ABIERTO | WP-2.1 |
| E-018 | Alta | UI | La página muestra  “Remata” como marca. | PARCIAL | WP-0.3 |
| E-019 | Media | UI | Diferencias de alineación, tamaño o espaciado entre tarjetas | ABIERTO | WP-0.3 |
| E-020 | Media | UI | Separar visualmente S/12,500 de +S/2,300 | ABIERTO | WP-4.1 |
| E-021 | Media | UI | Monto y retorno estimado necesitan una relación visual más ordenada | ABIERTO | WP-2.3 |
| E-022 | Media | UI | Los cuatro beneficios Premium añaden demasiados puntos visuales dentro de una card secundaria | ABIERTO | WP-2.2 |
| E-023 | Media | UI | El elemento activo necesita distinguirse claramente sin depender solo de color de texto | PARCIAL | WP-2.1 |
| E-024 | Baja | UI | Las imágenes genéricas pueden dominar demasiado respecto de los datos | ABIERTO | WP-2.3 |
| E-025 | Crítica | Propuesta Comercial | El producto no comunica claramente por qué el usuario debería mantener una relación recurrente con Rematto | ABIERTO | WP-8 |
| E-026 | Alta | Propuesta Comercial | La propuesta de valor del usuario Estándar queda eclipsada por Premium | ABIERTO | WP-8 |
| E-027 | Alta | Propuesta Comercial | Falta una comparación concreta entre Estándar y Premium | ABIERTO | WP-8 |
| E-028 | Alta | Propuesta Comercial | La narrativa comercial dentro de la cuenta continúa concentrándose en “ganar más” | PARCIAL | WP-8 |
| E-029 | Media | Propuesta Comercial | Las actualizaciones existentes no se aprovechan para demostrar el valor continuo del servicio | ABIERTO | WP-8 |
| E-030 | Media | Propuesta Comercial | Recomendar nuevas oportunidades de forma relevante | ABIERTO | WP-8 |
| E-031 | Baja | Propuesta Comercial | “Plan Estándar” puede estar empaquetando como plan algo que parece más cercano a un nivel de acceso | ABIERTO | WP-8 |
| E-032 | Alta | Confianza | “Propiedades verificadas” se declara, pero no se muestra qué fue verificado | ABIERTO | WP-3.1 |
| E-033 | Alta | Confianza | Falta evidencia visible del expediente y estado judicial que sustenta la oportunidad | ABIERTO | WP-3.1 |
| E-034 | Alta | Confianza | La plataforma representa únicamente escenarios de rendimiento positivo | ABIERTO | WP-4.3 |
| E-035 | Alta | Confianza | Falta un resumen de riesgos específico para la oportunidad antes de invertir | ABIERTO | WP-3.2 |
| E-036 | Media | Confianza | El ROI estimado no permite consultar su metodología | ABIERTO | WP-3.2 |
| E-037 | Media | Confianza | Etiquetas como “Alta demanda”, “Cierra pronto” o “Proceso expedito” pueden sonar vagas. | ABIERTO | WP-3.3 |
| E-038 | Crítica | Funcionalidad | El sistema debe soportar el ciclo completo, incluyendo escenarios no positivos | ABIERTO | WP-4.3 |
| E-039 | Alta | Funcionalidad | Hay propiedades que se muestran como "Próximo" y luego en "oportunidades" se pueden recibir aportes e inversiones. | ABIERTO | WP-5.1 |
| E-040 | Alta | Funcionalidad | El ROI de una misma propiedad es diferente entre módulos | ABIERTO | WP-0.1 |
| E-041 | Alta | Funcionalidad | La Molina muestra conceptos diferentes como si fueran el mismo estado | ABIERTO | WP-0.1 |
| E-042 | Alta | Funcionalidad | Una inversión confirmada debe actualizar todos los módulos relacionados | ABIERTO | WP-5.2 |
| E-043 | Alta | Funcionalidad | ROI, reembolso y devolución deben tratarse como movimientos distintos | ABIERTO | WP-4.1 |
| E-044 | Alta | Funcionalidad | Cada notificación debe abrir el recurso específico relacionado | PARCIAL | WP-5.3 |
| E-045 | Media | Funcionalidad | Inversiones de propiedades en dólares aparecen expresadas en soles en el Dashboard | ABIERTO | WP-4.2 |
| E-046 | Baja | Funcionalidad | Debe existir tratamiento funcional para inversiones que exceden el plazo previsto | ABIERTO | WP-4.3 |
| E-047 | Alta | Responsive | El control flotante de personalización invade repetidamente el contenido móvil | YA RESUELTO | WP-7.2 |
| E-048 | Alta | Responsive | El bloque Premium conserva prácticamente toda su extensión desktop en móvil | ABIERTO | WP-7.2 |
| E-049 | Alta | Responsive | Los montos financieros no se ven completos. | ABIERTO | WP-7.1 |
| E-050 | Alta | Responsive | La fecha ocupa una columna importante mientras información del activo se recorta | ABIERTO | WP-7.1 |
| E-051 | Media | Responsive | La disposición a una columna genera una longitud considerable del resumen | ABIERTO | WP-7.1 |
| E-052 | Baja | Responsive | Las métricas principales sí se reorganizan correctamente a una columna | NO ROMPER | WP-7.1 |

_52 hallazgos._

## Usuario Premium

| # | Prioridad | Dimensión | Hallazgo | Estado verificado | Paquete |
|---|---|---|---|---|---|
| P-001 | Alta | UX | Las inversiones activas no identifican si son Estándar o Premium | ABIERTO | WP-6.1 |
| P-002 | Alta | UX | “Ver oportunidades” debería llevar directamente a las oportunidades activas. | ABIERTO | WP-6.1 |
| P-003 | Alta | UX | La exclusividad Premium no muestra claramente cuándo termina | PARCIAL | WP-6.1 |
| P-004 | Media | UX | “Capturadas” y especialmente “Convertidas” requieren una explicación más clara. | ABIERTO | WP-6.1 |
| P-005 | Media | UX | En la parte superior aparece un botón “Premium” y debajo un banner “Oportunidades Premium activas" con un botón "Ver oportunidades”. Además puede acceder desde el menú lateral. | ABIERTO | WP-6.1 |
| P-006 | Alta | UI | Capital requerido, ROI y ganancia estimada reciben un peso demasiado similar | ABIERTO | WP-6.1 |
| P-007 | Media | UI | La condición Premium se repite visualmente en exceso | ABIERTO | WP-6.1 |
| P-008 | Media | UI | El banner Premium compite con los datos personales del portafolio | ABIERTO | WP-6.1 |
| P-009 | Baja | UI | Modalidad, disponibilidad y otros atributos se representan mediante demasiadas etiquetas. | ABIERTO | WP-6.1 |
| P-010 | Crítica | Propuesta Comercial | “Captura propiedades al 100%” no define qué derecho económico o jurídico adquiere realmente el usuario | ABIERTO | WP-6.2 |
| P-011 | Crítica | Propuesta Comercial | No se desarrolla suficientemente el valor que Rematto entrega después de recibir el capital | ABIERTO | WP-6.2 |
| P-012 | Alta | Propuesta Comercial | No se explica desde el inicio para qué capacidad financiera fue diseñada la modalidad | ABIERTO | WP-6.2 |
| P-013 | Alta | Propuesta Comercial | Se continúa utilizando “Ya capturada” "Capturada por ti" en el flujo de propiedades premium. | ABIERTO | WP-6.3 |
| P-014 | Alta | Propuesta Comercial | El paso a Estándar se comunica como consecuencia de que “nadie quiso invertir” | ABIERTO | WP-6.2 |
| P-015 | Media | Propuesta Comercial | Se debe enfatizar que modalidad diferente estás obteniendo en vez de solo dar a entender que ganarás más. | PARCIAL | WP-6.2 |
| P-016 | Media | Propuesta Comercial | La exclusividad Premium está poco definida porque un usuario Estándar puede consultar gran parte de la información clave | ABIERTO | WP-6.2 |
| P-017 | Baja | Propuesta Comercial | Se comunica ganancia  sin mostrar costos o que es un estimado claramente. | ABIERTO | WP-6.2 |
| P-018 | Alta | Confianza | Solo se muestra un escenario financiero favorable | ABIERTO | WP-6.3 |
| P-019 | Alta | Confianza | No se explica qué criterios hacen que una oportunidad sea “Premium” | ABIERTO | WP-6.3 |
| P-020 | Alta | Confianza | La evidencia documental visible no es proporcional al tamaño de la operación | ABIERTO | WP-6.3 |
| P-021 | Alta | Confianza | No se explica suficientemente dónde estará el dinero durante el proceso de alto valor de dinero. | ABIERTO | WP-6.3 |
| P-022 | Media | Confianza | Se publican nombres de personas asociados a operaciones de muy alto valor | ABIERTO | WP-6.3 |
| P-023 | Media | Confianza | No existe una vía humana claramente destacada para una decisión de inversión de miles de dólares. | ABIERTO | WP-6.3 |
| P-024 | Crítica | Funcionalidad | El flujo de captura al 100% no puede depender de un checkout convencional con tarjeta para operaciones de alto valor | ABIERTO | WP-6.4 |
| P-025 | Crítica | Funcionalidad/ Propuesta comercial | “Pago confirmado” no debe equivaler automáticamente a “propiedad adquirida” | ABIERTO | WP-6.4 |
| P-026 | Alta | Funcionalidad | El sistema debe validar la viabilidad del medio de pago antes de reservar definitivamente la oportunidad | ABIERTO | WP-6.4 |
| P-027 | Alta | Funcionalidad | Debe definirse explícitamente si Premium admite pagos fraccionados | ABIERTO | WP-6.4 |
| P-028 | Alta | Funcionalidad | Los límites del medio de pago deben mostrarse antes de que el usuario llegue al último paso | ABIERTO | WP-6.4 |
| P-029 | Alta | Funcionalidad | El proceso Premium no debe reutilizar el paso “Monto” editable del flujo Estándar | YA RESUELTO | WP-6.4 |
| P-030 | Alta | Funcionalidad | Validar límites de Yape u otros medios | ABIERTO | WP-6.4 |
| P-031 | Media | Responsive | El saludo se fragmenta en móvil | ABIERTO | WP-7.2 |
| P-032 | Media | Responsive | Los dos cards superiores ocupan demasiado espacio horizontal en móvil | ABIERTO | WP-7.2 |

_32 hallazgos._

---

# Parte 2 — Detalle agrupado por paquete de trabajo

Texto literal de la auditoría (*Hallazgo*, *Observación*, *Recomendación*) para cada
hallazgo, agrupado por el paquete que lo ejecuta. Un agente que tome un paquete encuentra
aquí todo su contexto sin volver a la hoja de cálculo.

### WP-0.1

**E-040** · Alta · `ABIERTO`  
*Hallazgo:* El ROI de una misma propiedad es diferente entre módulos  
*Observación:* San Isidro muestra +21% est. en Dashboard pero 22% en Propiedades. La Molina aparece +17% est. en Dashboard y 18% en Propiedades.  
*Recomendación del auditor:* Mantener un único porcentaje para la misma propiedad y alinearlo en Dashboard y Propiedades.

**E-041** · Alta · `ABIERTO`  
*Hallazgo:* La Molina muestra conceptos diferentes como si fueran el mismo estado  
*Observación:* En Dashboard figura “En revisión legal”, mientras el catálogo muestra la oportunidad como Activo.  
*Recomendación del auditor:* Mantener ambos campos por separado.


### WP-0.3

**L-025** · Crítica · `PARCIAL`  
*Hallazgo:* La marca aparece como “Remata" en lugar de Rematto.  
*Observación:* Se requiere tener una marca definida.  
*Recomendación del auditor:* Estandarizar la denominación Rematto en logo, encabezados, metadatos y todas las pantallas de autenticación.

**E-018** · Alta · `PARCIAL`  
*Hallazgo:* La página muestra  “Remata” como marca.  
*Observación:* Identidad de marca en el Dashboard.  
*Recomendación del auditor:* Reemplazar y alinear la marca a un solo nombre.

**E-019** · Media · `ABIERTO`  
*Hallazgo:* Diferencias de alineación, tamaño o espaciado entre tarjetas  
*Observación:* “Dashboard”, saludo, rendimiento, indicador adicional y “Nueva inversión”, seguido inmediatamente del bloque Premium.  
*Recomendación del auditor:* Definir escalas  fijas Para titulos, subtitulos, descripciones. CTAS grandes. Crear una estructura visual.


### WP-1.1

**L-002** · Alta · `ABIERTO`  
*Hallazgo:* Cuentas demo reciben demasiado protagonismo antes del formulario real  
*Observación:* “Cuentas demo”, “Usuario Premium” y “Usuario Estándar” aparecen antes de los campos de ingreso normal.  
*Recomendación del auditor:* Si es que está así momentaneamente. En el futuro explicar los beneficios que tendrás con cada uno.

**L-005** · Baja · `NO ROMPER`  
*Hallazgo:* El formulario tiene una jerarquía básica clara  
*Observación:* “Bienvenido de vuelta” explica inmediatamente que el usuario debe ingresar correo y contraseña; recuperación y registro también están disponibles.  
*Recomendación del auditor:* Mantener esta simplicidad al eliminar elementos demo y otros distractores.

**L-007** · Alta · `PARCIAL`  
*Hallazgo:* El panel promocional puede competir visualmente con el formulario  
*Observación:* El login combina titular comercial, cuatro beneficios, testimonio y pie legal junto al formulario de autenticación.  
*Recomendación del auditor:* Dar mayor jerarquía visual al formulario y utilizar el panel izquierdo como respaldo de marca, no como una segunda landing.

**L-008** · Media · `PARCIAL`  
*Hallazgo:* Exceso de mensajes en una pantalla de una sola tarea  
*Observación:* El usuario recibe propuesta comercial, cuatro beneficios, testimonio, claim regulatorio, cuentas demo, formulario, recuperación, registro y aceptación legal en una única vista.  
*Recomendación del auditor:* Reducir contenido secundario y proteger la simplicidad del flujo.

**L-011** · Baja · `ABIERTO`  
*Hallazgo:* Los textos legales inferiores pueden quedar demasiado desconectados del formulario  
*Observación:* Términos y privacidad aparecen después de todas las acciones principales.  
*Recomendación del auditor:* Mantenerlos mas visibles y legibles, con separación coherente del último elemento del formulario.

**L-014** · Crítica · `ABIERTO`  
*Hallazgo:* El contenido no está pensado específicamente para un usuario recurrente  
*Observación:* Los argumentos son prácticamente los mismos utilizados para convencer a alguien que todavía no conoce Rematto.  
*Recomendación del auditor:* “Tus oportunidades, siempre a la mano.” Acompañarlo con beneficios propios de la cuenta, no de adquisición.

**L-016** · Alta · `YA RESUELTO`  
*Hallazgo:* El testimonio financiero utiliza un resultado muy concreto como argumento de acceso  
*Observación:* Se comunica una inversión de S/2,000 y un resultado de S/420 en cuatro meses.  
*Recomendación del auditor:* Sustituir por una experiencia centrada en servicio: “Desde mi cuenta puedo revisar el avance de mis oportunidades y acceder a la información que necesito.” Si mantienen el caso financiero, agregar inmediatamente: “Resultado correspondiente a una operación específica. Los resultados pueden variar.”

**L-020** · Alta · `YA RESUELTO`  
*Hallazgo:* La rentabilidad tiene demasiado protagonismo dentro de una pantalla de autenticación  
*Observación:* Se vuelve a destacar el retorno de hasta 22% anual como uno de los principales argumentos.  
*Recomendación del auditor:* Dar menor protagonismo a la rentabilidad y sustituir parte del contenido por mensajes asociados a seguimiento, transparencia o acceso seguro a la cuenta. Ej: “Accede a tu cuenta para revisar tus oportunidades y hacer seguimiento de tus inversiones.”

**L-021** · Media · `YA RESUELTO`  
*Hallazgo:* “Sin comisiones de apertura” comunica solo una parte de la estructura de costos  
*Observación:* Se resalta la ausencia de una comisión determinada sin explicar las demás.  
*Recomendación del auditor:* Cambiar el beneficio por “Costos y condiciones transparentes” y convertirlo en enlace a “Ver tarifas y costos”. Si todavía no existe esa página, retirar temporalmente la referencia a comisiones.

**L-022** · Media · `PARCIAL`  
*Hallazgo:* La pantalla de acceso vuelve a vender el producto a un usuario que ya decidió ingresar  
*Observación:* El panel izquierdo dedica gran parte del espacio a beneficios comerciales: inversión desde S/500, retornos, propiedades verificadas y ausencia de comisión de apertura.  
*Recomendación del auditor:* Mantener un mensaje de marca breve y uno o dos elementos de confianza. Priorizar el acceso sobre la venta del producto.

**L-026** · Alta · `YA RESUELTO`  
*Hallazgo:* Los documentos legales deben ser fácilmente verificables desde el punto de acceso  
*Observación:* Términos y Política de privacidad aparecen mencionados, pero anteriormente se detectó que sus destinos no están correctamente diferenciados ni linkeados.  
*Recomendación del auditor:* Vincular ambos de forma independiente y que redireccionen a las páginas indicadas.

**L-027** · Alta · `YA RESUELTO`  
*Hallazgo:* El resultado financiero del testimonio puede interpretarse como promesa implícita  
*Observación:* El Login menciona una inversión de S/2,000 y un resultado de S/420 en cuatro meses.  
*Recomendación del auditor:* . Utilizar una experiencia centrada en confianza, por ejemplo: “Pude revisar la información de la oportunidad y seguir su avance desde mi cuenta.” Si se conserva la cifra, añadir inmediatamente debajo: “Resultado correspondiente a una operación específica. Los resultados pueden variar.”

**L-028** · Media · `ABIERTO`  
*Hallazgo:* La pantalla no presenta señales específicas de seguridad asociadas al inicio de sesión  
*Observación:* Aunque el panel comercial habla de propiedades y regulación, el formulario en sí no comunica mecanismos de protección de la cuenta  
*Recomendación del auditor:* Comunicar de forma discreta mecanismos reales de seguridad de cuenta. Dar a entender que crear una cuenta no lo compromete a poner su dinero de inmediato.

**L-032** · Alta · `YA RESUELTO`  
*Hallazgo:* Enlaces a Términos y Privacidad no están correctamente redireccionados.  
*Observación:* En login y registro, “Términos de uso” y “Política de privacidad” aparecen pero al probarlo no se accede independientemente a cada documento.  
*Recomendación del auditor:* Asignar enlaces independientes y funcionales a Términos de uso y Política de privacidad, tanto en login como en registro.


### WP-1.2

**L-006** · Crítica · `ABIERTO`  
*Hallazgo:* Login y Registro reutilizan exactamente el mismo panel comercial  
*Observación:* Ambas rutas presentan el mismo titular, argumentos y testimonio.  
*Recomendación del auditor:* Mantener el mismo sistema visual, pero adaptar ligeramente mensaje o recurso gráfico diferenciando “volver a entrar” vs. “crear cuenta”.

**L-013** · Crítica · `PARCIAL`  
*Hallazgo:* No se comunica de forma suficientemente concreta qué obtiene una persona al registrarse  
*Observación:* “Crear cuenta” explica la acción, pero no necesariamente el beneficio que tendrán.  
*Recomendación del auditor:* Debajo de “Crea tu cuenta” colocar: “Regístrate gratis para explorar oportunidades, acceder a información detallada e iniciar la validación de tu perfil.”

**L-017** · Alta · `YA RESUELTO`  
*Hallazgo:* Puede interpretarse que registrarse implica comprometerse inmediatamente a invertir  
*Observación:* El usuario viene de una landing orientada fuertemente a “Invertir ahora”.  
*Recomendación del auditor:* Agregar debajo del texto introductorio: “Crear tu cuenta es gratis y no te obliga a realizar una inversión.”

**L-018** · Alta · `PARCIAL`  
*Hallazgo:* La acción “Crear cuenta” podría comunicar mejor que es el inicio y no el final del proceso  
*Observación:* Los titulos muestran que creando tu cuenta empiezas a invertir.  
*Recomendación del auditor:* Cambiar el texto introductorio a: “Crea tu cuenta para comenzar tu proceso de registro.” Y debajo indicar: “Después verificaremos tus datos antes de habilitar inversiones.”

**L-019** · Alta · `ABIERTO`  
*Hallazgo:* El mismo tipo de mensaje comercial se utiliza en etapas con objetivos muy distintos  
*Observación:* Login, registro, validación y espera representan diferentes momentos del funnel.  
*Recomendación del auditor:* Usar una secuencia concreta y visualmente diferenciada. Utilizar como hilo conductor: “Crea tu cuenta → Verifica tu identidad → Explora oportunidades → Invierte cuando estés listo.” Mostrarlo completo al principio y luego destacar únicamente la etapa actual.

**L-023** · Media · `PARCIAL`  
*Hallazgo:* El registro podría reforzar mejor el beneficio final.  
*Observación:* Se presenta el formulario pero no una consecuencia comercial clara de completarlo.  
*Recomendación del auditor:* Debajo de los pasos agregar: “Una vez validada tu cuenta podrás acceder a las funciones habilitadas para inversionistas.”


### WP-1.3

**L-001** · Crítica · `ABIERTO`  
*Hallazgo:* No existe una vía inmediata de ayuda relacionada con la verificación  
*Observación:* La pantalla comunica que la revisión puede demorar varias horas, pero no muestra un enlace contextual para problemas con documentos o demoras.  
*Recomendación del auditor:* Incorporar un enlace discreto: “¿Problemas con tu verificación? Contáctanos” o “Ver preguntas frecuentes”.

**L-003** · Alta · `ABIERTO`  
*Hallazgo:* Falta indicar qué ocurre si la verificación es observada o rechazada  
*Observación:* La pantalla muestra únicamente la secuencia positiva hasta “Cuenta activada”.  
*Recomendación del auditor:* Añadir un mensaje breve: “Si necesitamos información adicional, te notificaremos por correo y podrás actualizarla desde tu cuenta”.

**L-004** · Media · `ABIERTO`  
*Hallazgo:* El plazo “2–4 horas” debe corresponder al tiempo real del proceso  
*Observación:* Se comunica que el usuario recibirá una confirmación por correo “en las próximas 2–4 horas”.  
*Recomendación del auditor:* Usar un rango realista para validaciones.

**L-009** · Media · `PARCIAL`  
*Hallazgo:* La pantalla de verificación pierde casi completamente la identidad visual de Rematto  
*Observación:* No se observa logo, header ni referencia clara a la marca. Visualmente predominan fondo neutro, stepper y card.  
*Recomendación del auditor:* Mantener al menos una presencia de marca discreta y consistente durante todo el proceso. Jugar con los colores y el Logo.

**L-010** · Media · `ABIERTO`  
*Hallazgo:* Los cuatro estados internos no siguen exactamente el mismo sistema que el stepper superior  
*Observación:* Arriba se representan 3 pasos; dentro de la tarjeta aparecen 4.  
*Recomendación del auditor:* Unificar conceptualmente ambos componentes o hacer  una diferenciación visual más evidente.

**L-012** · Baja · `PARCIAL`  
*Hallazgo:* La iconografía del stepper no mantiene colores completamente uniforme  
*Observación:* Los dos primeros pasos utilizan checks azules y el tercero utiliza un escudo dorado.  
*Recomendación del auditor:* Aplicar una misma lógica a los iconos.

**L-015** · Alta · `PARCIAL`  
*Hallazgo:* El momento de solicitar DNI tiene una barrera comercial alta.  
*Observación:* El usuario pasa de información relativamente normal a entregar un documento sensible.  
*Recomendación del auditor:* Colocar antes de la carga: “¿Por qué necesitamos tu documento?” seguido de: “Verificamos tu identidad antes de habilitar tu cuenta para invertir. Tu documento será utilizado únicamente como parte del proceso de validación.” Añadir enlace “Cómo protegemos tus datos”.

**L-024** · Baja · `PARCIAL`  
*Hallazgo:* Falta una alternativa para el usuario que todavía tenga dudas  
*Observación:* Solo existe una acción principal hacia el dashboard.  
*Recomendación del auditor:* Debajo del botón añadir: “¿Tienes dudas sobre tu verificación? Ver preguntas frecuentes” y “Contactar soporte”.

**L-029** · Baja · `ABIERTO`  
*Hallazgo:* “Ir al dashboard” puede generar una falsa percepción de que la cuenta ya está habilitada  
*Observación:* Se ofrece acceso al dashboard mientras el estado “Cuenta activada” sigue pendiente.  
*Recomendación del auditor:* Encima del botón colocar un banner: “Tu cuenta todavía está en revisión. Puedes explorar la plataforma, pero las operaciones de inversión permanecerán deshabilitadas hasta que aprobemos tu verificación.”

**L-031** · Alta · `ABIERTO`  
*Hallazgo:* "Ir al dashboard” puede generar dudas mientras la cuenta aún no está activada  
*Observación:* La interfaz indica que la “Revisión está en proceso” y que “Cuenta activada” continúa pendiente; sin embargo, inmediatamente se ofrece el CTA principal “Ir al dashboard  
*Recomendación del auditor:* Indicar claramente qué podrá hacer mientras espera. Ej.: “Puedes explorar propiedades mientras verificamos tu cuenta. Para invertir deberás esperar la aprobación”.


### WP-1.4

**L-030** · Alta · `ABIERTO`  
*Hallazgo:* Debe impedirse el registro con correo ya existente  
*Observación:* Un mismo correo no debería crear múltiples cuentas independientes.  
*Recomendación del auditor:* Si el correo ya existe, no crear otra cuenta. Mostrar: “Ya existe una cuenta con este correo. Inicia sesión o recupera tu contraseña.” Incluir ambos enlaces.

**L-033** · Alta · `ABIERTO`  
*Hallazgo:* Debe validarse limitación de intentos repetidos  
*Observación:* No es posible determinar desde la pantalla pública qué mecanismo existe ante múltiples intentos fallidos.  
*Recomendación del auditor:* Validar rate limiting/bloqueo progresivo, monitoreo y recuperación sin revelar información sensible. Puede ser tres o dos intentos de validación por usuario.

**L-034** · Media · `ABIERTO`  
*Hallazgo:* Debe definirse qué ocurre cuando la sesión expira  
*Observación:* Una sesión puede dejar de ser válida mientras el usuario mantiene abierta la aplicación.  
*Recomendación del auditor:* Redirigir al Login con: “Tu sesión venció. Inicia sesión nuevamente para continuar.” Conservar, cuando sea seguro, la ruta a la que intentaba acceder.

**L-035** · Media · `ABIERTO`  
*Hallazgo:* Registro con Google y Login deben ser coherentes entre sí  
*Observación:* El flujo para registro es Google como una vía de registro. Un usuario registrado por esa vía debe poder volver posteriormente.  
*Recomendación del auditor:* Si Google está habilitado para registro, agregar “Continuar con Google” también en Login usando el mismo proveedor y la misma lógica de cuenta.

**L-036** · Media · `ABIERTO`  
*Hallazgo:* Debe existir un límite de tamaño controlado antes de subir el archivo  
*Observación:* Fotografías tomadas desde teléfonos pueden superar varios MB.  
*Recomendación del auditor:* Validar el tamaño localmente antes de enviar. Si supera el límite mostrar: “El archivo supera el máximo de X MB. Selecciona otro archivo.”

**L-037** · Baja · `NO ROMPER`  
*Hallazgo:* Recuperación de contraseña sí dispone de ruta independiente  
*Observación:* ¿Olvidaste tu contraseña?” dirige a ruta donde se solicita correo para enviar un código.  
*Recomendación del auditor:* Validar el flujo, reenvío y cambio de contraseña. De igual manera tomar en cuenta para replicar en redirección a rutas independientes cuando sea necesario.

**L-038** · Baja · `PARCIAL`  
*Hallazgo:* Validar formato de correo antes de autenticar  
*Observación:* El campo debe rechazar valores que claramente no constituyen una dirección de correo.  
*Recomendación del auditor:* Mostrar: “Ingresa un correo electrónico válido.”


### WP-2.1

**E-001** · Crítica · `ABIERTO`  
*Hallazgo:* “Nueva inversión” e “Invertir” representan prácticamente la misma intención  
*Observación:* Existe un CTA “Nueva inversión” en el encabezado y una opción “Invertir” en el menú, además de “Propiedades”.  
*Recomendación del auditor:* Simplificar a “Explorar oportunidades” como CTA y menú principal. Usar Propiedades como destino y eliminar “Invertir” del menú si no representa un proceso distinto.

**E-012** · Baja · `ABIERTO`  
*Hallazgo:* “Dashboard” puede ser un término innecesariamente técnico para público general  
*Observación:* La pantalla muestra "Dashboard"  
*Recomendación del auditor:* Cambiarlo por “Inicio” y utilizar abajo “Resumen de tu cuenta” o mantener “Inicio” según el tono general del producto.

**E-016** · Alta · `ABIERTO`  
*Hallazgo:* Notificaciones solo accesibles mediante un pequeño icono superior y no desde navegación principal  
*Observación:* El icono de notificaciones es prácticamente imperceptible. Solo tiene esa ruta disponible.  
*Recomendación del auditor:* Agregar al Menú principal "Notificaciones"

**E-017** · Alta · `ABIERTO`  
*Hallazgo:* Siete entradas principales producen una sidebar visualmente cargada  
*Observación:* Dashboard, Propiedades, Premium, Mis inversiones, Retornos, Invertir y Mi cuenta se presentan como accesos principales.  
*Recomendación del auditor:* Crear grupos visuales mediante separación: Principal: Inicio, Propiedades, Mis inversiones, Retornos. Cuenta: Mi cuenta. Colocar Premium con tratamiento secundario y separar Cerrar sesión al fondo.

**E-023** · Media · `PARCIAL`  
*Hallazgo:* El elemento activo necesita distinguirse claramente sin depender solo de color de texto  
*Observación:* Todo el dashboard  
*Recomendación del auditor:* Usar fondo de baja intensidad + icon en color primario + indicador lateral de 3–4 px. No usar únicamente cambio de color de texto.


### WP-2.2

**E-002** · Alta · `ABIERTO`  
*Hallazgo:* En el resumen, "Ver todas” pasa desapercibido.  
*Observación:* No se ve claramente  
*Recomendación del auditor:* Colocar bien el CTA y usar los colores de la marca para contrastarlo.

**E-004** · Alta · `ABIERTO`  
*Hallazgo:* No existe una sección explícita de “Pendientes” o “Requiere tu atención”  
*Observación:* El dashboard contiene cifras y actividad, pero no un módulo dedicado a tareas del usuario.  
*Recomendación del auditor:* Añadir arriba de inversiones una tarjeta “Requiere tu atención”. Ej.: “1 documento nuevo por revisar”, “Verificación en proceso”, “0 acciones pendientes”.

**E-005** · Alta · `ABIERTO`  
*Hallazgo:* “Inversiones activas” agrupa estados conceptualmente distintos  
*Observación:* El Dashboard dice que existen 4 inversiones activas, pero entre las cards aparecen “Subasta activa”, “En revisión legal” y “Adjudicado”.  
*Recomendación del auditor:* Sustituir el resumen por estados explícitos: “4 inversiones en curso: 2 en subasta · 1 en revisión · 1 adjudicada”.

**E-008** · Media · `ABIERTO`  
*Hallazgo:* La promoción Premium aparece antes que la información principal del portafolio  
*Observación:* Después del saludo y “Nueva inversión”, el usuario encuentra un bloque amplio de Premium antes de llegar a Total invertido, inversiones activas y retornos.  
*Recomendación del auditor:* Reordenar el dashboard. Colocar la promoción Premium después del contenido personal del usuario.

**E-009** · Media · `ABIERTO`  
*Hallazgo:* No se evidencia una fecha de última actualización de las cifras del portafolio  
*Observación:* El dashboard muestra montos y rendimiento pero no muestra “actualizado el…” junto al resumen.  
*Recomendación del auditor:* Debajo del resumen colocar  Ej: “Información actualizada: 15 ago. 2026 · 00:25” o el momento real de sincronización.

**E-013** · Baja · `ABIERTO`  
*Hallazgo:* No existe un siguiente paso claramente personalizado  
*Observación:* Solo hay un CTA "Nueva inversión"  
*Recomendación del auditor:* acompañar el CTA según contexto: “Revisar documento nuevo”, “Ver inversión que cierra en 8 días”, o, si no hay pendientes, “Explorar nuevas oportunidades”.

**E-014** · Crítica · `ABIERTO`  
*Hallazgo:* Demasiados elementos compiten en la zona superior. Ningun CTA es mas grande que el otro. El tamaño es prácticamente el mismo.  
*Observación:* “Dashboard”, saludo, rendimiento, indicador adicional y “Nueva inversión”, seguido inmediatamente del bloque Premium.  
*Recomendación del auditor:* Crear solo tres niveles: H1/Saludo → dato contextual → CTA. Reducir y mantener un único botón sólido en el encabezado. El contenido visual inicial deberia ser para el usuario no comercial.

**E-015** · Alta · `ABIERTO`  
*Hallazgo:* El bloque Premium tiene demasiado peso visual frente al contenido personal  
*Observación:* Es un card extenso.  
*Recomendación del auditor:* Convertir Premium en una card horizontal compacta. Una línea de descripción y botón secundario “Ver beneficios”.

**E-022** · Media · `ABIERTO`  
*Hallazgo:* Los cuatro beneficios Premium añaden demasiados puntos visuales dentro de una card secundaria  
*Observación:* El bloque enumera acceso anticipado, ROI, inversión 100% y notificaciones.  
*Recomendación del auditor:* En el dashboard mostrar solo 2 beneficios acompañados de iconos: Acceso anticipado y Oportunidades exclusivas. Llevar los cuatro argumentos a la página de Premium.


### WP-2.3

**E-003** · Alta · `ABIERTO`  
*Hallazgo:* Falta una visión global del ciclo de cada inversión  
*Observación:* Las cards indican el estado actual, pero el Dashboard no explica visualmente qué viene después de “Subasta activa”, “Revisión legal” o “Adjudicado”.  
*Recomendación del auditor:* Añadir en cada inversión un mini estado de proceso: “Subasta → Adjudicación → Venta → Retorno”, resaltando la etapa actual.

**E-006** · Alta · `ABIERTO`  
*Hallazgo:* Las cards de inversiones no muestran una acción explícita para consultar el detalle  
*Observación:* El dashboard presenta cuatro inversiones pero no se evidencia un CTA como “Ver inversión”, “Ver detalle” o “Seguimiento” asociado a cada card.  
*Recomendación del auditor:* Añadir en cada card “Ver seguimiento".

**E-010** · Media · `ABIERTO`  
*Hallazgo:* Las cards no muestran cuánto se ha ganado o se espera ganar en dinero  
*Observación:* La información utiliza porcentajes de ROI, pero no traduce ese porcentaje al monto del usuario.  
*Recomendación del auditor:* Añadir “Retorno estimado: S/735” junto al ROI, calculado sobre su participación, y dejar claro que es estimado.

**E-011** · Baja · `ABIERTO`  
*Hallazgo:* Los días mostrados en las inversiones son ambiguos  
*Observación:* Se muestran textos como “Subasta activa 8 días”  
*Recomendación del auditor:* Colocar "Cierra en 8 días”, “En revisión desde hace 15 días”. Según lo que corresponda.

**E-021** · Media · `ABIERTO`  
*Hallazgo:* Monto y retorno estimado necesitan una relación visual más ordenada  
*Observación:* Cada card muestra monto junto a % estimado.  
*Recomendación del auditor:* Colocar dos columnas internas: izquierda “Tu inversión” + S/3,500, derecha “Retorno estimado” + 21. Todo alineado.

**E-024** · Baja · `ABIERTO`  
*Hallazgo:* Las imágenes genéricas pueden dominar demasiado respecto de los datos  
*Observación:* Todas las inversiones incorporan fotografías mientras el objetivo principal del card es financiero/de seguimiento.  
*Recomendación del auditor:* Reservar la mayor superficie para estado, monto y datos de la inversión.


### WP-3.1

**E-032** · Alta · `ABIERTO`  
*Hallazgo:* “Propiedades verificadas” se declara, pero no se muestra qué fue verificado  
*Observación:* No se evidencia en la vista pública del detalle un bloque que explique el alcance de dicha verificación.  
*Recomendación del auditor:* Añadir en cada detalle un bloque “Verificación de la oportunidad” con: Estado: Verificada · Fecha de revisión · Qué se revisó · Documentos disponibles · Última actualización.

**E-033** · Alta · `ABIERTO`  
*Hallazgo:* Falta evidencia visible del expediente y estado judicial que sustenta la oportunidad  
*Observación:* El detalle muestra estado comercial, descripción y datos financieros, pero no expone en el contenido rastreado datos como número de expediente, órgano judicial, etapa del procedimiento o fecha de revisión del expediente.  
*Recomendación del auditor:* Incorporar una sección que que muestre por propiedad “Proceso judicial” con N.º de expediente · Juzgado/órgano competente · Etapa actual · Fecha de última revisión Enlaces/documentos permitidos que respalden esos datos.


### WP-3.2

**E-035** · Alta · `ABIERTO`  
*Hallazgo:* Falta un resumen de riesgos específico para la oportunidad antes de invertir  
*Observación:* Bloque previo a “Invertir ahora”.  
*Recomendación del auditor:* Antes de “Invertir ahora” añadir “Antes de invertir” con 3,4 líneas: “Retorno estimado, no garantizado · Plazo estimado sujeto al proceso · Posibilidad de recuperación inferior a la prevista · Liquidez no inmediata”, adaptado y validado legalmente para el modelo real. Añadir “Ver riesgos completos”.

**E-036** · Media · `ABIERTO`  
*Hallazgo:* El ROI estimado no permite consultar su metodología  
*Observación:* Las propiedades presentan retornos estimados como 24%, 22% y 18%, pero en el detalle visible no se muestran los supuestos utilizados para llegar a esas cifras.  
*Recomendación del auditor:* Junto al ROI añadir “Ver cálculo”. Abrir un desglose que lo justifique.


### WP-3.3

**E-037** · Media · `ABIERTO`  
*Hallazgo:* Etiquetas como “Alta demanda”, “Cierra pronto” o “Proceso expedito” pueden sonar vagas.  
*Observación:* Las oportunidades se promocionan mediante badges como “Alta demanda”, “Cierra pronto” y “Proceso expedito”.  
*Recomendación del auditor:* Sustituir etiquetas vagas por evidencia concreta. Ej.: en vez de solo “Alta demanda”, mostrar “23 inversionistas · 70% financiado”. Para “Cierra pronto”, mostrar directamente “Cierra en 5 días”. Si “Proceso expedito” por algo más entendible. De igual forma, cambiar los colores del CTA para que se vean más.


### WP-4.1

**E-007** · Alta · `ABIERTO`  
*Hallazgo:* El incremento mensual de S/ 2,300 no está claramente etiquetado  
*Observación:* La interfaz no indica expresamente si se trata de valorización estimada, ganancia realizada, nuevas inversiones u otro tipo de movimiento.  
*Recomendación del auditor:* Si es que es una ganancia. + S/ 2,300 de ganancias acreditadas este mes”. Añadir un tooltip “¿Cómo se calcula?” con la fórmula y el periodo utilizado.

**E-020** · Media · `ABIERTO`  
*Hallazgo:* Separar visualmente S/12,500 de +S/2,300  
*Observación:* Tiene que parecer una variación, no otro saldo.  
*Recomendación del auditor:* Mantener S/12,500 como número dominante. Mostrar la variación en una cápsula secundaria: ↑ S/ 2,300 este mes/año/estimado.

**E-043** · Alta · `ABIERTO`  
*Hallazgo:* ROI, reembolso y devolución deben tratarse como movimientos distintos  
*Observación:* La sección Retornos ya presenta 3 ROI, 1 reembolso y 1 devolución.  
*Recomendación del auditor:* Separar los movimientos en tres categorías visibles: “Ganancia”, “Devolución de capital” y “Reembolso”. Solo los movimientos clasificados como “Ganancia” deben sumarse al indicador de retornos o ganancias del Dashboard. Ej: si el usuario invirtió S/1,000 y recibe S/1,200, mostrar S/1,000 como capital devuelto y S/200 como ganancia.


### WP-4.2

**E-045** · Media · `ABIERTO`  
*Hallazgo:* Inversiones de propiedades en dólares aparecen expresadas en soles en el Dashboard  
*Observación:* Penthouse Miraflores es una oportunidad en USD con mínimo USD 2,000; el Dashboard muestra para esa misma propiedad S/ 2,500.  
*Recomendación del auditor:* Cada inversión debe mostrarse y guardarse como los originales. USD si es el caso. Añadir en todo caso un estimado en soles, sin sustituir la moneda original..


### WP-4.3

**E-034** · Alta · `ABIERTO`  
*Hallazgo:* La plataforma representa únicamente escenarios de rendimiento positivo  
*Observación:* No se evidencia dentro de la experiencia del usuario cómo se representarían escenarios de menor rendimiento, retorno nulo, pérdida, devolución de capital o extensión del plazo.  
*Recomendación del auditor:* Incorporar estados financieros que cubran resultados favorables y desfavorables. Por ejemplo: “Retorno estimado: 18%”, “Estimación actualizada: 11%”, “Sin retorno generado”, “Capital devuelto”, “Resultado final: -3%” o “Plazo extendido”, según el caso real. Añadir en el detalle de cada inversión un bloque “Estimado vs. resultado actual” que muestre la evolución de la proyección.

**E-038** · Crítica · `ABIERTO`  
*Hallazgo:* El sistema debe soportar el ciclo completo, incluyendo escenarios no positivos  
*Observación:* La experiencia actual del Dashboard muestra cuatro retornos estimados positivos  
*Recomendación del auditor:* Permitir resultados positivos, 0 y negativos.

**E-046** · Baja · `ABIERTO`  
*Hallazgo:* Debe existir tratamiento funcional para inversiones que exceden el plazo previsto  
*Observación:* El producto maneja plazos/días en cada oportunidad.  
*Recomendación del auditor:* Cuando se supere el tiempo estimado, cambiar a un estado como “Plazo extendido”, registrar el nuevo hito/fecha y generar actualización al usuario.


### WP-5.1

**E-039** · Alta · `ABIERTO`  
*Hallazgo:* Hay propiedades que se muestran como "Próximo" y luego en "oportunidades" se pueden recibir aportes e inversiones.  
*Observación:* El paso “Selecciona una propiedad” muestra nombre, ubicación, moneda, precio, ROI y días, pero no presenta un estado como Disponible/Próximo/Cerrado. En el catálogo sí existen oportunidades Activo y Próximo  
*Recomendación del auditor:* Arreglar los accesos correspondientes en el backend para que solo las propiedades habilitadas estén disponibles para inversión en "Propiedades"


### WP-5.2

**E-042** · Alta · `ABIERTO`  
*Hallazgo:* Una inversión confirmada debe actualizar todos los módulos relacionados  
*Observación:* Sistema posterior a pago.  
*Recomendación del auditor:* Mis inversiones debe registrar S/1,000; Total invertido debe aumentar según la regla contable; la propiedad debe reducir disponible; el número/progreso debe actualizarse; Actividad debe registrar la operación y Notificaciones crear el aviso correspondiente.


### WP-5.3

**E-044** · Alta · `PARCIAL`  
*Hallazgo:* Cada notificación debe abrir el recurso específico relacionado  
*Observación:* Los eventos relevantes del producto están vinculados a propiedades, documentos, retornos y estados de cuenta.  
*Recomendación del auditor:* Disparar y redireccionar las notificaciones. Agregar si es necesario porque solo son de ganancias. Agregar también para cambio de ROI estimado, plazo extendido, subasta suspendida/cancelada, devolución, reembolso, documento requerido y cambio de estado legal.


### WP-6.1

**P-001** · Alta · `ABIERTO`  
*Hallazgo:* Las inversiones activas no identifican si son Estándar o Premium  
*Observación:* Las inversiones del Dashboard mantienen la misma estructura utilizada para la cuenta Estándar.  
*Recomendación del auditor:* Añadir un badge junto al estado: Estándar o Premium.

**P-002** · Alta · `ABIERTO`  
*Hallazgo:* “Ver oportunidades” debería llevar directamente a las oportunidades activas.  
*Observación:* La vista Premium mezcla disponibles, capturadas y convertidas.  
*Recomendación del auditor:* Hacer que Ver oportunidades abra Premium con el filtro Disponibles activo.

**P-003** · Alta · `PARCIAL`  
*Hallazgo:* La exclusividad Premium no muestra claramente cuándo termina  
*Observación:* El detalle indica que la oportunidad pasa al mercado Estándar cuando expira la ventana, pero no muestra una fecha/hora en el contenido actual.  
*Recomendación del auditor:* Mostrar Ventana Premium hasta: 24 ago. 2026, 18:00 y debajo Quedan 2 días 5 horas.

**P-004** · Media · `ABIERTO`  
*Hallazgo:* “Capturadas” y especialmente “Convertidas” requieren una explicación más clara.  
*Observación:* La sección dispone de esos títulos en distintas propiedades.  
*Recomendación del auditor:* Cambiar Convertidas → Pasaron a inversión colectiva. En la card mostrar Ventana Premium finalizada · Ahora disponible en Estándar

**P-005** · Media · `ABIERTO`  
*Hallazgo:* En la parte superior aparece un botón “Premium” y debajo un banner “Oportunidades Premium activas" con un botón "Ver oportunidades”. Además puede acceder desde el menú lateral.  
*Observación:* Los tres conducen a la misma pantalla.  
*Recomendación del auditor:* Mantener Premium únicamente en el menú lateral . De igual manera, se podría eliminar de la barra y cuando el usuario sea Premium se añadan a "Propiedades". Si es que se quieren mantener. Tener ese acceso y Ver oportunidades dentro del banner. Eliminar el botón dorado Premium del encabezado. El badge junto a “Valentina” debe quedar únicamente como indicador de tipo de cuenta y no como otro acceso.

**P-006** · Alta · `ABIERTO`  
*Hallazgo:* Capital requerido, ROI y ganancia estimada reciben un peso demasiado similar  
*Observación:* Una card puede mostrar USD 890,000, 48% y USD 427,200  
*Recomendación del auditor:* Jerarquizar: Capital requerido como cifra principal, debajo Retorno estimado y tercero Ganancia estimada.

**P-007** · Media · `ABIERTO`  
*Hallazgo:* La condición Premium se repite visualmente en exceso  
*Observación:* Badge junto a Valentina, botón Premium, banner dorado, indicador del menú y badge del perfil comunican lo mismo.  
*Recomendación del auditor:* Reservar el dorado para contenido exlusivo. Mantener badge de usuario + estado en el perfil.

**P-008** · Media · `ABIERTO`  
*Hallazgo:* El banner Premium compite con los datos personales del portafolio  
*Observación:* Ocupa prácticamente todo el ancho justo antes de la información del usuario.  
*Recomendación del auditor:* Reducirlo a una fila: 2 oportunidades disponibles · Ver oportunidades.

**P-009** · Baja · `ABIERTO`  
*Hallazgo:* Modalidad, disponibilidad y otros atributos se representan mediante demasiadas etiquetas.  
*Observación:* Aparecen Exclusivo Premium, Ya capturada, Ahora estándar y moneda.  
*Recomendación del auditor:* Usar máximo 2 badges superiores: Premium + Disponible/Capturada/Pasó a Estándar. Mover moneda al bloque financiero.


### WP-6.2

**P-010** · Crítica · `ABIERTO`  
*Hallazgo:* “Captura propiedades al 100%” no define qué derecho económico o jurídico adquiere realmente el usuario  
*Observación:* El lenguaje puede interpretarse como adquisición inmediata de propiedad, pero el sitio habla simultáneamente de inversión, captura y retorno.  
*Recomendación del auditor:* Sustituir por la figura real. Ej: Financia individualmente el 100% del capital requerido y recibe \[derecho contractual exacto\]. Explicar qué obtiene jurídicamente y validar el texto con asesoría legal.

**P-011** · Crítica · `ABIERTO`  
*Hallazgo:* No se desarrolla suficientemente el valor que Rematto entrega después de recibir el capital  
*Observación:* El mensaje se centra en acceso anticipado, captura y rentabilidad.  
*Recomendación del auditor:* Crear Qué hace Rematto después de tu inversión y describir etapas reales: seguimiento, documentación, formalización, proceso judicial, gestión del activo/salida y liquidación. De igual forma crear textos que sirvan de acompañamiento al usuario.

**P-012** · Alta · `ABIERTO`  
*Hallazgo:* No se explica desde el inicio para qué capacidad financiera fue diseñada la modalidad  
*Observación:* Las propiedades pueden valer mucho dinero como se ve en algunos cards de ejemplo.  
*Recomendación del auditor:* Añadir: Premium está diseñado para inversionistas que pueden financiar individualmente el capital total requerido de una oportunidad.

**P-014** · Alta · `ABIERTO`  
*Hallazgo:* El paso a Estándar se comunica como consecuencia de que “nadie quiso invertir”  
*Observación:* Si nadie invierte, la propiedad pasa al mercado regular.  
*Recomendación del auditor:* Cambiar por La oportunidad dispone inicialmente de una ventana de inversión individual. Finalizado ese periodo, puede habilitarse para participación colectiva.

**P-015** · Media · `PARCIAL`  
*Hallazgo:* Se debe enfatizar que modalidad diferente estás obteniendo en vez de solo dar a entender que ganarás más.  
*Observación:* Se utiliza ROI con retornos de hasta 52%  
*Recomendación del auditor:* Sustituir el titular por Accede primero a oportunidades disponibles para inversión individual.  Eliminar ROI y  solo dejar el procentaje RENTABILIDAD DE HASTA 52 %  usarlo en un card. Comisión  esta bien.

**P-016** · Media · `ABIERTO`  
*Hallazgo:* La exclusividad Premium está poco definida porque un usuario Estándar puede consultar gran parte de la información clave  
*Observación:* Desde Estándar se ven nombre, dirección, valor total, ROI, ganancia estimada, moneda y estado. Lo bloqueado es principalmente el análisis/contenido ampliado.  
*Recomendación del auditor:* Definir y comunicar exactamente: Premium obtiene X horas/días de acceso anticipado, análisis completo y capacidad exclusiva de captura. Ocultar del Estándar cualquier dato que realmente forme parte de la exclusividad.

**P-017** · Baja · `ABIERTO`  
*Hallazgo:* Se comunica ganancia  sin mostrar costos o que es un estimado claramente.  
*Observación:* Se muestran ganancias de S/159,600 a USD754,000, pero el contenido actual no presenta las comisiones/gastos que reduzcan el resultado. Aunque se muestre arriba que hay un 0.5 de comisiones muy pequeño arriba de todo.  
*Recomendación del auditor:* Añadir Costos estimados de la operación y terminar siempre con Retorno neto estimado. Incluir comisión Rematto, gastos legales/notariales/registrales, impuestos u otros conceptos que sean necesarios. Se puede añadir un apartado que lo direccione a la explicación detallada de estos costos adicionales.


### WP-6.3

**P-013** · Alta · `ABIERTO`  
*Hallazgo:* Se continúa utilizando “Ya capturada” "Capturada por ti" en el flujo de propiedades premium.  
*Observación:* Sus cards/detalles siguen presentando detalles cuando fueron adquiridos.  

**P-018** · Alta · `ABIERTO`  
*Hallazgo:* Solo se muestra un escenario financiero favorable  
*Observación:* Se presenta ganancia estimada sin escenarios alternativos visibles.  
*Recomendación del auditor:* Sustituir: Retorno estimado base: 48% Ver escenarios y cálculo

**P-019** · Alta · `ABIERTO`  
*Hallazgo:* No se explica qué criterios hacen que una oportunidad sea “Premium”  
*Observación:* Las cards utilizan Exclusivo Premium, pero el catálogo no explica el criterio de clasificación.  
*Recomendación del auditor:* Añadir ¿Por qué esta oportunidad es Premium? con criterios reales y comprobables

**P-020** · Alta · `ABIERTO`  
*Hallazgo:* La evidencia documental visible no es proporcional al tamaño de la operación  
*Observación:* En el contenido actual predominan imagen, ROI, valor total y ganancia estimada.  
*Recomendación del auditor:* Para Premium autenticado mostrarle más información al apretar: Expediente judicial · situación registral · tasación · análisis legal · documentos · costos · riesgos · fecha de revisión

**P-021** · Alta · `ABIERTO`  
*Hallazgo:* No se explica suficientemente dónde estará el dinero durante el proceso de alto valor de dinero.  
*Observación:* El usuario puede pagar el 100% del inmueble sin saber cuales son las gestiones posteriores.  
*Recomendación del auditor:* Antes del pago mostrar Destino de fondos, titular de la cuenta, entidad financiera/canal, momento en que se consideran recibidos y qué ocurre con el dinero si la operación no se formaliza. Validar todo con Legal

**P-022** · Media · `ABIERTO`  
*Hallazgo:* Se publican nombres de personas asociados a operaciones de muy alto valor  
*Observación:* Aparecen Capturada por María Vargas.  
*Recomendación del auditor:* Eliminar las propiedades capturadas de la vista de otros usuarios.

**P-023** · Media · `ABIERTO`  
*Hallazgo:* No existe una vía humana claramente destacada para una decisión de inversión de miles de dólares.  
*Observación:* La experiencia está diseñada principalmente como autoservicio web.  
*Recomendación del auditor:* En cada detalle añadir Hablar con un asesor Premium. Conectánd su consulta a alguien adecuado.


### WP-6.4

**P-024** · Crítica · `ABIERTO`  
*Hallazgo:* El flujo de captura al 100% no puede depender de un checkout convencional con tarjeta para operaciones de alto valor  
*Observación:* Las oportunidades Premium requieren financiar el 100% del capital y manejan importes de cientos de miles de soles o dólares. Las tarjetas están sujetas a líneas de crédito/débito, límites de operación y controles del emisor/adquirente, por lo que no es razonable asumir que todo el monto podrá procesarse como una compra ecommerce ordinaria.  
*Recomendación del auditor:* Separar el pago Premium del checkout Estándar. Después de seleccionar la oportunidad mostrar “Capital requerido: USD 890,000” y ofrecer el mecanismo de liquidación definido para operaciones de alto valor, por ejemplo transferencia bancaria a la cuenta designada por Rematto, u otro mecanismo contractual aprobado.

**P-025** · Crítica · `ABIERTO`  
*Hallazgo:* “Pago confirmado” no debe equivaler automáticamente a “propiedad adquirida”  
*Observación:* El pago es solo uno de los hitos de una operación inmobiliaria/inversión Premium. La formalización inmobiliaria puede requerir documentación, actos notariales y registro,  
*Recomendación del auditor:* Sustituir una confirmación genérica por estados puntuales y claros: Oportunidad reservada → Fondos pendientes → Fondos recibidos → Documentación/formalización en proceso → Operación formalizada. Solo utilizar “Propiedad adquirida”, “Adjudicada” o equivalente cuando el hecho jurídico correspondiente realmente haya ocurrido.

**P-026** · Alta · `ABIERTO`  
*Hallazgo:* El sistema debe validar la viabilidad del medio de pago antes de reservar definitivamente la oportunidad  
*Observación:* Una oportunidad Premium es exclusiva para un solo inversionista. Si se bloquea primero y después se descubre que el usuario no puede pagar por tarjeta, el activo podría quedar reservado innecesariamente.  
*Recomendación del auditor:* Antes de crear una reserva firme, mostrar “¿Cómo financiarás esta operación?” con las opciones reales disponibles. Si selecciona tarjeta y el monto supera el máximo admitido por ese canal, impedir avanzar y mostrar “Para este monto debes utilizar transferencia bancaria / método habilitado para operaciones de alto valor.”

**P-027** · Alta · `ABIERTO`  
*Hallazgo:* Debe definirse explícitamente si Premium admite pagos fraccionados  
*Observación:* Para tickets muy altos puede no ser viable realizar una única transferencia o cargo. El modelo actual comunica “100%” pero eso no necesariamente significa “un único pago”.  
*Recomendación del auditor:* Si debe ser un solo fondo: mostrar “El capital total debe recibirse en una única operación.” Si se permiten fracciones: crear un cronograma visible Capital requerido USD 890,000 · Recibido USD 300,000 · Pendiente USD 590,000,

**P-028** · Alta · `ABIERTO`  
*Hallazgo:* Los límites del medio de pago deben mostrarse antes de que el usuario llegue al último paso  
*Observación:* La capacidad real de tarjeta depende de las condiciones del banco y procesador; por ello el usuario no debe descubrir la restricción después de revisar toda la operación.  
*Recomendación del auditor:* mostrar “Métodos disponibles para esta oportunidad”. Ej.: Tarjeta: disponible hasta el límite definido por el canal · Transferencia bancaria: disponible para el monto completo o las opciones que sean viables.

**P-029** · Alta · `YA RESUELTO`  
*Hallazgo:* El proceso Premium no debe reutilizar el paso “Monto” editable del flujo Estándar  
*Observación:* Estándar permite decidir cuánto aportar; Premium exige el capital total de la oportunidad.  
*Recomendación del auditor:* Crear flujo específico: Oportunidad → Documentación/condiciones → Capital requerido (solo lectura) → Forma de fondeo → Verificación de fondos → Formalización/seguimiento.

**P-030** · Alta · `ABIERTO`  
*Hallazgo:* Validar límites de Yape u otros medios  
*Observación:* En la reunión se planteó específicamente el caso de límites por método de pago.  
*Recomendación del auditor:* Mostrar límites previamente y definir pagos parciales/reintentos.


### WP-7.1

**E-049** · Alta · `ABIERTO`  
*Hallazgo:* Los montos financieros no se ven completos.  
*Observación:* Capital invertido y retorno estimado aparecen con puntos suspensivos.  
*Recomendación del auditor:* Dar prioridad de ancho al valor.

**E-050** · Alta · `ABIERTO`  
*Hallazgo:* La fecha ocupa una columna importante mientras información del activo se recorta  
*Observación:* La fecha ocupa una columna importante mientras información del activo recorta y se tiene que deslizar para verlos.  
*Recomendación del auditor:* En móvil colocar la fecha debajo del nombre en tamaño secundario: “Oficina San Borja · 27 may. 2026”. Utilizar todo el ancho superior para el nombre del activo.

**E-051** · Media · `ABIERTO`  
*Hallazgo:* La disposición a una columna genera una longitud considerable del resumen  
*Observación:* Se utiliza una card de gran altura y existen tres consecutivas.  
*Recomendación del auditor:* Reducir moderadamente el padding vertical de las cards móviles, sin reducir tipografía y mantener una separación entre ellas.

**E-052** · Baja · `NO ROMPER`  
*Hallazgo:* Las métricas principales sí se reorganizan correctamente a una columna  
*Observación:* Total invertido, Inversiones activas y Retornos generados aparecen una debajo de otra y mantienen cifras grandes y legibles.  
*Recomendación del auditor:* Mantener la disposición de una card por fila en teléfono


### WP-7.2

**L-039** · Media · `ABIERTO`  
*Hallazgo:* Formulario de registro puede volverse excesivamente largo en móvil  
*Observación:* Registro incorpora distintos campos, aceptación legal y autenticación con Google.  
*Recomendación del auditor:* Revisar si puede dividirse por etapas o simplificarse visualmente manteniendo solo información necesaria.

**L-040** · Baja · `NO ROMPER`  
*Hallazgo:* La pantalla final presenta una adaptación móvil correcta en sus elementos principales  
*Observación:* Título, descripción, estados y CTA entran correctamente en el ancho disponible; no se observan cortes importantes ni overflow horizontal.  
*Recomendación del auditor:* Mantener esta estructura. Aplicar las correcciones globales de header y botón flotante sin modificar más.

**E-047** · Alta · `YA RESUELTO`  
*Hallazgo:* El control flotante de personalización invade repetidamente el contenido móvil  
*Observación:* El círculo azul con icono de paleta aparece sobre distintos elementos en diferentes páginas.  
*Recomendación del auditor:* Eliminar completamente el selector de personalización

**E-048** · Alta · `ABIERTO`  
*Hallazgo:* El bloque Premium conserva prácticamente toda su extensión desktop en móvil  
*Observación:* En teléfono el módulo ocupa casi una pantalla completa: título, párrafo largo, cuatro beneficios, plan actual, CTA,etc.  
*Recomendación del auditor:* Reducir el bloque a: “Inversiones Premium” + una frase + máximo 2 beneficios + “Conocer Premium”

**P-031** · Media · `ABIERTO`  
*Hallazgo:* El saludo se fragmenta en móvil  
*Observación:* Buenos días, Valentina permanece en la primera línea, pero el emoji de saludo cae solo a una segunda línea mientras el badge Premium permanece alineado a la derecha.  
*Recomendación del auditor:* Agrupar nombre y emoji en un mismo contenedor sin salto: Buenos días, Valentina  con el emoji. Colocar el badge Premium debajo o al lado únicamente si existe espacio suficiente

**P-032** · Media · `ABIERTO`  
*Hallazgo:* Los dos cards superiores ocupan demasiado espacio horizontal en móvil  
*Observación:* Premium y Nueva inversión permanecen juntos en una misma fila. Aunque actualmente caben, consumen gran parte del ancho disponible.  
*Recomendación del auditor:* Aplicar también en responsive la mejora UX: eliminar el botón Premium redundante. Dejar Nueva inversión como card principal a ancho completo


### WP-8

**E-025** · Crítica · `ABIERTO`  
*Hallazgo:* El producto no comunica claramente por qué el usuario debería mantener una relación recurrente con Rematto  
*Observación:* El dashboard enfatiza portafolio actual, nueva inversión y Premium, pero el valor recurrente no está formulado correctamente.  
*Recomendación del auditor:* Incorporar como promesa recurrente en el dashboard: “Sigue cada etapa de tus inversiones desde un solo lugar.” Respaldarla con accesos concretos a estado, documentos, movimientos y actualizaciones. Esa debería ser la propuesta principal de la cuenta una vez realizada la inversión.

**E-026** · Alta · `ABIERTO`  
*Hallazgo:* La propuesta de valor del usuario Estándar queda eclipsada por Premium  
*Observación:* El usuario aparece identificado como “Plan Estándar”, pero el dashboard desarrolla ampliamente las ventajas Premium  
*Recomendación del auditor:* Añadir junto al perfil o debajo del resumen: “Tu cuenta Estándar” y tres beneficios concretos:· Accede a oportunidades verificadas · Sigue tus inversiones y retornos desde tu cuenta.” Presentar Premium después como una modalidad adicional, no como corrección de una cuenta inferior.

**E-027** · Alta · `ABIERTO`  
*Hallazgo:* Falta una comparación concreta entre Estándar y Premium  
*Observación:* Se enumeran beneficios Premium, pero no se presenta claramente qué mantiene Estándar, qué añade Premium y qué condiciones cambian.  
*Recomendación del auditor:* En es basboard agregar “Comparar Estándar vs. Premium”.  Luego enlazar todos los beneficios completos de Premium al correspondiente "Premium"

**E-028** · Alta · `PARCIAL`  
*Hallazgo:* La narrativa comercial dentro de la cuenta continúa concentrándose en “ganar más”  
*Observación:* El saludo comunica +22.7%, existe “Retornos generados” y las cuatro inversiones visibles muestran retornos estimados positivos de 17% a 21%; además Premium eleva el discurso hasta 52%.  
*Recomendación del auditor:* Reemplazar parte del discurso financiero por pilares permanentes dentro de la cuenta: “Lo que Rematto está gestionando por ti” “Seguimiento de tus inversiones” ·  “Actualizaciones de cada proceso”. Mantener rentabilidad como dato de inversión, no como mensaje transversal de todas las secciones.

**E-029** · Media · `ABIERTO`  
*Hallazgo:* Las actualizaciones existentes no se aprovechan para demostrar el valor continuo del servicio  
*Observación:* Actividad reciente ya registra inversión confirmada, documento nuevo, retorno acreditado, nueva subasta y verificación completada.  
*Recomendación del auditor:* Renombrar el bloque a “Últimas actualizaciones de tu cuenta” y priorizar eventos ligados a inversiones del usuario. Debajo del título añadir: “Aquí encontrarás cambios, documentos y movimientos relacionados con tus inversiones.”

**E-030** · Media · `ABIERTO`  
*Hallazgo:* Recomendar nuevas oportunidades de forma relevante  
*Observación:* El catálogo contiene oportunidades con diferentes monedas, zonas, mínimos y retornos estimados.  
*Recomendación del auditor:* “Oportunidades que podrían interesarte” y explicar el motivo real: “En soles · Desde S/500 · Distrito que ya has consultado”

**E-031** · Baja · `ABIERTO`  
*Hallazgo:* “Plan Estándar” puede estar empaquetando como plan algo que parece más cercano a un nivel de acceso  
*Observación:* La cuenta se denomina “Plan Estándar” y se ofrece “Actualizar a Premium"  
*Recomendación del auditor:* Si no hay una tarifa periódica, utilizar “Cuenta Estándar” y “Acceso Premium”.

