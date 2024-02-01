const express = require("express");
const router = express.Router();
const Reservation = require('../models/reserv')

//get all reservations from db
router.get('/', async(req, res, next) => {
  try{
    const reservations = await Reservation.findAll()
    res.status(201).json({
      message: "Handling /reservations get requests",
      reservations: reservations,
    })
  } catch(error){
    console.error("Error fetching concierges", error)
  }
})

//get reservations with name and room number
router.get('/:name/:roomNumber', async (req, res, next) => {
  try{
    const { name , roomNumber} = req.params
    const reservations = await Reservation.findAll({
      where:{
        name: name,
        roomNumber: roomNumber,
      },
    });
    res.status(200).json({
      message: `Handling /reservations/${name}/${roomNumber} get requests`,
      reservations: reservations,
    })
  } catch(error){
    console.error("Error fetching reservations with name-room number given", error)
  }
})

//post a reservation to the db
router.post('/', async(req, res, next) => {
  try{
    const { type, tarih , saat , not , status , roomNumber , name , destination} = req.body
    const newReservation = await Reservation.create({
      type,
      tarih,
      saat,
      not,
      status,
      roomNumber,
      name,
      destination,
    })
    res.status(201).json({
      message: "Handling /reservations post requests",
      reservation: newReservation,
    })
  } catch(error){
    console.error("Error creating reservation: ", error)
  }
})

//doesnt do smt yet
router.get('/:id', async(req, res, next) => {
    res.status(200).json({
        message: "Handling /reservations/id get requests",
      });
})

//edit the reservation at db
router.patch('/:id', async(req, res, next) => {
  const id = req.params.id
  try{
    const reservation = await Reservation.findByPk(id)

    if(!reservation){
      return res.status(404).json({
        error: "Reservation not found"
      })
    }
    const { type, tarih , saat , not , status , roomNumber , name , destination} = req.body
    reservation.type = type
    reservation.tarih = tarih
    reservation.saat = saat
    reservation.not = not
    reservation.status = status
    reservation.roomNumber = roomNumber
    reservation.name = name
    reservation.destination = destination

    await reservation.save()

    res.status(201).json({
      message: "Reservation updated successfully",
      reservation: reservation,
    })
  } catch(error){
    console.error("Error updating the concierge: ", error)
  }
})

//edit the status at db
router.patch('/:status/:id', async(req, res, next) => {
  const id = req.params.id
  const status = req.params.status
  try{
    const reservation = await Reservation.findByPk(id)
    if(!reservation){
      return res.status(404).json({
        error: "Reservation not found"
      })
    }
    reservation.status = status

    await reservation.save()

    res.status(201).json({
      message: "Reservation updated successfully",
      reservation: reservation,
    })
  } catch(error){
    console.error("Error updating the concierge: ", error)
  }
})

//delete the reservation from db
router.delete('/:id', async(req, res, next) => {
  const id = req.params.id
  try{
    const reservation = await Reservation.findByPk(id)

    if(!reservation){
      return res.status(404).json({
        error: "Reservation not found"
      })
    }

    await reservation.destroy()
    res.status(201).json({
      message: "Reservation deleted succcessfully",
      reservation: reservation,
    })
  } catch(error){
    console.error("Error deleting the reservation: ", error)
  }
})

module.exports = router;