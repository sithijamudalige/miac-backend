const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // your SQLite connection

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.DATE, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  contactNumber: { type: DataTypes.STRING, allowNull: false },
  artistType: { 
    type: DataTypes.ENUM("Actor", "Singer", "Musician"), 
    allowNull: false 
  },
  profilePic: { type: DataTypes.STRING },      // path to uploaded profile picture
  idPhotoFront: { type: DataTypes.STRING },    // path to uploaded front ID
  idPhotoBack: { type: DataTypes.STRING },     // path to uploaded back ID
}, {
  timestamps: true,   // same as Mongoose { timestamps: true }
});

// Optional: helper methods for full image URLs
User.prototype.getProfilePicUrl = function() {
  return this.profilePic ? `http://localhost:5000/${this.profilePic}` : null;
};

User.prototype.getIdPhotoFrontUrl = function() {
  return this.idPhotoFront ? `http://localhost:5000/${this.idPhotoFront}` : null;
};

User.prototype.getIdPhotoBackUrl = function() {
  return this.idPhotoBack ? `http://localhost:5000/${this.idPhotoBack}` : null;
};

module.exports = User;
