// import SchedulesGenerator from '@/services/ShedulesGenerator/Generator';
import SchedulesStructure from '@/services/ShedulesGenerator/DataStructure';
import DataStore from '@/services/ShedulesGenerator/Data/Store';
import DataEmployee from '@/services/ShedulesGenerator/Data/Employee';

const nextWeeks: Date[] = [];
const today = new Date();
const todayNumber = today.getDay() + 1;
const diffToNextMonday = 7 - todayNumber + 1;

for (let i = 0, length = 7; i < length; i++) {
  const date = new Date();
  const dateNumber = date.getDate();
  date.setDate(dateNumber + i + diffToNextMonday);

  nextWeeks.push(date);
}

const structure = new SchedulesStructure(
  nextWeeks[0],
  nextWeeks[nextWeeks.length - 1]
);

const store1 = new DataStore({ name: 'Store 1' });
store1.addShift(['07:00', '15:00'], ['15:00', '23:00'], ['23:00', '07:00']);
const employee1 = new DataEmployee({ name: 'Simen' });
const employee2 = new DataEmployee({ name: 'Bitch' });

structure.put(store1);
structure.put(employee1, employee2);

structure.random();
