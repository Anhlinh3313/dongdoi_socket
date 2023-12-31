const express = require("express");
const Transactions = require("../database/entities/Transactions");
const { dashLogger } = require("../logger");
const ResponseModel = require("../models/ResponseModel");
const router = express.Router();

function SocketRouter(io) {
    router.post('/createTransactionSocket', async (req, res) => {
        try {
            let transaction = new Transactions(req.body);
            let newTransaction = await transaction.save();
            let response = new ResponseModel(1, "Create account newTransaction success!", newTransaction);
            
            let transactions = await Transactions
            .find({ type: "in" })
            .sort({
                datetime: "desc",
            });
            
            if (transactions.length > 0) {
                io.emit("transactions", transactions);
            }
            return res.json(response);
        } catch (error) {
            
        }
    });

    return router;
}

module.exports = SocketRouter;
