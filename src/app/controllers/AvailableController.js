
class AvailableController{
  async index(req, res){
    const {date } = req.query;

    if(!date){
      return res.status(400).json({ error: 'Invalid date'})
    }

    const searchDate = Number(date);


    return res.json();
  }
}

export default new AvailableController();