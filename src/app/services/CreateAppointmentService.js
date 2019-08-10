import pt from 'date-fns/locale/pt';
import { startOfHour, isBefore, parseISO, format } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import Cache from '../../lib/Cache';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    /**
     * Check if provider_id is a provider
     */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      throw new Error('You can only create appointments with providers');
    }

    if (checkIsProvider.id === user_id) {
      throw new Error('You can only create appointments with others providers');
    }

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      throw new Error('Past dates are not permitted');
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        cancelled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      throw new Error('Appointment date is not available');
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date,
    });

    /**
     * Notify appointment Provider
     */

    const user = await User.findByPk(user_id);
    const formattedData = format(
      hourStart,
      "'Dia' dd 'de' MMMM', às' H:mm'h'  ",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o dia ${formattedData}`,
      user: provider_id,
    });

    /** Invalidade Cache */
    await Cache.invalidatePrefix(`user:${user.id}:appointments`);

    return appointment;
  }
}

export default new CreateAppointmentService();
