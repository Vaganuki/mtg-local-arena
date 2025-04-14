const {DataTypes} = require("sequelize");
const inscriptionModel = (Sequelize) => {
    return Sequelize.define(
        'inscription',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            id_event: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'events',
                    key: 'id',
                }
            },
            id_user: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                }
            }
        },
        {
            tableName: 'inscriptions',
            timestamps: false,
        }
    );
};

module.exports = inscriptionModel;