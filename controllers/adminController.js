const db = require('../models');
const pageadmin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const secretKey = 'ma_clé_secrète';


// create main Model
const Admin = db.admins;
const Urgence = db.urgences;
const Client = db.clients;
const Mecanicien = db.mecaniciens;
const Garage = db.garages;


const login = async (req, res) => {
    try {
      const email = req.body.Email;
      const password = req.body.Password;
  
      const admin = await Admin.findOne({ where: { Email: email }});

      if (!admin) {
        return res.send({ status:false,message:'Vérifier bien votre email' });
      }

      const pass = await Admin.findOne({ where: { Password: password }});
      if (!pass) {
        return res.send({ status:false,message:'Vérifier bien votre mot de passe' });
      }
     
      const token = jwt.sign({ adminId: admin.id }, secretKey, { expiresIn: '1h' });
  
      res.json({ status:true,token:token });
      
      
    } catch (error) {
      console.error(error);
      res.send("Une erreur s'est produite lors de la connexion.");
    }
};


// Deconnexion
const logout = async (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie." });
   
};

// PRENDRE LE SESSION AVEC TOKEN
const session = async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];

    const decodedtoken = jwt.verify(token, secretKey);

    const adm = await Admin.findByPk(decodedtoken.adminId);

    if(!adm) {
      return res.status(401).json({message: 'Aucun trouvé'});
    }
    return res.json({adm: adm});


  } catch(error) {
    return res.json({message: 'Token pas trouvé'});
  }
};

// Mise à jour Admin
const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).send("Client not found");
    }

    admin.Nom = req.body.Nom;
    admin.Prenoms = req.body.Prenoms;
    admin.Naissance = req.body.Naissance;
    admin.Email = req.body.Email;
    admin.Password = req.body.Password;


    await admin.save();

    res.status(200).send(admin);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// 2. Prendre tous les administrateurs
const getAllAdmin = async (req, res) => {
  let admins = await Admin.findAll({})
  res.status(200).send(admins)
}


// Lister tous les urgences
const getAllurgence = async (req, res) => {
  conditions = {};

  if (req.query.Etat) {
    conditions['Etat'] = req.query.Etat;  
  }
  
  let urgences = await Urgence.findAll({
    where: conditions
  });
  
  res.status(200).send(urgences);
}


// Prendre le detail de l'urgence
const detailurgence = async (req, res) => {
  let id = req.params.id
  let urgence = await Urgence.findOne({ where: { id: id }})
  res.status(200).send(urgence)
}


// 3. Prendre profil client
const profilclient = async (req, res) => {
  let id = req.params.id
  let client = await Client.findOne({ where: { id: id }})
  res.status(200).send(client)
}

// 3. Prendre profil mecanicien
const profilmecanicien = async (req, res) => {
  let id = req.params.id
  let mecanicien = await Mecanicien.findOne({ where: { id: id }})
  res.status(200).send(mecanicien)
}

//4. Prendre profil garages
const profilegarage = async (req, res) => {
  let id = req.params.id
  let garage = await Garage.findOne({ where: { id: id }})
  res.status(200).send(garage)
}

const redirectToGarage = async (req, res) => {
  let idGarage = req.body.idGarage;
  let idUrgence = req.body.idUrgence;

  urgence = await Urgence.findOne({
    id: idUrgence
  });

  urgence.id_garage = idGarage;
  urgence.Etat = 2; // 2 garage
  
  await urgence.save();

  return res.status(200).send(urgence);
};

const redirectToMecanicien = async (req, res) => {
  let idMecanicien = req.body.idMecanicien;
  let idUrgence = req.body.idUrgence;

  urgence = await Urgence.findOne({
    id: idUrgence
  });

  urgence.id_mecanicien = idMecanicien;
  urgence.Etat = 2; // 3 Mecanicien
  
  await urgence.save();

  return res.status(200).send(urgence);
};

module.exports = {
  login,
  logout,
  session,
  getAllAdmin,
  updateAdmin,
  getAllurgence,
  profilclient,
  profilmecanicien,
  profilegarage,
  detailurgence,
  redirectToGarage,
  redirectToMecanicien
}