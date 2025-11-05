import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))
    const dbName = process.env.DB_NAME || 'prescripto'
    
    let connectionString = process.env.MONGODB_URI.trim()
    
    // Extract query parameters if they exist
    let queryParams = ''
    if (connectionString.includes('?')) {
        const parts = connectionString.split('?')
        connectionString = parts[0].trim() // Base URI without query params
        queryParams = '?' + parts[1] // Query parameters
    }
    
    // Remove trailing slash if present
    if (connectionString.endsWith('/')) {
        connectionString = connectionString.slice(0, -1)
    }
    
    // Get base URI (everything up to and including the host, without database name)
    // Pattern: mongodb+srv://user:pass@host or mongodb://user:pass@host
    // Match up to the host (before any / or ?)
    const baseUriMatch = connectionString.match(/^(mongodb\+srv:\/\/[^\/]+|mongodb:\/\/[^\/]+)/)
    if (baseUriMatch) {
        connectionString = baseUriMatch[1] // Keep only the base URI up to host
    }
    
    // Construct final connection string: baseUri/dbName?queryParams
    const finalConnectionString = queryParams 
        ? `${connectionString}/${dbName}${queryParams}`
        : `${connectionString}/${dbName}`
    
    console.log(`Connecting to database: ${dbName}`)
    await mongoose.connect(finalConnectionString)
    console.log(`Connected to database: ${dbName}`)

}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.