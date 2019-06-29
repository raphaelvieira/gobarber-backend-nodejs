import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // return all data from User
    // const user = await User.create(req.body);
    // return res.json(user);

    // return specific data
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { id, name, provider } = await user.update(req.body);
    return {
      id,
      name,
      email,
      provider,
    };

    /* const updatedUser = await User.update(req.body, {
      where: {
        id: req.userId,
      },
    });
    if (!updatedUser) {
      return res.status(500).json({ error: 'Error Updating!' });
    }
    // fetch updated data
    const returnUpdatedUser = await User.findByPk(req.userId);

    return res.json({ returnUpdatedUser }); */
  }
}
export default new UserController();
