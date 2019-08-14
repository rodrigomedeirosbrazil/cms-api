const { Item } = require('../../config/database');

module.exports = {
  Query: {
    items: () => Item.findAll(),
    item: (_, { id }) => Item.findOne({ where: { id: id } })
  },
  Mutation: {
    createItem: (
      _,
      {
        UserId,
        name,
        description,
        value,
        value_repo,
        quantity,
        width,
        height,
        length,
        active
      }
    ) =>
      Item.create({
        UserId,
        name,
        description,
        value,
        value_repo,
        quantity,
        width,
        height,
        length,
        active
      }),
    updateItem: async (
      _,
      {
        id,
        name,
        description,
        value,
        value_repo,
        quantity,
        width,
        height,
        length,
        active
      }
    ) => {
      const item = await Item.findOne({ where: { id: id } });
      if (!item) {
        throw Error(`Item not updated. id: ${id}`);
      }
      name && (item.name = name);
      description && (item.description = description);
      value && (item.value = value);
      value_repo && (item.value_repo = value_repo);
      quantity && (item.quantity = quantity);
      width && (item.width = width);
      height && (item.height = height);
      length && (item.length = length);
      active && (item.active = active);
      item.save();

      return item;
    }
  }
};
