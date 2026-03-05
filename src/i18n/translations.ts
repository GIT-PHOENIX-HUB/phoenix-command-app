// ============================================================================
// PHOENIX COMMAND - Translations
// Flat key-value maps for all user-facing strings
// ============================================================================

export const en: Record<string, string> = {
  // Global
  'app.name': 'PHOENIX OPS',
  'app.subtitle': 'Command Center',
  'app.authenticating': 'AUTHENTICATING...',
  'app.logout': 'Logout',

  // Nav
  'nav.home': 'HOME',
  'nav.knowledge': 'KNOWLEDGE',
  'nav.files': 'FILES',
  'nav.teams': 'TEAMS',
  'nav.timeclock': 'TIME CLOCK',

  // Dashboard
  'dashboard.title': 'DASHBOARD',
  'dashboard.timeStatus': 'TIME STATUS',
  'dashboard.clockedIn': 'Clocked In:',
  'dashboard.clockedOut': 'Clocked Out',
  'dashboard.status': 'Status:',
  'dashboard.today': 'Today',
  'dashboard.thisWeek': 'This Week',
  'dashboard.clockIn': 'CLOCK IN',
  'dashboard.clockOut': 'CLOCK OUT',
  'dashboard.processing': 'Processing...',
  'dashboard.todaysWork': "TODAY'S WORK",
  'dashboard.noActivity': 'No recent activity',
  'dashboard.noJobs': 'No active jobs',
  'dashboard.clockInToStart': 'Clock in to start',
  'dashboard.logNewWork': 'LOG NEW WORK',
  'dashboard.quickStats': 'QUICK STATS',
  'dashboard.jobsThisWeek': 'Jobs this week',
  'dashboard.logsSubmitted': 'Logs submitted',
  'dashboard.nextJob': 'Next job',
  'dashboard.noRecentSite': 'No recent site',

  // Knowledge Builder
  'kb.title': 'KNOWLEDGE BUILDER',
  'kb.loading': "LOADING TODAY'S CONTENT...",
  'kb.error': 'Unable to load content:',
  'kb.weekTheme': 'Week Theme',
  'kb.comingUp': 'Coming Up Next',
  'kb.backup': 'BACKUP / ADDITIONAL',
  'kb.revealAnswer': 'TAP TO REVEAL ANSWER',
  'kb.hideAnswer': 'HIDE ANSWER',
  'kb.correctAnswer': 'Correct Answer',
  'kb.explanation': 'Explanation',
  'kb.fieldNote': 'Field Note',
  'kb.necReference': 'NEC REFERENCE',
  'kb.viewArchive': 'VIEW ARCHIVE',
  'kb.stats': 'KNOWLEDGE STATS',
  'kb.totalItems': 'Total items',
  'kb.lastCollection': 'Last collection',

  // Daily Log
  'log.title': 'DAILY WORK LOG',
  'log.techName': 'Technician Name',
  'log.date': 'Date',
  'log.jobAddress': 'Job Name / Address',
  'log.phase': 'Phase',
  'log.roughIn': 'ROUGH-IN',
  'log.trimOut': 'TRIM-OUT',
  'log.completedWork': 'COMPLETED WORK',
  'log.taskItem': 'Task / Item',
  'log.qty': 'Qty',
  'log.estTime': 'Est. Time',
  'log.description': 'Description',
  'log.addRow': 'ADD ROW',
  'log.incompleteWork': 'INCOMPLETE WORK (Items worked on but NOT finished)',
  'log.notes': 'NOTES - Why items were not completed',
  'log.materialNeeded': 'Material Needed',
  'log.signatures': 'SIGNATURES',
  'log.techSignature': 'Technician Signature',
  'log.leadSignature': 'Lead Signature',
  'log.submit': 'SUBMIT LOG',
  'log.signed': '✓ Signed',
  'log.unsigned': '—',
  'log.estTimePlaceholder': '1 hr',
  'log.signaturesRequired': 'Both signatures are required before submitting.',
  'log.instructions.1': 'List items you FINISHED today based on your phase',
  'log.instructions.2': 'ROUGH-IN = Installing boxes, running wire, make-up, etc.',
  'log.instructions.3': 'TRIM-OUT = Installing devices, fixtures, covers',
  'log.instructions.4': 'List TOTAL QUANTITY for each task (not per-item)',
  'log.instructions.5': "Estimate TOTAL TIME for the task (Example: 'Can lights' = '1 hour' NOT '15 min each')",
  'log.instructions.6': 'INCOMPLETE WORK: Items you worked on but DID NOT finish',
  'log.instructions.7': 'EXPLAIN why items were not completed and LIST materials needed',
  'log.instructions.8': 'BOTH SIGNATURES REQUIRED - Technician AND Lead must sign',

  // Time Clock
  'tc.title': 'TIME CLOCK',

  // Files
  'files.title': 'FILES',

  // Teams
  'teams.title': 'TEAMS',

  // Chat
  'chat.placeholder': 'Ask Phoenix AI...',
  'chat.greeting': 'Hi! I can help you with job status, customer info, time tracking, finding files in SharePoint, and Service Fusion data.',

  // Language
  'lang.toggle': 'Español',
};

export const es: Record<string, string> = {
  // Global
  'app.name': 'PHOENIX OPS',
  'app.subtitle': 'Centro de Mando',
  'app.authenticating': 'AUTENTICANDO...',
  'app.logout': 'Cerrar Sesión',

  // Nav
  'nav.home': 'INICIO',
  'nav.knowledge': 'APRENDIZAJE',
  'nav.files': 'ARCHIVOS',
  'nav.teams': 'EQUIPO',
  'nav.timeclock': 'RELOJ',

  // Dashboard
  'dashboard.title': 'TABLERO',
  'dashboard.timeStatus': 'ESTADO DE TIEMPO',
  'dashboard.clockedIn': 'Hora de Entrada:',
  'dashboard.clockedOut': 'Sin Registrar',
  'dashboard.status': 'Estado:',
  'dashboard.today': 'Hoy',
  'dashboard.thisWeek': 'Esta Semana',
  'dashboard.clockIn': 'REGISTRAR ENTRADA',
  'dashboard.clockOut': 'REGISTRAR SALIDA',
  'dashboard.processing': 'Procesando...',
  'dashboard.todaysWork': 'TRABAJO DE HOY',
  'dashboard.noActivity': 'Sin actividad reciente',
  'dashboard.noJobs': 'Sin trabajos activos',
  'dashboard.clockInToStart': 'Registra entrada para comenzar',
  'dashboard.logNewWork': 'REGISTRAR TRABAJO',
  'dashboard.quickStats': 'RESUMEN RÁPIDO',
  'dashboard.jobsThisWeek': 'Trabajos esta semana',
  'dashboard.logsSubmitted': 'Reportes enviados',
  'dashboard.nextJob': 'Siguiente trabajo',
  'dashboard.noRecentSite': 'Sin sitio reciente',

  // Knowledge Builder
  'kb.title': 'CENTRO DE APRENDIZAJE',
  'kb.loading': 'CARGANDO CONTENIDO DE HOY...',
  'kb.error': 'No se pudo cargar el contenido:',
  'kb.weekTheme': 'Tema de la Semana',
  'kb.comingUp': 'Próximo Tema',
  'kb.backup': 'RESPALDO / ADICIONAL',
  'kb.revealAnswer': 'TOCA PARA VER RESPUESTA',
  'kb.hideAnswer': 'OCULTAR RESPUESTA',
  'kb.correctAnswer': 'Respuesta Correcta',
  'kb.explanation': 'Explicación',
  'kb.fieldNote': 'Nota de Campo',
  'kb.necReference': 'REFERENCIA NEC',
  'kb.viewArchive': 'VER ARCHIVO',
  'kb.stats': 'ESTADÍSTICAS',
  'kb.totalItems': 'Total de temas',
  'kb.lastCollection': 'Última recopilación',

  // Daily Log
  'log.title': 'REPORTE DIARIO DE TRABAJO',
  'log.techName': 'Nombre del Técnico',
  'log.date': 'Fecha',
  'log.jobAddress': 'Nombre del Trabajo / Dirección',
  'log.phase': 'Fase',
  'log.roughIn': 'ROUGH-IN',
  'log.trimOut': 'TRIM-OUT',
  'log.completedWork': 'TRABAJO COMPLETADO',
  'log.taskItem': 'Tarea / Artículo',
  'log.qty': 'Cant.',
  'log.estTime': 'Tiempo Est.',
  'log.description': 'Descripción',
  'log.addRow': 'AGREGAR FILA',
  'log.incompleteWork': 'TRABAJO INCOMPLETO (Trabajado pero NO terminado)',
  'log.notes': 'NOTAS - Por qué no se completaron los trabajos',
  'log.materialNeeded': 'Material Necesario',
  'log.signatures': 'FIRMAS',
  'log.techSignature': 'Firma del Técnico',
  'log.leadSignature': 'Firma del Líder',
  'log.submit': 'ENVIAR REPORTE',
  'log.signed': '✓ Firmado',
  'log.unsigned': '—',
  'log.estTimePlaceholder': '1 hora',
  'log.signaturesRequired': 'Ambas firmas son requeridas antes de enviar.',
  'log.instructions.1': 'Lista los trabajos TERMINADOS hoy según tu fase',
  'log.instructions.2': 'ROUGH-IN = Instalar cajas, correr cable, conexiones, etc.',
  'log.instructions.3': 'TRIM-OUT = Instalar dispositivos, lámparas, cubiertas',
  'log.instructions.4': 'Lista la CANTIDAD TOTAL por tarea (no por pieza)',
  'log.instructions.5': "Estima el TIEMPO TOTAL de la tarea (Ejemplo: 'Luces empotradas' = '1 hora' NO '15 min cada una')",
  'log.instructions.6': 'TRABAJO INCOMPLETO: Trabajos que empezaste pero NO terminaste',
  'log.instructions.7': 'EXPLICA por qué no se completaron y LISTA materiales necesarios',
  'log.instructions.8': 'AMBAS FIRMAS REQUERIDAS - Técnico Y Líder deben firmar',

  // Time Clock
  'tc.title': 'RELOJ DE TIEMPO',

  // Files
  'files.title': 'ARCHIVOS',

  // Teams
  'teams.title': 'EQUIPO',

  // Chat
  'chat.placeholder': 'Pregunta a Phoenix AI...',
  'chat.greeting': 'Hola! Puedo ayudarte con estado de trabajos, información de clientes, control de tiempo, buscar archivos en SharePoint y datos de Service Fusion.',

  // Language
  'lang.toggle': 'English',
};
