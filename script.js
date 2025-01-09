////////////////////////////////////////////
// HAUS-WAHL
////////////////////////////////////////////

const houseToChoose = document.querySelectorAll(".house-to-choose");
const buchungLabel = document.querySelector("#form-label");

houseToChoose.forEach((house) => {
  house.addEventListener('click', (e) => {
    // Entfernt die "house-active"-Klasse von allen Häusern
    houseToChoose.forEach((h) => h.classList.remove('house-active'));

    // Fügt die Klasse nur dem angeklickten Haus hinzu
    e.currentTarget.classList.add('house-active');
    let houseName = e.currentTarget.firstChild.nextSibling.innerHTML;
    buchungLabel.innerHTML = `Ausgewählte Termine für ${houseName}`

    // Nachdem das Haus gewechselt wurde, generieren wir den Kalender neu,
    // damit er die korrekten bookedDates anzeigt
    generateCalendar(currentYear, currentMonth);
  });
});


////////////////////////////////////////////
// BUCHUNGS-DATEN
////////////////////////////////////////////

// Gebuchte Daten jetzt im Format "DD-MM-YYYY"
const bookedDatesHouse1 = [
  '10-01-2025',
  '15-01-2025',
  '24-01-2025',
  '05-02-2025',
  '18-02-2025'
];

const bookedDatesHouse2 = [
  '10-01-2025',
  '12-01-2025',
  '21-01-2025',
  '05-02-2025',
  '06-02-2025'
];

// Hier speichern wir alle derzeit ausgewählten (freien) Tage
let selectedDates = [];

// "Heute" auf Mitternacht setzen, um Vergleich "vor heute" zu machen
const today = new Date();
today.setHours(0, 0, 0, 0);

// Standard-Start ist der heutige Monat
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();


////////////////////////////////////////////
// HILFSFUNKTION: AKTIVES HAUS ERMITTELN
////////////////////////////////////////////
function getActiveHouseId() {
  const activeHouse = document.querySelector(".house-to-choose.house-active");
  if (!activeHouse) {
    return null; // oder Default Haus 1, falls du das möchtest
  }
  return activeHouse.id; // z.B. "house1" oder "house2"
}

function getBookedDatesForActiveHouse() {
  const houseId = getActiveHouseId();
  if (houseId === "house2") {
    return bookedDatesHouse2;
  }
  // Default: house1
  return bookedDatesHouse1;
}


////////////////////////////////////////////
// KALENDER-GENERIERUNG
////////////////////////////////////////////

function generateCalendar(year, month) {
  const calendarGrid = document.getElementById('calendar-grid');
  if (!calendarGrid) return;

  // Vorherigen Inhalt leeren
  calendarGrid.innerHTML = '';

  // Monatstitel berechnen
  const date = new Date(year, month, 1);
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  // Monatstitel
  const monthTitle = document.createElement('div');
  monthTitle.textContent = firstDay.toLocaleString('de-DE', {
    month: 'long',
    year: 'numeric'
  });
  monthTitle.style.gridColumn = 'span 7';
  monthTitle.style.fontWeight = 'bold';
  monthTitle.style.textAlign = 'center';
  monthTitle.style.marginTop = '1rem';
  calendarGrid.appendChild(monthTitle);

  // Wochentags-Header
  const weekdays = ['Mo','Di','Mi','Do','Fr','Sa','So'];
  weekdays.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.textContent = day;
    dayHeader.style.fontWeight = '500';
    dayHeader.style.textAlign = 'center';
    calendarGrid.appendChild(dayHeader);
  });

  // Ermitteln, welcher Tag der Woche der 1. des Monats ist (0=Sonntag)
  let startDay = firstDay.getDay();
  // JS: Sonntag=0, Montag=1, ...
  // Für "deutsche" Darstellung => Sonntag=7
  if (startDay === 0) startDay = 7;

  // Leerfelder für Tage vor dem 1.
  for (let blank = 1; blank < startDay; blank++) {
    const emptySpot = document.createElement('div');
    calendarGrid.appendChild(emptySpot);
  }

  // Aktuelle Booked-Dates basierend auf dem aktiven Haus
  const activeHouseBookedDates = getBookedDatesForActiveHouse();

  // Tage generieren
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('calendar-day');

    // Echtes Datum-Objekt für den Vergleich
    const checkDate = new Date(y, m, d);
    checkDate.setHours(0, 0, 0, 0);

    // Nun im Format "DD-MM-YYYY"
    const currentDateStr = formatDDMMYYYY(checkDate);

    // Beschriftung
    dayCell.textContent = d;

    // 1) Alle Tage < heute => booked
    if (checkDate < today) {
      dayCell.classList.add('booked');
    }

    // 2) Gebuchte Daten vom aktiven Haus?
    if (activeHouseBookedDates.includes(currentDateStr)) {
      dayCell.classList.add('booked');
    }

    // 3) Heute kennzeichnen (optional)
    if (checkDate.getTime() === today.getTime()) {
      dayCell.classList.add('today');
    }

    // Klick -> nur, wenn nicht gebucht
    dayCell.addEventListener('click', () => {
      if (!dayCell.classList.contains('booked')) {
        toggleDateSelection(currentDateStr, dayCell);
      }
    });

    calendarGrid.appendChild(dayCell);
  }
}


////////////////////////////////////////////
// MEHRFACHAUSWAHL & FORMULAR
////////////////////////////////////////////

function toggleDateSelection(dateStr, dayCell) {
  const index = selectedDates.indexOf(dateStr);
  if (index === -1) {
    // Hinzufügen
    selectedDates.push(dateStr);
    dayCell.classList.add('selected');
  } else {
    // Entfernen
    selectedDates.splice(index, 1);
    dayCell.classList.remove('selected');
  }
  updateSelectedDatesField();
}

function updateSelectedDatesField() {
  const textarea = document.getElementById('selectedDates');
  if (!textarea) return;
  textarea.value = selectedDates.join(', ');
}


////////////////////////////////////////////
// NAVIGATION (Vor/Zurück) & INIT
////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  // Starte mit dem aktuellen Monat
  generateCalendar(currentYear, currentMonth);

  // Buttons für Navigation
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  // Monat zurück
  btnPrev.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
  });

  // Monat vor
  btnNext.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
  });

  // Formular-Absende-Logik
  const bookingForm = document.getElementById('bookingForm');
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const emailAddress = document.getElementById('emailAddress').value;
    const chosenDates = selectedDates; // Array

    if (!chosenDates.length) {
      alert("Bitte wähle mindestens einen Tag aus, bevor Du fortfährst.");
      return;
    }

    // Demo: Nur mailto-Link
    const mailBody = `
      Name: ${encodeURIComponent(fullName)}
      Telefon: ${encodeURIComponent(phoneNumber)}
      E-Mail: ${encodeURIComponent(emailAddress)}
      Gewählte Tage: ${encodeURIComponent(chosenDates.join(', '))}
    `;
    const mailtoLink = `mailto:deinname@domain.de?subject=Buchungsanfrage` +
      `&body=${mailBody.replace(/\n/g, '%0D%0A')}`;

    window.location.href = mailtoLink;
  });
});


////////////////////////////////////////////
// DATUMS-FORMATIERUNG
////////////////////////////////////////////

function formatDDMMYYYY(dateObj) {
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const yyyy = dateObj.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
