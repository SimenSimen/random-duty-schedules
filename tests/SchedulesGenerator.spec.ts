// import SchedulesGenerator from '@/services/ShedulesGenerator/Generator';
import SchedulesStructure from '@/services/ShedulesGenerator/DataStructure';
import DataStore from '@/services/ShedulesGenerator/Data/Store';
import DataEmployee from '@/services/ShedulesGenerator/Data/Employee';

describe('Schedule generator data testings', () => {
  it('Store and shift data test', () => {
    const store1 = new DataStore({ name: '豐原店' });
    store1.addShift(['07:00', '15:00'], ['15:00', '23:00'], ['23:00', '07:00']);

    expect(() => {
      store1.addShift(['asdasd', 'asdsad']);
    }).toThrow('INVALID_TIME_FORMAT');

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

  it('Employees data test', () => {
    const employee1 = new DataEmployee({ name: 'Simen' });
    expect(typeof employee1.getId() === 'string').toBeTruthy();

    const day3After = new Date();
    day3After.setDate(day3After.getDate() + 2);

    employee1.assignHolidays(day3After);

    expect(() => {
      employee1.assignHolidays('setset');
    }).toThrow('INVALID_TIME_FORMAT');

    const holidays = employee1.getWannaHolidays();

    expect(holidays.length).toBe(1);

    employee1.clearHolidays();
    const holidaysClear = employee1.getWannaHolidays();

    expect(holidaysClear.length).toBe(0);

    employee1.setWorkDaysLimit(1);
    employee1.assignWorkingDays(day3After);

    expect(() => {
      employee1.assignWorkingDays(day3After);
    }).toThrow('DATE_DUPLICATED');

    expect(employee1.getActualWorkingDays()).toBe(1);

    const day4After = new Date();
    day4After.setDate(day4After.getDate() + 3);

    expect(() => {
      employee1.assignWorkingDays(day4After);
    }).toThrow('WORKING_DAYS_LIMITAION_EXCEED');
  });
});

describe('Schdule data structure test', () => {
  const nextWeeks: Date[] = [];

  it('Structure settings test', () => {
    const structure = new SchedulesStructure(
      nextWeeks[0],
      nextWeeks[nextWeeks.length - 1]
    );

    const store1 = new DataStore({ name: 'Store 1' });
    const employee1 = new DataEmployee({ name: 'Simen' });
    const employee2 = new DataEmployee({ name: 'Bitch' });

    structure.put(store1);

    expect(function () {
      structure.put(store1);
    }).toThrow('ELEMENT_DUPLICATED');

    structure.put(employee1, employee2);
  });

  it('Structure valid test', () => {
    const structure = new SchedulesStructure(
      nextWeeks[0],
      nextWeeks[nextWeeks.length - 1]
    );

    const store1 = new DataStore({ name: 'Store 1' });
    const employee1 = new DataEmployee({ name: 'Simen' });
    const employee2 = new DataEmployee({ name: 'Bitch' });

    /**
     * Should has no solution
     */
    expect(structure.isValid()).toBe(false);

    expect(structure.isValid()).toBe(true);
  });
});
