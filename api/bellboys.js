const express = require("express");
const router = express.Router();
const User = require("../models/user");

//gets all belboy information from db
router.get("/", async (req, res, next) => {
  try {
    const bellboys = await User.findAll({
      where: { role: "bellboy" },
    });
    res.status(200).json({
      message: "Handling /bellboys get requests",
      bellboys: bellboys,
    });
  } catch (error) {
    console.error("Error fetching bellboys", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//posts a bellboy to the db
router.post("/", async (req, res, next) => {
  try {
    const { username, password, ad, soyad, email } = req.body;
    const newBellboy = await User.create({
      username,
      password,
      role: "bellboy",
      ad,
      soyad,
      email,
    });
    res.status(201).json({
      message: "Handling /bellboys post requests",
      bellboy: newBellboy,
    });
  } catch (error) {
    console.error("Error creating bellboy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// doesnt do smt yet
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({
    message: "Handling /bellboys/id get requests",
    id: id,
  });
});

// editting bellboy at db/table
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    // Find the concierge user by ID
    const bellboy = await User.findByPk(id);

    if (!bellboy) {
      return res.status(404).json({ error: "Bellboy not found" });
    }
    const { username, ad, soyad, email } = req.body;
    bellboy.username = username;
    bellboy.ad = ad;
    bellboy.soyad = soyad;
    bellboy.email = email;

    await bellboy.save();

    res.status(200).json({
      message: "Bellboy updated successfully",
      bellboy: bellboy,
    });
  } catch (error) {
    console.error("Error updating Bellboy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete a bellboy
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try{
    const bellboy = await User.findByPk(id)

    if(!bellboy){
      return res.status(404).json({ error: "Bellboy was not found"})
    }

    await bellboy.destroy()
    res.status(200).json({
      message: "Bellboy deleted successfully",
      bellboy:bellboy,
    })
  }catch (error){
    console.error("Error deleting bellboy:", error)
    res.status(500).json({ error: "Internal Server Error"})
  }
});

module.exports = router;
