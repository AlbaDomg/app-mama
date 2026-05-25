/**
 * Calendar Utilities for App-mama (Manual Concert Registrar)
 */

/**
 * Calculates the week range (Monday to Sunday) containing a specific date,
 * strictly parsed in local timezone to prevent off-by-one shifts.
 * 
 * @param {string} dateStr Format: "YYYY-MM-DD"
 */
export function getWeekRange(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return {
      mondayDate: '',
      sundayDate: '',
      weekendDates: { friday: '', saturday: '', sunday: '' }
    };
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    return {
      mondayDate: '',
      sundayDate: '',
      weekendDates: { friday: '', saturday: '', sunday: '' }
    };
  }

  const [year, month, day] = parts.map(Number);
  
  // Parse in local time:
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday...
  
  // Calculate difference to Monday of that week
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(year, month - 1, day + diffToMonday);
  
  // Calculate Friday, Saturday, Sunday
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const formatDate = (d) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  
  return {
    mondayDate: formatDate(monday),
    sundayDate: formatDate(sunday),
    weekendDates: {
      friday: formatDate(friday),
      saturday: formatDate(saturday),
      sunday: formatDate(sunday)
    }
  };
}

/**
 * Returns a friendly text describing the week range (e.g. "Semana del 25 al 31 de Mayo de 2026")
 */
export function getWeekLabel(mondayStr, sundayStr) {
  if (!mondayStr || !sundayStr || typeof mondayStr !== 'string' || typeof sundayStr !== 'string') {
    return 'Semana no seleccionada';
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const mParts = mondayStr.split('-');
  const sParts = sundayStr.split('-');
  
  if (mParts.length !== 3 || sParts.length !== 3) {
    return 'Semana no seleccionada';
  }

  const [, mMonth, mDay] = mParts.map(Number);
  const [sYear, sMonth, sDay] = sParts.map(Number);

  if (mMonth === sMonth) {
    return `Semana del ${mDay} al ${sDay} de ${monthNames[mMonth - 1]} de ${sYear}`;
  } else {
    return `Semana del ${mDay} de ${monthNames[mMonth - 1]} al ${sDay} de ${monthNames[sMonth - 1]} de ${sYear}`;
  }
}

/**
 * Pre-seeded default concerts list to populate the calendar initial state
 */
export const DEFAULT_EVENTS = [
  {
    id: 'event-default-1',
    title: 'Jazz & Blues Trío',
    type: 'Concierto en Vivo',
    date: '2026-05-29',
    time: '21:30',
    artist: 'Jazz & Blues Trío',
    description: 'Noche de música en directo, swing y buena vibra en la terraza de nuestro local.',
    isGoogleEvent: false
  },
  {
    id: 'event-default-2',
    title: 'Vibras de Primavera (DJ Set)',
    type: 'Dj de la Casa',
    date: '2026-05-30',
    time: '23:00',
    artist: 'Dj Carlotta',
    description: 'Sesión especial de música house y éxitos de los 80/90 para bailar toda la noche.',
    isGoogleEvent: false
  }
];
