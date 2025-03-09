const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwtDecode = require('jwt-decode')

// PROTECTED ROUTE
const verifyJWT = require('../../middleware/verifyJWT')
router.use(verifyJWT)

// Load user model
const User = require('../../models/User')


// @route GET api/users
// @description get all users
// @access Protected
router.get('/', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    const decodedJWT = jwtDecode(token)
    const user = decodedJWT.UserInfo
    
    let find = {}
    if(user.roles.includes('4305') || user.roles.includes('5150')) {
        find = {
            'allowed_stations': user.username
        }
    }

    User.find(find).sort({firstname: 'asc'})
        .then(users => {
            const data = users.map((user) => {
                return {
                    id: user.id,
                    login_name: user.login_name,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    roles: user.roles,
                    allowed_stations: user.allowed_stations
                }
            })
            res.json(data)
        })
        .catch(err => res.status(404).json({ notransportsfound: 'No transports found' }));
});
  

// @route POST api/users
// @description add user
// @access Protected
router.post('/', async (req, res) => {

    const {login_name, firstname, lastname, username, allowed_stations, password} = req.body

    if(!login_name || !firstname || !lastname || !username || !allowed_stations || !password) {
        return res.status(400).json({ message: 'Eingaben konnten nicht übernommen werden' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ login_name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Diesen Benutzernamen gibt es bereits' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = {
        ...req.body,
        password: hashedPwd
    }

    User.create(userObject)
    .then(user => {
        res.json({ ok: true })
    })
    .catch(err => res.status(400).json({ message: 'Ein unerwarteter ist aufgetreten.', error: err }))
})

// @route PUT api/users/:id
// @description Update user
// @access Protected
router.put('/:id', async (req, res) => {
    
    if(req.body.username) {
        const { username } = req.body
        const foundUser = await User.findById(req.params.id)
        const allowed_stations = foundUser?.allowed_stations
        if(allowed_stations && allowed_stations.includes(username)) {

            User.findByIdAndUpdate(req.params.id, {username})
            .then(user => {
                res.json({ message: 'User Update erfolgreich', user })
            })
            .catch(err => {
                res.status(400).json({ error: err })
            })

        } else {
            res.status(401).json({ message: 'Unbefugter Updateversuch' })
        }
    } else {
        res.status(400)
    }
})

// @route DELETE api/users/:id
// @description Delete user by id
// @access Protected
router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(user => {
        res.json({ ok: true, message: 'entry deleted successfully' })
    })
    .catch(err => {
        res.status(404).json({ error: err })
    })
})

module.exports = router;