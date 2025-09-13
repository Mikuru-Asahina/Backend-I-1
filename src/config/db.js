import mongoose from "mongoose"

export const conectarDB = async (url, dbName) => {
    try {
        await mongoose.connect (
            url,
            {
                dbName /* Para las nuevas versiones de JS ya no es necesario nombrarlo de esta manera ya que tiene 
                el mismo nombre y se puede escribir DIRECTO. Por ejemplo: dbName a secas y ya no escribir: dbName: dbName*/
            }
        )
        console.log(`DB online!!!`)
    } catch (error) {
        console.log(`Error al conectar a db: ${error.message}`)
        process.exit(1)
    }
}