import Address from "../models/Address.js";

const addAddress = async (req, res) => {
    try {
        const { street, city, state, country, postalCode } = req.body;

        const newAddress = new Address({
            user: req.user._id, 
            street,
            city,
            state,
            country,
            postalCode,
        });

        const savedAddress = await newAddress.save();

        res.status(201).json({ message: "Address added successfully", address: savedAddress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id });
        res.status(200).json({ addresses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const updated = await Address.findOneAndUpdate(
            { _id: addressId, user: req.user._id },
            { $set: req.body },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Address not found" });

        res.status(200).json({ message: "Address updated", address: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const deleted = await Address.findOneAndDelete({ _id: addressId, user: req.user._id });

        if (!deleted) return res.status(404).json({ message: "Address not found" });

        res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export {addAddress, getAddresses, updateAddress, deleteAddress}