const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll();
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create({
      id: req.body.id,
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// router.put('/:id', (req, res) => {
//   // update a category by its `id` value
// });
// // update product
router.put('/:id', (req, res) => {
  // update product data
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      // find all associated tags from ProductTag
      return Category.findAll({ where: { id: req.params.id } });
    })
    .then((newCats) => {
      // get list of current tag_ids
      const categoryIds = newCats.map(({ id }) => id);
      // create filtered list of new tag_ids
      const newCats = req.body.categoryIds
        .filter((id) => !categoryIds.includes(id))
        .map((id) => {
          return {
            id: req.params.id,
            
          };
        });
      // figure out which ones to remove
      const catsToRemove = newCats
        .filter(({ id }) => !req.body.categoryIds.includes(id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        Category.destroy({ where: { id: catsToRemove } }),
        Category.bulkCreate(newCats),
      ]);
    })
    .then((updatedCats) => res.json(updatedCats))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// router.delete('/:id', (req, res) => {
//   // delete a category by its `id` value
// });
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
