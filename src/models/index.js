const { Sequelize } = require('sequelize');
const eventModel = require("./event.model");
const categoryModel = require("./category.model");
const formatModel = require("./format.model");
const commentModel = require("./comment.model");
const userModel = require("./user.model");
const inscriptionModel = require("./inscription.model");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
    }
);

const db = {
    sequelize,
    categories: categoryModel(sequelize),
    formats: formatModel(sequelize),
    events: eventModel(sequelize),
    comments: commentModel(sequelize),
    users: userModel(sequelize),
    inscriptions: inscriptionModel(sequelize),
};

//categories association
db.categories.hasMany(db.events,{
    foreignKey: 'id_category',
});

//formats association
db.formats.hasMany(db.events,{
    foreignKey: 'id_format',
});

//events association
db.events.hasMany(db.inscriptions,{
    foreignKey: 'id_event',
});
db.events.hasMany(db.comments,{
    foreignKey: 'id_event',
});
db.events.belongsTo(db.categories,{
    foreignKey: 'id_category',
});
db.events.belongsTo(db.formats,{
    foreignKey: 'id_format',
});

//comments association
db.comments.belongsTo(db.events,{
    foreignKey: 'id_event',
});
db.comments.belongsTo(db.users,{
    foreignKey: 'id_user',
})

//users association
db.users.hasMany(db.comments,{
    foreignKey: 'id_user',
});
db.users.hasMany(db.inscriptions,{
    foreignKey: 'id_user',
});

//inscriptions association
db.inscriptions.belongsTo(db.events,{
    foreignKey:'id_event',
});
db.inscriptions.belongsTo(db.users,{
    foreignKey:'id_user',
});

console.log('DB models & associations loaded!');

module.exports = db;