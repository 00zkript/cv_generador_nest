export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-key',
        expiresIn: process.env.JWT_EXPIRATION || '24h',
    }
})