const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reservation = sequelize.define('user', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isIn: [['vip', 'taxi']]
        }
    },
    tarih: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    saat: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    not: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['done', 'waiting' , 'accepted']]
        }
    },
    roomNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
} , {
    tableName: 'reservations',
})

Reservation.findById = async function(id){
    const reservation = await Reservation.findOne({
        where: {
            id: id,
        },
    })
    return reservation
}

Reservation.findByName = async function(name){
    const reservation = await Reservation.findOne({
        where:{
            name: name,
        },
    })
    return reservation
}

Reservation.sync()

module.exports = Reservation