module.exports = async (Models) => {
  Models.User.hasMany(Models.Stories, {
    foreignKey: 'user_id',
    as: 'stories',
  });
  Models.Stories.belongsTo(Models.User, {
    foreignKey: 'user_id',
    as: 'user',
  });
  Models.User.belongsTo(Models.Orders, {
    foreignKey: 'user_id',
    as: 'user',
  });
  await Models.User.sync({ alter: true });
  await Models.Stories.sync({ alter: true });
};
