import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Cache from '../../lib/Cache';

import CreateAppointmentService from '../services/CreateAppointmentService';
import CancelAppointmentService from '../services/CancelAppoitmentService';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const cacheKey = `user:${req.userId}:appointments:${page}`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        cancelled_at: null,
      },
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      order: ['date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    await Cache.set(cacheKey, appointments);

    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, date } = req.body;
    const appointment = await CreateAppointmentService({
      provider_id,
      user_id: req.userId,
      date,
    });
    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await CancelAppointmentService({
      provider_id: req.params.id,
      user_id: req.userId,
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
