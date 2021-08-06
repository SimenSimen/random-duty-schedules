import SchedulesGenerator from '@/services/ShedulesGenerator/Generator';
import SchedulesStructure from '@/services/ShedulesGenerator/DataStructure';
import DataStore from '@/services/ShedulesGenerator/Data/Store';
import DataDate from '@/services/ShedulesGenerator/Data/Date';
import DataPeriod from '@/services/ShedulesGenerator/Data/Period';
import DataEmployee from '@/services/ShedulesGenerator/Data/Employee';

describe('Test schedure structure', function () {
  const structure = new SchedulesStructure();

  it('Push node test', function () {
    expect(() => {
      structure.push(new DataEmployee());
    }).toThrow();

    expect(() => {
      structure.push(new DataDate());
    }).toThrow();

    expect(() => {
      structure.push(new DataPeriod());
    }).toThrow();

    structure.push(new DataStore());
    expect(structure.countStore()).toBe(1);

    structure.push([new DataStore(), new DataStore(), new DataStore()]);
    expect(structure.countStore()).toBe(4);
  });
});

describe('Test the schedule generator', function () {
  const Schedule = new SchedulesGenerator();

  it('Schedules result and traversal logs should be null current step', function () {
    const schedules = Schedule.schedules();
    const logs = Schedule.traversalLogs();

    expect(schedules).toBeNull();
    expect(logs).toBeNull();
  });

  it('At this moment, the schedule tree should be invalid.', function () {
    expect(Schedule.isValid()).toBe(false);
  });

  it('Length of logs should be over than zero.', function () {
    Schedule.setDays();
    Schedule.setEmployees();
    Schedule.setStores();

    Schedule.run();

    const logs = Schedule.traversalLogs();
    const schedules = Schedule.schedules();

    expect(Array.isArray(logs)).toBeTruthy();
    Array.isArray(logs) && expect(logs.length > 0).toBeTruthy();
    expect(typeof logs?.[0].getAction() === 'string').toBeTruthy();

    const data = schedules.getDataByDate();
  });

  it('At this moment, The schedule validation should be true.', function () {
    expect(Schedule.isValid()).toBeTruthy();
  });

  it('Schedules result and traversal logs should be null again', function () {
    Schedule.clear();

    const logs = Schedule.traversalLogs();
    const schedules = Schedule.schedules();

    expect(schedules).toBeNull();
    expect(logs).toBeNull();
  });

  it("At this moment, the schedule tree should be invalid again cause it's empty.", function () {
    expect(Schedule.isValid()).toBe(false);
  });
});
