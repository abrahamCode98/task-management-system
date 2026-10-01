const generateTaskCacheKey = (userId, page, limit, priority, status, search ) => {
    const parts = ["tasks",`user=${userId}`, `page=${page}`, `limit=${limit}`]

    if(priority) {
        parts.push(`priority=${priority}`);
    };

    if(status) {
        parts.push(`status=${status}`);
    };

    if(search) {
        parts.push(`search=${search}`);
    };

    return parts.join(':');
};

export default generateTaskCacheKey;