import {
  startOfDay,
  endOfDay,
  setSeconds,
  setHours,
  setMinutes,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableService {
  async run({ date, provider_id }) {
    const appointments = await Appointment.findAll({
      where: {
        date: { [Op.between]: [startOfDay(date), endOfDay(date)] },
        cancelled_at: null,
        provider_id,
      },
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      // set format HH:MM:SS to the times
      const value = setSeconds(setMinutes(setHours(date, hour), minute), 0);
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return available;
  }
}
export default new AvailableService();
