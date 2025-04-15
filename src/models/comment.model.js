const {DataTypes} = require("sequelize");
const commentModel = (Sequelize) => {
    return Sequelize.define(
        'comment',
        {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            id_event:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'events',
                    key: 'id',
                }
            },
            id_user:{
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                  model: 'users',
                  key: 'id',
              }
            },
            content:{
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            tableName: 'comments',
            timestamps: false,
        }
    );
};

module.exports = commentModel;