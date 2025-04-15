const mainController = {
    get : (req, res) => {
        try {
            res.status(200).json(`Ok ça marche mais c'est qu'un place holder`)
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    },
}

module.exports = mainController;