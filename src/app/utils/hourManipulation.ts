import { BarberInfo, Turn } from '@types';

export function formatHour(value: number) {
  const hour = value.toString();
  const lengthHour = hour.length;
  if (lengthHour < 3) return value.toString();
  const firstDigitsOriginal = hour.slice(0, lengthHour - 2);
  const firstDigits =
    Number(firstDigitsOriginal) > 12
      ? (Number(firstDigitsOriginal) - 12).toString()
      : firstDigitsOriginal;
  const lastDigits = hour.slice(-2);
  return `${firstDigits.padStart(2, '0')}:${lastDigits} ${Number(firstDigitsOriginal) >= 12 ? 'PM' : 'AM'}`;
}

export function getBusyHours(turns: Turn[], dateForm: Date | null | undefined) {
  if (dateForm === null || dateForm === undefined) return [];
  if (turns.length === 0) return [];
  const busyTurns = turns.filter(t => {
    const date = t.date.toDate();
    return (
      date.getDate() === dateForm.getDate() &&
      date.getMonth() === dateForm.getMonth() &&
      date.getFullYear() === dateForm.getFullYear()
    );
  });
  if (busyTurns.length === 0) return [];
  return busyTurns.map(t => {
    const date = t.date.toDate();
    const busy =
      date.getHours().toString() +
      date.getMinutes().toString().padStart(2, '0');
    return Number(busy);
  });
}

export function generateHours(barber: BarberInfo, busyHours: number[]) {
  let { firstTurn, lastTurn, steps, rest } = barber;
  let hours = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (firstTurn > lastTurn) {
      break;
    }
    if (Number(firstTurn.toString().slice(-2)) > 59) {
      firstTurn = hours[hours.length - 1].hour + steps + 40;
    }
    if (firstTurn >= rest[0] && firstTurn < rest[1]) {
      firstTurn = rest[1];
    }
    if (busyHours.includes(firstTurn)) {
      firstTurn += steps;
      if (Number(firstTurn.toString().slice(-2)) > 59) {
        firstTurn += 40;
      }
      continue;
    }
    hours.push({ hour: firstTurn, hourF: formatHour(firstTurn) });
    firstTurn += steps;
  }
  return hours;
}

export function buildDate(date: Date, hour: number) {
  const lastDigits = hour.toString().slice(-2);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    parseInt((hour / 100).toString()),
    Number(lastDigits),
    0,
    0
  );
}
