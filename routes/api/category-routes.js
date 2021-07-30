const router = require('express').Router();
const {
  Category,
  Product
} = require('../../models');



router.get('/', async (req, res) => {
  try {
    const catData = await Category.findAll({
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    });
    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const catData = await Category.findByPk(req.params.id, {
      include: [{
        model: Product
      }],
    });

    if (!catData) {
      res.status(404).json({
        message: 'No category found with that id!'
      });
      return;
    }

    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/', async (req, res) => {
  try {
    const catData = await Category.create({
      id: req.body.id,
    });
    res.status(200).json(catData);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.put('/:id', (req, res) => {

  Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    .then(catData => {
      if (!catData) {
        res.status(404).json({
          message: 'No category found with this id'
        });
        return;
      }
      res.json(catData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



router.delete('/:id', async (req, res) => {
  try {
    const catData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!catData) {
      res.status(404).json({
        message: 'No category found with that id!'
      });
      return;
    }

    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;