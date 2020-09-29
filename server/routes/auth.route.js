const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');  // to generate token
const bcrypt = require('bcryptjs');   //  encrypt password

// Check validation for requests 
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');  // get user image by email
const auth = require('../middleware/auth');

// Models
const User = require('../models/User');


// @Route POST api/user
// @decs  User Information
// @access Private 
router.get('/', auth, async (req, res) => {
	try {
		// get user information by id 
		const user = await User.findById(req.user.id).select('-password');
		res.json(user)
	} catch (error) {
		console.log(error.message)
		res.status(500).send('Server Error');
	}
})



// @Route POST api/users/register 
// @decs  Register user 
// @access Public
router.post('/register', [
	// validation
	check('name', 'Name is required').not().isEmpty(),
	check('email', 'Please include a valid email').isEmail(),
	check('password', 'Please enter a password with 6 or more characters').isLength({
		min: 6
	})
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		});
	}

	// Get name and email and password from request 
	const { name, email, password } = req.body;

	try {
		// Check if user already exist
		let user = await User.findOne({ email });

		// If user exist
		if (user) {
			return res.status(400).json({
				errors: [
					{
						msg: 'User already exist',
					},
				],
			});
		}

		// If not errors 
		// get image from gravatar 
		const avatar = gravatar.url(email, {
			s: '200',  // Size 
			r: 'pg',    // Rate
			d: 'mm'
		}); 

		// create user object 
		user = new User({
			name, email, avatar, password 
		})

		// encrypt password 
		const salt = await bcrypt.genSalt(10); // generate salt contains 10

		// save password s
		user.password = await bcrypt.hash(password, salt);  // use user password and salt to hash password s

		// save user in database 
		await user.save();

		// payload to generate token 
		const payload = {
			user: {
				id: user.id
			}
		}

		jwt.sign(
			payload,
			process.env.JWT_SECRET, {
				expiresIn: 360000,  // For developmnet for production it will 3600
			}, 
			(err, token) => {
				if (err) throw err;
				res.json({ token })
			}
		)

	} catch (error) {
		console.log(err.message)
		res.status(500).send('Server error')
	}
});

// @Route POST api/user/login 
// @decs  Login user 
// @access Public
router.post('/login', [
	check('email', 'please include a valid email').isEmail(),
	check('password', 'password is required').exists()
], async (req, res) => {

	//If error
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}
	
	// If everything is good 
	// Get email and password from request body 
	const {email, password} = req.body;

	try {
		// find user 
		let user =await User.findOne({
			email
		});

		if (!user) {
			return res.status(400).json({
				errors: [{
					msg : 'Invalid credentials'
				}]
			})
		}

		// Know user founded by email let's compare password 
		const isMatch = await bcrypt.compare(password, user.password);

		// password don't match 
		if (!isMatch) {
			return res.status(400).json({
				errors:[{
					msg: 'Invalid credentials'
				}]
			})
		}

		// payload for jwt
		const payload = {
			user: {
				id: user.id
			}
		}

		jwt.sign(
			payload,
			process.env.JWT_SECRET,{
				expiresIn: 360000
			}, (err, token) => {
				if (err) throw err;
				res.json({token})
			}
		)


	} catch (error) {
		console.log(err.message)
		res.status(500).send('Server error')
	}
})


module.exports = router;