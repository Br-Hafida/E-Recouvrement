var userModel = require('./userModel');
var key = '123456789trytryrtyr';
var encryptor = require('simple-encryptor')(key);
const archiveModel = require('./archiveModel');

module.exports.createUserDBService = (userDetails) => {
   var userModelData = new userModel();

   userModelData.firstname = userDetails.firstname;
   userModelData.lastname = userDetails.lastname;
   userModelData.email = userDetails.email;
   userModelData.cne = userDetails.cne;
   var encrypted = encryptor.encrypt(userDetails.password);
   userModelData.password = encrypted;
   userModelData.dateinscription = new Date(userDetails.dateinscription);
   userModelData.etat = userDetails.etat;
   userModelData.role = userDetails.role;
   console.log(userModelData.datedebut);
   console.log('dateinscription:', userDetails.datedebut);

   const now = new Date(Date.now());
   console.log('now:', now);
   const userStartDate = new Date(userDetails.datedebut);

   const diffTime = now.getTime() - userStartDate.getTime();

   console.log(diffTime);

   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   console.log(diffDays);
   // Formater la durée
   let duration = '';
   if (diffDays >= 30 && diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      duration = `${months} mois ${remainingDays} jours`;
   } else if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      const remainingDays = (diffDays % 365) % 30;
      duration = `${years} an(s) ${remainingMonths} mois ${remainingDays} jours`;
   } else {
    duration = `${diffDays} jour(s)`;
   }

   userModelData.duree = duration;

   return userModelData.save()
      .then(result => {
         return true;
      })
      .catch(error => {
         return false;
      });
}

module.exports.loginUserDBService = (userDetails) => {
    return userModel.findOne({ email: userDetails.email })
        .then(result => {
            if (result) {
                var decrypted = encryptor.decrypt(result.password);
                if (decrypted === userDetails.password) {
                    return { status: true, msg: "User Validated Successfully" };
                } else {
                    throw { status: false, msg: "User Validation Failed" };
                }
            } else {
                throw { status: false, msg: "Invalid Email or Password" };
            }
        })
        .catch(error => {
            throw error;
        });
}
 
// Récupérer depuis MongoDB en fonction de l'email
module.exports.getUserByEmailDBService = async (email) => {
    try {
        var user = await userModel.findOne({ email: email }).exec();
        console.log(user);
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports.updateUserById = async (id, data) => {
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return false; // Utilisateur non trouvé
        }

        // Mettre à jour les nouvelles propriétés du formulaire
        if (data.dateBirth) {
            user.dateBirth = data.dateBirth;
        }
        if (data.age) {
            user.age = data.age;
        }
        if (data.tele) {
            user.tele = data.tele;
        }

        await user.save();
        return true; // Mise à jour réussie
    } catch (error) {
        console.log(error);
        return false; // Erreur lors de la mise à jour
    }
}
  
// Récupérer depuis MongoDB
module.exports.getDataFromDBService = async () => {
    try {
        const result = await userModel.find({});
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports.archiveAndDeleteUserDBService = async (email) => {
    try {
        // Récupérer l'utilisateur à archiver
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return { status: false, message: 'Utilisateur non trouvé' };
        }

        // Créer une instance du modèle d'archive avec les données de l'utilisateur
        const archiveData = new archiveModel(user.toObject());

        // Enregistrer l'utilisateur archivé dans la collection "archives"
        const archivedUser = await archiveData.save();

        if (!archivedUser) {
            return { status: false, message: 'Erreur lors de l\'archivage de l\'utilisateur' };
        }

        // Supprimer l'utilisateur de la collection "users"
        const deletedUser = await userModel.findOneAndDelete({ email: email });

        if (!deletedUser) {
            return { status: false, message: 'Erreur lors de la suppression de l\'utilisateur' };
        }

        return { status: true, message: 'Utilisateur archivé et supprimé avec succès' };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports.getUserIdByEmail = async (email) => {
    try {
        const user = await userModel.findOne({ email: email }).exec();
        return user._id; // Récupérer l'ID de l'utilisateur à partir du champ "_id" de l'objet user
    } catch (error) {
        throw error;
    }
}

module.exports.getUserByIdDBService = async (id) => {
    try {
        const user = await userModel.findById(id);
        return user;
    } catch (error) {
        throw error;
    }
};

module.exports.getArchiveDataFromDBService = async () => {
    try {
        const result = await archiveModel.find({});
        return result;
    } catch (error) {
        throw error;
    }
};
