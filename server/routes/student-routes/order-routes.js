const express = require("express");
const {
  createOrder,
  getOrderDetails,
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.get("/:orderId", getOrderDetails);

module.exports = router;
