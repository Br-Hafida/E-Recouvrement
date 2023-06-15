var express = require('express');
var userService = require('./userService');
const nodemailer = require('nodemailer');

var createUserControllerFn = async (req, res) => {
    try {
        console.log(req.body);
        var status = await userService.createUserDBService(req.body);
        console.log(status);

        if (status) {
            // Envoyer l'email de confirmation
            sendConfirmationEmail(req.body);
            res.send({ "status": true, "message": "User created successfully" });
        } else {
            res.send({ "status": false, "message": "Error creating user" });
        }
    }
    catch (err) {
        console.log(err);
    }
}

var loginUserControllerFn = async (req, res) => {
    var result = null;
    try {
        result = await userService.loginUserDBService(req.body);
        if (result.status) {
            res.send({ "status": true, "message": result.msg });
        } else {
            res.send({ "status": false, "message": result.msg });
        }

    } catch (error) {
        console.log(error);
        res.send({ "status": false, "message": error.msg });
    }
}

var sendConfirmationEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        // Configuration des informations de votre service de messagerie
        service: 'gmail',
        auth: {
            user: 'elbririhafida@gmail.com',
            pass: 'kythvetdhzfhmxfl',
        },
    });

    const userId = await userService.getUserIdByEmail(user.email);
    const confirmationLink = `http://localhost:4200/inscriptionconfirme/${userId}`;

    const mailOptions = {
        from: 'elbririhafida@gmail.com',
        to: user.email,
        subject: 'Confirmation d\'inscription',
        text: `Cher ${user.firstname} ${user.lastname},\n\nBienvenue à notre Laboratoire de Thesard. Pour confirmer votre inscription, cliquez sur ce lien : ${confirmationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email de confirmation envoyé : ' + info.response);
        }
    });
}

var getUserByEmailControllerFn = async (req, res) => {
    try {
        const email = req.params.email;
        var user = await userService.getUserByEmailDBService(email);
        res.json(user);
        console.log(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'utilisateur' });
    }
}

var updateUserControllerFn = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        var status = await userService.updateUserById(id, data);
        if (status) {
            res.send({ status: true, message: 'User updated successfully' });
        } else {
            res.send({ status: false, message: 'Error updating user' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
};

var getDataConntrollerfn = async (req, res) => {
    var students = await userService.getDataFromDBService();
    res.send({ "status": true, "data": students });
};

var getArchiveDataController = async (req, res) => {
    try {
        var archiveData = await userService.getArchiveDataFromDBService();
        res.send({ "status": true, "data": archiveData });
    } catch (error) {
        console.log(error);
        res.send({ "status": false, "message": "Error retrieving archive data" });
    }
};

var archiveAndDeleteStudentControllerFn = async (req, res) => {
    try {
        const email = req.params.email;
        const result = await userService.archiveAndDeleteUserDBService(email);

        if (result.status) {
            res.send({ status: true, message: result.message });
        } else {
            res.send({ status: false, message: result.message });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'archivage et de la suppression de l\'utilisateur' });
    }
};

var getUserByIdControllerFn = async (req, res) => {
    const id = req.params.id;
    console.log('ID:', id);
    try {
        const user = await userService.getUserByIdDBService(id);
        console.log('User:', user);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des informations de l\'utilisateur' });
    }
};

module.exports = {
    createUserControllerFn,
    loginUserControllerFn,
    sendConfirmationEmail,
    getUserByEmailControllerFn,
    updateUserControllerFn,
    getDataConntrollerfn,
    getArchiveDataController,
    archiveAndDeleteStudentControllerFn,
    getUserByIdControllerFn
};
