const { createClient } = require('redis')

const redisClient = createClient({
    url: "redis://localhost:6379"
});

async function testRedis() {
    try {
        await redisClient.connect();
        console.log("Redis connection success ✅");
    } catch (error) {
        console.log("Redis connection failed ❌", error);
    }
}
testRedis();
module.exports = redisClient;