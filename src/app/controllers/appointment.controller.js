import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/appointment.model';
import User from '../models/user.model';
import File from '../models/file.model';
import Notification from '../schemas/notfication.schema';

class AppointmentController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const appointments = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['date'],
            attributes: ['id', 'date'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['path', 'url'],
                        },
                    ],
                },
            ],
        });

        return res.json(appointments);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { provider_id, date } = req.body;

        // Verifica se provider_id é de um provider
        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!isProvider) {
            return res.status(401).json({
                error: 'You can only create appointments with provides',
            });
        }

        // verifica datas passadas
        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return res.status(401).json({
                error: 'Past date are not permitted',
            });
        }

        // verifica disponibilidade da data
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            },
        });

        if (checkAvailability) {
            return res
                .status(400)
                .json({ error: 'Appointment date is not available' });
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date: hourStart,
        });

        const user = await User.findByPk(req.userId);
        const formattedDate = format(hourStart, "dd 'de' MMM', às' H:mm'h'", {
            locale: pt,
        });

        // Notificar agendamento para o prestador de serviço
        await Notification.create({
            content: `Novo agendamento de ${user.name} para o dia ${formattedDate}`,
            user: provider_id,
        });

        return res.json(appointment);
    }
}

export default new AppointmentController();
