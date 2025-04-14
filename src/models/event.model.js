const {DataTypes} = require("sequelize");
const eventModel = (sequelize) => {
    return sequelize.define(
        'event',
        {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            description:{
                type: DataTypes.STRING,
                allowNull: false
            },
            places_count:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            location:{
                type: DataTypes.STRING,
                allowNull: false
            },
            id_format:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: 'formats',
                    key: 'id',
                }
            },
            id_category:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: 'categories',
                    key: 'id',
                }

            },
            annulation:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            image:{
                type: DataTypes.STRING,
            },
            date:{
                type: DataTypes.DATE,
                allowNull: false
            },
            id_creator:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: 'users',
                    key: 'id'
                }
            },
        },
        {
            tableName: 'events',
            timestamps: false,
        }
    )
}

module.exports = eventModel;