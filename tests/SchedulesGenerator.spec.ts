// import SchedulesGenerator from '@/services/ShedulesGenerator/Generator';
import SchedulesStructure from '@/services/ShedulesGenerator/DataStructure';
import DataStore from '@/services/ShedulesGenerator/Data/Store';
import DataEmployee from '@/services/ShedulesGenerator/Data/Employee';

describe('Test schedure structure', function () {
  it('Store and shift data test', function () {
    const store1 = new DataStore({ name: '豐原店' });
    store1.addShift(['07:00', '15:00'], ['15:00', '23:00'], ['23:00', '07:00']);

    expect(store1.shift(0)?.getStartTime()).toBe('07:00');
    expect(store1.shift(3)).toBeNull();

    store1.shift(0)?.setLabourLimit(2);
    expect(store1.shift(0)?.getLabourLimit()).toBe(2);
    store1.shift(1)?.setLabourLimit(2);
    expect(store1.shift(1)?.getLabourLimit()).toBe(2);
    store1.shift(2)?.setLabourLimit(1);
    expect(store1.shift(2)?.getLabourLimit()).toBe(1);

    expect(store1.shift(0)?.getDiff()).toBe(60 * 60 * 8);
  });

  it('Employees data test', function () {
    const employee1 = new DataEmployee({ name: 'Simen' });
    expect(typeof employee1.getId() === 'string').toBeTruthy();

    const day3After = new Date();
    day3After.setDate(day3After.getDate() + 2);
    employee1.assignHolidays(day3After);

    const holidays = employee1.getWannaHolidays();

    expect(holidays.length).toBe(1);

    employee1.clearHolidays();
    const holidaysClear = employee1.getWannaHolidays();

    expect(holidaysClear.length).toBe(0);

    const totalDays = 7;
    employee1.setWorkDaysLimit(1, totalDays);
    employee1.assignWorkingDays(day3After);

    expect(() => {
      employee1.assignWorkingDays(day3After);
    }).toThrow('Same day error');

    expect(employee1.getWorkDays().length).toBe(1);

    const day4After = new Date();
    day4After.setDate(day4After.getDate() + 3);

    expect(() => {
      employee1.assignWorkingDays(day4After);
    }).toThrow('work days limiation exceed');
  });

  it('Structure test', function () {
    const today = new Date();
    const day7After = new Date();
    day7After.setDate(day7After.getDate() + 6);

    const structure = new SchedulesStructure(today, day7After);
    const store1 = new DataStore();
    const employee1 = new DataEmployee({ name: 'Simen' });
    const employee2 = new DataEmployee({ name: 'Bitch' });

    structure.put(store);
    structure.put(employee1, employee2);

    expect(typeof structure.isValid() === 'boolean').toBeTruthy();
    structure.random();
    const result = structure.result();
  });
});
