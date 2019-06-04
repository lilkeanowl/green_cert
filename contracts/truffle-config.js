module.exports = {
    compilers: {
        solc: {
            version: "0.4.26",
        }
    },
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        }
    }
};
