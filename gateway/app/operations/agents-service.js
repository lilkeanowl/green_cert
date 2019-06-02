const energyType = require('../consts');

const agents = {};
const stations = {};
module.exports = {
    init: function(mongo) {
        agents = mongo.collection('agents');
        stations = mongo.collection('stations');
    }
}

function mockData() {
    agents.insertMany([
        {privateKey: "0d30af87da5d8b52f87a5d12b058e9279b1d9cd04ea5ee29e29469be56336495",
        agentAddress: "0x1c463d7085B173AA52721586642804F2c709E292"
        },
        {privateKey: "6a58aacb1a081136bce2b3d603e413237898325eaec63e335aab475e4103b5e6",
        agentAddress: "0xa9B2C9C98bfC04Fe0aEd8Ee461186d830e3F90c1"
        },
        {privateKey: "b94536f2fafae191dc31a226e16b825894e119b6516a67cf7df1e105c409182f",
        agentAddress: "0x4D0f12e1786BE3D680910522E0D133AF83620076"
        }]
    );
    stations.insertMany([
        {
            stationId: 1,
            energyType: energyType.WIND
        }, 
        {
            stationId: 2,
            energyType: energyType.WIND
        },
        {
            stationId: 3,
            energyType: energyType.SOLAR
        }
    ]);
}

function findStationAgent(stationId) {
    return agents.findOne({statons: stationId})
}