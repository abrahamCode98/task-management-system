import client from "../config/redis.js";

const invalidateTaskCache = async (userId) => {
  const pattern = `tasks:user=${userId}:*`;

  for await (const batch of client.scanIterator({
    match: pattern,
  })) {
    const keys = Array.isArray(batch) ? batch : [batch];

    for (const key of keys) {
      if (typeof key === "string" && key) {
        await client.del(key);
      }
    }
  }
};

export default invalidateTaskCache;