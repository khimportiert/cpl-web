const User = require('../models/User')
const FacilityGroup = require('../models/FacilityGroup')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const is_https = true

// @desc Login
// @route POST /auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
    const { login_name, password } = req.body

    if (!login_name || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ login_name }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    // Objekt mit den Daten der erlaubten Stationen
    // Stations username in FacilityGroup finden und dann das Stationsobject liefern
    const find = {"facilities.stations.username": {$in: foundUser.allowed_stations}}
    let facilityGroup = await FacilityGroup.find(find).exec()
    let foundStations = []
    
    if(facilityGroup?.length > 0 ) {
        foundStations = facilityGroup[0].facilities.map((facility) => {
            return facility.stations.map((station) => {
                if(foundUser.allowed_stations.includes(station.username)) {
                    return station
                }
            })
        })[0]
    }
    

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "firstname": foundUser.firstname,
                "lastname": foundUser.lastname,
                "login_name": foundUser.login_name,
                "username": foundUser.username,
                "roles": foundUser.roles,
                "allowed_stations": foundStations
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    )

    const refreshToken = jwt.sign(
        { "login_name": foundUser.login_name },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    )

    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    await foundUser.save()

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: is_https, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 1 * 60 * 60 * 1000 //cookie expiry: set to match rT (ein biscchen weniger um request spam zu vermeiden)
    })

    // Send accessToken
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies
    
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ login_name: decoded.login_name }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            // Objekt mit den Daten der erlaubten Stationen
            // Stations username in FacilityGroup finden und dann das Stationsobject liefern
            const find = {"facilities.stations.username": {$in: foundUser.allowed_stations}}
            let facilityGroup = await FacilityGroup.find(find).exec()
            let foundStations = []

            if(facilityGroup?.length > 0 ) {
                foundStations = facilityGroup[0].facilities.map((facility) => {
                    return facility.stations.map((station) => {
                        if(foundUser.allowed_stations.includes(station.username)) {
                            return station
                        }
                    })
                })[0]
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": foundUser._id,
                        "firstname": foundUser.firstname,
                        "lastname": foundUser.lastname,
                        "login_name": foundUser.login_name,
                        "username": foundUser.username,
                        "roles": foundUser.roles,
                        "allowed_stations": foundStations
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
            )
            
            res.setHeader('Cache-Control', 'no-store')
            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content

    const refreshToken = cookies.jwt;
    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(200).send('asynctoken');
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(204).send();
}

module.exports = {
    login,
    refresh,
    logout
}