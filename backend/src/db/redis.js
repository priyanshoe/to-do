const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",

    RESP: 2
});

redisClient.on("error", (err)=>{
    console.error("❌ Redis Error: ", err);
})

async function connectRedis(){
    try{
        await redisClient.connect();
        console.log("✅ Redis connected");   
    }catch(error) {
        console.log("❌ Redis connection failed", error);
    }
}

connectRedis();

module.exports = redisClient
