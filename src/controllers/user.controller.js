const { getAllUsersService, signupService,getUserByIdService } = require("../services/user.service");

exports.getAllUsers = async(req, res) => {
  const users = await getAllUsersService();
  res.json(users);
}

exports.signup = async(req, res) => {
  try {
    const userInfo = req.body;
    const user = await signupService(userInfo);

    console.log(user)
    if(!user) {
      return res.status(400).json({
        success: false,
        message: "User couldn't signed up"
      })
    }
    res.status(200).json({
      success: true,
      message: 'User signed up successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
exports.getUserById = async(req, res) => {
  try {
    const {id} = req.params;
    console.log(id)
    const user = await getUserByIdService(id);

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this id"
      })
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

