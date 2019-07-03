import pt from 'date-fns/locale/pt';
import { format, parseIso } from 'date-fns';
import Mail from '../../lib/Mail';

class CancellationMail {
  // every job nesse a unique key
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseIso(appointment.date),
          "'Dia' dd 'de' MMMM', às' H:mm'h'  ",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}
export default new CancellationMail();
