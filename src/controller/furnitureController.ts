import { Request, Response } from 'express';

const test = (req: Request, res: Response) => {
    res.send('Test route success')
}

const getFurnitureCategories = (req: Request, res: Response) => {
    res.send('getting furniture categories...')
}

const getPieceOfFurniture = (req: Request, res: Response) => {
    
    res.send(`getting piece of furniture with id ${req.params.id}`)
}

export default { test, getFurnitureCategories, getPieceOfFurniture }