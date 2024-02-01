const express = require("express");
const router = express.Router();
const User = require("../models/user");

//gets all concierge information from db
router.get("/", async (req, res, next) => {
  try {
    const concierges = await User.findAll({
      where: { role: "concierge" },
    });
    res.status(200).json({
      message: "Handling /concierges get requests",
      concierges: concierges,
    });
  } catch (error) {
    console.error("Error fetching concierges:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//posts a concierge to the db
router.post("/", async (req, res, next) => {
  try {
    const { username, password, ad, soyad, email } = req.body;
    const newConcierge = await User.create({
      username,
      password,
      role: "concierge", // Set the role to 'concierge'
      ad,
      soyad,
      email,
    });
    res.status(201).json({
      message: "Handling /concierges post requests",
      concierge: newConcierge,
    });
  } catch (error) {
    console.error("Error creating concierge:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// doesnt do smt yet
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({
    message: "Handling /concierges/id get requests",
    id: id,
  });
});

// editting concierge at db
router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    // Find the concierge user by ID
    const concierge = await User.findByPk(id);

    if (!concierge) {
      return res.status(404).json({ error: "Concierge not found" });
    }
    const { username, ad, soyad, email } = req.body;
    concierge.username = username;
    concierge.ad = ad;
    concierge.soyad = soyad;
    concierge.email = email;

    await concierge.save();

    res.status(200).json({
      message: "Concierge updated successfully",
      concierge: concierge,
    });
  } catch (error) {
    console.error("Error updating concierge:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//deleting concierge from db
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try{
    const concierge = await User.findByPk(id)

    if(!concierge){
      return res.status(404).json({ error: "Concierge was not found"})
    }

    await concierge.destroy()
    res.status(200).json({
      message: "Concierge deleted successfully",
      concierge:concierge,
    })
  }catch (error){
    console.error("Error deleting concierge:", error)
    res.status(500).json({ error: "Internal Server Error"})
  }
});

module.exports = router;
